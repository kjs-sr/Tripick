import os
import json
import time
from datetime import datetime
import pandas as pd
import numpy as np
import pickle
import scipy.sparse
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sklearn.metrics.pairwise import cosine_similarity
from typing import Optional

# ==============================================================================
# 🚨 [배포 최적화] 환경 변수(ENV) 기반 DB 연결 (보안 강화)
# Render 환경 변수에 설정한 DATABASE_URL을 최우선으로 가져오고, 없으면 로컬 테스트용을 씁니다.
# ==============================================================================
DB_URL = os.getenv("DATABASE_URL", "로컬_테스트용_URL")

if DB_URL.startswith("postgres://"):
    DB_URL = DB_URL.replace("postgres://", "postgresql://", 1)

db_engine = create_engine(DB_URL, pool_size=5, max_overflow=10)

app = FastAPI(title="Tripick AI 통합 추천 엔진 (클라우드 배포 버전)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

print("======================================================")
print(" Tripick 초경량 AI 엔진 (DB & ANN) 초기화 시작...")
print("======================================================")

# --- 1. 고속 벡터 검색 엔진 클래스 (메모리 사용량 획기적 단축) ---
class GameEngineDB:
    def __init__(self, model_dir="models"):
        self.mat = scipy.sparse.load_npz(f"{model_dir}/game_matrix.npz")
        with open(f"{model_dir}/game_ids.pkl", "rb") as f: self.ids = pickle.load(f)
        self.id_to_idx = {appid: idx for idx, appid in enumerate(self.ids)}

    def get_sim_scores(self, target_id):
        idx = self.id_to_idx.get(target_id)
        if idx is None: return None
        return cosine_similarity(self.mat[idx], self.mat).flatten()

class MovieEngineDB:
    def __init__(self, model_dir="models"):
        self.mat_g = scipy.sparse.load_npz(f"{model_dir}/movie_mat_genre.npz")
        self.mat_k = scipy.sparse.load_npz(f"{model_dir}/movie_mat_keyword.npz")
        self.mat_d = scipy.sparse.load_npz(f"{model_dir}/movie_mat_director.npz")
        with open(f"{model_dir}/movie_ids.pkl", "rb") as f: self.ids = pickle.load(f)
        self.id_to_idx = {i: idx for idx, i in enumerate(self.ids)}

    def get_sim_scores(self, target_id):
        idx = self.id_to_idx.get(target_id)
        if idx is None: return None
        sim_g = cosine_similarity(self.mat_g[idx], self.mat_g).flatten()
        sim_k = cosine_similarity(self.mat_k[idx], self.mat_k).flatten()
        sim_d = cosine_similarity(self.mat_d[idx], self.mat_d).flatten()
        return (sim_g * 0.2) + (sim_k * 0.6) + (sim_d * 0.2)

class MusicEngineDB:
    def __init__(self, model_dir="models"):
        self.mat_a = scipy.sparse.load_npz(f"{model_dir}/music_mat_artist.npz")
        self.mat_g = scipy.sparse.load_npz(f"{model_dir}/music_mat_genre.npz")
        self.mat_au = np.load(f"{model_dir}/music_mat_audio.npy")
        with open(f"{model_dir}/music_ids.pkl", "rb") as f: self.ids = pickle.load(f)
        self.id_to_idx = {i: idx for idx, i in enumerate(self.ids)}

    def get_sim_scores(self, target_id):
        idx = self.id_to_idx.get(target_id)
        if idx is None: return None
        sim_a = cosine_similarity(self.mat_a[idx], self.mat_a).flatten()
        sim_g = cosine_similarity(self.mat_g[idx], self.mat_g).flatten()
        sim_au = cosine_similarity([self.mat_au[idx]], self.mat_au).flatten()
        return (sim_a * 0.20) + (sim_g * 0.30) + (sim_au * 0.50)

try:
    game_rec = GameEngineDB()
    movie_rec = MovieEngineDB()
    music_rec = MusicEngineDB()
    print("✅ 벡터 인덱스 로드 완료! (메모리 150MB 수준 방어 성공)")
except Exception as e:
    print(f"⚠️ 엔진 초기화 실패 (models 폴더 또는 추출 파일 확인 요망): {e}")
    game_rec = movie_rec = music_rec = None

def fetch_top_candidates(table_name, id_col, top_ids):
    formatted_ids = ", ".join([f"'{str(x)}'" for x in top_ids])
    query = f"SELECT * FROM {table_name} WHERE {id_col} IN ({formatted_ids})"
    return pd.read_sql(query, db_engine)

# --- 3. API 엔드포인트 ---
@app.get("/")
def read_root():
    return {"status": "success", "message": "Tripick AI 통합 추천 엔진 (DB & ANN 클라우드 배포) 가동 중"}

@app.get("/metadata")
def get_metadata():
    # 기본 폴백(Fallback) 메타데이터
    meta = {
        "game": {"minYear": 1997, "maxYear": 2024, "minPrice": 0, "maxPrice": 100, "minAge": 0, "maxAge": 18, "ageOptions": []},
        "movie": {"minYear": 1970, "maxYear": 2024},
        "music": {"minDuration": 0, "maxDuration": 600}
    }
    
    try:
        # 1. 게임 메타데이터 DB 실시간 조회
        game_stats = pd.read_sql("SELECT MIN(release_date) as min_date, MAX(release_date) as max_date, MAX(price_initial) as max_price, MIN(required_age) as min_age, MAX(required_age) as max_age FROM games WHERE release_date IS NOT NULL", db_engine).iloc[0]
        if pd.notna(game_stats['min_date']): meta['game']['minYear'] = int(str(game_stats['min_date'])[:4])
        if pd.notna(game_stats['max_date']): meta['game']['maxYear'] = int(str(game_stats['max_date'])[:4])
        if pd.notna(game_stats['max_price']): meta['game']['maxPrice'] = float(game_stats['max_price'])
        if pd.notna(game_stats['min_age']): meta['game']['minAge'] = int(game_stats['min_age'])
        if pd.notna(game_stats['max_age']): meta['game']['maxAge'] = int(game_stats['max_age'])
        
        # 실제 게임 데이터에 존재하는 고유 연령 제한 옵션(눈금) 조회
        game_ages = pd.read_sql("SELECT DISTINCT required_age FROM games WHERE required_age > 0 ORDER BY required_age", db_engine)
        if not game_ages.empty:
            meta['game']['ageOptions'] = game_ages['required_age'].astype(int).tolist()

        # 2. 영화 메타데이터 DB 실시간 조회
        movie_stats = pd.read_sql("SELECT MIN(release_date) as min_date, MAX(release_date) as max_date FROM movies WHERE release_date IS NOT NULL", db_engine).iloc[0]
        if pd.notna(movie_stats['min_date']): meta['movie']['minYear'] = int(str(movie_stats['min_date'])[:4])
        if pd.notna(movie_stats['max_date']): meta['movie']['maxYear'] = int(str(movie_stats['max_date'])[:4])

        # 3. 음악 메타데이터 DB 실시간 조회
        music_stats = pd.read_sql("SELECT MAX(duration_ms) as max_duration FROM musics", db_engine).iloc[0]
        if pd.notna(music_stats['max_duration']): meta['music']['maxDuration'] = int(music_stats['max_duration'] / 1000)

    except Exception as e:
        print(f"Metadata DB Fetch Error: {e}")
        
    return {"status": "success", "data": meta}

# ==========================
# 검색 엔진 (DB 쿼리 전용)
# ==========================
@app.get("/search/game")
def search_game(query: str = Query(...)):
    q = f"%{query}%"
    sql = "SELECT name, developer, appid FROM games WHERE name ILIKE %(q)s LIMIT 10"
    df = pd.read_sql(sql, db_engine, params={"q": q})
    return {"status": "success", "data": df.to_dict(orient='records')}

@app.get("/search/movie")
def search_movie(query: str = Query(...)):
    q = f"%{query}%"
    sql = "SELECT title, original_title, directors, id FROM movies WHERE title ILIKE %(q)s OR original_title ILIKE %(q)s LIMIT 10"
    df = pd.read_sql(sql, db_engine, params={"q": q})
    return {"status": "success", "data": df.to_dict(orient='records')}

@app.get("/search/music")
def search_music(query: str = Query(...)):
    q = f"%{query}%"
    sql = "SELECT track_name, artists, track_id FROM musics WHERE track_name ILIKE %(q)s OR artists ILIKE %(q)s LIMIT 10"
    df = pd.read_sql(sql, db_engine, params={"q": q})
    return {"status": "success", "data": df.to_dict(orient='records')}

# ==========================
# 하이브리드 추천 엔진 (DB + 벡터 인덱스)
# ==========================
# 파라미터에 target_id를 수신하여 검색 쿼리 없이 다이렉트로 매칭합니다.
@app.get("/recommend/game")
def recommend_game(query: str, mode: str="custom", sim_tier: int=5, rec_tier: int=2, limit: int=10, filters: str=None, excludes: str=None, target_id: Optional[str]=None):
    if not game_rec: return {"status": "fail", "message": "엔진 에러"}
    
    # 전달받은 타겟 ID가 있으면 SQL 텍스트 검색을 과감히 생략하여 동명이인 오류 원천 방지
    if target_id:
        target_id = int(target_id) if str(target_id).isdigit() else target_id
    else:
        sql = "SELECT appid FROM games WHERE name ILIKE %(q)s LIMIT 1"
        target_df = pd.read_sql(sql, db_engine, params={"q": f"{query}"})
        if target_df.empty: return {"status": "fail"}
        target_id = target_df['appid'].iloc[0]

    sim_scores = game_rec.get_sim_scores(target_id)
    if sim_scores is None: return {"status": "fail", "message": "해당 게임을 인덱스에서 찾을 수 없습니다."}
    
    top_indices = sim_scores.argsort()[::-1][:300]
    top_ids = [game_rec.ids[i] for i in top_indices]
    sim_dict = {game_rec.ids[i]: sim_scores[i] for i in top_indices}

    res_df = fetch_top_candidates("games", "appid", top_ids)
    res_df['similarity'] = res_df['appid'].map(sim_dict)

    parsed_filters = json.loads(filters) if filters else {}
    if excludes:
        parsed_excludes = json.loads(excludes)
        exclude_names = [str(x).lower().strip() for x in parsed_excludes if not str(x).isdigit()]
        exclude_ids = [int(x) for x in parsed_excludes if str(x).isdigit()]
        if exclude_names: res_df = res_df[~res_df['name'].str.lower().str.strip().isin(exclude_names)]
        if exclude_ids: res_df = res_df[~res_df['appid'].isin(exclude_ids)]
        
    if 'start_date' in parsed_filters or 'end_date' in parsed_filters:
        res_df['temp_rd'] = pd.to_datetime(res_df['release_date'], errors='coerce')
        if parsed_filters.get('start_date'): res_df = res_df[res_df['temp_rd'] >= pd.to_datetime(parsed_filters['start_date'])]
        if parsed_filters.get('end_date'): res_df = res_df[res_df['temp_rd'] <= pd.to_datetime(parsed_filters['end_date'])]
        
    if parsed_filters.get('min_price') is not None: res_df = res_df[res_df['price_initial'] >= parsed_filters['min_price']]
    if parsed_filters.get('max_price') is not None: res_df = res_df[res_df['price_initial'] <= parsed_filters['max_price']]
    if parsed_filters.get('max_required_age') is not None: res_df = res_df[res_df['required_age'] <= parsed_filters['max_required_age']]
    if parsed_filters.get('is_free') is not None:
        tf = 1 if parsed_filters['is_free'] else 0
        res_df = res_df[res_df['is_free'].astype(int) == tf]

    w_sim = (sim_tier / 10.0) ** 1.0
    
    if mode == "trend":
        w_brand = (rec_tier / 10.0)
        res_df['sim_score'] = res_df['similarity'] * w_sim
        bf_norm = res_df.get('brand_fame_norm', pd.Series([1]*len(res_df)))
        res_df['brand_score'] = bf_norm * w_brand
        
        ref_date = datetime.now()
        days_diff = np.maximum(0, (ref_date - pd.to_datetime(res_df['release_date'], errors='coerce')).dt.days.fillna(99999))
        res_df['recency_score'] = np.where(days_diff <= 90, 1.0 - (days_diff/90)*0.2, 0.8*np.exp(-0.0015*(days_diff-90)))
        res_df['rec_score'] = np.clip(res_df['recency_score'], 0.005, 1.0) * w_brand
        res_df['total_score'] = res_df['sim_score'] + res_df['brand_score'] + res_df['rec_score']
    else:
        w_rev = 0.25 * ((rec_tier / 10.0) ** 1.5)
        res_df['sim_score'] = res_df['similarity'] * w_sim
        pos_norm = res_df.get('positive_ratio_norm', res_df.get('positive_reviews_rate', pd.Series([0.5]*len(res_df))))
        res_df['rev_score'] = pos_norm * w_rev
        res_df['total_score'] = res_df['sim_score'] + res_df['rev_score']

    res_df = res_df[res_df['appid'] != target_id].sort_values(by='total_score', ascending=False)
    return {"status": "success", "data": res_df.head(limit).to_dict(orient='records')}

@app.get("/recommend/movie")
def recommend_movie(query: str, mode: str="custom", sim_tier: int=5, rec_tier: int=2, limit: int=10, filters: str=None, excludes: str=None, target_id: Optional[str]=None):
    if not movie_rec: return {"status": "fail"}
    
    if target_id:
        target_id = int(target_id) if str(target_id).isdigit() else target_id
    else:
        sql = "SELECT id, title, original_title FROM movies WHERE title ILIKE %(q)s OR original_title ILIKE %(q)s LIMIT 1"
        target_df = pd.read_sql(sql, db_engine, params={"q": f"{query}"})
        if target_df.empty: return {"status": "fail"}
        target_id = target_df['id'].iloc[0]

    sim_scores = movie_rec.get_sim_scores(target_id)
    if sim_scores is None: return {"status": "fail", "message": "인덱스 오류"}
    
    top_indices = sim_scores.argsort()[::-1][:300]
    top_ids = [movie_rec.ids[i] for i in top_indices]
    sim_dict = {movie_rec.ids[i]: sim_scores[i] for i in top_indices}

    res_df = fetch_top_candidates("movies", "id", top_ids)
    res_df['similarity'] = res_df['id'].map(sim_dict)

    parsed_filters = json.loads(filters) if filters else {}
    if excludes:
        ex_movies = [str(x).lower().strip() for x in json.loads(excludes)]
        res_df = res_df[~res_df['title'].str.lower().str.strip().isin(ex_movies)]
        
    if parsed_filters.get('start_year'): res_df = res_df[pd.to_datetime(res_df['release_date'], errors='coerce').dt.year >= int(parsed_filters['start_year'])]
    if parsed_filters.get('end_year'): res_df = res_df[pd.to_datetime(res_df['release_date'], errors='coerce').dt.year <= int(parsed_filters['end_year'])]

    w_sim = sim_tier / 10.0
    w_rel = rec_tier / 10.0
    res_df['sim_score'] = res_df['similarity'] * w_sim

    if mode == "trend":
        res_df['dir_score'] = res_df.get('dir_score_norm', res_df.get('Director_Evaluation_Score', pd.Series([0]*len(res_df)))) * w_rel
        ref_date = datetime.now()
        days_diff = np.maximum(0, (ref_date - pd.to_datetime(res_df['release_date'], errors='coerce')).dt.days.fillna(99999))
        res_df['recency_score'] = np.where(days_diff <= 90, 1.0 - (days_diff/90)*0.2, 0.8*np.exp(-0.0015*(days_diff-90)))
        res_df['rec_score'] = np.clip(res_df['recency_score'], 0.005, 1.0) * w_rel
        res_df['total_score'] = res_df['sim_score'] + res_df['dir_score'] + res_df['rec_score']
    else:
        rel_norm = res_df.get('rel_score_norm', res_df.get('Total_Reliability_Score', pd.Series([0.5]*len(res_df))) / 10.0)
        res_df['rel_score'] = rel_norm * w_rel
        res_df['total_score'] = res_df['sim_score'] + res_df['rel_score']

    res_df = res_df[res_df['id'] != target_id].sort_values(by='total_score', ascending=False)
    return {"status": "success", "data": res_df.head(limit).to_dict(orient='records')}

@app.get("/recommend/music")
def recommend_music(query: str, mode: str="custom", sim_tier: int=5, rec_tier: int=2, limit: int=10, filters: str=None, excludes: str=None, target_id: Optional[str]=None):
    if not music_rec: return {"status": "fail"}
    
    if target_id:
        # 음악의 track_id는 문자열이므로 그대로 사용합니다.
        pass
    else:
        sql = "SELECT track_id, track_name FROM musics WHERE track_name ILIKE %(q)s LIMIT 1"
        target_df = pd.read_sql(sql, db_engine, params={"q": f"{query}"})
        if target_df.empty: return {"status": "fail"}
        target_id = target_df['track_id'].iloc[0]

    sim_scores = music_rec.get_sim_scores(target_id)
    if sim_scores is None: return {"status": "fail", "message": "인덱스 오류"}
    
    top_indices = sim_scores.argsort()[::-1][:300]
    top_ids = [music_rec.ids[i] for i in top_indices]
    sim_dict = {music_rec.ids[i]: sim_scores[i] for i in top_indices}

    res_df = fetch_top_candidates("musics", "track_id", top_ids)
    res_df['similarity'] = res_df['track_id'].map(sim_dict)

    parsed_filters = json.loads(filters) if filters else {}
    if excludes:
        ex_artists = [str(x).lower().strip() for x in json.loads(excludes)]
        for ea in ex_artists: res_df = res_df[~res_df['artists'].str.lower().str.contains(ea, regex=False)]
        
    if parsed_filters.get('include_artist'): res_df = res_df[res_df['artists'].str.lower().str.contains(str(parsed_filters['include_artist']).lower(), regex=False)]
    if parsed_filters.get('exclude_artist'):
        for ea in parsed_filters['exclude_artist']: res_df = res_df[~res_df['artists'].str.lower().str.contains(str(ea).lower(), regex=False)]
    if parsed_filters.get('min_duration_ms') is not None: res_df = res_df[res_df['duration_ms'] >= parsed_filters['min_duration_ms']]
    if parsed_filters.get('max_duration_ms') is not None: res_df = res_df[res_df['duration_ms'] <= parsed_filters['max_duration_ms']]
    if parsed_filters.get('explicit') is not None:
        exp_val = 1 if parsed_filters['explicit'] else 0
        res_df = res_df[res_df['explicit'].astype(int) == exp_val]
    if parsed_filters.get('mode') is not None: res_df = res_df[res_df['mode'] == int(parsed_filters['mode'])]

    w_sim = sim_tier / 10.0
    w_pop = rec_tier / 10.0
    res_df['sim_score'] = res_df['similarity'] * w_sim
    pop_norm = res_df.get('popularity_norm', res_df.get('popularity', pd.Series([50]*len(res_df))) / 100.0)
    res_df['pop_score'] = pop_norm * w_pop
    res_df['total_score'] = res_df['sim_score'] + res_df['pop_score']

    res_df = res_df[res_df['track_id'] != target_id].sort_values(by='total_score', ascending=False)
    return {"status": "success", "data": res_df.head(limit).to_dict(orient='records')}
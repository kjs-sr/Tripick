import pandas as pd
import numpy as np
import os
import time
import pickle
import scipy.sparse
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MinMaxScaler

# 결과물을 저장할 폴더 생성
MODEL_DIR = "models"
if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

def build_game_index():
    print("\n[1/3] 🎮 게임 추천 엔진 벡터화 시작...")
    start_time = time.time()
    
    file_path = 'game_analytics_final_calibrated.csv'
    if not os.path.exists(file_path):
        file_path = 'game_analytics_final.csv'
        
    df = pd.read_csv(file_path)
    
    # 텍스트 병합 로직 (기존 엔진과 동일)
    df['clean_tags'] = df.get('tags', pd.Series([''] * len(df))).astype(str).str.replace(',', ' ')
    df['clean_genre'] = df.get('genre_primary', pd.Series([''] * len(df))).astype(str)
    df['clean_dev'] = df.get('developer', pd.Series([''] * len(df))).astype(str)
    
    combined_text = df['clean_tags'] + " " + df['clean_genre'] + " " + df['clean_dev']
    
    # TF-IDF 모델 훈련 및 변환
    vec = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
    matrix = vec.fit_transform(combined_text)
    
    # 파일 저장 (모델, 행렬, AppID 매핑)
    with open(f"{MODEL_DIR}/game_vectorizer.pkl", "wb") as f:
        pickle.dump(vec, f)
    scipy.sparse.save_npz(f"{MODEL_DIR}/game_matrix.npz", matrix)
    with open(f"{MODEL_DIR}/game_ids.pkl", "wb") as f:
        pickle.dump(df['appid'].values, f)
        
    print(f"✅ 게임 모델 저장 완료! (소요 시간: {time.time()-start_time:.1f}초)")


def build_movie_index():
    print("\n[2/3] 🎬 영화 추천 엔진 벡터화 시작...")
    start_time = time.time()
    
    df = pd.read_csv('movie_dataset_preprocessed.csv')
    
    # 텍스트 정제
    df['clean_genres'] = df['genres'].astype(str).str.replace('{','').str.replace('}','').str.replace(',',' ')
    df['clean_keywords'] = df['keywords'].astype(str).str.replace('{','').str.replace('}','').str.replace(',',' ')
    df['clean_directors'] = df['directors'].astype(str).str.replace(',',' ')
    
    # 각각의 TF-IDF 훈련
    vec_genre = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
    mat_genre = vec_genre.fit_transform(df['clean_genres'].fillna(''))
    
    vec_keyword = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
    mat_keyword = vec_keyword.fit_transform(df['clean_keywords'].fillna(''))
    
    vec_director = TfidfVectorizer(stop_words='english')
    mat_director = vec_director.fit_transform(df['clean_directors'].fillna(''))
    
    # 저장
    with open(f"{MODEL_DIR}/movie_vec_genre.pkl", "wb") as f: pickle.dump(vec_genre, f)
    with open(f"{MODEL_DIR}/movie_vec_keyword.pkl", "wb") as f: pickle.dump(vec_keyword, f)
    with open(f"{MODEL_DIR}/movie_vec_director.pkl", "wb") as f: pickle.dump(vec_director, f)
    
    scipy.sparse.save_npz(f"{MODEL_DIR}/movie_mat_genre.npz", mat_genre)
    scipy.sparse.save_npz(f"{MODEL_DIR}/movie_mat_keyword.npz", mat_keyword)
    scipy.sparse.save_npz(f"{MODEL_DIR}/movie_mat_director.npz", mat_director)
    
    with open(f"{MODEL_DIR}/movie_ids.pkl", "wb") as f:
        pickle.dump(df['id'].values, f)
        
    print(f"✅ 영화 모델 저장 완료! (소요 시간: {time.time()-start_time:.1f}초)")


def build_music_index():
    print("\n[3/3] 🎵 음악 추천 엔진 벡터화 시작...")
    start_time = time.time()
    
    df = pd.read_csv('spotify_dataset_preprocessed.csv')
    
    # 텍스트 병합 (아티스트 + 장르) -> 사용자 기획 의도에 맞게 3차원 독립 분리로 원상 복구
    def process_artists_for_tfidf(artist_str):
        if pd.isna(artist_str): return ""
        return " ".join([a.strip().replace(' ', '_') for a in str(artist_str).split(';')])

    df['clean_artists'] = df['artists'].apply(process_artists_for_tfidf)
    vec_artist = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
    mat_artist = vec_artist.fit_transform(df['clean_artists'])
    
    df['clean_genre'] = df['track_genre'].astype(str).str.replace(' ', '_')
    vec_genre = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
    mat_genre = vec_genre.fit_transform(df['clean_genre'])
    
    # 오디오 특성 스케일링
    audio_features = [
        'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 
        'acousticness', 'instrumentalness', 'liveness', 'valence', 
        'tempo', 'time_signature'
    ]
    scaler = MinMaxScaler()
    mat_audio = scaler.fit_transform(df[audio_features].fillna(0))
    
    # 저장 (아티스트 20%, 장르 30%, 오디오 50% 분리 모델)
    with open(f"{MODEL_DIR}/music_vec_artist.pkl", "wb") as f: pickle.dump(vec_artist, f)
    scipy.sparse.save_npz(f"{MODEL_DIR}/music_mat_artist.npz", mat_artist)
    
    with open(f"{MODEL_DIR}/music_vec_genre.pkl", "wb") as f: pickle.dump(vec_genre, f)
    scipy.sparse.save_npz(f"{MODEL_DIR}/music_mat_genre.npz", mat_genre)
    
    with open(f"{MODEL_DIR}/music_scaler.pkl", "wb") as f: pickle.dump(scaler, f)
    np.save(f"{MODEL_DIR}/music_mat_audio.npy", mat_audio) # dense array는 npy로 저장
    
    with open(f"{MODEL_DIR}/music_ids.pkl", "wb") as f:
        pickle.dump(df['track_id'].values if 'track_id' in df.columns else df['id'].values, f)
        
    print(f"✅ 음악 모델 저장 완료! (소요 시간: {time.time()-start_time:.1f}초)")


if __name__ == "__main__":
    print("="*60)
    print(" 🚀 Tripick 클라우드 배포용 AI 모델 추출 프로세스")
    print("="*60)
    
    build_game_index()
    build_movie_index()
    build_music_index()
    
    print("\n" + "="*60)
    print(" 🎉 모든 인덱스 파일이 'models' 폴더에 성공적으로 저장되었습니다!")
    print(" 이제 파이썬 서버 코드를 DB와 이 모델 파일들을 연동하도록 개편할 준비가 되었습니다.")
    print("="*60)
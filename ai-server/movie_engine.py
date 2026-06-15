import pandas as pd
import numpy as np
import os
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
import warnings

warnings.filterwarnings('ignore')

class HybridMovieRecommender:
    def __init__(self, file_path):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"지정된 정제 파일 '{file_path}'을 찾을 수 없습니다.")
            
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 영화 추천 엔진 데이터 로드 중...")
        self.df = pd.read_csv(file_path)
        
        self.df['release_date'] = pd.to_datetime(self.df['release_date'], errors='coerce')
        
        scaler = MinMaxScaler()
        self.df['dir_score_norm'] = scaler.fit_transform(self.df[['Director_Evaluation_Score']].fillna(0))
        self.df['rel_score_norm'] = self.df['Total_Reliability_Score'].fillna(0) / 10.0
        
        self._initialize_engine()

    def _initialize_engine(self):
        print(f"데이터({len(self.df):,}건) 텍스트 분석 및 다중 벡터 인덱싱 시작...")
        
        self.df['clean_genres'] = self.df['genres'].astype(str).str.replace('{','').str.replace('}','').str.replace(',',' ')
        self.df['clean_keywords'] = self.df['keywords'].astype(str).str.replace('{','').str.replace('}','').str.replace(',',' ')
        self.df['clean_directors'] = self.df['directors'].astype(str).str.replace(',',' ')
        
        self.vec_genre = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
        self.vec_keyword = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
        self.vec_director = TfidfVectorizer(stop_words='english')

        self.mat_genre = self.vec_genre.fit_transform(self.df['clean_genres'].fillna(''))
        self.mat_keyword = self.vec_keyword.fit_transform(self.df['clean_keywords'].fillna(''))
        self.mat_director = self.vec_director.fit_transform(self.df['clean_directors'].fillna(''))

    def _apply_filters(self, res_df, filters):
        if not filters:
            return res_df

        if 'start_year' in filters or 'end_year' in filters:
            res_df['temp_year'] = res_df['release_date'].dt.year
            if 'start_year' in filters and filters['start_year']:
                res_df = res_df[res_df['temp_year'] >= filters['start_year']]
            if 'end_year' in filters and filters['end_year']:
                res_df = res_df[res_df['temp_year'] <= filters['end_year']]
            res_df = res_df.drop(columns=['temp_year'])

        if 'exclude_movies' in filters:
            excludes = filters['exclude_movies']
            if isinstance(excludes, list):
                exclude_names = [str(x).lower().strip() for x in excludes]
                res_df = res_df[~res_df['title'].str.lower().str.strip().isin(exclude_names)]

        return res_df

    def recommend(self, target_title, filters=None, top_n=10, sim_tier=5, rel_tier=2, target_id=None):
        display_cols = [
            'id', 'title', 'original_title', 'directors', 'genres', 'similarity', 'rel_score_norm', 
            'sim_score', 'rel_score', 'total_score', 'release_date', 'poster_path'
        ]

        if target_id is not None:
            target_rows = self.df[self.df['id'].astype(str) == str(target_id)]
        else:
            search_query = str(target_title).lower().strip()
            target_rows = self.df[self.df['title'].str.lower().str.strip() == search_query]
        
        if target_rows.empty:
            return pd.DataFrame()
        
        target_idx = target_rows.index[0]
        
        sim_g = cosine_similarity(self.mat_genre[target_idx], self.mat_genre).flatten()
        sim_k = cosine_similarity(self.mat_keyword[target_idx], self.mat_keyword).flatten()
        sim_d = cosine_similarity(self.mat_director[target_idx], self.mat_director).flatten()

        res_df = self.df.copy()
        res_df['similarity'] = (sim_g * 0.2) + (sim_k * 0.6) + (sim_d * 0.2)
        
        w_sim = sim_tier / 10.0
        w_rel = rel_tier / 10.0
        
        res_df['sim_score'] = res_df['similarity'] * w_sim
        res_df['rel_score'] = res_df['rel_score_norm'] * w_rel
        res_df['total_score'] = res_df['sim_score'] + res_df['rel_score']

        res_df = self._apply_filters(res_df, filters)
        final_list = res_df.drop(index=target_idx, errors='ignore').sort_values(by='total_score', ascending=False)
        top_results = final_list.head(top_n).copy()
        
        existing_cols = [c for c in display_cols if c in top_results.columns]
        return top_results[existing_cols]

    def recommend_trending(self, target_title, filters=None, top_n=10, sim_tier=5, rel_tier=2, target_id=None):
        display_cols = [
            'id', 'title', 'original_title', 'directors', 'genres', 'similarity', 'dir_score_norm', 'recency_score', 
            'sim_score', 'dir_score', 'rec_score', 'total_score', 'release_date', 'poster_path'
        ]

        if target_id is not None:
            target_rows = self.df[self.df['id'].astype(str) == str(target_id)]
        else:
            search_query = str(target_title).lower().strip()
            target_rows = self.df[self.df['title'].str.lower().str.strip() == search_query]
        
        if target_rows.empty:
            return pd.DataFrame()
        
        target_idx = target_rows.index[0]
        
        sim_g = cosine_similarity(self.mat_genre[target_idx], self.mat_genre).flatten()
        sim_k = cosine_similarity(self.mat_keyword[target_idx], self.mat_keyword).flatten()
        sim_d = cosine_similarity(self.mat_director[target_idx], self.mat_director).flatten()

        res_df = self.df.copy()
        res_df['similarity'] = (sim_g * 0.2) + (sim_k * 0.6) + (sim_d * 0.2)
        
        ref_date = datetime.now()
        days_diff = np.maximum(0, (ref_date - res_df['release_date']).dt.days.fillna(99999))
        
        res_df['recency_score'] = np.where(
            days_diff <= 90,
            1.0 - (days_diff / 90) * 0.2, 
            0.8 * np.exp(-0.0015 * (days_diff - 90)) 
        )
        res_df['recency_score'] = np.clip(res_df['recency_score'], 0.005, 1.0)
        
        w_sim = sim_tier / 10.0
        w_rel = rel_tier / 10.0  
        
        res_df['sim_score'] = res_df['similarity'] * w_sim
        res_df['dir_score'] = res_df['dir_score_norm'] * w_rel
        
        res_df['rec_score'] = res_df['recency_score'] * w_rel
        
        res_df['total_score'] = res_df['sim_score'] + res_df['dir_score'] + res_df['rec_score']

        res_df = self._apply_filters(res_df, filters)
        final_list = res_df.drop(index=target_idx, errors='ignore').sort_values(by='total_score', ascending=False)
        top_results = final_list.head(top_n).copy()
        
        existing_cols = [c for c in display_cols if c in top_results.columns]
        return top_results[existing_cols]
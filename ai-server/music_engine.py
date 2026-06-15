import pandas as pd
import numpy as np
import os
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
import warnings

warnings.filterwarnings('ignore')

class AdvancedMusicRecommender:
    def __init__(self, file_path):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"지정된 정제 파일 '{file_path}'을 찾을 수 없습니다.")
            
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 음악 추천 엔진 데이터 로드 중...")
        self.df = pd.read_csv(file_path)
        self.df['popularity_norm'] = self.df['popularity'].fillna(0) / 100.0
        self._initialize_engine()

    def _initialize_engine(self):
        print(f"데이터({len(self.df):,}건) 오디오 특징 분석 및 하이브리드 벡터 인덱싱 시작...")
        
        def process_artists_for_tfidf(artist_str):
            if pd.isna(artist_str): return ""
            artists = [a.strip().replace(' ', '_') for a in str(artist_str).split(';')]
            return " ".join(artists)

        self.df['clean_artists'] = self.df['artists'].apply(process_artists_for_tfidf)
        self.df['clean_genre'] = self.df['track_genre'].astype(str).str.replace(' ', '_')
        
        combined_text = self.df['clean_artists'] + " " + self.df['clean_genre']
        
        self.vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
        self.tfidf_matrix = self.vectorizer.fit_transform(combined_text)
        
        self.audio_features = [
            'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 
            'acousticness', 'instrumentalness', 'liveness', 'valence', 
            'tempo', 'time_signature'
        ]
        
        scaler = MinMaxScaler()
        self.audio_matrix = scaler.fit_transform(self.df[self.audio_features].fillna(0))

    def _apply_filters(self, res_df, filters):
        if not filters:
            return res_df

        if 'include_artist' in filters and filters['include_artist']:
            target_artist = str(filters['include_artist']).lower().strip()
            res_df = res_df[res_df['artists'].astype(str).str.lower().str.contains(target_artist)]
        
        if 'exclude_artist' in filters and filters['exclude_artist']:
            target_artist = str(filters['exclude_artist']).lower().strip()
            res_df = res_df[~res_df['artists'].astype(str).str.lower().str.contains(target_artist)]

        if 'min_duration_ms' in filters and filters['min_duration_ms'] is not None:
            res_df = res_df[res_df['duration_ms'] >= filters['min_duration_ms']]
        if 'max_duration_ms' in filters and filters['max_duration_ms'] is not None:
            res_df = res_df[res_df['duration_ms'] <= filters['max_duration_ms']]

        if 'explicit' in filters and filters['explicit'] is not None:
            target_explicit = bool(filters['explicit'])
            res_df = res_df[res_df['explicit'] == target_explicit]

        if 'mode' in filters and filters['mode'] is not None:
            target_mode = int(filters['mode'])
            res_df = res_df[res_df['mode'] == target_mode]

        return res_df

    # target_id를 수신하도록 업데이트
    def recommend(self, target_track_name, target_artist=None, filters=None, top_n=10, sim_tier=5, pop_tier=2, target_id=None):
        display_cols = [
            'track_id', 'track_name', 'artists', 'track_genre', 'similarity', 'popularity',
            'sim_score', 'pop_score', 'total_score', 'duration_ms', 'explicit', 'mode'
        ]

        if target_id is not None:
            target_rows = self.df[self.df['track_id'].astype(str) == str(target_id)]
        else:
            search_query = str(target_track_name).lower().strip()
            mask = self.df['track_name'].astype(str).str.lower().str.strip() == search_query
            if target_artist:
                mask &= self.df['artists'].astype(str).str.lower().str.contains(str(target_artist).lower().strip())
            target_rows = self.df[mask]
        
        if target_rows.empty:
            return pd.DataFrame()
        
        target_idx = target_rows.sort_values(by='popularity', ascending=False).index[0]
        actual_target_artist = self.df.loc[target_idx, 'artists']
        actual_target_name = self.df.loc[target_idx, 'track_name']
        
        sim_text = cosine_similarity(self.tfidf_matrix[target_idx], self.tfidf_matrix).flatten()
        sim_audio = cosine_similarity([self.audio_matrix[target_idx]], self.audio_matrix).flatten()
        
        res_df = self.df.copy()
        res_df['similarity'] = (sim_text * 0.5) + (sim_audio * 0.5)
        
        w_sim = sim_tier / 10.0
        w_pop = pop_tier / 10.0
        
        res_df['sim_score'] = res_df['similarity'] * w_sim
        res_df['pop_score'] = res_df['popularity_norm'] * w_pop
        res_df['total_score'] = res_df['sim_score'] + res_df['pop_score']

        res_df = self._apply_filters(res_df, filters)

        exclude_mask = (res_df['track_name'].str.lower() == str(actual_target_name).lower()) & (res_df['artists'] == actual_target_artist)
        final_list = res_df[~exclude_mask].sort_values(by='total_score', ascending=False)
        top_results = final_list.head(top_n).copy()
        
        existing_cols = [c for c in display_cols if c in top_results.columns]
        return top_results[existing_cols]

    def recommend_trending(self, target_track_name, target_artist=None, filters=None, top_n=10, sim_tier=5, pop_tier=2, target_id=None):
        return self.recommend(target_track_name, target_artist, filters, top_n, sim_tier, pop_tier, target_id)
import pandas as pd
import numpy as np
import os
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
import warnings

warnings.filterwarnings('ignore')

class AdvancedSteamRecommender:
    def __init__(self, file_path):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"지정된 정제 파일 '{file_path}'을 찾을 수 없습니다.")
            
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 게임 추천 엔진 데이터 로드 중...")
        self.df = pd.read_csv(file_path)
        self.df['release_date'] = pd.to_datetime(self.df['release_date'], errors='coerce')
        
        self._calculate_brand_fame()
        
        scaler = MinMaxScaler()
        if 'positive_ratio' not in self.df.columns:
            self.df['positive_ratio'] = np.random.uniform(0.4, 0.98, len(self.df))
            
        self.df['positive_ratio_norm'] = scaler.fit_transform(self.df[['positive_ratio']].fillna(0))
        self.df['brand_fame_norm'] = scaler.fit_transform(self.df[['brand_fame']].fillna(0))
        
        self._initialize_engine()

    def _calculate_brand_fame(self):
        if 'developer' in self.df.columns:
            dev_counts = self.df['developer'].value_counts().to_dict()
            self.df['brand_fame'] = self.df['developer'].map(dev_counts).fillna(1)
        else:
            self.df['brand_fame'] = 1.0

    def _initialize_engine(self):
        print(f"데이터({len(self.df):,}건) 텍스트 분석 및 벡터 인덱싱 시작...")
        
        self.df['clean_tags'] = self.df.get('tags', pd.Series([''] * len(self.df))).astype(str).str.replace(',', ' ')
        self.df['clean_genre'] = self.df.get('genre_primary', pd.Series([''] * len(self.df))).astype(str)
        self.df['clean_dev'] = self.df.get('developer', pd.Series([''] * len(self.df))).astype(str)
        
        combined_text = (
            self.df['clean_tags'] + " " + 
            self.df['clean_genre'] + " " + 
            self.df['clean_dev']
        )
        
        self.vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
        self.tfidf_matrix = self.vectorizer.fit_transform(combined_text)

    def _apply_filters(self, res_df, filters):
        if not filters:
            return res_df

        if 'exclude_games' in filters:
            excludes = filters['exclude_games']
            if isinstance(excludes, list):
                title_col = 'name' if 'name' in res_df.columns else 'title'
                exclude_names = [str(x).lower().strip() for x in excludes]
                res_df = res_df[~res_df[title_col].astype(str).str.lower().str.strip().isin(exclude_names)]
        
        if 'start_date' in filters or 'end_date' in filters:
            res_df['temp_release_date'] = pd.to_datetime(res_df['release_date'], errors='coerce')
            if 'start_date' in filters and filters['start_date']:
                start_dt = pd.to_datetime(filters['start_date'])
                res_df = res_df[res_df['temp_release_date'] >= start_dt]
            if 'end_date' in filters and filters['end_date']:
                end_dt = pd.to_datetime(filters['end_date'])
                res_df = res_df[res_df['temp_release_date'] <= end_dt]
            res_df = res_df.drop(columns=['temp_release_date'])

        if 'price_initial' in res_df.columns:
            if 'min_price' in filters and filters['min_price'] is not None:
                res_df = res_df[res_df['price_initial'] >= filters['min_price']]
            if 'max_price' in filters and filters['max_price'] is not None:
                res_df = res_df[res_df['price_initial'] <= filters['max_price']]

        if 'required_age' in res_df.columns:
            if 'min_required_age' in filters and filters['min_required_age'] is not None:
                res_df = res_df[res_df['required_age'] >= filters['min_required_age']]
            if 'max_required_age' in filters and filters['max_required_age'] is not None:
                res_df = res_df[res_df['required_age'] <= filters['max_required_age']]

        if 'is_free' in filters and filters['is_free'] is not None:
            if 'is_free' in res_df.columns:
                target_free = 1 if filters['is_free'] else 0
                res_df = res_df[res_df['is_free'].astype(int) == target_free]

        return res_df

    def recommend(self, target_title, filters=None, top_n=10, sim_tier=7, rev_tier=2):
        display_cols = [
            'appid', 'name', 'genre_primary', 'developer', 'similarity', 'positive_ratio_norm', 
            'sim_score', 'rev_score', 'total_score', 'release_date'
        ]
        
        title_col = 'name' if 'name' in self.df.columns else 'title'

        search_query = str(target_title).lower().strip()
        target_rows = self.df[self.df[title_col].astype(str).str.lower().str.strip() == search_query]
        
        if target_rows.empty:
            return pd.DataFrame()
        
        target_idx = target_rows.index[0]
        
        sim_scores = cosine_similarity(self.tfidf_matrix[target_idx], self.tfidf_matrix).flatten()

        res_df = self.df.copy()
        res_df['similarity'] = sim_scores
        
        w_sim = sim_tier / 10.0
        w_rev = rev_tier / 10.0
        
        res_df['sim_score'] = res_df['similarity'] * w_sim
        res_df['rev_score'] = res_df['positive_ratio_norm'] * w_rev
        
        res_df['total_score'] = res_df['sim_score'] + res_df['rev_score']

        res_df = self._apply_filters(res_df, filters)

        final_list = res_df.drop(index=target_idx, errors='ignore').sort_values(by='total_score', ascending=False)
        top_results = final_list.head(top_n).copy()
        
        existing_cols = [c for c in display_cols if c in top_results.columns]
        return top_results[existing_cols]

    def recommend_trending(self, target_title, filters=None, top_n=10, sim_tier=5, brand_tier=3):
        display_cols = [
            'appid', 'name', 'genre_primary', 'developer', 'similarity', 'brand_fame_norm', 
            'recency_score', 'sim_score', 'brand_score', 'rec_score', 'total_score', 'release_date'
        ]
        
        title_col = 'name' if 'name' in self.df.columns else 'title'

        search_query = str(target_title).lower().strip()
        target_rows = self.df[self.df[title_col].astype(str).str.lower().str.strip() == search_query]
        
        if target_rows.empty:
            return pd.DataFrame()
        
        target_idx = target_rows.index[0]
        
        sim_scores = cosine_similarity(self.tfidf_matrix[target_idx], self.tfidf_matrix).flatten()

        res_df = self.df.copy()
        res_df['similarity'] = sim_scores
        
        ref_date = datetime.now()
        days_diff = np.maximum(0, (ref_date - res_df['release_date']).dt.days.fillna(99999))
        
        res_df['recency_score'] = np.where(
            days_diff <= 90,
            1.0 - (days_diff / 90) * 0.2, 
            0.8 * np.exp(-0.0015 * (days_diff - 90)) 
        )
        res_df['recency_score'] = np.clip(res_df['recency_score'], 0.005, 1.0)
        
        w_sim = sim_tier / 10.0
        w_brand = brand_tier / 10.0 
        
        res_df['sim_score'] = res_df['similarity'] * w_sim
        res_df['brand_score'] = res_df['brand_fame_norm'] * w_brand
        
        # [수정됨] 최신성 점수(rec_score)에 추천도(w_brand)를 동기화하여 곱함
        res_df['rec_score'] = res_df['recency_score'] * w_brand
        
        res_df['total_score'] = res_df['sim_score'] + res_df['brand_score'] + res_df['rec_score']

        res_df = self._apply_filters(res_df, filters)

        final_list = res_df.drop(index=target_idx, errors='ignore').sort_values(by='total_score', ascending=False)
        top_results = final_list.head(top_n).copy()
        
        existing_cols = [c for c in display_cols if c in top_results.columns]
        return top_results[existing_cols]
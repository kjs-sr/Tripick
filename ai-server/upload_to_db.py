import pandas as pd
from sqlalchemy import create_engine
import os
import time

# ==============================================================================
# 🚨 [필수 설정] 🚨
# Render에서 복사한 External Database URL을 아래 따옴표 안에 붙여넣으세요.
# 예시: "postgresql://tripick_user:비밀번호1234@dpg-어쩌고.oregon-a.render.com/tripick_db"
# ==============================================================================
DB_URL = "postgresql://tripick_db_zc1m_user:577WubeunQD7QXKkeRHU1pMs2iPSggNL@dpg-d8ncm6ernols73djv9og-a.singapore-postgres.render.com/tripick_db_zc1m"

# SQLAlchemy 1.4 이상 버전 호환성을 위해 'postgres://' 로 시작하면 'postgresql://'로 자동 변환
if DB_URL.startswith("postgres://"):
    DB_URL = DB_URL.replace("postgres://", "postgresql://", 1)

# 업로드할 데이터 파일과 매칭될 DB 테이블 이름 설정
DATASETS = [
    {
        "file_path": "game_analytics_final_calibrated.csv", # 윌슨 스코어 보정본 (없으면 기본 final.csv 시도)
        "fallback_path": "game_analytics_final.csv",
        "table_name": "games"
    },
    {
        "file_path": "movie_dataset_preprocessed.csv",
        "fallback_path": None,
        "table_name": "movies"
    },
    {
        "file_path": "spotify_dataset_preprocessed.csv",
        "fallback_path": None,
        "table_name": "musics"
    }
]

def upload_to_postgres():
    print("="*60)
    print(" 🚀 Tripick 로컬 CSV -> Render PostgreSQL 마이그레이션 시작")
    print("="*60)
    
    if DB_URL == "여기에_복사한_URL을_붙여넣으세요":
        print("[오류] DB_URL을 입력하지 않으셨습니다. 코드 내부를 수정해주세요!")
        return

    try:
        # DB 연결 엔진 생성
        print("-> DB 접속 시도 중...")
        engine = create_engine(DB_URL)
        
        # 연결 테스트
        with engine.connect() as connection:
            print("-> DB 접속 성공! 데이터 업로드를 시작합니다.\n")
            
        for data in DATASETS:
            file_path = data["file_path"]
            fallback = data["fallback_path"]
            table_name = data["table_name"]
            
            # 파일 존재 여부 확인 및 fallback 적용
            target_file = file_path
            if not os.path.exists(target_file):
                if fallback and os.path.exists(fallback):
                    print(f"[안내] '{file_path}' 대신 '{fallback}' 파일을 사용합니다.")
                    target_file = fallback
                else:
                    print(f"⚠️ [건너뜀] '{file_path}' 파일을 찾을 수 없습니다.")
                    continue
                    
            print(f"[{table_name.upper()} 데이터 업로드 중] 파일 읽는 중...")
            df = pd.read_csv(target_file)
            
            # 대용량 데이터 업로드 (chunksize를 주어 메모리 폭파 방지)
            start_time = time.time()
            print(f"-> 총 {len(df):,}행 데이터를 '{table_name}' 테이블에 밀어넣습니다. (수 분 정도 소요될 수 있습니다...)")
            
            # if_exists='replace': 기존에 동일한 이름의 테이블이 있으면 지우고 새로 덮어씌움
            df.to_sql(name=table_name, con=engine, if_exists='replace', index=False, chunksize=5000)
            
            elapsed = time.time() - start_time
            print(f"✅ '{table_name}' 테이블 업로드 완료! (소요 시간: {elapsed:.1f}초)\n")

        print("="*60)
        print(" 🎉 모든 데이터의 클라우드 DB 마이그레이션이 완벽하게 끝났습니다!")
        print("="*60)

    except Exception as e:
        print(f"\n[업로드 중 오류 발생]: {e}")
        print("URL이 정확한지, 혹은 Render DB가 아직 'Creating' 상태인지 확인해 주세요.")

if __name__ == "__main__":
    upload_to_postgres()
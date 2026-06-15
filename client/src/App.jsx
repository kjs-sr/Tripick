import React, { useState, useEffect, useRef } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
// --- 내장형 아이콘 컴포넌트 ---
const Gamepad2 = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="6" x2="10" y1="12" y2="12" />
    <line x1="8" x2="8" y1="10" y2="14" />
    <line x1="15" x2="15.01" y1="13" y2="13" />
    <line x1="18" x2="18.01" y1="11" y2="11" />
    <rect width="20" height="12" x="2" y="6" rx="2" />
  </svg>
);
const Film = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 3v18" />
    <path d="M17 3v18" />
    <path d="M3 7h4" />
    <path d="M3 12h18" />
    <path d="M3 17h4" />
    <path d="M17 7h4" />
    <path d="M17 17h4" />
  </svg>
);
const Music = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);
const Search = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
const Sparkles = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);
const TrendingUp = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);
const Zap = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const Target = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const Loader2 = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
const FilterIcon = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const ChevronDown = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const ChevronUp = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
);
const ArrowLeft = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const ChevronLeft = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const XIcon = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ListXIcon = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M11 12H3" />
    <path d="M16 6H3" />
    <path d="M16 18H3" />
    <path d="M19 10l-4 4" />
    <path d="M15 10l4 4" />
  </svg>
);
const RotateCcw = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);
const AlertCircle = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

// --- UI 테스트용 가짜 데이터 (로컬 폴백용) ---
const mockDatabase = {
  game: [
    {
      name: "DARK SOULS III",
      developer: "FromSoftware",
      genre_primary: "Action RPG",
      total_score: 0.95,
      similarity: 92,
      positive_reviews_rate: 0.94,
      release_date: "2016-04-12",
    },
    {
      name: "Elden Ring",
      developer: "FromSoftware",
      genre_primary: "Action RPG",
      total_score: 0.88,
      similarity: 85,
      positive_reviews_rate: 0.95,
      release_date: "2022-02-25",
    },
    {
      name: "Lies of P",
      developer: "NEOWIZ",
      genre_primary: "Action RPG",
      total_score: 0.82,
      similarity: 79,
      positive_reviews_rate: 0.89,
      release_date: "2023-09-18",
    },
  ],
  movie: [
    {
      title: "The Matrix",
      original_title: "The Matrix",
      directors: "Lana Wachowski",
      genres: "Action, Sci-Fi",
      total_score: 0.92,
      similarity: 90,
      Total_Reliability_Score: 8.7,
      release_date: "1999-03-31",
      poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    },
    {
      title: "Inception",
      original_title: "Inception",
      directors: "Christopher Nolan",
      genres: "Action, Sci-Fi",
      total_score: 0.88,
      similarity: 82,
      Total_Reliability_Score: 8.8,
      release_date: "2010-07-16",
      poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    },
  ],
  music: [
    {
      track_name: "Comedy",
      artists: "Gen Hoshino;Sun",
      track_genre: "J-Pop",
      total_score: 0.89,
      similarity: 85,
      popularity: 85,
    },
    {
      track_name: "Shape of You",
      artists: "Ed Sheeran;Pop",
      track_genre: "Pop",
      total_score: 0.82,
      similarity: 78,
      popularity: 90,
    },
  ],
};

// --- 비율 3, 5, 7 / 1, 2, 3 설정 ---
const similarityLevels = [
  { id: "weak", label: "약함", description: "폭넓은 탐색", value: 3 },
  { id: "medium", label: "보통", description: "균형잡힌 추천", value: 5 },
  { id: "strong", label: "강함", description: "정밀한 타겟팅", value: 7 },
];

const recommendationLevels = [
  { id: "weak", label: "약함", description: "폭넓은 탐색", value: 1 },
  { id: "medium", label: "보통", description: "균형잡힌 추천", value: 2 },
  { id: "strong", label: "강함", description: "정밀한 타겟팅", value: 3 },
];

const tabs = [
  {
    id: "games",
    label: "게임",
    icon: <Gamepad2 size={20} />,
    gradient: "from-emerald-500 to-teal-600",
    accentColor: "emerald",
    placeholder: "게임 제목을 입력하세요 (예: DARK SOULS III)",
  },
  {
    id: "movies",
    label: "영화",
    icon: <Film size={20} />,
    gradient: "from-rose-500 to-red-600",
    accentColor: "rose",
    placeholder: "영화 제목을 입력하세요 (예: The Matrix)",
  },
  {
    id: "music",
    label: "음악",
    icon: <Music size={20} />,
    gradient: "from-sky-500 to-indigo-600",
    accentColor: "sky",
    placeholder: "곡 제목을 입력하세요 (예: Comedy)",
  },
];

// --- 제외 목록 관리 모달 컴포넌트 ---
function ExcludedItemsModal({
  isOpen,
  onClose,
  excludedItems,
  onRestore,
  onRestoreAll,
}) {
  const [modalTab, setModalTab] = useState("game");

  if (!isOpen) return null;

  const tabInfo = [
    { id: "game", label: "🎮 게임", count: excludedItems.game.length },
    { id: "movie", label: "🎬 영화", count: excludedItems.movie.length },
    { id: "music", label: "🎵 음악", count: excludedItems.music.length },
  ];

  const currentItems = excludedItems[modalTab] || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ListXIcon size={22} className="text-red-500" />
            추천 제외 목록 관리
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-200"
          >
            <XIcon size={24} />
          </button>
        </div>

        <div className="flex border-b border-gray-200 bg-gray-50/50 px-4 pt-2 gap-2">
          {tabInfo.map((t) => (
            <button
              key={t.id}
              onClick={() => setModalTab(t.id)}
              className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                modalTab === t.id
                  ? "border-teal-500 text-teal-700 bg-white rounded-t-lg"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-t-lg"
              }`}
            >
              {t.label}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${modalTab === t.id ? "bg-teal-100 text-teal-700" : "bg-gray-200 text-gray-600"}`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-extrabold text-gray-500 uppercase flex items-center gap-2">
              {tabInfo.find((t) => t.id === modalTab)?.label} 제외 내역
            </h4>
            {currentItems.length > 0 && (
              <button
                onClick={() => onRestoreAll(modalTab)}
                className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 px-3 py-1.5 rounded-lg border border-red-200 hover:border-red-500 transition-all shadow-sm"
              >
                <RotateCcw size={14} /> 현재 탭 전체 복구
              </button>
            )}
          </div>

          {currentItems.length > 0 ? (
            <div className="space-y-2">
              {currentItems.map((title) => (
                <div
                  key={title}
                  className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:border-teal-300 transition-colors"
                >
                  <span className="font-bold text-gray-800 line-clamp-1 flex-1 pr-4">
                    {title}
                  </span>
                  <button
                    onClick={() => onRestore(modalTab, title)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-500 hover:text-white rounded-lg text-xs font-bold transition-colors shrink-0"
                  >
                    <RotateCcw size={14} /> 개별 복구
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Target size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">
                제외된 항목이 없습니다.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                해당 탭의 추천 결과에서 '제외하기'를 누르면 등록됩니다.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-white text-center flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition-colors w-full"
          >
            완료 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}

// --- 콘텐츠 카드 컴포넌트 ---
function ContentCard({ item, rank, onExclude }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [item.id]);

  const getMusicGradient = (str) => {
    const gradients = [
      "from-pink-500 via-red-500 to-yellow-500",
      "from-green-400 via-cyan-500 to-blue-500",
      "from-yellow-300 via-orange-400 to-red-500",
      "from-fuchsia-600 via-purple-600 to-indigo-600",
      "from-emerald-400 via-teal-500 to-cyan-600",
      "from-rose-400 via-fuchsia-500 to-indigo-500",
      "from-indigo-400 via-purple-400 to-pink-400",
      "from-slate-700 via-purple-800 to-slate-900",
    ];
    let hash = 0;
    const targetStr = String(str || "music");
    for (let i = 0; i < targetStr.length; i++) {
      hash = targetStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  const displayCreator = String(item.creator || "Unknown")
    .split(";")
    .join(", ");

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full transition-transform duration-300">
      {/* 랭킹 뱃지 */}
      <div className="absolute top-3 right-3 z-10">
        <div className="flex items-center justify-center px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg font-extrabold border border-white/20 tracking-wider">
          <span className="text-sm">#{rank}</span>
        </div>
      </div>

      <div className="relative h-56 overflow-hidden bg-gray-900 flex-shrink-0">
        {item.image && !imgError ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 relative">
            {/* 게임 이미지 실패 시 */}
            {item.category === "game" && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-slate-900 flex flex-col items-center justify-center p-6">
                <AlertCircle size={36} className="text-gray-500 mb-3" />
                <span className="text-gray-400 text-sm font-bold leading-relaxed whitespace-pre-line">
                  연령 제한 콘텐츠이거나{"\n"}이미지를 불러올 수 없습니다.
                </span>
              </div>
            )}

            {/* 음악 이미지 API 부재 시 (자체 그라데이션 커버 생성) */}
            {item.category === "music" && (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${getMusicGradient(item.id || item.title)} flex flex-col items-center justify-center p-6 opacity-90`}
              >
                <Music
                  size={56}
                  className="text-white/90 mb-3 drop-shadow-lg"
                />
                <span className="text-white text-2xl font-extrabold line-clamp-2 drop-shadow-md leading-tight">
                  {item.title}
                </span>
                <span className="text-white/80 text-sm font-bold mt-2 line-clamp-1">
                  {displayCreator}
                </span>
              </div>
            )}

            {/* 영화 이미지 실패 시 */}
            {item.category === "movie" && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-slate-900 flex flex-col items-center justify-center">
                <Film size={48} className="text-gray-600 mb-3" />
                <span className="text-gray-500 font-bold text-xl">
                  NO POSTER
                </span>
              </div>
            )}
          </div>
        )}

        {/* 하단 그라데이션 및 연도 표시 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium shadow-sm">
              {item.year || "Unknown"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        {/* 원어 제목이 메인, 영문 제목이 서브 */}
        <h3
          className="font-extrabold text-gray-900 text-2xl leading-tight mb-1 line-clamp-1"
          title={item.title}
        >
          {item.title}
        </h3>
        {item.subTitle ? (
          <div
            className="text-sm text-gray-400 font-bold mb-3 line-clamp-1"
            title={item.subTitle}
          >
            {item.subTitle}
          </div>
        ) : (
          <div className="mb-3" />
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {item.genre.slice(0, 3).map((g) => (
            <span
              key={g}
              className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-semibold truncate max-w-[120px]"
            >
              {g}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          <div className="pt-4 border-t border-gray-100 mb-5">
            <p
              className="text-sm text-gray-500 font-medium line-clamp-1 truncate"
              title={displayCreator}
            >
              {item.creatorLabel}:{" "}
              <span className="text-gray-800 font-bold">{displayCreator}</span>
            </p>
          </div>

          <button
            onClick={() => onExclude(item)}
            className="w-full py-3 bg-gray-50 hover:bg-red-50 hover:text-red-600 text-gray-500 font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 border border-gray-200 hover:border-red-200"
          >
            <span>🚫</span> 추천에서 제외하기
          </button>
        </div>
      </div>
    </div>
  );
}

function IntensitySelector({ label, selected, onSelect, type, levels }) {
  const iconBg =
    type === "similarity"
      ? "bg-teal-100 text-teal-600"
      : "bg-amber-100 text-amber-600";
  const icon = type === "similarity" ? <Target size={18} /> : <Zap size={18} />;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg ${iconBg}`}>{icon}</div>
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>
      <div className="flex gap-2">
        {levels.map((level, index) => {
          const isSelected = selected === level.id;
          const intensityGradient =
            type === "similarity"
              ? index === 0
                ? "from-teal-200 to-teal-300 text-teal-800"
                : index === 1
                  ? "from-teal-400 to-teal-500 text-white"
                  : "from-teal-500 to-emerald-600 text-white"
              : index === 0
                ? "from-amber-200 to-amber-300 text-amber-800"
                : index === 1
                  ? "from-amber-400 to-amber-500 text-white"
                  : "from-amber-500 to-orange-600 text-white";

          return (
            <button
              type="button"
              key={level.id}
              onClick={() => onSelect(level.id)}
              className={`flex-1 relative px-2 py-3 rounded-xl transition-all duration-300 ${
                isSelected
                  ? `bg-gradient-to-br ${intensityGradient} shadow-md border-transparent`
                  : "bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-bold text-sm mb-0.5">{level.label}</div>
              <div
                className={`text-[10px] leading-tight ${isSelected ? "opacity-80" : "text-gray-400"}`}
              >
                {level.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- 연속형 범위 슬라이더 컴포넌트 ---
function DualRangeSlider({
  min,
  max,
  minValue,
  maxValue,
  onChangeMin,
  onChangeMax,
  activeBgColor,
  label,
  formatValue,
}) {
  const safeMax = Math.max(max, min + 1);
  const safeMinValue = Math.min(Math.max(minValue, min), safeMax);
  const safeMaxValue = Math.max(Math.min(maxValue, safeMax), safeMinValue);

  const minPercent = ((safeMinValue - min) / (safeMax - min)) * 100;
  const maxPercent = ((safeMaxValue - min) / (safeMax - min)) * 100;

  const isFullRange = safeMinValue === min && safeMaxValue === safeMax;

  const trackColor = isFullRange ? "bg-gray-200" : activeBgColor;
  const badgeClass = isFullRange
    ? "bg-gray-100 text-gray-400 border-gray-200"
    : "bg-white text-gray-800 border-gray-300";
  const labelText = `${formatValue ? formatValue(safeMinValue) : safeMinValue} ~ ${formatValue ? formatValue(safeMaxValue) : safeMaxValue}`;

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-3">
        <label className="text-sm font-bold text-gray-700">{label}</label>
        <span
          className={`text-xs font-bold px-3 py-1.5 rounded-lg border shadow-sm transition-colors duration-300 ${badgeClass}`}
        >
          {labelText}
        </span>
      </div>
      <div className="relative h-6 flex items-center group">
        <div className="absolute w-full h-2 bg-gray-100 rounded-full"></div>
        <div
          className={`absolute h-2 ${trackColor} rounded-full transition-colors duration-300`}
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        ></div>

        <input
          type="range"
          min={min}
          max={safeMax}
          value={safeMinValue}
          onChange={(e) =>
            onChangeMin(Math.min(Number(e.target.value), safeMaxValue))
          }
          className="absolute w-full appearance-none bg-transparent pointer-events-none cursor-pointer"
          style={{
            WebkitAppearance: "none",
            zIndex: minPercent > 50 ? 50 : 30,
          }}
        />
        <input
          type="range"
          min={min}
          max={safeMax}
          value={safeMaxValue}
          onChange={(e) =>
            onChangeMax(Math.max(Number(e.target.value), safeMinValue))
          }
          className="absolute w-full appearance-none bg-transparent pointer-events-none cursor-pointer"
          style={{ WebkitAppearance: "none", zIndex: 40 }}
        />

        <style
          dangerouslySetInnerHTML={{
            __html: `
          input[type=range]::-webkit-slider-thumb {
            pointer-events: auto; width: 20px; height: 20px; -webkit-appearance: none;
            background: white; border: 2px solid ${isFullRange ? "#e5e7eb" : "#9ca3af"}; border-radius: 50%;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2); cursor: ew-resize;
            transition: border-color 0.3s;
          }
          input[type=range]::-webkit-slider-thumb:hover { border-color: #6b7280; }
        `,
          }}
        />
      </div>
    </div>
  );
}

// --- 이산형(Discrete) 스냅 범위 슬라이더 컴포넌트 ---
function DiscreteDualRangeSlider({
  options,
  minValue,
  maxValue,
  onChangeMin,
  onChangeMax,
  activeBgColor,
  label,
  formatValue,
}) {
  const safeOptions =
    Array.isArray(options) && options.length > 1
      ? options
      : [0, 12, 15, 18, 21];
  const maxLimit = safeOptions.length - 1;

  let minIdx = safeOptions.findIndex((o) => Number(o) === Number(minValue));
  if (minIdx < 0) minIdx = 0;

  let maxIdx = safeOptions.findIndex((o) => Number(o) === Number(maxValue));
  if (maxIdx < 0) maxIdx = maxLimit;

  const minPercent = maxLimit > 0 ? (minIdx / maxLimit) * 100 : 0;
  const maxPercent = maxLimit > 0 ? (maxIdx / maxLimit) * 100 : 0;

  const isFullRange = minIdx === 0 && maxIdx === maxLimit;
  const trackColor = isFullRange ? "bg-gray-200" : activeBgColor;
  const badgeClass = isFullRange
    ? "bg-gray-100 text-gray-400 border-gray-200"
    : "bg-white text-gray-800 border-gray-300";
  const labelText = `${formatValue ? formatValue(safeOptions[minIdx]) : safeOptions[minIdx]} ~ ${formatValue ? formatValue(safeOptions[maxIdx]) : safeOptions[maxIdx]}`;

  return (
    <div className="w-full pb-6 relative">
      <div className="flex justify-between items-end mb-3">
        <label className="text-sm font-bold text-gray-700">{label}</label>
        <span
          className={`text-xs font-bold px-3 py-1.5 rounded-lg border shadow-sm transition-colors duration-300 ${badgeClass}`}
        >
          {labelText}
        </span>
      </div>
      <div className="relative h-6 flex items-center group">
        <div className="absolute w-full h-2 bg-gray-100 rounded-full"></div>
        <div
          className={`absolute h-2 ${trackColor} rounded-full transition-colors duration-300`}
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        ></div>

        <input
          type="range"
          min={0}
          max={maxLimit}
          value={minIdx}
          onChange={(e) => {
            const newIdx = Math.min(Number(e.target.value), maxIdx);
            onChangeMin(safeOptions[newIdx]);
          }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none cursor-pointer"
          style={{
            WebkitAppearance: "none",
            zIndex: minPercent > 50 ? 50 : 30,
          }}
        />
        <input
          type="range"
          min={0}
          max={maxLimit}
          value={maxIdx}
          onChange={(e) => {
            const newIdx = Math.max(Number(e.target.value), minIdx);
            onChangeMax(safeOptions[newIdx]);
          }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none cursor-pointer"
          style={{ WebkitAppearance: "none", zIndex: 40 }}
        />

        <style
          dangerouslySetInnerHTML={{
            __html: `
          input[type=range]::-webkit-slider-thumb {
            pointer-events: auto; width: 20px; height: 20px; -webkit-appearance: none;
            background: white; border: 2px solid ${isFullRange ? "#e5e7eb" : "#9ca3af"}; border-radius: 50%;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2); cursor: ew-resize;
            transition: border-color 0.3s;
          }
          input[type=range]::-webkit-slider-thumb:hover { border-color: #6b7280; }
        `,
          }}
        />
      </div>

      <div className="absolute w-full mt-1 flex justify-between px-2.5">
        {safeOptions.map((opt, i) => (
          <div
            key={opt}
            className="flex flex-col items-center absolute"
            style={{
              left: `${maxLimit > 0 ? (i / maxLimit) * 100 : 0}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="w-0.5 h-1.5 bg-gray-300 mb-0.5"></div>
            <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
              {formatValue ? formatValue(opt) : opt}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SingleChips({ options, selected, onChange, activeColor, activeBg }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              isSelected
                ? `${activeBg} ${activeColor} shadow-sm border-transparent`
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 border"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({ checked, onChange, label, colorClass }) {
  return (
    <label className="flex items-center cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div
          className={`block w-12 h-7 rounded-full transition-colors ${checked ? colorClass : "bg-gray-300 group-hover:bg-gray-400"}`}
        ></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${checked ? "transform translate-x-5" : ""}`}
        ></div>
      </div>
      <div className="ml-3 text-sm font-bold text-gray-700">{label}</div>
    </label>
  );
}

function ResultsView({
  results,
  onBack,
  subTab,
  activeTab,
  currentTabConfig,
  onExclude,
  onOpenExcludeModal,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
  }, [results]);

  useEffect(() => {
    if (currentIndex >= results.length && results.length > 0) {
      setCurrentIndex(Math.max(0, results.length - 1));
    }
  }, [results.length, currentIndex]);

  const minSwipeDistance = 50;

  const goToNext = () => {
    if (results.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % results.length);
  };

  const goToPrev = () => {
    if (results.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + results.length) % results.length);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) goToNext();
    if (distance < -minSwipeDistance) goToPrev();
  };

  const onMouseDown = (e) => {
    setIsDragging(true);
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    if (touchStart !== null) {
      setTouchEnd(e.clientX);
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
    if (!touchStart || !touchEnd) {
      setTouchStart(null);
      return;
    }
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) goToNext();
    if (distance < -minSwipeDistance) goToPrev();

    setTouchStart(null);
    setTouchEnd(null);
  };

  const onMouseLeave = () => {
    if (isDragging) {
      onMouseUp();
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans relative overflow-hidden flex flex-col">
      <div
        className={`absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b ${currentTabConfig.gradient} opacity-20 pointer-events-none blur-3xl`}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 w-full flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/5">
              <ArrowLeft size={20} />
            </div>
            <span className="font-bold text-lg hidden sm:inline">
              다시 검색하기
            </span>
          </button>

          <button
            onClick={onOpenExcludeModal}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <span className="font-bold text-sm hidden sm:inline">
              제외 목록 관리
            </span>
            <div className="p-2 bg-white/10 rounded-full group-hover:bg-red-500/20 backdrop-blur-sm transition-colors border border-white/5 group-hover:text-red-400">
              <ListXIcon size={18} />
            </div>
          </button>
        </div>

        <div className="mb-4 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-3 text-white tracking-tight drop-shadow-md">
            {subTab === "trend" ? "트렌드 추천 결과" : "맞춤형 추천 결과"}
          </h2>
          <p className="text-gray-400 text-sm md:text-lg font-medium px-4 leading-relaxed">
            AI가 찾아낸 {results.length}개의 작품입니다.
            <br />
            <span className="hidden md:inline">
              마우스로 드래그하거나 화살표를 클릭하여 넘겨보세요.
            </span>
            <span className="md:hidden">
              좌우로 스와이프하여 다음 작품을 확인해보세요.
            </span>
          </p>
        </div>

        {results.length > 0 ? (
          <div
            className="relative flex-1 flex items-center justify-center min-h-[550px] w-full max-w-6xl mx-auto cursor-grab active:cursor-grabbing select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-2 md:left-8 lg:left-12 z-50 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-lg border border-white/20 text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={32} />
            </button>

            <div className="relative w-full h-[550px] flex items-center justify-center">
              {results.map((item, index) => {
                let diff = index - currentIndex;

                if (
                  diff < -1 &&
                  currentIndex === results.length - 1 &&
                  index === 0
                )
                  diff = 1;
                if (
                  diff > 1 &&
                  currentIndex === 0 &&
                  index === results.length - 1
                )
                  diff = -1;

                const isCurrent = diff === 0;
                const isPrev = diff === -1;
                const isNext = diff === 1;

                let translateX = "0%";
                let scale = 0.7;
                let opacity = 0;
                let zIndex = 0;

                if (isCurrent) {
                  translateX = "0%";
                  scale = 1.0;
                  opacity = 1;
                  zIndex = 30;
                } else if (isPrev) {
                  translateX = "-55%";
                  scale = 0.8;
                  opacity = 0.5;
                  zIndex = 20;
                } else if (isNext) {
                  translateX = "55%";
                  scale = 0.8;
                  opacity = 0.5;
                  zIndex = 20;
                }

                return (
                  <div
                    key={item.id}
                    className="absolute transition-all duration-500 ease-in-out w-[320px] md:w-[380px]"
                    style={{
                      transform: `translateX(${translateX}) scale(${scale})`,
                      opacity: opacity,
                      zIndex: zIndex,
                      pointerEvents: isCurrent ? "auto" : "none",
                      filter: isCurrent ? "blur(0px)" : "blur(2px)",
                    }}
                  >
                    <ContentCard
                      item={item}
                      rank={index + 1}
                      onExclude={onExclude}
                    />
                  </div>
                );
              })}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 md:right-8 lg:right-12 z-50 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-lg border border-white/20 text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
            >
              <ChevronRight size={32} />
            </button>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 flex-wrap max-w-sm mx-auto px-4">
              {results.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/30"}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center py-16 px-8 bg-gray-800/50 rounded-3xl border border-gray-700/50 backdrop-blur-md max-w-lg">
              <AlertCircle size={48} className="text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                결과를 찾을 수 없습니다
              </h3>
              <p className="text-gray-400 text-base">
                설정하신 조건이나 제외 목록으로 인해 남은 작품이 없습니다.
                조건을 완화해보세요.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [view, setView] = useState("search");
  const [activeTab, setActiveTab] = useState("game");
  const [subTab, setSubTab] = useState("custom");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [similarity, setSimilarity] = useState("medium");
  const [recommendation, setRecommendation] = useState("medium");

  const [suggestions, setSuggestions] = useState([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValidSelection, setIsValidSelection] = useState(false);
  const dropdownRef = useRef(null);

  // ★ 최적화: 검색어 자동완성 결과를 로컬에 임시 저장(캐싱)하기 위한 Ref
  const searchCache = useRef({});

  // 탭이 바뀔 때 캐시 초기화
  useEffect(() => {
    searchCache.current = {};
  }, [activeTab]);

  const [excludedItems, setExcludedItems] = useState(() => {
    try {
      const saved = localStorage.getItem("tripick_excluded_items");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("로컬 스토리지 파싱 에러:", e);
    }
    return { game: [], movie: [], music: [] };
  });

  useEffect(() => {
    localStorage.setItem(
      "tripick_excluded_items",
      JSON.stringify(excludedItems),
    );
  }, [excludedItems]);

  const [isExcludeModalOpen, setIsExcludeModalOpen] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [metadataStatus, setMetadataStatus] = useState("loading");
  const [metadataErrorMsg, setMetadataErrorMsg] = useState("");

  const [searchSessionId, setSearchSessionId] = useState(Date.now());

  const [filterMeta, setFilterMeta] = useState({
    game: {
      minYear: 1950,
      maxYear: 2025,
      minPrice: 0,
      maxPrice: 999,
      minAge: 0,
      maxAge: 18,
      ageOptions: [12, 15, 18],
    },
    movie: { minYear: 1900, maxYear: 2025 },
    music: { minDuration: 0, maxDuration: 3600 },
  });

  const [filters, setFilters] = useState({
    gameStartYear: 1950,
    gameEndYear: 2025,
    minPrice: 0,
    maxPrice: 999,
    isFree: false,
    gameMinAge: 0,
    gameMaxAge: 18,
    movieStartYear: 1900,
    movieEndYear: 2025,
    musicMinDuration: 0,
    musicMaxDuration: 3600,
    explicit: false,
    mood: "",
  });

  const categoryMap = { games: "game", movies: "movie", music: "music" };
  const revCategoryMap = { game: "games", movie: "movies", music: "music" };
  const currentUiTab = revCategoryMap[activeTab];
  const currentTabConfig = tabs.find((t) => t.id === currentUiTab);

  const showSubTabs = activeTab === "game" || activeTab === "movie";

  useEffect(() => {
    const fetchMetadata = async () => {
      setMetadataStatus("loading");
      setMetadataErrorMsg("");
      try {
        let res = null;
        let data = null;

        try {
          res = await fetch(`${API_BASE_URL}/api/metadata?_t=${Date.now()}`, {
            cache: "no-store",
          });
          if (res.ok) data = await res.json();
        } catch (e) {}

        if (!data || data.status !== "success") {
          res = await fetch(`http://127.0.0.1:8000/metadata?_t=${Date.now()}`, {
            cache: "no-store",
          });
          if (!res.ok) throw new Error("CORS or Server Down");
          data = await res.json();
        }

        if (data && data.status === "success" && data.data) {
          setFilterMeta((prevMeta) => ({
            ...prevMeta,
            game: {
              ...prevMeta.game,
              minYear: data.data.game?.minYear ?? prevMeta.game.minYear,
              maxYear: data.data.game?.maxYear ?? prevMeta.game.maxYear,
              minPrice: data.data.game?.minPrice ?? prevMeta.game.minPrice,
              maxPrice: data.data.game?.maxPrice ?? prevMeta.game.maxPrice,
              minAge: data.data.game?.minAge ?? prevMeta.game.minAge,
              maxAge: data.data.game?.maxAge ?? prevMeta.game.maxAge,
              ageOptions:
                data.data.game?.ageOptions ?? prevMeta.game.ageOptions,
            },
            movie: {
              ...prevMeta.movie,
              minYear: data.data.movie?.minYear ?? prevMeta.movie.minYear,
              maxYear: data.data.movie?.maxYear ?? prevMeta.movie.maxYear,
            },
            music: {
              ...prevMeta.music,
              minDuration:
                data.data.music?.minDuration ?? prevMeta.music.minDuration,
              maxDuration:
                data.data.music?.maxDuration ?? prevMeta.music.maxDuration,
            },
          }));

          setFilters((prev) => ({
            ...prev,
            gameStartYear: data.data.game?.minYear ?? prev.gameStartYear,
            gameEndYear: data.data.game?.maxYear ?? prev.gameEndYear,
            minPrice: data.data.game?.minPrice ?? prev.minPrice,
            maxPrice: data.data.game?.maxPrice ?? prev.maxPrice,
            gameMinAge: data.data.game?.minAge ?? prev.gameMinAge,
            gameMaxAge: data.data.game?.maxAge ?? prev.gameMaxAge,
            movieStartYear: data.data.movie?.minYear ?? prev.movieStartYear,
            movieEndYear: data.data.movie?.maxYear ?? prev.movieEndYear,
            musicMinDuration:
              data.data.music?.minDuration ?? prev.musicMinDuration,
            musicMaxDuration:
              data.data.music?.maxDuration ?? prev.musicMaxDuration,
          }));
          setMetadataStatus("success");
        } else {
          throw new Error("Invalid Format");
        }
      } catch (err) {
        console.warn(
          "백엔드 오프라인. 실제 데이터셋 기준값을 사용한 로컬 모드로 전환합니다.",
        );
        const fallbackMeta = {
          game: {
            minYear: 1997,
            maxYear: 2024,
            minPrice: 0,
            maxPrice: 100,
            minAge: 0,
            maxAge: 18,
            ageOptions: [12, 15, 18, 21],
          },
          movie: { minYear: 1970, maxYear: 2024 },
          music: { minDuration: 0, maxDuration: 600 },
        };
        setFilterMeta(fallbackMeta);
        setFilters((prev) => ({
          ...prev,
          gameStartYear: fallbackMeta.game.minYear,
          gameEndYear: fallbackMeta.game.maxYear,
          minPrice: fallbackMeta.game.minPrice,
          maxPrice: fallbackMeta.game.maxPrice,
          gameMinAge: fallbackMeta.game.minAge,
          gameMaxAge: fallbackMeta.game.maxAge,
          movieStartYear: fallbackMeta.movie.minYear,
          movieEndYear: fallbackMeta.movie.maxYear,
          musicMinDuration: fallbackMeta.music.minDuration,
          musicMaxDuration: fallbackMeta.music.maxDuration,
        }));
        setMetadataStatus("fallback");
        setMetadataErrorMsg(err.message);
      }
    };

    fetchMetadata();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ★ 자동완성 미리보기 속도 최적화 로직 적용 (캐싱 + 딜레이 단축)
  useEffect(() => {
    const query = searchTerm.trim();

    // 1글자 미만이거나 이미 선택된 상태면 미리보기 창을 닫음
    if (query.length < 1 || isValidSelection) {
      setSuggestions([]);
      setIsSuggesting(false);
      return;
    }

    // ★ 캐싱 로직: 동일한 탭에서 이미 검색해 본 키워드는 서버 요청 없이 메모리에서 즉시 꺼내옴
    const cacheKey = `${activeTab}_${query.toLowerCase()}`;
    if (searchCache.current[cacheKey]) {
      setSuggestions(searchCache.current[cacheKey]);
      setIsSuggesting(false);
      return;
    }

    setIsSuggesting(true);

    // ★ 디바운스(Debounce) 대기 시간을 300ms에서 150ms로 대폭 단축하여 반응성을 두 배로 끌어올림
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/search?category=${activeTab}&query=${encodeURIComponent(query)}&_t=${Date.now()}`,
          { cache: "no-store" },
        );
        const data = await res.json();

        if (data.status === "success" && data.data) {
          const results = data.data.slice(0, 10);
          searchCache.current[cacheKey] = results; // 성공한 결과 캐싱
          setSuggestions(results);
        } else {
          throw new Error("API failed");
        }
      } catch (err) {
        // 백엔드 미연결 시 로컬 모의(Mock) 데이터 검색 로직
        const mockData = mockDatabase[activeTab] || [];
        const filtered = mockData.filter((item) => {
          const title = (
            item.title ||
            item.name ||
            item.track_name ||
            ""
          ).toLowerCase();
          const origTitle = (item.original_title || "").toLowerCase();
          const q = query.toLowerCase();
          return title.includes(q) || origTitle.includes(q);
        });
        const results = filtered.slice(0, 10);
        searchCache.current[cacheKey] = results; // 모의 결과도 캐싱
        setSuggestions(results);
      } finally {
        setIsSuggesting(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchTerm, activeTab, isValidSelection]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      gameStartYear: filterMeta.game.minYear,
      gameEndYear: filterMeta.game.maxYear,
      minPrice: filterMeta.game.minPrice,
      maxPrice: filterMeta.game.maxPrice,
      isFree: false,
      gameMinAge: filterMeta.game.minAge,
      gameMaxAge: filterMeta.game.maxAge,
      movieStartYear: filterMeta.movie.minYear,
      movieEndYear: filterMeta.movie.maxYear,
      musicMinDuration: filterMeta.music.minDuration,
      musicMaxDuration: filterMeta.music.maxDuration,
      explicit: false,
      mood: "",
    });
  };

  const handleExclude = (item) => {
    setExcludedItems((prev) => ({
      ...prev,
      [item.category]: [...prev[item.category], item.title],
    }));
    setResults((prev) => prev.filter((r) => r.id !== item.id));
  };

  const handleRestore = (category, title) => {
    setExcludedItems((prev) => ({
      ...prev,
      [category]: prev[category].filter((t) => t !== title),
    }));
  };

  const handleRestoreAll = (category) => {
    setExcludedItems((prev) => ({
      ...prev,
      [category]: [],
    }));
  };

  const renderSuggestion = (item) => {
    if (activeTab === "music") {
      const formattedArtists = String(item.artists || "")
        .split(";")
        .join(", ");
      return {
        displayTitle: item.track_name || item.title || "",
        displaySub: formattedArtists,
        searchKey: item.track_name || item.title || "",
      };
    } else if (activeTab === "game") {
      return {
        displayTitle: item.name || item.title || "",
        displaySub: item.developer || "",
        searchKey: item.name || item.title || "",
      };
    } else if (activeTab === "movie") {
      const mainTitle = item.original_title || item.title || "";
      const engTitle = item.title !== item.original_title ? item.title : "";
      const directorInfo = item.directors ? `감독: ${item.directors}` : "";

      let subText = engTitle;
      if (directorInfo) {
        subText = subText ? `${engTitle} | ${directorInfo}` : directorInfo;
      }

      return {
        displayTitle: mainTitle,
        displaySub: subText,
        searchKey: item.title || "",
      };
    }
    return { displayTitle: "Unknown", displaySub: "", searchKey: "" };
  };

  const handleSuggestionClick = (item) => {
    const { searchKey } = renderSuggestion(item);
    setSearchTerm(searchKey);
    setIsValidSelection(true);
    setShowSuggestions(false);
    setError(null);
  };

  const normalizeData = (item, category) => {
    let base = {
      id: item.appid || item.id || item.track_id || Math.random().toString(),
      category: category,
      finalScore: item.total_score ? item.total_score * 100 : 0,
      similarity: item.similarity || 0,
    };

    if (category === "music") {
      const formattedArtists = String(item.artists || "Unknown")
        .split(";")
        .join(", ");
      return {
        ...base,
        title: item.track_name || "Unknown",
        creatorLabel: "아티스트",
        creator: formattedArtists,
        genre: item.track_genre ? item.track_genre.split(",") : [],
        quality: item.popularity_norm || item.popularity || 0,
        year: item.release_date ? item.release_date.substring(0, 4) : "",
        image: item.poster_path || null,
      };
    } else if (category === "game") {
      return {
        ...base,
        title: item.name || "Unknown",
        creatorLabel: "개발사",
        creator: item.developer || "Unknown",
        genre: item.genre_primary ? item.genre_primary.split(",") : [],
        quality: item.positive_ratio_norm || item.positive_reviews_rate || 0,
        year: item.release_date ? item.release_date.substring(0, 4) : "",
        image: item.appid
          ? `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${item.appid}/header.jpg`
          : null,
      };
    } else if (category === "movie") {
      return {
        ...base,
        title: item.original_title || item.title || "Unknown",
        subTitle:
          item.title && item.title !== item.original_title ? item.title : null,
        creatorLabel: "감독",
        creator: item.directors
          ? String(item.directors).replace(/[\[\]']/g, "")
          : "Unknown",
        genre: item.genres ? item.genres.split(",") : [],
        quality: item.rel_score_norm || item.Total_Reliability_Score || 0,
        year: item.release_date ? item.release_date.substring(0, 4) : "",
        image: item.poster_path
          ? `https://image.tmdb.org/t/p/original${item.poster_path}`
          : null,
      };
    }
    return base;
  };

  const getBackendFilters = () => {
    if (!isFilterOpen) return null;
    let backendFilters = {};

    if (activeTab === "game") {
      backendFilters.start_date = `${filters.gameStartYear}-01-01`;
      backendFilters.end_date = `${filters.gameEndYear}-12-31`;
      backendFilters.min_price = Number(filters.minPrice);
      backendFilters.max_price =
        Number(filters.maxPrice) >= filterMeta.game.maxPrice
          ? 9999
          : Number(filters.maxPrice);
      backendFilters.min_required_age = Number(filters.gameMinAge);
      backendFilters.max_required_age = Number(filters.gameMaxAge);
      if (filters.isFree) backendFilters.is_free = true;
    } else if (activeTab === "movie") {
      backendFilters.start_year = Number(filters.movieStartYear);
      backendFilters.end_year = Number(filters.movieEndYear);
    } else if (activeTab === "music") {
      backendFilters.min_duration_ms = Number(filters.musicMinDuration) * 1000;
      backendFilters.max_duration_ms =
        Number(filters.musicMaxDuration) >= filterMeta.music.maxDuration
          ? 99999999
          : Number(filters.musicMaxDuration) * 1000;
      if (filters.explicit) backendFilters.explicit = false;
      if (filters.mood !== "") backendFilters.mode = Number(filters.mood);
    }
    return backendFilters;
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;

    if (!isValidSelection) {
      setError(
        "목록에서 정확한 작품을 선택해주세요.\n(데이터베이스에 존재하지 않는 검색어입니다)",
      );
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    setSearchSessionId(Date.now());

    const appliedFilters = getBackendFilters();
    const currentExcluded = excludedItems[activeTab] || [];

    const simValue =
      similarityLevels.find((l) => l.id === similarity)?.value || 5;
    const recValue =
      recommendationLevels.find((l) => l.id === recommendation)?.value || 2;

    try {
      const queryParams = new URLSearchParams({
        category: activeTab,
        query: searchTerm,
        mode: subTab,
        sim_tier: simValue.toString(),
        rec_tier: recValue.toString(),
        limit: "10",
        _t: Date.now().toString(),
      });

      if (appliedFilters && Object.keys(appliedFilters).length > 0) {
        queryParams.append("filters", JSON.stringify(appliedFilters));
      }
      if (currentExcluded.length > 0) {
        queryParams.append("excludes", JSON.stringify(currentExcluded));
      }

      const response = await fetch(
        `${API_BASE_URL}/api/recommend?${queryParams.toString()}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) throw new Error("API Connect Error");

      const data = await response.json();

      if (data.status === "success" && data.data && data.data.length > 0) {
        const normalized = data.data.map((item) =>
          normalizeData(item, activeTab),
        );
        setSearchSessionId(Date.now());
        setResults(normalized);
        setView("results");
      } else {
        setError("조건에 맞는 결과를 찾지 못했습니다.\n필터를 완화해보세요.");
      }
    } catch (err) {
      console.warn("백엔드 미연결: 로컬 데이터로 UI만 테스트합니다.");
      let data = mockDatabase[activeTab] || [];

      data = data.filter((item) => {
        const title = item.name || item.title || item.track_name || "";
        const origTitle = item.original_title || "";
        return (
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          origTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

      if (currentExcluded.length > 0) {
        data = data.filter((item) => {
          const title = item.name || item.title || item.track_name;
          return !currentExcluded.includes(title);
        });
      }
      if (appliedFilters && isFilterOpen) {
        if (activeTab === "game" && appliedFilters.min_price !== undefined) {
          data = data.filter(
            (d) => (d.price_initial || 0) >= appliedFilters.min_price,
          );
        }
      }

      if (data.length > 0) {
        const normalized = data.map((item) => normalizeData(item, activeTab));
        setSearchSessionId(Date.now());
        setResults(normalized);
        setView("results");
      } else {
        setError("필터 조건에 맞는 테스트용 결과가 없습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(categoryMap[tabId]);
    setError(null);
    setSearchTerm("");
    setIsValidSelection(false);
    setSuggestions([]);
    if (tabId === "music") {
      setSubTab("custom");
    }
  };

  const rawAgeOptions = filterMeta.game?.ageOptions;
  const safeAgeOptions =
    Array.isArray(rawAgeOptions) && rawAgeOptions.length > 0
      ? rawAgeOptions
      : [12, 15, 18, 21];
  const gameAgeOptions = Array.from(new Set([0, ...safeAgeOptions])).sort(
    (a, b) => Number(a) - Number(b),
  );

  if (view === "results") {
    return (
      <>
        <ExcludedItemsModal
          isOpen={isExcludeModalOpen}
          onClose={() => setIsExcludeModalOpen(false)}
          excludedItems={excludedItems}
          onRestore={handleRestore}
          onRestoreAll={handleRestoreAll}
        />
        <ResultsView
          key={searchSessionId}
          results={results}
          onBack={() => {
            setView("search");
            setResults([]);
            setSearchTerm("");
          }}
          subTab={subTab}
          activeTab={activeTab}
          currentTabConfig={currentTabConfig}
          onExclude={handleExclude}
          onOpenExcludeModal={() => setIsExcludeModalOpen(true)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 font-sans">
      <ExcludedItemsModal
        isOpen={isExcludeModalOpen}
        onClose={() => setIsExcludeModalOpen(false)}
        excludedItems={excludedItems}
        onRestore={handleRestore}
        onRestoreAll={handleRestoreAll}
      />

      <header className="relative overflow-hidden shadow-sm pb-6">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${currentTabConfig.gradient} transition-colors duration-700`}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsExcludeModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full text-sm font-bold transition-all shadow-sm border border-white/10"
          >
            <ListXIcon size={16} /> 제외 목록 관리
          </button>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 text-center mt-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-sm">
            <span className="text-white/90">Tri</span>pick
          </h1>
          <p className="text-white/90 text-xl max-w-xl mx-auto font-medium">
            당신의 취향을 저격할 음악, 게임, 영화를 찾아보세요.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="flex gap-2 p-1.5 bg-white/10 backdrop-blur-md rounded-2xl w-fit mx-auto shadow-inner">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  currentUiTab === tab.id
                    ? `bg-white text-gray-900 shadow-lg scale-105`
                    : "text-white/80 hover:text-white hover:bg-white/20"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          {showSubTabs && (
            <div className="flex gap-4 justify-center mb-8">
              <button
                type="button"
                onClick={() => setSubTab("custom")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  subTab === "custom"
                    ? "bg-teal-600 text-white shadow-md shadow-teal-500/30"
                    : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-800 border border-gray-200"
                }`}
              >
                <Sparkles size={18} />
                <span>맞춤형 추천</span>
              </button>
              <button
                type="button"
                onClick={() => setSubTab("trend")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  subTab === "trend"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                    : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-800 border border-gray-200"
                }`}
              >
                <TrendingUp size={18} />
                <span>트렌드 추천</span>
              </button>
            </div>
          )}

          <form onSubmit={handleSearch}>
            <div className="relative z-50 mb-8" ref={dropdownRef}>
              <div className="relative flex items-center w-full shadow-sm rounded-2xl group">
                <div className="absolute left-5 flex items-center justify-center pointer-events-none">
                  <Search
                    className="text-gray-400 group-focus-within:text-teal-500 transition-colors"
                    size={24}
                  />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsValidSelection(false);
                    setShowSuggestions(true);
                    setError(null);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (
                        showSuggestions &&
                        suggestions.length > 0 &&
                        !isValidSelection
                      ) {
                        e.preventDefault();
                        handleSuggestionClick(suggestions[0]);
                      }
                    }
                  }}
                  placeholder={currentTabConfig.placeholder}
                  className="w-full py-5 pl-14 pr-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-gray-800 placeholder:text-gray-400 text-lg"
                />
              </div>

              {/* 검색 자동완성 드롭다운 UI */}
              {showSuggestions &&
                searchTerm.trim().length > 0 &&
                !isValidSelection && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-80 overflow-y-auto animate-fade-in">
                    {isSuggesting ? (
                      <div className="p-5 text-center text-gray-400 flex items-center justify-center gap-2 font-medium">
                        <Loader2
                          size={18}
                          className="animate-spin text-teal-500"
                        />{" "}
                        데이터셋 탐색 중...
                      </div>
                    ) : suggestions.length > 0 ? (
                      <ul className="divide-y divide-gray-50">
                        {suggestions.map((item, idx) => {
                          const { displayTitle, displaySub } =
                            renderSuggestion(item);
                          return (
                            <li
                              key={item.id || idx}
                              onClick={() => handleSuggestionClick(item)}
                              className="px-5 py-3.5 hover:bg-teal-50 cursor-pointer transition-colors flex flex-col group"
                            >
                              <span className="font-bold text-gray-800 line-clamp-1 group-hover:text-teal-700">
                                {displayTitle}
                              </span>
                              {displaySub && (
                                <span className="text-sm text-gray-500 font-medium line-clamp-1 mt-0.5">
                                  {displaySub}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="p-5 text-center text-gray-500 text-sm font-medium">
                        일치하는 결과가 데이터셋에 존재하지 않습니다.
                        <br />
                        정확한 영문 이름을 입력해보세요.
                      </div>
                    )}
                  </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <IntensitySelector
                label="유사도 강도 (Similarity)"
                selected={similarity}
                onSelect={setSimilarity}
                type="similarity"
                levels={similarityLevels}
              />
              <IntensitySelector
                label="품질/트렌드 강도 (Quality/Trend)"
                selected={recommendation}
                onSelect={setRecommendation}
                type="recommendation"
                levels={recommendationLevels}
              />
            </div>

            <div className="flex justify-between items-center mb-2 mt-4">
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  isFilterOpen
                    ? "bg-teal-50 text-teal-600 border border-teal-200 shadow-sm"
                    : "bg-white text-gray-400 border border-gray-200 hover:bg-gray-50 hover:text-gray-600"
                }`}
              >
                <FilterIcon size={14} />
                {isFilterOpen ? "상세 필터 닫기" : "상세 필터 열기"}
                {isFilterOpen ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>

              {isFilterOpen && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-teal-600 transition-colors hover:bg-teal-50 px-2 py-1 rounded-md"
                >
                  <RotateCcw size={12} /> 필터 초기화
                </button>
              )}
            </div>

            <div
              className={`transition-all duration-500 ease-in-out origin-top ${
                isFilterOpen
                  ? "max-h-[2000px] opacity-100 mb-8 overflow-visible"
                  : "max-h-0 opacity-0 overflow-hidden m-0"
              }`}
            >
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
                {metadataStatus === "loading" && (
                  <div className="flex justify-center p-6">
                    <Loader2 size={32} className="animate-spin text-teal-500" />
                  </div>
                )}

                {metadataStatus === "fallback" && (
                  <div className="mb-6 p-4 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 text-sm font-bold flex items-center gap-3 animate-fade-in">
                    <AlertCircle size={20} className="shrink-0" />
                    <div>
                      백엔드 서버와 연결할 수 없어{" "}
                      <b>로컬 데이터 테스트 모드</b>로 동작합니다.
                      <br />
                      <span className="font-medium">
                        슬라이더 범위는 실제 데이터셋의 기준(예: 게임
                        1997~2024년)으로 정상 적용되어 있습니다.
                      </span>
                    </div>
                  </div>
                )}

                {metadataStatus !== "loading" && activeTab === "game" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                    <DualRangeSlider
                      label="출시일 범위"
                      min={filterMeta.game.minYear}
                      max={filterMeta.game.maxYear}
                      minValue={filters.gameStartYear}
                      maxValue={filters.gameEndYear}
                      onChangeMin={(val) =>
                        handleFilterChange("gameStartYear", val)
                      }
                      onChangeMax={(val) =>
                        handleFilterChange("gameEndYear", val)
                      }
                      activeBgColor="bg-teal-500"
                      formatValue={(v) => `${v}년`}
                    />
                    <DualRangeSlider
                      label="가격 범위 ($)"
                      min={filterMeta.game.minPrice}
                      max={filterMeta.game.maxPrice}
                      minValue={filters.minPrice}
                      maxValue={filters.maxPrice}
                      onChangeMin={(val) => handleFilterChange("minPrice", val)}
                      onChangeMax={(val) => handleFilterChange("maxPrice", val)}
                      activeBgColor="bg-teal-500"
                      formatValue={(v) =>
                        v === filterMeta.game.maxPrice
                          ? `$${filterMeta.game.maxPrice}+`
                          : `$${v}`
                      }
                    />

                    <div className="md:col-span-2">
                      <DiscreteDualRangeSlider
                        label="연령 제한 범위"
                        options={gameAgeOptions}
                        minValue={filters.gameMinAge}
                        maxValue={filters.gameMaxAge}
                        onChangeMin={(val) =>
                          handleFilterChange("gameMinAge", val)
                        }
                        onChangeMax={(val) =>
                          handleFilterChange("gameMaxAge", val)
                        }
                        activeBgColor="bg-teal-500"
                        formatValue={(v) => (v === 0 ? "전체이용가" : `${v}세`)}
                      />
                    </div>

                    <div className="flex items-center mt-6">
                      <Toggle
                        label="무료 게임만 보기"
                        checked={filters.isFree}
                        onChange={(e) =>
                          handleFilterChange("isFree", e.target.checked)
                        }
                        colorClass="bg-teal-500"
                      />
                    </div>
                  </div>
                )}

                {metadataStatus !== "loading" && activeTab === "movie" && (
                  <div className="grid grid-cols-1 gap-8 animate-fade-in">
                    <DualRangeSlider
                      label="개봉 연도 범위"
                      min={filterMeta.movie.minYear}
                      max={filterMeta.movie.maxYear}
                      minValue={filters.movieStartYear}
                      maxValue={filters.movieEndYear}
                      onChangeMin={(val) =>
                        handleFilterChange("movieStartYear", val)
                      }
                      onChangeMax={(val) =>
                        handleFilterChange("movieEndYear", val)
                      }
                      activeBgColor="bg-rose-500"
                      formatValue={(v) => `${v}년`}
                    />
                  </div>
                )}

                {metadataStatus !== "loading" && activeTab === "music" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                    <div className="md:col-span-2">
                      <DualRangeSlider
                        label="곡 길이 범위"
                        min={filterMeta.music.minDuration}
                        max={filterMeta.music.maxDuration}
                        minValue={filters.musicMinDuration}
                        maxValue={filters.musicMaxDuration}
                        onChangeMin={(val) =>
                          handleFilterChange("musicMinDuration", val)
                        }
                        onChangeMax={(val) =>
                          handleFilterChange("musicMaxDuration", val)
                        }
                        activeBgColor="bg-sky-500"
                        formatValue={(v) => {
                          const m = Math.floor(v / 60);
                          const s = v % 60;
                          return `${m}분 ${s}초`;
                        }}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-2">
                        곡 분위기 (Mode)
                      </label>
                      <SingleChips
                        options={[
                          { label: "상관없음", value: "" },
                          { label: "Major (밝은 분위기)", value: "1" },
                          { label: "Minor (어두운 분위기)", value: "0" },
                        ]}
                        selected={filters.mood}
                        onChange={(val) => handleFilterChange("mood", val)}
                        activeColor="text-sky-700"
                        activeBg="bg-sky-100"
                      />
                    </div>
                    <div className="flex items-center mt-6">
                      <Toggle
                        label="성인용(Explicit) 가사 제외하기"
                        checked={filters.explicit}
                        onChange={(e) =>
                          handleFilterChange("explicit", e.target.checked)
                        }
                        colorClass="bg-sky-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!searchTerm.trim() || loading}
              className={`w-full py-5 bg-gradient-to-r ${
                subTab === "trend"
                  ? "from-amber-500 via-orange-500 to-amber-600 shadow-amber-500/30"
                  : "from-teal-500 via-emerald-500 to-teal-600 shadow-emerald-500/30"
              } text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
            >
              {loading ? (
                <>
                  <Loader2 size={28} className="animate-spin" />{" "}
                  <span>AI가 작품을 엄선 중입니다...</span>
                </>
              ) : (
                <>
                  <Sparkles size={28} />{" "}
                  <span>
                    {subTab === "trend" ? "트렌드" : "맞춤형"} 추천 결과
                    가져오기
                  </span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* 중앙 에러 모달창 */}
      {error && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5">
              <AlertCircle size={36} />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-3">알림</h3>
            <p className="text-gray-600 font-medium mb-8 leading-relaxed whitespace-pre-line">
              {error}
            </p>
            <button
              onClick={() => setError(null)}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white text-lg font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

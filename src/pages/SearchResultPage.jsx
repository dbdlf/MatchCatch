import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { matchApi } from '../api';

function SearchResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const myLostItemId = location.state?.lostItemId;
  const initialResults = location.state?.results || []; 

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const dummyData = [
        {
          id: "dummy_search_1",
          mode: "found",
          content: "연두색 장우산입니다. 손잡이 부분은 갈색입니다",
          keywords: "연두색, 우산, 장우산, 갈색",
          img: "/images/green.jpeg",
          imageUrl: "/images/usagi1.png", 
          similarity_score: 80.5,
          status: "REGISTERED",
          location: "공학5호관",
          time: "2026-06-05 10:00",
          author: { id: "익명", temperature: 36.5 }
        },
        {
          id: "dummy_search_2",
          mode: "found",
          content: "흰색 단우산입니다. 남색 줄무늬가 있어요",
          keywords: "흰색, 우산, 단우산, 남색, 줄무늬",
          img: "/images/white.jpeg",
          imageUrl: "/images/usagi2.png",
          similarity_score: 35.0,
          status: "REGISTERED",
          location: "도서관 1층",
          time: "2026-06-04 15:30",
          author: { id: "익명", temperature: 36.5 }
        },
        {
          id: "dummy_search_3",
          mode: "found",
          content: "회색 장우산입니다. 손잡이 부분은 검은색입니다.",
          keywords: "회색, 우산, 장우산, 검은색",
          img: "/images/grey.jpeg",
          imageUrl: "/images/grey.jpeg",
          similarity_score: 73.2,
          status: "REGISTERED",
          location: "학생회관 앞",
          time: "2026-06-05 09:10",
          author: { id: "익명", temperature: 36.5 }
        },
        {
          id: "dummy_search_4",
          mode: "found",
          content: "노란색 장우산입니다. 손잡이 부분은 갈색입니다.",
          keywords: "노란색, 우산, 장우산, 갈색",
          img: "/images/yellow.jpeg",
          imageUrl: "/images/yellow.jpeg",
          similarity_score: 95.5,
          status: "REGISTERED",
          location: "정문 버스정류장",
          time: "2026-06-05 08:45",
          author: { id: "익명", temperature: 36.5 }
        }
      ];

      // 시연용: 검색 결과는 항상 우산 더미 4종만 고정으로 보여준다.
      // (실제 등록된 습득물과 섞이지 않도록 mockItems에는 저장하지 않음)
      const sortedResults = [...dummyData].sort((a, b) => (b.similarity_score || 0) - (a.similarity_score || 0));
      setResults(sortedResults);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [initialResults]);

  const getScoreOpacity = (score) => {
    if (score >= 80) return 1;
    if (score >= 50) return 0.5;
    return 0.25;
  };

  const handleMatchRequest = async (foundItemId) => {
    if (!myLostItemId) {
      alert('내 분실물 정보가 확인되지 않습니다. 검색을 다시 진행해주세요.');
      return;
    }
    if (window.confirm('습득자에게 매칭 요청을 보내시겠습니까?')) {
      try {
        await matchApi.createMatch(myLostItemId, foundItemId);
        alert('매칭 요청이 성공적으로 전송되었습니다!');
      } catch (error) {
        alert('매칭 요청 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <Layout>
      <div className="px-6 pt-8 pb-5 bg-white">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 bg-gradient-to-b from-primary to-primary-light rounded-full" />
          <h1 className="text-xl font-black text-gray-900">검색 결과</h1>
        </div>
        {!isLoading && results.length > 0 && (
          <p className="text-xs text-gray-400 font-medium pl-3">
            유사 습득물 <span className="text-primary font-bold">{results.length}건</span> 발견
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 bg-white">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-6 pb-16">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center">
                <svg className="animate-spin w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                </svg>
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-gray-700">AI가 분석 중이에요</p>
              <p className="text-xs text-gray-400 font-medium">유사한 습득물을 찾고 있습니다...</p>
            </div>
            {[1,2,3].map(i => (
              <div key={i} className="w-full h-28 bg-gray-100 rounded-2xl animate-pulse" style={{ opacity: 1 - i * 0.2 }} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-3 pt-1">
            {results.map((item, index) => {
              const score = item.similarity_score || 0;
              const opacity = getScoreOpacity(score);
              return (
                <div 
                  key={item.id} 
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm active:scale-[0.99] transition-transform"
                >
                  <div className="flex p-4 gap-3.5">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                      <img src={item.img} alt="습득물" className="w-full h-full object-cover" />
                      {index === 0 && (
                        <div className="absolute top-1 left-1 bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                          TOP
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${score}%`, opacity }}
                            />
                          </div>
                          <span
                            className="text-[10px] font-black px-2 py-0.5 rounded-full bg-primary text-white"
                            style={{ opacity }}
                          >
                            {score.toFixed(0)}%
                          </span>
                        </div>

                        <p className="text-sm font-bold text-gray-800 leading-snug line-clamp-2">
                          {(!item.title || item.title === '습득물 (제목 없음)') && item.content 
                            ? item.content 
                            : item.title}
                        </p>

                        {(item.location || item.time) && (
                          <div className="flex items-center gap-2.5 mt-1 text-[10px] text-gray-400 font-medium">
                            {item.location && (
                              <span className="flex items-center gap-0.5">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                                </svg>
                                {item.location}
                              </span>
                            )}
                            {item.time && (
                              <span className="flex items-center gap-0.5">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
                                </svg>
                                {item.time}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {(item.keywords || '').split(',').slice(0, 3).map((kw, i) => (
                            <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                              {kw.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={() => handleMatchRequest(item.id)}
                        className="self-end mt-2 bg-primary text-white px-4 py-1.5 rounded-xl text-[11px] font-bold hover:brightness-95 transition-colors active:scale-95 shadow-sm"
                      >
                        매칭 요청 보내기
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-6 pb-16 space-y-5">
            <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-black text-gray-800">일치하는 습득물이 없어요</p>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                분실하신 물건과 유사한 습득물이<br/>아직 등록되지 않았습니다
              </p>
            </div>
            <button 
              onClick={() => navigate('/upload', { state: { mode: 'lost' } })}
              className="mt-2 px-6 py-3 bg-primary/8 text-primary rounded-2xl font-bold text-sm hover:bg-primary/15 transition-colors"
            >
              다른 키워드로 재검색
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default SearchResultPage;

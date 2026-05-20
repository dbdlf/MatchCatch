import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

function SearchResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // UploadPage에서 넘겨준 실제 검색 결과와 내 분실물 ID 받기
  const myLostItemId = location.state?.lostItemId;
  const initialResults = location.state?.results || []; 

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // AI 로딩 효과 (UX를 위해 1.5초 지연)
    const timer = setTimeout(() => {
      
      // 핵심 1: 유사도 점수(similarity_score)가 높은 순으로 내림차순 정렬
      const sortedResults = [...initialResults].sort((a, b) => {
        const scoreA = a.similarity_score || 0;
        const scoreB = b.similarity_score || 0;
        return scoreB - scoreA; // 내림차순 정렬
      });

      setResults(sortedResults);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [initialResults]);

  return (
    <Layout>
      {/* 상단 헤더 */}
      <div className="flex items-center px-6 py-6 border-b border-gray-100 bg-white">
        <h1 className="text-xl font-bold relative">
          검색결과
          <span className="absolute bottom-0 left-0 w-full h-1 bg-[#FFD18F] -mb-1 opacity-50"></span>
        </h1>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-24 bg-white">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#FFD18F] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">AI가 유사한 물품을 분석 중입니다...</p>
          </div>
        ) : results.length > 0 ? (
          /* Case 1: 검색 결과가 있는 경우 */
          <div className="space-y-4">
            {results.map((item) => (
              <div key={item.id} className="relative flex p-4 border border-gray-200 rounded-xl items-center bg-white shadow-sm transition-transform active:scale-[0.98] overflow-hidden">
                
                {/* 핵심 2: 유사도 점수 시각화 뱃지 (우측 상단 고정) */}
                <div className="absolute top-0 right-0 bg-[#FFD18F] px-3 py-1.5 rounded-bl-xl font-bold text-xs text-gray-900 shadow-sm z-10">
                  일치율 {item.similarity_score ? item.similarity_score.toFixed(1) : '0.0'}%
                </div>

                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.img} alt="습득물 사진" className="w-full h-full object-cover" />
                </div>
                
                <div className="ml-4 flex-1 flex flex-col justify-between h-24">
                  <div className="pr-16">
                    <h4 className="font-bold text-base text-gray-900 truncate">
                      {(!item.title || item.title === '습득물 (제목 없음)') && item.content 
                        ? `${item.content.substring(0, 15)}...` 
                        : item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      <span className="font-semibold">키워드:</span> {item.keywords}
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/postdetail', { 
                      state: { 
                        postId: item.id,   
                        isAuthor: false,   
                        myLostItemId: myLostItemId // 이전 스텝에서 반영한 내 분실물 ID 릴레이
                      } 
                    })}
                    className="self-end bg-gray-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-gray-800 transition-colors"
                  >
                    상세보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Case 2: 검색 결과가 없는 경우 */
          <div className="h-full flex flex-col items-center justify-center text-center px-6 space-y-6">
            <div className="space-y-4">
              <p className="text-2xl font-bold text-gray-800 leading-snug">
                앗! 일치하는 물건을<br/>찾지 못했어요 ㅠㅠ
              </p>
              <p className="text-gray-400 text-sm leading-relaxed break-keep">
                분실하신 물건과 유사한 습득물이 아직 등록되지 않았습니다.<br/>
                새로운 습득물이 등록되면 다시 확인해 주세요!
              </p>
            </div>
            <button 
              onClick={() => navigate('/upload', { state: { mode: 'lost' } })}
              className="mt-4 px-6 py-3 bg-gray-100 text-gray-600 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              다른 키워드로 다시 검색하기
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default SearchResultPage;
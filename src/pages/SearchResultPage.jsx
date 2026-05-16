import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

function SearchResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 테스트용
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // AI 유사도 계산 및 데이터 로딩 시뮬레이션
    setTimeout(() => {
      // 검색 결과가 있는 경우의 더미 데이터
      const dummyResults = [
        { id: 1, title: "삼색 고양이 인형", keywords: "인형, 삼색, 고양이, 꼬리 짧음", img: "https://via.placeholder.com/100" },
        { id: 2, title: "흰색 곰 인형", keywords: "인형, 흰색, 곰, 리본", img: "https://via.placeholder.com/100" },
        { id: 3, title: "갈색 강아지 인형", keywords: "인형, 갈색, 강아지, 골든리트리버", img: "https://via.placeholder.com/100" },
      ];
      
      // 테스트용, 결과 없음 테스트 시 [] 로 변경
      setResults(dummyResults);
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <Layout>

    
        
        {/* 상단 헤더 */}
        <div className="flex items-center px-6 py-6 border-b border-gray-100">
          <h1 className="text-xl font-bold ml-4 relative">
            검색결과
            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-400 -mb-1 opacity-50"></span>
          </h1>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto px-6 py-8 pb-24">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-[#FFD18F] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">AI가 유사한 물품을 분석 중입니다...</p>
            </div>
          ) : results.length > 0 ? (
            /* Case 1: 검색 결과가 있는 경우 */
            <div className="space-y-4">
              {results.map((item) => (
                <div key={item.id} className="flex p-4 border-2 border-black rounded-xl items-center bg-white shadow-sm transition-transform active:scale-[0.98]">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.img} alt="습득물 사진" className="w-full h-full object-cover" />
                  </div>
                  <div className="ml-4 flex-1 flex flex-col justify-between h-24">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 truncate">{item.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        <span className="font-semibold">키워드:</span> {item.keywords}
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate('/postdetail', { 
                        state: { 
                          postId: item.id,   // 클릭한 물품의 ID 전달
                          isAuthor: false    // 상대방 게시글이므로 false 전달
                        } 
                      })}
                      className="self-end bg-[#FFD18F] text-black px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-[#ffc67a]"
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
                className="mt-4 px-6 py-3 bg-gray-100 text-gray-600 rounded-full font-bold text-sm hover:bg-gray-200"
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
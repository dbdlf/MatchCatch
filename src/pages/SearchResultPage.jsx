import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

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
          author: { id: "익명", temperature: 36.5 }
        }
      ];

      // 상세페이지 에러 방지 더미 데이터
      let mockItems = JSON.parse(localStorage.getItem('mockItems')) || [];
      const hasSearchDummy = mockItems.some(item => item.id === 'dummy_search_1');
      if (!hasSearchDummy) {
        mockItems = [...mockItems, ...dummyData];
        localStorage.setItem('mockItems', JSON.stringify(mockItems));
      }

      // initialResults에 결과가 없으면 이 더미를 띄움. 추후 수정
      const baseResults = initialResults.length > 0 ? initialResults : dummyData;
      
      const sortedResults = [...baseResults].sort((a, b) => {
        const scoreA = a.similarity_score || 0;
        const scoreB = b.similarity_score || 0;
        return scoreB - scoreA; 
      });

      setResults(sortedResults);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [initialResults]);

  return (
    <Layout>
      <div className="flex items-center px-6 py-6 border-b border-gray-100 bg-white">
        <h1 className="text-xl font-bold relative">
          검색결과
          <span className="absolute bottom-0 left-0 w-full h-1 bg-[#FFD18F] -mb-1 opacity-50"></span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 pb-24 bg-white">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#FFD18F] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">AI가 유사한 물품을 분석 중입니다...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((item) => (
              <div key={item.id} className="relative flex p-4 border border-gray-200 rounded-xl items-start bg-white shadow-sm transition-transform active:scale-[0.98] overflow-hidden">
                
                <div className="absolute top-0 right-0 bg-[#FFD18F] px-3 py-1 rounded-bl-xl font-bold text-[10px] text-gray-900 shadow-sm z-10">
                  일치율 {item.similarity_score ? item.similarity_score.toFixed(1) : '0.0'}%
                </div>

                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 mt-2">
                  <img src={item.img} alt="습득물 사진" className="w-full h-full object-cover" />
                </div>
                
                <div className="ml-4 flex-1 flex flex-col justify-between min-w-0 min-h-[6.5rem]">
                  <div className="pt-5">
                    <h4 className="font-bold text-sm text-gray-900 break-keep line-clamp-2 leading-snug">
                      {(!item.title || item.title === '습득물 (제목 없음)') && item.content 
                        ? item.content 
                        : item.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-1.5 line-clamp-2 leading-tight">
                      <span className="font-semibold">키워드:</span> {item.keywords}
                    </p>
                  </div>

                  <button 
                    onClick={() => navigate('/postdetail', { 
                      state: { 
                        postId: item.id,   
                        isAuthor: false,   
                        myLostItemId: myLostItemId 
                      } 
                    })}
                    className="self-end mt-3 bg-gray-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-gray-800 transition-colors"
                  >
                    상세보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 결과 없음 화면 */
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
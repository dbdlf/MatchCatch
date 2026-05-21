import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { matchApi } from '../api';

function MatchManagementPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  
  // 💡 실시간 데이터를 담을 상태(State) 추가
  const [matches, setMatches] = useState({ received: [], sent: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        // 1. 가상 API에서 모든 매칭 내역 불러오기
        const allMatches = await matchApi.getMatches();
        // 2. 가상 DB에서 물품 정보 불러오기 (이미지나 제목 매핑용)
        const mockItems = JSON.parse(localStorage.getItem('mockItems')) || [];

        // 3. 매칭 데이터에 물품 정보 결합하기
        const enrichedMatches = allMatches.map(match => {
          const lostItem = mockItems.find(item => item.id === match.lost_item_id) || {};
          const foundItem = mockItems.find(item => item.id === match.found_item_id) || {};

          // 습득물은 제목이 없을 수 있으므로 내용을 잘라서 제목처럼 사용
          const foundTitle = foundItem.title && foundItem.title !== "습득물 (제목 없음)" 
            ? foundItem.title 
            : foundItem.content?.substring(0, 12) + "...";

          return {
            ...match,
            lostItemTitle: lostItem.title || "분실물 정보 없음",
            foundItemTitle: foundTitle || "습득물 정보 없음",
            img: foundItem.imageUrl || lostItem.imageUrl || "/images/default.png",
            // 테스트용: 1번 매칭은 분실자가 User1234, 나머지는 내가 보낸 것이므로 습득자 이름 표시
            opponentName: match.match_id === 1 ? "User1234" : (foundItem.author?.id || "익명")
          };
        });

        // 💡 4. 탭 분리 로직 (테스트 환경 고정 설정)
        // - 더미 데이터 1번(match_id: 1)은 남이 나에게 보낸 '받은 요청'으로 분류
        // - 방금 새로 추가한 요청들을 포함한 나머지는 '보낸 요청'으로 분류
        setMatches({
          received: enrichedMatches.filter(m => m.match_id === 1),
          sent: enrichedMatches.filter(m => m.match_id !== 1)
        });

      } catch (error) {
        console.error("매칭 내역을 불러오는데 실패했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []); // 페이지가 열릴 때 한 번 실행

  // 상태값에 따른 뱃지 색상 및 텍스트 렌더링 헬퍼 함수
  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING': return <span className="text-[11px] px-3 py-1.5 bg-amber-50 text-amber-600 font-bold rounded-full border border-amber-100">수락 대기 중</span>;
      case 'ACCEPTED': return <span className="text-[11px] px-3 py-1.5 bg-green-50 text-green-600 font-bold rounded-full border border-green-100">매칭 수락됨</span>;
      case 'REJECTED': return <span className="text-[11px] px-3 py-1.5 bg-red-50 text-red-500 font-bold rounded-full border border-red-100">거절됨</span>;
      case 'DELIVERED': return <span className="text-[11px] px-3 py-1.5 bg-gray-100 text-gray-500 font-bold rounded-full border border-gray-200">인도 완료</span>;
      default: return null;
    }
  };

  return (
    <Layout hideNav>
        <div className="flex items-center px-4 py-6 border-b border-gray-100 bg-white">
          <button onClick={() => navigate(-1)} className="p-1 mr-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">매칭 요청 관리</h1>
        </div>

        <div className="flex border-b border-gray-100 bg-white">
          <button 
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-4 font-bold text-sm transition-colors ${activeTab === 'received' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400'}`}
          >
            받은 요청 (수신함)
          </button>
          <button 
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-4 font-bold text-sm transition-colors ${activeTab === 'sent' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400'}`}
          >
            보낸 요청 (발신함)
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white pb-24">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <span className="text-sm text-gray-400 font-medium">내역을 불러오는 중...</span>
            </div>
          ) : activeTab === 'received' ? (
            
            /* 탭 A: 받은 요청 목록 렌더링 */
            <div className="space-y-4">
              {matches.received.length > 0 ? matches.received.map(match => (
                <div key={match.match_id} className="p-4 border border-gray-200 rounded-2xl space-y-4 shadow-sm bg-white">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 overflow-hidden">
                      <img src={match.img} alt="물품" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{match.lostItemTitle}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 font-medium">분실자: {match.opponentName}</p>
                    </div>
                  </div>
                  {match.status === 'PENDING' ? (
                    <div className="flex space-x-2 pt-1">
                      <button className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors" onClick={() => alert("거절되었습니다.")}>거절</button>
                      <button className="flex-1 py-2.5 bg-[#FFD18F] text-black rounded-xl text-xs font-bold hover:brightness-95 transition-colors shadow-sm" onClick={() => alert("수락되었습니다! 채팅방이 생성됩니다.")}>수락</button>
                    </div>
                  ) : (
                    <div className="flex justify-end pt-1">
                      {getStatusBadge(match.status)}
                    </div>
                  )}
                </div>
              )) : (
                <div className="text-center py-10 text-gray-400 text-sm font-medium">받은 매칭 요청이 없습니다.</div>
              )}
            </div>

          ) : (

            /* 탭 B: 보낸 요청 목록 렌더링 (방금 추가한 실시간 데이터 표시 영역) */
            <div className="space-y-4">
              {matches.sent.length > 0 ? matches.sent.map(match => (
                <div key={match.match_id} className="p-4 border border-gray-200 rounded-2xl flex items-center justify-between shadow-sm bg-white active:scale-[0.98] transition-transform cursor-pointer">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 overflow-hidden flex-shrink-0">
                      <img src={match.img} alt="물품" className="w-full h-full object-cover" />
                    </div>
                    <div className="mr-3">
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-1 break-all">{match.foundItemTitle}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 font-medium">습득자: {match.opponentName}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(match.status)}
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-gray-400 text-sm font-medium">보낸 매칭 요청이 없습니다.</div>
              )}
            </div>
            
          )}
        </div>
    </Layout>
  );
}

export default MatchManagementPage;
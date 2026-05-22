import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { matchApi } from '../api';

function MatchManagementPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sent'); // 편의상 보낸 요청 탭을 기본으로 설정
  
  const [isWalletDetailOpen, setIsWalletDetailOpen] = useState(false);
  const [dynamicSentMatches, setDynamicSentMatches] = useState([]);

  // 실시간 매칭 요청 데이터를 가져오는 로직
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const allMatches = await matchApi.getMatches();
        const mockItems = JSON.parse(localStorage.getItem('mockItems')) || [];

        const realMatches = allMatches.filter(m => m.match_id > 100);

        const enrichedMatches = realMatches.map(match => {
          const lostItem = mockItems.find(item => item.id === match.lost_item_id) || {};
          const foundItem = mockItems.find(item => item.id === match.found_item_id) || {};

          const foundTitle = foundItem.title && foundItem.title !== "습득물 (제목 없음)" 
            ? foundItem.title 
            : foundItem.content?.substring(0, 12) + "...";

          return {
            ...match,
            foundItemTitle: foundTitle || "습득물 정보 없음",
            img: foundItem.imageUrl || lostItem.imageUrl || "/images/default.png",
            opponentName: foundItem.author?.id || "익명"
          };
        });

        setDynamicSentMatches(enrichedMatches);
      } catch (error) {
        console.error("매칭 내역을 불러오는데 실패했습니다.", error);
      }
    };

    fetchMatches();
  }, []);

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
        {/* 상단 헤더 */}
        <div className="flex items-center px-4 py-6 border-b border-gray-100 bg-white">
          <button onClick={() => navigate(-1)} className="p-1 mr-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">매칭 요청 관리</h1>
        </div>

        {/* 탭 메뉴 */}
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

        {/* 요청 리스트 영역 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white pb-24">
          {activeTab === 'received' ? (
            /* 탭 A: 받은 요청 */
            <div className="space-y-4">
              <div 
                className="p-4 border border-gray-200 rounded-2xl space-y-4 shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsWalletDetailOpen(!isWalletDetailOpen)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3"></div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">검정색 지갑을 찾습니다</h4>
                      
                      {/* 💡 수정 1: 분실자 텍스트 클릭 시 User1234 프로필로 이동 (isOwnProfile: false 설정) */}
                      <p 
                        className="text-[10px] text-gray-400 mt-0.5 inline-block hover:text-gray-700 hover:underline cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // 아코디언 방지
                          navigate('/profile', { state: { userId: 'User1234', isOwnProfile: false } });
                        }}
                      >
                        분실자: <span className="font-semibold text-gray-600">User1234</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {isWalletDetailOpen ? '▲' : '▼'}
                  </div>
                </div>

                {isWalletDetailOpen && (
                  <div className="p-3 bg-gray-100 rounded-xl mt-2">
                    <p className="text-xs font-bold text-gray-500 mb-1">상세 내용</p>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      어제 오후 3시쯤 정문 앞 벤치에 두고 온 것 같습니다. 
                      안에 학생증이랑 체크카드가 들어있어요. 검은색 가죽 소재의 반지갑입니다. 
                      소중한 물건이니 꼭 좀 연락 부탁드립니다 ㅠㅠ
                    </p>
                  </div>
                )}

                <div className="flex space-x-2 pt-1">
                  <button 
                    className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors" 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      alert("거절되었습니다.");
                    }}
                  >
                    거절
                  </button>
                  <button 
                    className="flex-1 py-2.5 bg-[#FFD18F] text-black rounded-xl text-xs font-bold hover:brightness-95 transition-colors shadow-sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("수락되었습니다! 채팅방이 생성됩니다.");
                    }}
                  >
                    수락
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* 탭 B: 보낸 요청 */
            <div className="space-y-4">
              {/* 고정 예시: 에어팟 프로 */}
              <div className="p-4 border border-gray-200 rounded-2xl flex items-center justify-between shadow-sm bg-white">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3"></div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">에어팟 프로 습득물</h4>
                    
                    {/* 💡 수정 2: 고정 에어팟 예시의 습득자 프로필 연동 */}
                    <p 
                      className="text-[10px] text-gray-400 mt-0.5 inline-block hover:text-gray-700 hover:underline cursor-pointer"
                      onClick={() => navigate('/profile', { state: { userId: 'Finder01', isOwnProfile: false } })}
                    >
                      습득자: <span className="font-semibold text-gray-600">Finder01</span>
                    </p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 bg-amber-50 text-amber-600 font-bold rounded-full">수락 대기 중</span>
              </div>

              {/* 실시간 추가 데이터 목록 */}
              {dynamicSentMatches.map(match => (
                <div key={match.match_id} className="p-4 border border-gray-200 rounded-2xl flex items-center justify-between shadow-sm bg-white mt-4 cursor-pointer active:scale-[0.98] transition-transform">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 overflow-hidden flex-shrink-0">
                      <img src={match.img} alt="물품" className="w-full h-full object-cover" />
                    </div>
                    <div className="mr-3">
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-1 break-all">{match.foundItemTitle}</h4>
                      
                      {/* 💡 수정 3: 실시간으로 추가되는 상대방(익명 등)의 프로필 연동 */}
                      <p 
                        className="text-[11px] text-gray-500 mt-0.5 font-medium inline-block hover:text-gray-800 hover:underline cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // 카드 자체 클릭 이벤트 차단
                          navigate('/profile', { state: { userId: match.opponentName, isOwnProfile: false } });
                        }}
                      >
                        습득자: {match.opponentName}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(match.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </Layout>
  );
}

export default MatchManagementPage;
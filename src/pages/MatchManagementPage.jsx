import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function MatchManagementPage() {
  const navigate = useNavigate();
  // 💡 탭의 기본값을 필요에 따라 'received'나 'sent'로 변경해서 테스트하세요.
  const [activeTab, setActiveTab] = useState('sent'); 
  
  const [isWalletDetailOpen, setIsWalletDetailOpen] = useState(false);

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
            /* 탭 A: 받은 요청 (하드코딩 고정) */
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
                      
                      <p 
                        className="text-[10px] text-gray-400 mt-0.5 inline-block hover:text-gray-700 hover:underline cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); 
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
            /* 탭 B: 보낸 요청 (하드코딩 고정) */
            <div className="space-y-4">
              {/* 고정 예시: 에어팟 프로 */}
              <div className="p-4 border border-gray-200 rounded-2xl flex items-center justify-between shadow-sm bg-white">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3"></div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">에어팟 프로 습득물</h4>
                    
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
            </div>
          )}
        </div>
    </Layout>
  );
}

export default MatchManagementPage;
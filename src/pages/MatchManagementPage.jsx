import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { matchApi } from '../api';

function MatchManagementPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'

  return (
    <Layout hideNav>
        {/* 상단 헤더 */}
        <div className="flex items-center px-4 py-6 border-b border-gray-100">
          <button onClick={() => navigate(-1)} className="p-1 mr-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <h1 className="text-xl font-bold">매칭 요청 관리</h1>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-4 font-bold text-sm ${activeTab === 'received' ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}
          >
            받은 요청 (수신함)
          </button>
          <button 
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-4 font-bold text-sm ${activeTab === 'sent' ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}
          >
            보낸 요청 (발신함)
          </button>
        </div>

        {/* 요청 리스트 영역 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'received' ? (
            /* 탭 A: 습득자 시점 - 수락/거절 */
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3"></div>
                  <div>
                    <h4 className="font-bold text-sm">검정색 지갑을 찾습니다</h4>
                    <p className="text-[10px] text-gray-400">분실자: User1234</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold" onClick={() => alert("거절되었습니다.")}>거절</button>
                  <button className="flex-1 py-2 bg-[#FFD18F] text-black rounded-lg text-xs font-bold" onClick={() => alert("수락되었습니다! 채팅방이 생성됩니다.")}>수락</button>
                </div>
              </div>
            </div>
          ) : (
            /* 탭 B: 분실자 시점 - 상태 확인 */
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3"></div>
                  <div>
                    <h4 className="font-bold text-sm">에어팟 프로 습득물</h4>
                    <p className="text-[10px] text-gray-400">습득자: Finder01</p>
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
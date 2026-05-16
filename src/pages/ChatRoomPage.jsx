import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ChatRoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  
  // 인도 완료 처리를 위한 로컬 상태
  const [isDeliveredConfirmed, setIsDeliveredConfirmed] = useState(false);

  const handleStatusChange = () => {
    // 명세서에 따라 두 사용자 모두 완료 시 상태가 변경됨을 안내
    const confirm = window.confirm("물건을 성공적으로 전달받으셨나요? 상대방도 수락해야 '인도 완료' 처리됩니다.");
    if (confirm) {
      setIsDeliveredConfirmed(true);
      alert("인도 완료 확인이 전송되었습니다. 상대방의 승인을 기다립니다.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
      <div className="w-[412px] h-[917px] bg-white rounded-2xl shadow-xl flex flex-col relative overflow-hidden font-['Inter']">
        
        {/* 상단 네비게이션 */}
        <div className="flex items-center px-4 py-4 border-b border-gray-100">
          <button onClick={() => navigate(-1)} className="p-1 mr-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <span className="font-bold text-lg">Finder</span>
        </div>

        {/* 매칭 물품 정보 카드 (상단 고정) */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="bg-white p-3 border-2 border-black rounded-xl flex items-center shadow-sm">
            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-3">
              <img src="https://via.placeholder.com/64" alt="물품" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-gray-800">삼색 고양이 인형</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">매칭된 게시글</p>
            </div>
            <button 
              onClick={handleStatusChange}
              className={`px-3 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors ${isDeliveredConfirmed ? 'bg-gray-200 text-gray-500' : 'bg-[#FFD18F] text-black hover:bg-[#ffc67a]'}`}
            >
              상태변경
            </button>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          <div className="flex justify-center"><span className="text-[10px] bg-gray-100 px-3 py-1 rounded-full text-gray-400">2026년 5월 15일</span></div>
          <div className="flex flex-col items-start"><div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-tl-none max-w-[80%] text-sm">안녕하세요! 인형 습득자입니다.</div></div>
          <div className="flex flex-col items-end"><div className="bg-[#FFD18F] px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%] text-sm">안녕하세요! 제 인형이 맞는 것 같아요 ㅠㅠ</div></div>
        </div>

        {/* 메시지 입력창 */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <input type="text" placeholder="메시지를 입력하세요" className="flex-1 bg-transparent outline-none text-sm" />
            <button className="ml-2 text-[#FFD18F] font-bold text-sm">전송</button>
          </div>
        </div>

        <div className="flex flex-col items-center my-6 space-y-3">
            <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 text-center shadow-sm">
                <p className="text-sm text-gray-600 mb-3">거래가 완료되었습니다!</p>
                <button 
                    onClick={() => navigate('/review/123')} // 해당 매칭 ID로 이동
                    className="bg-[#FFD18F] text-black px-6 py-2 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-transform"
                >
                    후기 작성하러 가기
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default ChatRoomPage;
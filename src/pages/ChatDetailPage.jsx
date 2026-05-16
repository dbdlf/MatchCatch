import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

function ChatDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 이전 화면에서 넘겨받은 채팅방 정보 (없으면 기본 더미값)
  const chatRoomInfo = location.state?.roomInfo || {
    id: "chat_01",
    partnerId: "차차",
    itemTitle: "삼색 고양이 인형",
    initialStatus: "REGISTERED" // REGISTERED(진행중) -> DELIVERED(인도완료)
  };

  // 2. 물품 상태 관리
  const [itemStatus, setItemStatus] = useState(chatRoomInfo.initialStatus);

  // 3. 채팅 메시지 내역 상태 관리 (초기 더미 메시지 포함)
  const [messages, setMessages] = useState([
    { id: 1, sender: "차차", text: "안녕하세요! 고양이 인형 습득하신 분 맞으신가요?", type: "TALK" },
    { id: 2, sender: "me", text: "네 맞습니다! 정문 앞 커피숍인데 언제쯤 오시나요?", type: "TALK" },
    { id: 3, sender: "차차", text: "지금 거의 다 도착했습니다. 흰색 셔츠 입고 있어요!", type: "TALK" }
  ]);

  const [inputText, setInputText] = useState("");

  // 4. 메시지 전송 함수
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: inputText,
      type: "TALK"
    };

    setMessages([...messages, newMessage]);
    setInputText("");
  };

  // 5. [인도 완료] 상태 변경 시 시스템 안내 메시지 발송 함수
  const handleCompleteDelivery = () => {
    if (window.confirm("물품을 상대방에게 전달하셨습니까?\n확인을 누르면 상태가 변경되고 후기 요청 메시지가 발송됩니다.")) {
      setItemStatus("DELIVERED"); // 1. 물품 상태를 인도 완료로 변경

      // 2. 채팅 내역에 후기 작성 버튼이 포함될 'SYSTEM' 타입 메시지 강제 추가
      const systemNotice = {
        id: `system_${Date.now()}`,
        sender: "SYSTEM",
        text: "물품 인도가 완료되었습니다! 따뜻한 거래를 위해 서로에게 후기를 남겨주세요.",
        type: "SYSTEM" // 일반 채팅과 구별되는 시스템 타입
      };

      setMessages(prev => [...prev, systemNotice]);
      alert("물품 상태가 인도 완료로 변경되었습니다.");
    }
  };

  // 6. 후기 작성하기 버튼 클릭 시 처리
  const handleGoReview = () => {
    navigate('/review', { state: { partnerId: chatRoomInfo.partnerId } });
  };

  return (
    <Layout>
      {/* 상단 헤더: 상대방 이름 및 [인도 완료] 버튼 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <button onClick={() => navigate(-1)} className="p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        
        <div className="text-center">
          <h1 className="text-base font-bold text-gray-900">{chatRoomInfo.partnerId}</h1>
          <p className="text-[11px] text-gray-400 font-medium">{chatRoomInfo.itemTitle}</p>
        </div>

        {/* 물품 상태에 따른 버튼 분기 처리 */}
        {itemStatus === "REGISTERED" ? (
          <button 
            onClick={handleCompleteDelivery}
            className="bg-[#FFD18F] text-black px-3 py-1 rounded-lg text-xs font-bold shadow-sm hover:brightness-95 transition-all"
          >
            인도 완료
          </button>
        ) : (
          <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-lg text-xs font-bold">
            인도 완료됨
          </span>
        )}
      </div>

      {/* 채팅 메시지 영역 (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gray-50 pb-24">
        {messages.map((msg) => {
          // Case A: 후기 작성을 유도하는 시스템 안내 메시지 디자인
          if (msg.type === "SYSTEM") {
            return (
              <div key={msg.id} className="flex flex-col items-center justify-center my-6 px-4">
                <div className="bg-white border border-amber-100 rounded-2xl p-4 shadow-sm max-w-[90%] text-center space-y-3">
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {msg.text}
                  </p>
                  <button 
                    onClick={handleGoReview}
                    className="w-full bg-[#FFD18F] text-black text-xs font-bold py-2 rounded-lg hover:brightness-95 active:scale-[0.98] transition-all"
                  >
                    후기 작성하기
                  </button>
                </div>
              </div>
            );
          }

          // Case B: 일반 대화 메시지 디자인 (내 메시지 vs 상대방 메시지)
          const isMe = msg.sender === "me";
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm ${
                isMe 
                  ? 'bg-[#FFD18F] text-black rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 메시지 입력창 */}
      <form 
        onSubmit={handleSendMessage}
        className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex space-x-2 items-center"
      >
        <input 
          type="text" 
          placeholder="메시지를 입력하세요..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 p-3 bg-gray-100 rounded-xl outline-none text-sm font-medium"
        />
        <button 
          type="submit"
          className="bg-black text-white px-4 py-3 rounded-xl text-sm font-bold active:scale-95 transition-all"
        >
          전송
        </button>
      </form>
    </Layout>
  );
}

export default ChatDetailPage;
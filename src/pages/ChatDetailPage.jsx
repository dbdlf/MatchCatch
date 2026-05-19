import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

function ChatDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const chatRoomInfo = {
    id: location.state?.chatId || "chat_01",
    partnerId: location.state?.opponentName || "상대방",
    itemTitle: location.state?.postTitle || "물품 정보 없음",
    initialStatus: "MATCHING"
  };

  // 물품 상태 관리 (진행중 MATCHING -> 인도완료 DELIVERED)
  const [itemStatus, setItemStatus] = useState(chatRoomInfo.initialStatus);

  // 채팅 메시지 내역 상태 관리
  const [messages, setMessages] = useState([
    { id: 1, sender: chatRoomInfo.partnerId, text: `안녕하세요! ${chatRoomInfo.itemTitle} 습득하신 분 맞으신가요?`, type: "TALK" },
    { id: 2, sender: "me", text: "네 맞습니다! 정문 앞 커피숍인데 언제쯤 오시나요?", type: "TALK" },
    { id: 3, sender: chatRoomInfo.partnerId, text: "지금 거의 다 도착했습니다. 흰색 셔츠 입고 있어요!", type: "TALK" }
  ]);

  const [inputText, setInputText] = useState("");

  // 메시지 전송 함수
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

  // [인도 완료] 상태 변경 및 시스템 메시지 발송
  const handleCompleteDelivery = () => {
    const confirm = window.confirm("물건을 성공적으로 전달받으셨나요? 상대방도 수락해야 '인도 완료' 처리됩니다.");
    if (confirm) {
      setItemStatus("DELIVERED");

      const systemNotice = {
        id: `system_${Date.now()}`,
        sender: "SYSTEM",
        text: "물품 인도가 완료되었습니다! 따뜻한 거래를 위해 서로에게 후기를 남겨주세요.",
        type: "SYSTEM"
      };

      setMessages(prev => [...prev, systemNotice]);
      alert("인도 완료 확인이 전송되었습니다.");
    }
  };

  return (
    <Layout hideNav>
      {/* A. 상단 헤더 네비게이션 */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100 bg-white">
        <button onClick={() => navigate(-1)} className="p-1 mr-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="font-bold text-lg">{chatRoomInfo.partnerId}</span>
      </div>

      {/* B. 매칭 물품 정보 카드 (상단 고정) */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="bg-white p-3 border border-gray-200 rounded-xl flex items-center shadow-sm">
          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden mr-3 flex items-center justify-center text-xs text-gray-400 font-bold">
            사진
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-gray-800">{chatRoomInfo.itemTitle}</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">매칭된 게시글</p>
          </div>
          
          {/* 상태에 따른 버튼 변경 */}
          {itemStatus === "REGISTERED" ? (
            <button 
              onClick={handleCompleteDelivery}
              className="bg-[#FFD18F] text-black px-3 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-[#ffc67a] transition-colors"
            >
              상태변경
            </button>
          ) : (
            <span className="bg-gray-100 text-gray-400 px-3 py-2 rounded-lg text-xs font-bold">
              인도 완료
            </span>
          )}
        </div>
      </div>

      {/* C. 채팅 메시지 영역 (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-white pb-24">
        <div className="flex justify-center">
          <span className="text-[10px] bg-gray-100 px-3 py-1 rounded-full text-gray-400">2026년 5월 18일</span>
        </div>

        {messages.map((msg) => {
          // 시스템 대화 카드 (인도 완료 시 등장)
          if (msg.type === "SYSTEM") {
            return (
              <div key={msg.id} className="flex flex-col items-center justify-center my-4">
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center max-w-[90%] shadow-sm space-y-3">
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">{msg.text}</p>
                  <button 
                    onClick={() => navigate('/review', {
                      state: {
                        matchId: chatRoomInfo.id,
                        opponentName: chatRoomInfo.partnerId,
                        postTitle: chatRoomInfo.itemTitle
                      }
                    })}
                    className="w-full bg-[#FFD18F] text-black text-xs font-bold py-2 rounded-xl hover:brightness-95 active:scale-[0.98] transition-all"
                  >
                    후기 작성하러 가기
                  </button>
                </div>
              </div>
            );
          }

          // 일반 대화
          const isMe = msg.sender === "me";
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm ${
                isMe 
                  ? 'bg-[#FFD18F] text-black rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* D. 하단 메시지 입력창 (고정) */}
      <form 
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-100 bg-white absolute bottom-0 left-0 right-0"
      >
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input 
            type="text" 
            placeholder="메시지를 입력하세요..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm font-medium"
          />
          <button type="submit" className="ml-2 text-[#FFD18F] font-bold text-sm hover:brightness-90">
            전송
          </button>
        </div>
      </form>
    </Layout>
  );
}

export default ChatDetailPage;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { chatApi, matchApi } from '../api'; 

function ChatDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const chatRoomInfo = {
    chatRoomId: location.state?.chatRoomId || 1,        // 채팅 내역 조회용 ID
    matchId: location.state?.matchId || 1,              // 인도 완료 및 후기 작성용 ID
    partnerName: location.state?.opponentName || "상대방", // 화면에 보여줄 닉네임
    partnerId: location.state?.opponentId || "default_target_id", // 유저 ID
    itemTitle: location.state?.postTitle || "물품 정보 없음",
    itemImg: location.state?.postImg || "https://via.placeholder.com/50",
  };

  // 상태 관리
  const [itemStatus, setItemStatus] = useState("MATCHING");
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 1. 방에 들어올 때 채팅 내역 API 불러오기
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setIsLoading(true);
        const response = await chatApi.getMessages(chatRoomInfo.chatRoomId);
        
        const formattedMessages = response.messages.map(msg => ({
          id: msg.message_id,
          sender: msg.sender_id === 1 ? "me" : chatRoomInfo.partnerName, 
          text: msg.message,
          type: "TALK"
        }));
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error("메시지를 불러오지 못했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatData();
  }, [chatRoomInfo.chatRoomId, chatRoomInfo.partnerName]);

  // 2. 메시지 전송 API 연동
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const currentText = inputText;
    setInputText("");

    try {
      const response = await chatApi.sendMessage(chatRoomInfo.chatRoomId, currentText);
      
      const newMessage = {
        id: response.message_id,
        sender: "me",
        text: response.message,
        type: "TALK"
      };

      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      alert("메시지 전송에 실패했습니다.");
      setInputText(currentText); 
    }
  };

  // 3. 인도 완료 처리 API 연동
  const handleCompleteDelivery = async () => {
    const confirm = window.confirm("물건을 성공적으로 전달받으셨나요? 상대방도 수락해야 '인도 완료' 처리됩니다.");
    if (confirm) {
      try {
        await matchApi.deliverMatch(chatRoomInfo.matchId);
        
        setItemStatus("DELIVERED"); 

        const systemNotice = {
          id: `system_${Date.now()}`,
          sender: "SYSTEM",
          text: "물품 인도가 완료되었습니다! 따뜻한 거래를 위해 서로에게 후기를 남겨주세요.",
          type: "SYSTEM"
        };

        setMessages(prev => [...prev, systemNotice]);
        alert("인도 완료 처리가 완료되었습니다.");
      } catch (error) {
        alert("상태 변경 처리에 실패했습니다.");
      }
    }
  };

  return (
    <Layout hideNav>
      <div className="flex items-center px-4 py-4 border-b border-gray-100 bg-white">
        <button onClick={() => navigate(-1)} className="p-1 mr-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="font-bold text-lg">{chatRoomInfo.partnerName}</span>
      </div>

      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="bg-white p-3 border border-gray-200 rounded-xl flex items-center shadow-sm">
          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden mr-3">
            <img src={chatRoomInfo.itemImg} alt="물품" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-gray-800">{chatRoomInfo.itemTitle}</h4>
          </div>
          
          {itemStatus === "MATCHING" ? (
            <button 
              onClick={handleCompleteDelivery}
              className="bg-primary text-black px-3 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-[#ffc67a] transition-colors"
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

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-white pb-24 relative">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-sm text-gray-400 font-medium">대화 내역을 불러오는 중...</span>
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <span className="text-[10px] bg-gray-100 px-3 py-1 rounded-full text-gray-400">2026년 5월 18일</span>
            </div>

            {messages.map((msg) => {
              if (msg.type === "SYSTEM") {
                return (
                  <div key={msg.id} className="flex flex-col items-center justify-center my-4">
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center max-w-[90%] shadow-sm space-y-3">
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">{msg.text}</p>
                      <button 
                        onClick={() => navigate('/review', {
                          state: {
                            matchId: chatRoomInfo.matchId,
                            opponentName: chatRoomInfo.partnerName,
                            postTitle: chatRoomInfo.itemTitle,
                            targetUserId: chatRoomInfo.partnerId
                          }
                        })}
                        className="w-full bg-primary text-black text-xs font-bold py-2 rounded-xl hover:brightness-95 active:scale-[0.98] transition-all"
                      >
                        후기 작성하러 가기
                      </button>
                    </div>
                  </div>
                );
              }

              const isMe = msg.sender === "me";
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm break-words ${
                    isMe 
                      ? 'bg-primary text-black rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

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
          <button type="submit" disabled={!inputText.trim()} className="ml-2 text-primary font-bold text-sm hover:brightness-90 disabled:opacity-50">
            전송
          </button>
        </div>
      </form>
    </Layout>
  );
}

export default ChatDetailPage;
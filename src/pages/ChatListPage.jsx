import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Layout from '../components/Layout';

function ChatListPage() {
  const navigate = useNavigate();

  // 더미 데이터: 활성화된 채팅방 목록
  const chatRooms = [
    { id: 1, userId: "user1234", lastMsg: "내일 정문 앞에서 뵐까요?", time: "오후 2:30", img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" },
    { id: 2, userId: "cnuchacha", lastMsg: "물건 확인했습니다! 감사합니다.", time: "어제", img: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" },
  ];

  return (
    <Layout>
      
        {/* 헤더 영역 */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold">채팅</h1>
          <button 
            onClick={() => navigate('/matchmanagement')}
            className="bg-[#FFD18F] text-black px-4 py-2 rounded-lg text-sm font-bold shadow-sm"
          >
            요청 관리
          </button>
        </div>

{/* 채팅 리스트 영역 */}
<div className="flex-1 overflow-y-auto pb-24">
  {chatRooms.map(room => (
    <div 
      key={room.id}
      onClick={() => navigate('/chatdetail', {
        state: {
          chatId: room.id,
          opponentName: room.userId,
          postTitle: room.postTitle || "삼색 고양이 인형", // 상세방 상단에 보여줄 게시글 제목 (데이터에 없으면 기본값)
          postImg: room.img // 상세방 상단에 보여줄 게시글 이미지
        }
      })}
      className="flex items-center px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors"
    >
      <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden mr-4 border border-gray-100">
        <img src={room.img} alt="프로필" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-gray-900">{room.userId}</span>
          <span className="text-xs text-gray-400">{room.time}</span>
        </div>
        <p className="text-sm text-gray-500 truncate">{room.lastMsg}</p>
      </div>
    </div>
  ))}
</div>

  
    </Layout>
  );
}

export default ChatListPage;
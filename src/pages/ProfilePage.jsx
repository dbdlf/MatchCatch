import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Layout from '../components/Layout';
import { profileApi } from '../api';

function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. location.state에서 전달받은 본인 여부와 유저 ID를 꺼냄
  const receivedIsOwnProfile = location.state?.isOwnProfile || false;
  const receivedUserId = location.state?.userId || "차차"; 

  // 2. 상태(State) 선언
  const [isOwnProfile, setIsOwnProfile] = useState(receivedIsOwnProfile); 

  // 3. 더미 데이터 설정 (전달받은 userId를 id로 적용)
  const [userData, setUserData] = useState({
    id: receivedUserId,
    temperature: 36.5,
    ongoingActivities: [
      { id: 101, title: "파란색 카드지갑", status: "REGISTERED", img: "https://via.placeholder.com/60" }
    ],
    completedActivities: [
      { id: 201, title: "검은색 우산", status: "DELIVERED", img: "https://via.placeholder.com/60" },
      { id: 202, title: "갤럭시 버즈 프로", status: "DELIVERED", img: "https://via.placeholder.com/60" }
    ],
    reviews: [
      { id: 1, type: "POSITIVE", content: "정말 친절하시고 시간 약속도 잘 지키셨어요!" },
      { id: 2, type: "POSITIVE", content: "덕분에 소중한 물건을 찾았습니다. 감사합니다." }
    ]
  });

  // 4. 활동 내역 클릭 시 상세 페이지 이동 함수
  const handleActivityClick = (activityId) => {
    navigate('/postdetail', {
      state: {
        postId: activityId,
        isAuthor: isOwnProfile
      }
    });
  };

  return (
    <Layout>
   
      {/* 상단 헤더 영역 */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100 bg-white">
        
        {/* 조건 분기: 내 프로필로 들어왔을 때는 뒤로가기 버튼을 숨김 */}
        {!isOwnProfile ? (
          <button onClick={() => navigate(-1)} className="p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : (
          <div className="w-8"></div>
        )}

        {/* 타이틀 텍스트 */}
        <h1 className="text-base font-bold text-gray-900">
          {isOwnProfile ? "내 프로필" : `${receivedUserId}님의 프로필`}
        </h1>

        {/* 우측 편집 버튼 */}
        {isOwnProfile ? (
          <button 
            onClick={() => navigate('/profileedit', { state: { userId: receivedUserId } })}
            className="text-sm font-medium text-gray-400 hover:text-black transition-colors"
          >
            편집
          </button>
        ) : (
          <div className="w-8"></div>
        )}
      </div>

      {/* 프로필 정보 영역 */}
      <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white">
        <div className="flex items-center space-x-4">
          {/* 프로필 이미지 */}
          <div className="w-20 h-20 bg-gray-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
            <img src="https://via.placeholder.com/80" alt="프로필" />
          </div>
      
          {/* 사용자 식별 정보 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{userData.id}</h2>
          </div>
        </div>

        {/* 사용자 온도 지표 */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-full border-2 border-[#FFD18F] flex items-center justify-center mb-1">
            <span className="text-xs font-bold text-[#FFD18F]">{userData.temperature}℃</span>
          </div>
          <span className="text-[10px] text-gray-400 font-bold">온도</span>
        </div>
      </div>

      {/* 활동 및 후기 내역 영역 (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-24 bg-white">
        
        {/* 1. 활동 내역 (진행 중) - 본인 프로필일 때만 노출 */}
        {isOwnProfile && (
          <section className="space-y-4">
            <h3 className="font-bold text-lg">활동내역 (진행중)</h3>
            {userData.ongoingActivities.map(item => (
              <div 
                key={item.id} 
                onClick={() => handleActivityClick(item.id)}
                className="flex p-3 bg-gray-50 rounded-xl items-center cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <img src={item.img} alt="물품" className="w-12 h-12 rounded-lg bg-gray-200 mr-3" />
                <span className="text-sm font-medium text-gray-800">{item.title}</span>
              </div>
            ))}
          </section>
        )}

        {/* 2. 활동 내역 (완료) - 공통 노출 */}
        <section className="space-y-4">
          <h3 className="font-bold text-lg">활동내역 (완료)</h3>
          {userData.completedActivities.map(item => (
            <div 
              key={item.id} 
              onClick={() => handleActivityClick(item.id)}
              className="flex p-3 bg-gray-50 rounded-xl items-center cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <img src={item.img} alt="물품" className="w-12 h-12 rounded-lg bg-gray-200 mr-3" />
              <span className="text-sm font-medium text-gray-800">{item.title}</span>
            </div>
          ))}
        </section>

        {/* 3. 받은 후기 - 공통 노출 */}
        <section className="space-y-4">
          <h3 className="font-bold text-lg">받은 후기</h3>
          <div className="space-y-3">
            {userData.reviews.map(review => (
              <div key={review.id} className="p-4 border border-gray-100 rounded-2xl bg-white shadow-sm">
                <div className="flex items-center mb-2">
                  <span className="text-sm mr-2">{review.type === 'POSITIVE' ? '😊' : '🙁'}</span>
                  <span className={`text-[11px] font-bold ${review.type === 'POSITIVE' ? 'text-amber-500' : 'text-red-400'}`}>
                    {review.type === 'POSITIVE' ? '만족' : '불만족'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{review.content}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </Layout>
  );
}

export default ProfilePage;
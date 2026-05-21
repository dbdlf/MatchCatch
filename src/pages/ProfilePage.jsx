import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const receivedIsOwnProfile = location.state?.isOwnProfile || false;
  const receivedUserId = location.state?.userId || "차차"; 

  const [isOwnProfile] = useState(receivedIsOwnProfile); 
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    let mockItems = JSON.parse(localStorage.getItem('mockItems')) || [];
    
    // 고정 더미 데이터 주입
    const hasDummy = mockItems.some(item => String(item.id).startsWith('dummy_1'));
    if (!hasDummy) {
      const initialDummies = [
        {
          id: "dummy_1",
          mode: "lost", 
          status: "REGISTERED",
          title: "검은색 카드 지갑",
          content: "검은색 가죽 카드 지갑입니다.",
          location: "충남대학교 정문 근처",
          time: "2026-05-19 14:00",
          imageUrl: "/images/black_wallet.png",
          author: { id: "차차", temperature: 36.5 }
        },
        {
          id: "dummy_2",
          mode: "lost",
          status: "DELIVERED",
          title: "흰색 텀블러",
          content: "스탠리 텀블러입니다.",
          location: "인문대학 1층 로비",
          time: "2026-05-18 11:30",
          imageUrl: "/images/white_tumbler.png",
          author: { id: "차차", temperature: 36.5 }
        },
        {
          id: "dummy_3",
          mode: "lost",
          status: "DELIVERED",
          title: "갤럭시 버즈 프로",
          content: "화이트 색상의 갤럭시 버즈 프로입니다.",
          location: "공과대학 5호관 2층",
          time: "2026-05-17 16:45",
          imageUrl: "/images/buds_pro.png",
          author: { id: "차차", temperature: 36.5 }
        }
      ];
      mockItems = [...initialDummies, ...mockItems];
      localStorage.setItem('mockItems', JSON.stringify(mockItems));
    }

    // 현재 보고 있는 프로필의 주인공 ID 설정
    const profileOwnerId = isOwnProfile ? "차차" : receivedUserId;

    // 진행 중인 활동 필터링 (글쓴이 일치 여부 확인)
    const ongoing = mockItems.filter(item => 
      item.author?.id === profileOwnerId && 
      (item.status === 'REGISTERED' || item.status === 'MATCHING') && 
      (item.mode === 'found' || String(item.id).startsWith('dummy_'))
    );
    
    // 완료된 활동 필터링
    const completed = mockItems.filter(item => 
      item.author?.id === profileOwnerId &&
      item.status === 'DELIVERED'
    );

    setUserData({
      id: profileOwnerId,
      temperature: 36.5,
      ongoingActivities: ongoing.map(item => ({
        id: item.id,
        title: item.id === "dummy_1" ? "검은색 카드 지갑" : (item.mode === 'found' ? `${item.content.substring(0, 15)}...` : item.title),
        img: item.imageUrl
      })),
      completedActivities: completed.map(item => ({
        id: item.id,
        title: item.id === "dummy_2" ? "흰색 텀블러" : item.id === "dummy_3" ? "갤럭시 버즈 프로" : (item.mode === 'found' ? `${item.content.substring(0, 15)}...` : item.title),
        img: item.imageUrl
      })),
      reviews: [
        { id: 1, type: "POSITIVE", content: "정말 친절하시고 시간 약속도 잘 지키셨어요!" },
        { id: 2, type: "POSITIVE", content: "덕분에 소중한 물건을 찾았습니다. 감사합니다." }
      ]
    });
  }, [receivedUserId, isOwnProfile]);

  const handleActivityClick = (activityId) => {
    navigate('/postdetail', {
      state: {
        postId: activityId,
        isAuthor: isOwnProfile
      }
    });
  };

  if (!userData) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full text-gray-400 text-sm font-medium">
          프로필을 불러오는 중...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* 상단 헤더 영역 */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100 bg-white">
        {!isOwnProfile ? (
          <button onClick={() => navigate(-1)} className="p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : (
          <div className="w-8"></div>
        )}

        <h1 className="text-base font-bold text-gray-900">
          {isOwnProfile ? "내 프로필" : `${userData.id}님의 프로필`}
        </h1>

        {isOwnProfile ? (
          <button 
            onClick={() => navigate('/profileedit', { state: { userId: userData.id } })}
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
          <div className="w-20 h-20 bg-gray-200 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
            <img 
              src={isOwnProfile ? (location.state?.userImg || "/images/profile.png") : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
              alt="프로필 사진" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
              }}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{userData.id}</h2>
          </div>
        </div>

        <div className="text-center">
          <div className="w-14 h-14 rounded-full border-2 border-[#FFD18F] flex items-center justify-center mb-1">
            <span className="text-xs font-bold text-[#FFD18F]">{userData.temperature}℃</span>
          </div>
          <span className="text-[10px] text-gray-400 font-bold">온도</span>
        </div>
      </div>

      {/* 활동 및 후기 내역 영역 */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-24 bg-white">
        
        {/* 1. 활동 내역 (진행 중) */}
        {/* 💡 핵심 수정: 다시 {isOwnProfile && (...)} 안전장치를 씌워서 내 프로필일 때만 렌더링되게 만들었습니다! */}
        {isOwnProfile && (
          <section className="space-y-4">
            <h3 className="font-bold text-lg">활동내역 (진행중)</h3>
            {userData.ongoingActivities.length > 0 ? (
              userData.ongoingActivities.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => handleActivityClick(item.id)}
                  className="flex p-3 bg-gray-50 rounded-xl items-center cursor-pointer hover:bg-gray-100 transition-colors border border-gray-100 shadow-sm"
                >
                  <img src={item.img} alt="물품" className="w-12 h-12 rounded-lg bg-gray-200 object-cover mr-3" />
                  <span className="text-sm font-bold text-gray-800">{item.title}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-2">진행 중인 내역이 없습니다.</p>
            )}
          </section>
        )}

        {/* 2. 활동 내역 (완료) */}
        <section className="space-y-4">
          <h3 className="font-bold text-lg">활동내역 (완료)</h3>
          {userData.completedActivities.length > 0 ? (
            userData.completedActivities.map(item => (
              <div 
                key={item.id} 
                onClick={() => handleActivityClick(item.id)}
                className="flex p-3 bg-gray-50 rounded-xl items-center cursor-pointer hover:bg-gray-100 transition-colors border border-gray-100 shadow-sm"
              >
                <img src={item.img} alt="물품" className="w-12 h-12 rounded-lg bg-gray-200 object-cover mr-3" />
                <span className="text-sm font-bold text-gray-800">{item.title}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 py-2">완료된 내역이 없습니다.</p>
          )}
        </section>

        {/* 3. 받은 후기 */}
        <section className="space-y-4">
          <h3 className="font-bold text-lg">받은 후기</h3>
          <div className="space-y-3">
            {userData.reviews.map(review => (
              <div key={review.id} className="p-4 border border-gray-100 rounded-2xl bg-white shadow-sm">
                <div className="flex items-center mb-2">
                  <span className="text-sm mr-2">{review.type === 'POSITIVE' ? '😊' : '🙁'}</span>
                  <span className={`text-[11px] font-bold ${review.type === 'POSITIVE' ? 'text-[#FFD18F]' : 'text-red-400'}`}>
                    {review.type === 'POSITIVE' ? '만족' : '불만족'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">{review.content}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </Layout>
  );
}

export default ProfilePage;
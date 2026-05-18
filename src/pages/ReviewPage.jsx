import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

function ReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const matchId = location.state?.matchId || "default_id";
  const opponentName = location.state?.opponentName || "상대방";
  const postTitle = location.state?.postTitle || "물품 정보 없음";

  const [satisfaction, setSatisfaction] = useState(null); 
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!satisfaction) {
      alert("만족 또는 불만족 중 하나를 반드시 선택해주세요!");
      return;
    }

    const reviewData = {
      matchId,
      type: satisfaction, 
      content: comment
    };

    console.log("후기 등록 데이터:", reviewData);
    alert(`후기가 성공적으로 등록되었습니다. ${opponentName}님의 온도가 ${satisfaction === 'POSITIVE' ? '+5' : '-5'}도 반영됩니다.`);
    navigate('/home'); 
  };

  return (
    <Layout hideNav>
      <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto">
        {/* 상단 헤더 */}
        <div className="px-6 py-6 border-b border-gray-100 flex items-center bg-white">
          <button onClick={() => navigate(-1)} className="p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="font-bold text-lg ml-4">거래 후기</span>
        </div>

        <div className="px-6 py-8 space-y-10 flex-1">
          {/* 매칭된 게시물 정보 카드 */}
          <div className="p-4 border border-gray-200 rounded-xl flex items-center shadow-sm bg-white">
            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-4 flex-shrink-0 flex items-center justify-center text-xs text-gray-400 font-bold">
              사진
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-gray-800">{postTitle}</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">매칭 완료된 분실물</p>
            </div>
          </div>

          {/* 만족도 선택 섹션 */}
          <div className="text-center space-y-6">
            <h2 className="text-xl font-bold text-gray-900 leading-snug">
              <span className="text-[#FF8C69]">{opponentName}</span>님과의 거래에<br/>만족하셨나요?
            </h2>
            
            <div className="flex justify-center space-x-3">
              <button 
                onClick={() => setSatisfaction('POSITIVE')}
                className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all shadow-sm ${
                  satisfaction === 'POSITIVE' 
                  ? 'bg-[#FFD18F] text-black ring-2 ring-[#FFD18F] ring-offset-2' 
                  : 'bg-gray-50 text-gray-400 border border-gray-200'
                }`}
              >
                만족 (+5도)
              </button>
              <button 
                onClick={() => setSatisfaction('NEGATIVE')}
                className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all shadow-sm ${
                  satisfaction === 'NEGATIVE' 
                  ? 'bg-gray-500 text-white ring-2 ring-gray-500 ring-offset-2' 
                  : 'bg-gray-50 text-gray-400 border border-gray-200'
                }`}
              >
                불만족 (-5도)
              </button>
            </div>
          </div>

          {/* 세부 사항 작성 */}
          <div className="space-y-2">
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="따뜻한 후기를 남겨주시면 상대방의 매너 온도가 올라갑니다 (선택사항)"
              className="w-full h-36 p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-[#FFD18F] focus:bg-white transition-all"
            />
          </div>

          {/* 등록하기 버튼 */}
          <div className="pt-4 pb-6 flex justify-center">
            <button 
              onClick={handleSubmit}
              disabled={!satisfaction}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all shadow-md ${
                satisfaction 
                ? 'bg-[#FFD18F] text-black active:scale-[0.98]' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              후기 등록하기
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ReviewPage;
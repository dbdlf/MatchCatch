import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';

function ReviewPage() {
  const navigate = useNavigate();
  const { matchId } = useParams();

  // 후기 유형 상태 (POSITIVE: 만족, NEGATIVE: 불만족)
  const [satisfaction, setSatisfaction] = useState(null); 
  const [comment, setComment] = useState("");

  // 등록하기 버튼 클릭 시 처리 로직
  const handleSubmit = () => {
    if (!satisfaction) {
      alert("만족 또는 불만족 중 하나를 반드시 선택해주세요!");
      return;
    }

    // API 호출 지점
    const reviewData = {
      matchId,
      type: satisfaction, // 'POSITIVE' or 'NEGATIVE'
      content: comment
    };

    console.log("후기 등록 데이터:", reviewData);
    alert(`후기가 성공적으로 등록되었습니다. 상대방의 온도가 ${satisfaction === 'POSITIVE' ? '+5' : '-5'}도 반영됩니다.`);
    navigate('/home'); 
  };

  return (
    <Layout hideNav>

        {/* 상단 헤더 */}
        <div className="px-6 py-6 border-b border-gray-100 flex items-center">
          <button onClick={() => navigate(-1)} className="p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10">
          
          {/* 매칭된 게시물 정보 카드 */}
          <div className="p-4 border-2 border-black rounded-xl flex items-center shadow-sm">
            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden mr-4 flex-shrink-0">
              <img src="https://via.placeholder.com/80" alt="물품 사진" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">삼색 고양이 인형</h4>
              <p className="text-xs text-gray-400 mt-1">매칭된 게시물 사진</p>
            </div>
          </div>

          {/* 만족도 선택 섹션 (필수 선택) */}
          <div className="text-center space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              [상대방ID]님과의 거래에<br/>만족하셨나요?
            </h2>
            
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setSatisfaction('POSITIVE')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                  satisfaction === 'POSITIVE' 
                  ? 'bg-[#FFD18F] text-black ring-2 ring-[#FFD18F] ring-offset-2' 
                  : 'bg-[#FFD18F] bg-opacity-40 text-gray-700'
                }`}
              >
                만족(+5)
              </button>
              <button 
                onClick={() => setSatisfaction('NEGATIVE')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                  satisfaction === 'NEGATIVE' 
                  ? 'bg-gray-400 text-white ring-2 ring-gray-400 ring-offset-2' 
                  : 'bg-gray-200 text-gray-500'
                }`}
              >
                불만족(-5)
              </button>
            </div>
          </div>

          {/* 세부 사항 작성 (선택 사항) */}
          <div className="space-y-2">
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="세부사항작성(선택)"
              className="w-full h-40 p-4 bg-gray-100 rounded-xl text-sm outline-none resize-none focus:ring-1 focus:ring-gray-200 transition-all"
            />
          </div>

          {/* 등록하기 버튼 */}
          <div className="pt-4 flex justify-center">
            <button 
              onClick={handleSubmit}
              disabled={!satisfaction}
              className={`px-10 py-3 rounded-2xl font-bold text-lg transition-all shadow-md ${
                satisfaction 
                ? 'bg-[#FFD18F] text-black active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              등록하기
            </button>
          </div>
        </div>

    </Layout>
  );
}

export default ReviewPage;
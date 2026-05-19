import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout'; 
import { itemApi } from '../api';

function UploadPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [mode, setMode] = useState(location.state?.mode || 'found'); 
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

  const [formData, setFormData] = useState({
    title: '',        // 분실/습득물 제목
    content: '',      // 상세 설명
    keywords: '',     // 특징 키워드 (분실물 전용)
    location: '',     // 예상 장소
    time: '',         // 예상 시간
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);
      
      // AI 특징 추출 시뮬레이션
      setTimeout(() => {
        if (mode === 'found') {
          setFormData(prev => ({
            ...prev,
            title: "삼색 고양이 인형",
            content: "인형, 삼색, 고양이, 꼬리 짧음"
          }));
        } else {
          // 분실물일 때 이미지를 올리면 키워드를 AI가 잡아주는 연출
          setFormData(prev => ({
            ...prev,
            keywords: "인형, 삼색, 고양이"
          }));
        }
      }, 1000);
    }
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    if (mode === 'found') {
      // 습득물: 이미지 필수, 제목 필수, 설명 필수
      return selectedImage && formData.title.trim() && formData.content.trim();
    } else {
      // 분실물: 제목 필수, 설명 필수, 키워드 필수 (명세서상 이미지는 선택 사항)
      return formData.title.trim() && formData.content.trim() && formData.keywords.trim();
    }
  };

  // 백엔드 명세서에 맞춘 연속 호출 로직!
  const handleSubmit = async () => {
    if (!isFormValid() || isLoading) return;
    
    setIsLoading(true); // 로딩 스피너 및 버튼 비활성화 시작

    try {
      if (mode === 'found') {
        // [과정] 습득물 등록
        const response = await itemApi.registerFoundItem({ ...formData, image: selectedImage });
        
        alert("습득물이 성공적으로 등록되었습니다.");
        navigate('/postdetail', {
          state: { 
            postId: response.found_item_id, // 서버에서 발급한 ID
            isAuthor: true,
            isFromUpload: true
          } 
        }); 

      } else {
        // [과정 1] 분실물 등록
        const registerResponse = await itemApi.registerLostItem({ ...formData, image: selectedImage });
        const newLostItemId = registerResponse.lost_item_id; // 등록 후 발급받은 내 분실물 고유 ID

        // [과정 2] 발급받은 ID로 유사 습득물 조회
        const searchResults = await itemApi.getSimilarFoundItems(newLostItemId);

        // [과정 3] 결과 페이지로 이동 (검색 결과 + 분실물 ID 동시 전달)
        navigate('/searchresult', { 
          state: { 
            results: searchResults,     // 화면에 뿌려줄 검색 결과
            lostItemId: newLostItemId   // 매칭 요청 시 백엔드에 줘야 할 내 분실물 고유 번호
          } 
        });
      }
    } catch (error) {
      alert("서버 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <Layout>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* 상단 헤더 */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100 bg-white">
        <button onClick={() => navigate(-1)} className="p-1" disabled={isLoading}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button 
          disabled={!isFormValid() || isLoading}
          onClick={handleSubmit}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
            !isFormValid() || isLoading 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-[#FFD18F] text-black active:scale-[0.98] shadow-sm hover:brightness-95'
          }`}
        >
          {isLoading 
            ? 'AI 분석 중...' 
            : (mode === 'found' ? '등록 완료' : '검색하기')}
        </button>
      </div>

      {/* 폼 입력 영역 */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-white pb-24">
        <h2 className="text-center text-gray-400 text-sm font-medium">
          {mode === 'found' ? '습득자_Post_Editor' : '분실자_Post_Editor'}
        </h2>

        {/* 사진 선택 영역 */}
        <div 
          onClick={() => !isLoading && fileInputRef.current.click()}
          className={`w-full aspect-video bg-gray-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden transition-colors ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-100'}`}
        >
          {selectedImage ? (
            <img src={selectedImage} alt="선택된 사진" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <span className="text-gray-400 font-bold block">
                {mode === 'found' ? '사진 선택 (필수)' : '참고 사진 선택 (선택)'}
              </span>
              <span className="text-gray-300 text-xs mt-1 block">(기기 앨범 열기)</span>
            </div>
          )}
        </div>

        {/* 조건 분기 폼 */}
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="제목 (필수)" 
            disabled={isLoading}
            className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border border-gray-100 focus:border-[#FFD18F] focus:ring-1 focus:ring-[#FFD18F] transition-all"
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
          
          <textarea 
            placeholder={mode === 'found' ? "상세 설명 (필수)" : "잃어버린 물건의 상세 설명 (필수)"} 
            disabled={isLoading}
            className="w-full h-32 p-4 bg-gray-50 rounded-xl outline-none resize-none text-sm border border-gray-100 focus:border-[#FFD18F] focus:ring-1 focus:ring-[#FFD18F] transition-all"
            value={formData.content} 
            onChange={e => setFormData({...formData, content: e.target.value})}
          />

          {/* 분실물일 때만 나타나는 특징 키워드 입력란 */}
          {mode === 'lost' && (
            <input 
              type="text" 
              placeholder="특징 키워드 (쉼표로 구분하여 입력, 필수)" 
              disabled={isLoading}
              className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border border-gray-100 focus:border-[#FFD18F] focus:ring-1 focus:ring-[#FFD18F] transition-all"
              value={formData.keywords} 
              onChange={e => setFormData({...formData, keywords: e.target.value})}
            />
          )}

          <input 
            type="text" 
            placeholder={mode === 'found' ? "습득 장소 (선택)" : "분실 예상 장소 (선택)"} 
            disabled={isLoading}
            className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border border-gray-100 focus:border-[#FFD18F] focus:ring-1 focus:ring-[#FFD18F] transition-all"
            value={formData.location} 
            onChange={e => setFormData({...formData, location: e.target.value})}
          />
          
          <input 
            type="text" 
            placeholder={mode === 'found' ? "습득 시간 (선택)" : "분실 예상 시간 (선택)"} 
            disabled={isLoading}
            className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border border-gray-100 focus:border-[#FFD18F] focus:ring-1 focus:ring-[#FFD18F] transition-all"
            value={formData.time} 
            onChange={e => setFormData({...formData, time: e.target.value})}
          />
        </div>
      </div>
    </Layout>
  );
}

export default UploadPage;
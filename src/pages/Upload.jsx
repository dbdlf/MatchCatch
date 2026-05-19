import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout'; 
import { itemApi } from '../api'; 

function UploadPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [mode] = useState(location.state?.mode || 'found'); 
  const [selectedImage, setSelectedImage] = useState(null);
  
  // 💡 로딩 상태를 두 가지로 분리했습니다!
  const [isImageAnalyzing, setIsImageAnalyzing] = useState(false); // 사진 올렸을 때 AI 분석 로딩
  const [isSubmitting, setIsSubmitting] = useState(false);         // 최종 버튼 눌렀을 때 서버 통신 로딩

  const [formData, setFormData] = useState({
    title: '',        
    content: '',      
    keywords: '',     
    location: '',     
    time: '',         
  });

  // 사진 첨부 시 즉시 실행되는 AI 분석 로직
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);
      
      // 사진 등록 즉시 분석 로딩 시작!
      setIsImageAnalyzing(true);
      
      // AI 특징 추출 시뮬레이션
      setTimeout(() => {
        if (mode === 'found') {
          setFormData(prev => ({
            ...prev,
            title: "삼색 고양이 인형",
            content: "인형, 삼색, 고양이, 꼬리 짧음"
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            keywords: "인형, 삼색, 고양이"
          }));
        }
        setIsImageAnalyzing(false); // 분석 완료 후 로딩 끝
      }, 1500);
    }
  };

  const isFormValid = () => {
    if (mode === 'found') {
      return selectedImage && formData.title.trim() && formData.content.trim();
    } else {
      return formData.title.trim() && formData.content.trim() && formData.keywords.trim();
    }
  };

  // 하단 등록/검색 버튼 클릭 시 실행되는 로직
  const handleSubmit = async () => {
    if (!isFormValid() || isSubmitting || isImageAnalyzing) return;
    
    setIsSubmitting(true); // 최종 전송 로딩 시작

    try {
      if (mode === 'found') {
        const response = await itemApi.registerFoundItem({ ...formData, image: selectedImage });
        alert("습득물이 성공적으로 등록되었습니다.");
        navigate('/postdetail', {
          state: { postId: response.found_item_id, isAuthor: true, isFromUpload: true } 
        }); 
      } else {
        const registerResponse = await itemApi.registerLostItem({ ...formData, image: selectedImage });
        const newLostItemId = registerResponse.lost_item_id; 
        const searchResults = await itemApi.getSimilarFoundItems(newLostItemId);

        navigate('/searchresult', { 
          state: { results: searchResults, lostItemId: newLostItemId } 
        });
      }
    } catch (error) {
      alert("서버 처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
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
        <button onClick={() => navigate(-1)} className="p-1" disabled={isSubmitting}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button 
          disabled={!isFormValid() || isSubmitting || isImageAnalyzing}
          onClick={handleSubmit}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
            !isFormValid() || isSubmitting || isImageAnalyzing
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-[#FFD18F] text-black active:scale-[0.98] shadow-sm hover:brightness-95'
          }`}
        >
          {isSubmitting ? (mode === 'found' ? '등록 중...' : '검색 중...') : (mode === 'found' ? '등록 완료' : '검색하기')}
        </button>
      </div>

      {/* 폼 입력 영역 */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-white pb-24">
        <h2 className="text-center text-gray-400 text-sm font-medium">
          {mode === 'found' ? '습득자_Post_Editor' : '분실자_Post_Editor'}
        </h2>

        {/* 사진 선택 영역 */}
        <div 
          onClick={() => !isSubmitting && !isImageAnalyzing && fileInputRef.current.click()}
          className={`w-full aspect-video bg-gray-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden transition-colors ${
            isSubmitting || isImageAnalyzing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-100'
          }`}
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
        <div className="space-y-4 relative">
          
          {/* 사진 분석 중일 때 입력칸 위에 뜨는 블러 오버레이 */}
          {isImageAnalyzing && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-xl border border-gray-100">
              <div className="w-8 h-8 border-4 border-[#FFD18F] border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-bold text-gray-700">AI가 이미지를 분석 중입니다...</p>
            </div>
          )}

          <input 
            type="text" 
            placeholder="제목 (필수)" 
            disabled={isSubmitting || isImageAnalyzing}
            className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border border-gray-100 focus:border-[#FFD18F] transition-all"
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
          
          <textarea 
            placeholder={mode === 'found' ? "상세 설명 (필수)" : "잃어버린 물건의 상세 설명 (필수)"} 
            disabled={isSubmitting || isImageAnalyzing}
            className="w-full h-32 p-4 bg-gray-50 rounded-xl outline-none resize-none text-sm border border-gray-100 focus:border-[#FFD18F] transition-all"
            value={formData.content} 
            onChange={e => setFormData({...formData, content: e.target.value})}
          />

          {mode === 'lost' && (
            <input 
              type="text" 
              placeholder="특징 키워드 (쉼표로 구분, 필수)" 
              disabled={isSubmitting || isImageAnalyzing}
              className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border border-gray-100 focus:border-[#FFD18F] transition-all"
              value={formData.keywords} 
              onChange={e => setFormData({...formData, keywords: e.target.value})}
            />
          )}

          <input 
            type="text" 
            placeholder={mode === 'found' ? "습득 장소 (선택)" : "분실 예상 장소 (선택)"} 
            disabled={isSubmitting || isImageAnalyzing}
            className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border border-gray-100 focus:border-[#FFD18F] transition-all"
            value={formData.location} 
            onChange={e => setFormData({...formData, location: e.target.value})}
          />
          
          <input 
            type="text" 
            placeholder={mode === 'found' ? "습득 시간 (선택)" : "분실 예상 시간 (선택)"} 
            disabled={isSubmitting || isImageAnalyzing}
            className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border border-gray-100 focus:border-[#FFD18F] transition-all"
            value={formData.time} 
            onChange={e => setFormData({...formData, time: e.target.value})}
          />
        </div>
      </div>
    </Layout>
  );
}

export default UploadPage;
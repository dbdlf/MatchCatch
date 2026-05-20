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
  
  // 상태 관리: 분실물 사진 분석 로딩과 최종 제출 로딩 분리
  const [isImageAnalyzing, setIsImageAnalyzing] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);         

  const [formData, setFormData] = useState({
    title: '',        // 분실물 전용
    content: '',      // 공통 (설명)
    keywords: '',     // 분실물 전용
    location: '',     
    time: '',         
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);
    }
  };

  // 폼 유효성 검사 (습득물은 제목 검사 제외!)
  const isFormValid = () => {
    if (mode === 'found') {
      return selectedImage && formData.content.trim(); 
    } else {
      return formData.title.trim() && formData.content.trim() && formData.keywords.trim();
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid() || isSubmitting || isImageAnalyzing) return;
    
    setIsSubmitting(true); 

    try {
      if (mode === 'found') {
        // 습득물
        const payload = {
          description: formData.content,
          found_location: formData.location,
          found_time: formData.time,
          image: selectedImage
        };
        const response = await itemApi.registerFoundItem(payload);
        
        alert("습득물이 성공적으로 등록되었습니다.");
        navigate('/postdetail', {
          state: { postId: response.found_item_id, isAuthor: true, isFromUpload: true } 
        }); 
      } else {
        // 분실물
        const payload = {
          title: formData.title,
          description: formData.content,
          keywords: formData.keywords.split(',').map(k => k.trim()), // 배열로 변환
          lost_location: formData.location,
          lost_time: formData.time,
          image: selectedImage
        };
        const registerResponse = await itemApi.registerLostItem(payload);
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

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-white pb-24">
        <h2 className="text-center text-gray-400 text-sm font-medium">
          {mode === 'found' ? '습득물 등록하기' : '분실물 찾기'}
        </h2>

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
                {mode === 'found' ? '사진 첨부 (필수)' : '참고 사진 첨부 (선택)'}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4 relative">

          {/* 분실물일 때만 나타나는 제목 입력창 */}
          {mode === 'lost' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 pl-1">제목 (필수)</label>
              <input 
                type="text" 
                placeholder="물품 제목을 입력하세요" 
                disabled={isSubmitting}
                className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border border-gray-100 focus:border-[#FFD18F] focus:bg-white transition-all"
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
          )}
          
          {/* 습득물, 분실물 공통: 상세 설명 */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 pl-1">상세 내용 (필수)</label>
            <textarea 
              placeholder="물품에 대한 상세 설명을 입력하세요" 
              disabled={isSubmitting}
              className="w-full h-32 p-4 bg-gray-50 rounded-xl outline-none resize-none text-sm border border-gray-100 focus:border-[#FFD18F] focus:bg-white transition-all"
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})}
            />
          </div>

          {/* 분실물일 때만 나타나는 키워드 입력창 */}
          {mode === 'lost' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 pl-1">특징 키워드 (쉼표 구분, 필수)</label>
              <input 
                type="text" 
                placeholder="종류, 색깔, 모양 등" 
                disabled={isSubmitting}
                className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border border-gray-100 focus:border-[#FFD18F] focus:bg-white transition-all font-semibold text-gray-800"
                value={formData.keywords} 
                onChange={e => setFormData({...formData, keywords: e.target.value})}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 pl-1">{mode === 'found' ? '습득 장소 (선택)' : '분실 예상 장소 (선택)'}</label>
            <input 
              type="text" 
              placeholder="예: 충남대 정문 앞 커피숍" 
              disabled={isSubmitting}
              className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border border-gray-100 focus:border-[#FFD18F] focus:bg-white transition-all"
              value={formData.location} 
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 pl-1">{mode === 'found' ? '습득 시간 (선택)' : '분실 예상 시간 (선택)'}</label>
            <input 
              type="text" 
              placeholder="예: 2026-05-19 14:30" 
              disabled={isSubmitting}
              className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border border-gray-100 focus:border-[#FFD18F] focus:bg-white transition-all"
              value={formData.time} 
              onChange={e => setFormData({...formData, time: e.target.value})}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default UploadPage;
import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout'; 

function UploadPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [mode, setMode] = useState(location.state?.mode || 'found'); 
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '', 
    location: '',
    time: '',
    type: '',     
    color: '',    
    extraKeywords: ''
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
          setFormData(prev => ({
            ...prev,
            type: "인형",
            color: "삼색(흰/검/갈)"
          }));
        }
      }, 1000);
    }
  };

  // 폼 유효성 검사 (장소, 시간은 조건에서 제외)
  const isFormValid = () => {
    if (mode === 'found') {
      return selectedImage && formData.title.trim() && formData.content.trim();
    } else {
      const hasRequiredKeywords = formData.type && formData.color;
      return selectedImage || hasRequiredKeywords;
    }
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;

    if (mode === 'found') {
      const newPostId = "123"; 
      alert("습득물이 성공적으로 등록되었습니다.");
      
      navigate('/postdetail', {
        state: { 
          postId: newPostId,
          isAuthor: true,
          isFromUpload: true
        } 
      }); 
    } else {
      navigate('/searchresult', { state: { searchData: formData } });
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
        <button onClick={() => navigate(-1)} className="p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button 
          disabled={!isFormValid()}
          onClick={handleSubmit}
          className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-colors ${isFormValid() ? 'bg-[#FFD18F] text-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          {mode === 'found' ? '등록 완료' : '검색하기'}
        </button>
      </div>

      {/* 폼 입력 영역 */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-white pb-24">
        <h2 className="text-center text-gray-400 text-sm font-medium">
          {mode === 'found' ? '습득자_Post_Editor' : '분실자_Post_Editor'}
        </h2>

        {/* 사진 선택 영역 */}
        <div 
          onClick={() => fileInputRef.current.click()}
          className="w-full aspect-video bg-gray-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 cursor-pointer overflow-hidden hover:bg-gray-100 transition-colors"
        >
          {selectedImage ? (
            <img src={selectedImage} alt="선택된 사진" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <span className="text-gray-400 font-bold block">사진 선택 (필수)</span>
              <span className="text-gray-300 text-xs mt-1 block">(기기 앨범 열기)</span>
            </div>
          )}
        </div>

        {/* 조건 분기 폼 */}
        {mode === 'found' ? (
          /* 습득자 폼 */
          <div className="space-y-4">
            <input 
              type="text" placeholder="제목 (필수)" 
              className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm border-l-4 border-[#FFD18F]"
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
            />
            <textarea 
              placeholder="내용: 자동 키워드 생성 (필수)" 
              className="w-full h-32 p-3 bg-gray-100 rounded-lg outline-none resize-none text-sm border-l-4 border-[#FFD18F]"
              value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
            />
            <input 
              type="text" placeholder="습득 장소 (선택)" 
              className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm"
              value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
            />
            <input 
              type="text" placeholder="습득 시간 (선택)" 
              className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm"
              value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
            />
          </div>
        ) : (
          /* 분실자 폼 */
          <div className="space-y-4">
            <input 
              type="text" placeholder="종류 (필수)" 
              className="w-full p-3 bg-gray-100 rounded-lg outline-none border-l-4 border-[#FFD18F] text-sm"
              value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
            />
            <input 
              type="text" placeholder="색상 (필수)" 
              className="w-full p-3 bg-gray-100 rounded-lg outline-none border-l-4 border-[#FFD18F] text-sm"
              value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})}
            />
            <input 
              type="text" placeholder="기타 키워드" 
              className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm"
              value={formData.extraKeywords} onChange={e => setFormData({...formData, extraKeywords: e.target.value})}
            />
            <input 
              type="text" placeholder="잃어버린 예상 장소 (선택)" 
              className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm"
              value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
            />
            <input 
              type="text" placeholder="잃어버린 예상 시간 (선택)" 
              className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm"
              value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default UploadPage;
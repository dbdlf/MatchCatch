import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout'; 

function PostEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  // 1. 상세 페이지 등에서 넘겨준 기존 게시글 데이터를 받아옴. (없으면 기본 더미값)
  const originalPost = location.state?.postData || {
    id: "123",
    title: "삼색 고양이 인형",
    content: "인형, 삼색, 고양이, 꼬리 짧음",
    location: "대전광역시 유성구 궁동 대학로",
    time: "2026-05-14 14:30",
    imageUrl: "https://via.placeholder.com/400"
  };

  // 2. 수정할 입력 폼 상태 관리 (기존 데이터로 초기화)
  const [formData, setFormData] = useState({
    title: originalPost.title,
    content: originalPost.content,
    location: originalPost.location,
    time: originalPost.time,
    imageUrl: originalPost.imageUrl
  });

  // 3. 앨범에서 사진 변경 시 처리 함수
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, imageUrl: previewUrl });
    }
  };

  // 4. 완료 버튼 활성화 조건식 (사진, 제목, 키워드/내용 필수)
  const isFormValid = 
    formData.imageUrl && 
    formData.title.trim() && 
    formData.content.trim();

  // 5. 완료 버튼 클릭 시 처리
  const handleSubmit = () => {
    if (!isFormValid) return;

    alert("게시글 수정이 완료되었습니다!");
    
    // 수정된 데이터를 다시 상세 페이지(PostDetailPage)로 반환
    navigate('/postdetail', {
      state: {
        postId: originalPost.id,
        isAuthor: true,
        updatedPostData: formData 
      }
    });
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

      {/* 상단 헤더 영역 */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100 bg-white">
        {/* 취소 버튼: 원래 화면(상세 페이지)으로 그냥 돌아감 */}
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-400 text-sm font-medium hover:text-black transition-colors"
        >
          취소
        </button>
        <h1 className="text-base font-bold text-gray-900">게시글 수정</h1>
        {/* 완료 버튼: 필수 조건 충족 시에만 활성화 */}
        <button 
          disabled={!isFormValid}
          onClick={handleSubmit}
          className={`text-sm font-bold transition-colors ${isFormValid ? 'text-[#FFD18F] hover:opacity-80' : 'text-gray-300 cursor-not-allowed'}`}
        >
          완료
        </button>
      </div>

      {/* 입력 영역 (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-white pb-24">
        
        {/* 1. 사진 수정 영역 (클릭 시 기기 앨범 열기) */}
        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-bold block">사진 (필수)</label>
          <div 
            onClick={() => fileInputRef.current.click()}
            className="w-full aspect-video bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 cursor-pointer overflow-hidden hover:bg-gray-100 transition-colors"
          >
            {formData.imageUrl ? (
              <img src={formData.imageUrl} alt="수정된 사진" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 font-bold">사진을 선택해주세요</span>
            )}
          </div>
        </div>

        {/* 2. 제목 입력 필드 */}
        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-bold block">제목 (필수)</label>
          <input 
            type="text" 
            value={formData.title} 
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm font-medium border-l-4 border-[#FFD18F]"
            placeholder="제목을 입력해주세요"
          />
        </div>

        {/* 3. 내용/키워드 입력 필드 */}
        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-bold block">내용 및 키워드 (필수)</label>
          <textarea 
            value={formData.content} 
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            className="w-full h-28 p-3 bg-gray-100 rounded-lg outline-none resize-none text-sm font-medium border-l-4 border-[#FFD18F]"
            placeholder="특징 키워드를 입력해주세요"
          />
        </div>

        {/* 4. 습득 장소 입력 필드 */}
        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-bold block">습득 장소 (선택)</label>
          <input 
            type="text" 
            value={formData.location} 
            onChange={e => setFormData({ ...formData, location: e.target.value })}
            className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm font-medium"
            placeholder="습득 장소를 입력해주세요"
          />
        </div>

        {/* 5. 습득 시간 입력 필드 */}
        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-bold block">습득 시간 (선택)</label>
          <input 
            type="text" 
            value={formData.time} 
            onChange={e => setFormData({ ...formData, time: e.target.value })}
            className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm font-medium"
            placeholder="습득 시간을 입력해주세요"
          />
        </div>

      </div>
    </Layout>
  );
}

export default PostEditPage;
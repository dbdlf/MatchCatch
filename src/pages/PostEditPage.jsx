import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout'; 
import { itemApi } from '../api';

function PostEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // 상세 페이지에서 넘겨준 데이터 수신 (안전망으로 더미 데이터 유지)
  const originalPost = location.state?.postData || {
    id: "123",
    mode: "lost",           // 습득물인지 분실물인지 구분
    status: "REGISTERED",   // 현재 상태값 (수정 가능 여부 판단용)
    title: "삼색 고양이 인형",
    content: "인형, 삼색, 고양이, 꼬리 짧음",
    location: "대전광역시 유성구 궁동 대학로",
    time: "2026-05-14 14:30",
    imageUrl: "https://via.placeholder.com/400"
  };

  const [formData, setFormData] = useState({
    title: originalPost.title,
    content: originalPost.content,
    location: originalPost.location,
    time: originalPost.time,
    imageUrl: originalPost.imageUrl
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, imageUrl: previewUrl });
    }
  };

  const isFormValid = 
    formData.imageUrl && 
    formData.title.trim() && 
    formData.content.trim() &&
    !isLoading;

  // API 전송 및 REGISTERED 상태 검증 로직 추가
  const handleSubmit = async () => {
    if (!isFormValid) return;

    // 1차 방어: REGISTERED 상태가 아니면 아예 서버로 안 보냄!
    if (originalPost.status !== "REGISTERED") {
      alert("매칭이 진행 중이거나 인도가 완료된 물품은 수정할 수 없습니다.");
      return;
    }

    try {
      setIsLoading(true);

      // 모드에 따라 분실물/습득물 PATCH API 분기 처리
      if (originalPost.mode === 'found') {
        await itemApi.editFoundItem(originalPost.id, formData);
      } else {
        await itemApi.editLostItem(originalPost.id, formData);
      }

      alert("게시글 수정이 완료되었습니다!");
      
      navigate('/postdetail', {
        state: {
          postId: originalPost.id,
          isAuthor: true,
          updatedPostData: formData 
        }
      });
    } catch (error) {
      alert("수정 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
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
        <button 
          onClick={() => navigate(-1)} 
          disabled={isLoading}
          className="text-gray-400 text-sm font-medium hover:text-black transition-colors disabled:opacity-50"
        >
          취소
        </button>
        <h1 className="text-base font-bold text-gray-900">게시글 수정</h1>
        <button 
          disabled={!isFormValid}
          onClick={handleSubmit}
          className={`text-sm font-bold transition-colors ${isFormValid ? 'text-[#FFD18F] hover:opacity-80' : 'text-gray-300 cursor-not-allowed'}`}
        >
          {isLoading ? '저장 중...' : '완료'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-white pb-24">
        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-bold block">사진 (필수)</label>
          <div 
            onClick={() => !isLoading && fileInputRef.current.click()}
            className={`w-full aspect-video bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden transition-colors ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-100'}`}
          >
            {formData.imageUrl ? (
              <img src={formData.imageUrl} alt="수정된 사진" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 font-bold">사진을 선택해주세요</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-bold block">제목 (필수)</label>
          <input 
            type="text" 
            disabled={isLoading}
            value={formData.title} 
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm font-medium border-l-4 border-[#FFD18F] disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-bold block">내용 및 키워드 (필수)</label>
          <textarea 
            disabled={isLoading}
            value={formData.content} 
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            className="w-full h-28 p-3 bg-gray-100 rounded-lg outline-none resize-none text-sm font-medium border-l-4 border-[#FFD18F] disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-bold block">습득/분실 장소 (선택)</label>
          <input 
            type="text" 
            disabled={isLoading}
            value={formData.location} 
            onChange={e => setFormData({ ...formData, location: e.target.value })}
            className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm font-medium disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-bold block">습득/분실 시간 (선택)</label>
          <input 
            type="text" 
            disabled={isLoading}
            value={formData.time} 
            onChange={e => setFormData({ ...formData, time: e.target.value })}
            className="w-full p-3 bg-gray-100 rounded-lg outline-none text-sm font-medium disabled:opacity-50"
          />
        </div>

      </div>
    </Layout>
  );
}

export default PostEditPage;
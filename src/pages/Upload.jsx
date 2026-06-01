import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { itemApi, analyzeImage, getMockLocationAndTime } from '../api';

// ─────────────────────────────────────────────────────────────────────────────
// 🔄 실제 AI/위치 연동 시 교체 안내
//
// 현재는 api/itemApi.js 의 Mock 함수를 사용합니다.
//   - analyzeImage(base64, mimeType)  →  Mock AI 분석 (랜덤 더미 결과 반환)
//   - getMockLocationAndTime()        →  Mock 위치/시간 (랜덤 주소 + 현재 시각)
//
// 실제 연동 준비가 되면 itemApi.js 안의 해당 함수만 교체하세요.
// 이 파일(Upload.jsx)은 수정할 필요 없습니다.
// ─────────────────────────────────────────────────────────────────────────────

// 유틸: 이미지 File → base64 문자열
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function UploadPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [mode] = useState(location.state?.mode || 'found');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageAnalyzing, setIsImageAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    keywords: '',
    location: '',
    time: '',
  });

  // 습득물 모드 진입 시 카메라 자동 실행
  useEffect(() => {
    if (mode === 'found') {
      const timer = setTimeout(() => fileInputRef.current?.click(), 100);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  // 사진 선택/촬영 후 처리
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    setAnalyzeError('');
    setIsImageAnalyzing(true);

    try {
      // 위치·시간 및 AI 분석을 병렬로 실행해서 대기 시간 최소화
      const base64 = await fileToBase64(file);
      const [locationTime, aiResult] = await Promise.all([
        getMockLocationAndTime(),                        // 🔄 실제 연동 시 itemApi.js에서 교체
        analyzeImage(base64, file.type || 'image/jpeg'), // 🔄 실제 연동 시 itemApi.js에서 교체
      ]);

      setFormData(prev => ({
        ...prev,
        time:     locationTime.datetime,
        location: locationTime.location,
        content:  aiResult.description || prev.content,
        // lost 모드에서만 제목·키워드 자동 입력
        title:    mode === 'lost' ? (aiResult.title    || prev.title)    : prev.title,
        keywords: mode === 'lost' ? (aiResult.keywords || prev.keywords) : prev.keywords,
      }));
    } catch (err) {
      setAnalyzeError(`자동 분석 실패: ${err.message} — 직접 입력해 주세요.`);
    } finally {
      setIsImageAnalyzing(false);
    }
  };

  const isFormValid = () => {
    if (mode === 'found') return selectedImage && formData.content.trim();
    return formData.title.trim() && formData.content.trim() && formData.keywords.trim();
  };

  const handleSubmit = async () => {
    if (!isFormValid() || isSubmitting || isImageAnalyzing) return;
    setIsSubmitting(true);
    try {
      if (mode === 'found') {
        const response = await itemApi.registerFoundItem({
          description:    formData.content,
          found_location: formData.location,
          found_time:     formData.time,
          image:          selectedImage,
        });
        alert('습득물이 성공적으로 등록되었습니다.');
        navigate('/postdetail', {
          state: { postId: response.found_item_id, isAuthor: true, isFromUpload: true },
        });
      } else {
        const registerResponse = await itemApi.registerLostItem({
          title:         formData.title,
          description:   formData.content,
          keywords:      formData.keywords.split(',').map(k => k.trim()),
          lost_location: formData.location,
          lost_time:     formData.time,
          image:         selectedImage,
        });
        const searchResults = await itemApi.getSimilarFoundItems(registerResponse.lost_item_id);
        navigate('/searchresult', {
          state: { results: searchResults, lostItemId: registerResponse.lost_item_id },
        });
      }
    } catch {
      alert('서버 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || isImageAnalyzing;

  return (
    <Layout>
      {/* capture="environment" → 모바일에서 후면 카메라 바로 실행 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture={mode === 'found' ? 'environment' : undefined}
        className="hidden"
      />

      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100 bg-white">
        <button onClick={() => navigate(-1)} className="p-1" disabled={isDisabled}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          disabled={!isFormValid() || isDisabled}
          onClick={handleSubmit}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
            !isFormValid() || isDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-primary text-white active:scale-[0.98] shadow-sm hover:brightness-95'
          }`}
        >
          {isSubmitting
            ? (mode === 'found' ? '등록 중...' : '검색 중...')
            : (mode === 'found' ? '등록 완료' : '검색하기')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-white pb-24">
        <h2 className="text-center text-gray-400 text-sm font-medium">
          {mode === 'found' ? '습득물 등록하기' : '분실물 찾기'}
        </h2>

        {/* 이미지 영역 */}
        <div
          onClick={() => !isDisabled && fileInputRef.current?.click()}
          className={`w-full aspect-video bg-gray-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden transition-colors ${
            isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-100'
          }`}
        >
          {selectedImage ? (
            <img src={selectedImage} alt="선택된 사진" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 font-bold text-sm">
              {mode === 'found' ? '사진 첨부 (필수)' : '참고 사진 첨부 (선택)'}
            </span>
          )}
        </div>

        {/* AI 분석 상태 */}
        {isImageAnalyzing && (
          <div className="flex items-center gap-2 text-sm text-primary font-medium px-1">
            <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
            사진을 분석하는 중... 잠시만 기다려 주세요.
          </div>
        )}
        {analyzeError && (
          <p className="text-xs text-red-400 px-1">{analyzeError}</p>
        )}

        {/* 폼 */}
        <div className="space-y-4">
          {mode === 'lost' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 pl-1">제목 (필수)</label>
              <input
                type="text"
                placeholder="물품 제목을 입력하세요"
                disabled={isDisabled}
                className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border border-gray-100 focus:border-primary focus:bg-white transition-all"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 pl-1">상세 내용 (필수)</label>
            <textarea
              placeholder="물품에 대한 상세 설명을 입력하세요"
              disabled={isDisabled}
              className="w-full h-32 p-4 bg-gray-50 rounded-xl outline-none resize-none text-sm border border-gray-100 focus:border-primary focus:bg-white transition-all"
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          {mode === 'lost' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 pl-1">특징 키워드 (쉼표 구분, 필수)</label>
              <input
                type="text"
                placeholder="종류, 색상, 모양 등"
                disabled={isDisabled}
                className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border border-gray-100 focus:border-primary focus:bg-white transition-all"
                value={formData.keywords}
                onChange={e => setFormData({ ...formData, keywords: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 pl-1">
              {mode === 'found' ? '습득 장소 (선택)' : '분실 예상 장소 (선택)'}
            </label>
            <input
              type="text"
              placeholder="예: 충남대 정문 앞 커피숍"
              disabled={isDisabled}
              className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border border-gray-100 focus:border-primary focus:bg-white transition-all"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 pl-1">
              {mode === 'found' ? '습득 시간 (선택)' : '분실 예상 시간 (선택)'}
            </label>
            <input
              type="text"
              placeholder="예: 2026-05-19 14:30"
              disabled={isDisabled}
              className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm border border-gray-100 focus:border-primary focus:bg-white transition-all"
              value={formData.time}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default UploadPage;

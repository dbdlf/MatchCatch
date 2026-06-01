import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { itemApi, analyzeImage, getMockLocationAndTime } from '../api';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 포커스 상태에 따른 폼 행 스타일
const FormRow = ({ label, required, focused, children }) => (
  <div className={`px-4 py-4 transition-colors ${focused ? 'bg-primary/[0.025]' : ''}`}>
    <label className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${focused ? 'text-primary' : 'text-gray-400'}`}>
      {label}
      {required && <span className="ml-1 text-primary">*</span>}
    </label>
    {children}
  </div>
);

function UploadPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [mode] = useState(location.state?.mode || 'found');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageAnalyzing, setIsImageAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    keywords: '',
    location: '',
    time: '',
  });

  useEffect(() => {
    const capturedFile = location.state?.capturedFile;
    if (capturedFile) processFile(capturedFile);
  }, []);

  const processFile = async (file) => {
    setSelectedImage(URL.createObjectURL(file));
    setAnalyzeError('');
    setIsImageAnalyzing(true);
    try {
      const base64 = await fileToBase64(file);
      const [locationTime, aiResult] = await Promise.all([
        getMockLocationAndTime(),
        analyzeImage(base64, file.type || 'image/jpeg'),
      ]);
      setFormData(prev => ({
        ...prev,
        time:     locationTime.datetime,
        location: locationTime.location,
        content:  aiResult.description || prev.content,
        title:    mode === 'lost' ? (aiResult.title    || prev.title)    : prev.title,
        keywords: mode === 'lost' ? (aiResult.keywords || prev.keywords) : prev.keywords,
      }));
    } catch (err) {
      setAnalyzeError(`자동 분석 실패: ${err.message} — 직접 입력해 주세요.`);
    } finally {
      setIsImageAnalyzing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
        <button
          onClick={() => navigate(-1)}
          disabled={isDisabled}
          className="p-2 -ml-2 rounded-xl disabled:opacity-40 active:scale-95 transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-sm font-black text-gray-900">
            {mode === 'found' ? '습득물 등록' : '분실물 찾기'}
          </span>
          <div className="flex gap-1 mt-1">
            <div className={`h-0.5 w-8 rounded-full ${mode === 'found' ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`h-0.5 w-8 rounded-full ${mode === 'lost' ? 'bg-primary' : 'bg-gray-200'}`} />
          </div>
        </div>

        <button
          disabled={!isFormValid() || isDisabled}
          onClick={handleSubmit}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all active:scale-95 ${
            !isFormValid() || isDisabled
              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary to-primary-light text-white shadow-sm shadow-primary/25'
          }`}
        >
          {isSubmitting
            ? (mode === 'found' ? '등록 중...' : '검색 중...')
            : (mode === 'found' ? '등록 완료' : '검색하기')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-gray-50 pb-24">

        {/* 이미지 업로드 영역 */}
        <div
          onClick={() => !isDisabled && fileInputRef.current?.click()}
          className={`w-full aspect-video rounded-2xl overflow-hidden transition-all active:scale-[0.99] ${
            isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
          } ${
            selectedImage
              ? 'shadow-md'
              : 'border-2 border-dashed bg-white shadow-sm'
          } ${
            !selectedImage && focusedField === null
              ? 'border-gray-200'
              : !selectedImage ? 'border-primary/30' : ''
          }`}
        >
          {selectedImage ? (
            <div className="relative w-full h-full">
              <img src={selectedImage} alt="선택된 사진" className="w-full h-full object-cover" />
              {!isDisabled && (
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <span className="text-white text-xs font-bold bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full">
                    탭하여 사진 변경
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#464BAA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <p className="text-gray-400 text-xs font-semibold">
                {mode === 'found' ? '사진 첨부 (필수)' : '참고 사진 첨부 (선택)'}
              </p>
            </div>
          )}
        </div>

        {/* AI 분석 중 */}
        {isImageAnalyzing && (
          <div className="flex items-center gap-3 bg-primary/5 border border-primary/10 rounded-2xl px-4 py-3.5">
            <svg className="animate-spin w-4 h-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
            </svg>
            <div>
              <p className="text-primary text-xs font-bold">AI가 사진을 분석하는 중...</p>
              <p className="text-primary/60 text-[10px] font-medium mt-0.5">잠시만 기다려 주세요</p>
            </div>
          </div>
        )}

        {analyzeError && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-2xl px-4 py-3.5">
            <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className="text-red-400 text-xs font-medium">{analyzeError}</p>
          </div>
        )}

        {/* 폼 카드 — 각 행에 포커스 효과 */}
        <div
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
        >
          {/* 좌측 컬러 바 (포커스 시 나타남) */}
          <div className="divide-y divide-gray-50">

            {mode === 'lost' && (
              <FormRow label="제목" required focused={focusedField === 'title'}>
                <input
                  type="text"
                  placeholder="물품 제목을 입력하세요"
                  disabled={isDisabled}
                  className="w-full mt-1.5 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-300 disabled:opacity-50"
                  value={formData.title}
                  onFocus={() => setFocusedField('title')}
                  onBlur={() => setFocusedField(null)}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </FormRow>
            )}

            <FormRow label="상세 내용" required focused={focusedField === 'content'}>
              <textarea
                placeholder="물품에 대한 상세 설명을 입력하세요"
                disabled={isDisabled}
                className="w-full mt-1.5 h-24 bg-transparent outline-none resize-none text-sm text-gray-800 placeholder:text-gray-300 disabled:opacity-50"
                value={formData.content}
                onFocus={() => setFocusedField('content')}
                onBlur={() => setFocusedField(null)}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
              />
            </FormRow>

            {mode === 'lost' && (
              <FormRow label="키워드 · 쉼표로 구분" required focused={focusedField === 'keywords'}>
                <input
                  type="text"
                  placeholder="예: 지갑, 검정, 가죽"
                  disabled={isDisabled}
                  className="w-full mt-1.5 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-300 disabled:opacity-50"
                  value={formData.keywords}
                  onFocus={() => setFocusedField('keywords')}
                  onBlur={() => setFocusedField(null)}
                  onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                />
              </FormRow>
            )}

            <FormRow
              label={mode === 'found' ? '습득 장소 · 선택' : '분실 예상 장소 · 선택'}
              focused={focusedField === 'location'}
            >
              <input
                type="text"
                placeholder="예: 충남대 정문 앞 커피숍"
                disabled={isDisabled}
                className="w-full mt-1.5 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-300 disabled:opacity-50"
                value={formData.location}
                onFocus={() => setFocusedField('location')}
                onBlur={() => setFocusedField(null)}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
            </FormRow>

            <FormRow
              label={mode === 'found' ? '습득 시간 · 선택' : '분실 예상 시간 · 선택'}
              focused={focusedField === 'time'}
            >
              <input
                type="text"
                placeholder="예: 2026-05-19 14:30"
                disabled={isDisabled}
                className="w-full mt-1.5 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-300 disabled:opacity-50"
                value={formData.time}
                onFocus={() => setFocusedField('time')}
                onBlur={() => setFocusedField(null)}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
              />
            </FormRow>

          </div>
        </div>

        {/* 하단 안내 */}
        {mode === 'found' && !selectedImage && (
          <p className="text-center text-[11px] text-gray-300 font-medium">
            사진을 먼저 업로드하면 AI가 자동으로 내용을 채워드려요
          </p>
        )}
      </div>
    </Layout>
  );
}

export default UploadPage;

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

  // 홈에서 카메라로 찍은 파일이 넘어온 경우 → 바로 분석 시작
  useEffect(() => {
    const capturedFile = location.state?.capturedFile;
    if (capturedFile) {
      processFile(capturedFile);
    }
    // lost 모드이고 파일 없으면 갤러리 열기
    else if (mode === 'lost') {
      // lost는 선택 사항이라 자동으로 열지 않음
    }
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
      {/* lost 모드 또는 사진 재선택용 input (capture 없음 → 갤러리) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
        <button onClick={() => navigate(-1)} className="p-1" disabled={isDisabled}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="text-sm font-bold text-gray-700">
          {mode === 'found' ? '습득물 등록' : '분실물 찾기'}
        </span>
        <button
          disabled={!isFormValid() || isDisabled}
          onClick={handleSubmit}
          className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
            !isFormValid() || isDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary to-primary-light text-white active:scale-[0.97] shadow-sm'
          }`}
        >
          {isSubmitting
            ? (mode === 'found' ? '등록 중...' : '검색 중...')
            : (mode === 'found' ? '등록 완료' : '검색하기')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-gray-50 pb-24">

        {/* 이미지 영역 */}
        <div
          onClick={() => !isDisabled && fileInputRef.current?.click()}
          className={`w-full aspect-video rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all ${
            isDisabled
              ? 'cursor-not-allowed opacity-60'
              : 'cursor-pointer'
          } ${
            selectedImage ? '' : 'border-2 border-dashed border-gray-200 bg-white'
          }`}
          style={selectedImage ? {} : { boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
        >
          {selectedImage ? (
            <div className="relative w-full h-full">
              <img src={selectedImage} alt="선택된 사진" className="w-full h-full object-cover" />
              {/* 재선택 오버레이 */}
              {!isDisabled && (
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center">
                  <span className="opacity-0 hover:opacity-100 text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-full transition-all">
                    사진 변경
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#464BAA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <p className="text-gray-400 text-sm font-medium">
                {mode === 'found' ? '사진 첨부 (필수)' : '참고 사진 첨부 (선택)'}
              </p>
            </div>
          )}
        </div>

        {/* AI 분석 상태 */}
        {isImageAnalyzing && (
          <div className="flex items-center gap-3 bg-primary/5 border border-primary/10 rounded-xl px-4 py-3">
            <svg className="animate-spin w-4 h-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
            <p className="text-primary text-xs font-semibold">AI가 사진을 분석하는 중...</p>
          </div>
        )}
        {analyzeError && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <p className="text-red-400 text-xs">{analyzeError}</p>
          </div>
        )}

        {/* 폼 카드 */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50"
          style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>

          {mode === 'lost' && (
            <div className="px-4 py-4">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">제목 · 필수</label>
              <input
                type="text"
                placeholder="물품 제목을 입력하세요"
                disabled={isDisabled}
                className="w-full mt-1.5 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-300"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          )}

          <div className="px-4 py-4">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">상세 내용 · 필수</label>
            <textarea
              placeholder="물품에 대한 상세 설명을 입력하세요"
              disabled={isDisabled}
              className="w-full mt-1.5 h-24 bg-transparent outline-none resize-none text-sm text-gray-800 placeholder:text-gray-300"
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          {mode === 'lost' && (
            <div className="px-4 py-4">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">키워드 · 필수 · 쉼표 구분</label>
              <input
                type="text"
                placeholder="예: 지갑, 검정, 가죽"
                disabled={isDisabled}
                className="w-full mt-1.5 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-300"
                value={formData.keywords}
                onChange={e => setFormData({ ...formData, keywords: e.target.value })}
              />
            </div>
          )}

          <div className="px-4 py-4">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {mode === 'found' ? '습득 장소' : '분실 예상 장소'} · 선택
            </label>
            <input
              type="text"
              placeholder="예: 충남대 정문 앞 커피숍"
              disabled={isDisabled}
              className="w-full mt-1.5 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-300"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="px-4 py-4">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {mode === 'found' ? '습득 시간' : '분실 예상 시간'} · 선택
            </label>
            <input
              type="text"
              placeholder="예: 2026-05-19 14:30"
              disabled={isDisabled}
              className="w-full mt-1.5 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-300"
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

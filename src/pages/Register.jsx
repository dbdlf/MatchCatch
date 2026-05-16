import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const RegisterPage = () => {
  const navigate = useNavigate();

  // 1. 입력값 상태 관리
  const [formData, setFormData] = useState({
    email: '',
    userId: '',
    password: '',
    confirmPassword: ''
  });

  // 2. 중복 확인 통과 여부 상태 관리
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false);

  // 입력창 수정 시 처리 (값을 바꾸면 중복 확인을 다시 하도록 false 처리)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email') setIsEmailChecked(false);
    if (name === 'userId') setIsIdChecked(false);
  };

  // 가상 이메일 중복 확인 함수
  const checkEmailDuplicate = () => {
    if (!formData.email.trim()) return alert('이메일을 입력해주세요.');
    
    // 단순 예시 시뮬레이션
    if (formData.email === 'chacha@daejeon.ac.kr') {
      alert('이미 등록된 이메일입니다.');
      setIsEmailChecked(false);
    } else {
      alert('사용 가능한 이메일입니다.');
      setIsEmailChecked(true);
    }
  };

  // 가상 아이디 중복 확인 함수
  const checkIdDuplicate = () => {
    if (!formData.userId.trim()) return alert('아이디를 입력해주세요.');
    
    if (formData.userId === 'chacha') {
      alert('이미 존재하는 아이디입니다.');
      setIsIdChecked(false);
    } else {
      alert('사용 가능한 아이디입니다.');
      setIsIdChecked(true);
    }
  };

  // 3. 가입하기 버튼 활성화 조건식
  const isFormValid = 
    formData.email.trim() &&
    formData.userId.trim() &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    isEmailChecked && 
    isIdChecked;      

  // 가입 버튼 클릭 시 처리
  const handleRegister = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    alert('회원가입이 완료되었습니다!');
    navigate('/'); // 성공 시 로그인(메인) 화면으로 이동
  };

  return (
    <Layout hideNav>
        {/* 입력 폼 영역 */}
        <div className="mt-6 space-y-6 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">회원가입</h1>
          
          {/* 이메일 입력 필드 + 중복확인 버튼 */}
          <div className="space-y-2">
            <label className="block text-gray-800 font-bold text-sm">Email</label>
            <div className="flex space-x-2">
              <input 
                name="email"
                className="flex-1 p-3.5 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-[#FFC107]" 
                type="text" 
                placeholder="example1234@email.com"
                value={formData.email}
                onChange={handleChange}
              />
              <button 
                type="button"
                onClick={checkEmailDuplicate}
                className={`px-3 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${isEmailChecked ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {isEmailChecked ? '확인 완료' : '중복 확인'}
              </button>
            </div>
          </div>

          {/* 아이디 입력 필드 + 중복확인 버튼 */}
          <div className="space-y-2">
            <label className="block text-gray-800 font-bold text-sm">아이디</label>
            <div className="flex space-x-2">
              <input 
                name="userId"
                className="flex-1 p-3.5 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-[#FFC107]" 
                type="text" 
                placeholder="사용할 아이디 입력"
                value={formData.userId}
                onChange={handleChange}
              />
              <button 
                type="button"
                onClick={checkIdDuplicate}
                className={`px-3 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${isIdChecked ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {isIdChecked ? '확인 완료' : '중복 확인'}
              </button>
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="space-y-2">
            <label className="block text-gray-800 font-bold text-sm">비밀번호</label>
            <input 
              name="password"
              className="w-full p-3.5 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-[#FFC107]" 
              type="password" 
              placeholder="비밀번호 입력"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* 비밀번호 확인 + 실시간 피드백 */}
          <div className="space-y-2">
            <label className="block text-gray-800 font-bold text-sm">비밀번호 확인</label>
            <input 
              name="confirmPassword"
              className="w-full p-3.5 border border-gray-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-[#FFC107]" 
              type="password" 
              placeholder="비밀번호 다시 입력"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            
            {/* 실시간 패스워드 일치 여부 시각화 피드백 */}
            {formData.confirmPassword && (
              formData.password === formData.confirmPassword ? (
                <p className="text-xs text-green-500 font-medium mt-1">✓ 비밀번호가 일치합니다.</p>
              ) : (
                <p className="text-xs text-red-500 font-medium mt-1">✗ 비밀번호가 일치하지 않습니다.</p>
              )
            )}
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="mt-8 mb-4">
          <button 
            disabled={!isFormValid}
            onClick={handleRegister}
            className={`w-full py-4 rounded-lg text-lg font-bold transition-all shadow-sm ${
              isFormValid 
                ? 'bg-[#FFDCA8] border border-gray-400 text-gray-800 active:scale-[0.98] hover:brightness-95 cursor-pointer' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed border-none'
            }`}
          >
            가입하기
          </button>
        </div>

    </Layout>
  );
};

export default RegisterPage;
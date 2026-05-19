import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const RegisterPage = () => {
  const navigate = useNavigate();

  // 1. 입력값 상태 관리 (email -> studentId로 변경)
  const [formData, setFormData] = useState({
    studentId: '', 
    userId: '',
    password: '',
    confirmPassword: ''
  });

  // 2. 중복 확인 통과 여부 상태 관리
  const [isStudentIdChecked, setIsStudentIdChecked] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false);

  // 입력창 수정 시 처리
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 💡 학번 입력란일 경우: 숫자가 아닌 모든 문자를 빈 문자열로 치환하여 숫자만 남김
    if (name === 'studentId') {
      const onlyNumbers = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: onlyNumbers });
      setIsStudentIdChecked(false); // 값이 바뀌면 중복확인 초기화
    } else {
      setFormData({ ...formData, [name]: value });
      if (name === 'userId') setIsIdChecked(false);
    }
  };

  // 가상 학번 중복 확인 함수
  const checkStudentIdDuplicate = () => {
    if (!formData.studentId.trim()) return alert('학번을 입력해주세요.');
    
    // 가상의 중복된 학번 예시 (예: 20261234)
    if (formData.studentId === '20261234') {
      alert('이미 가입된 학번입니다.');
      setIsStudentIdChecked(false);
    } else {
      alert('사용 가능한 학번입니다.');
      setIsStudentIdChecked(true);
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
    formData.studentId.trim() &&
    formData.userId.trim() &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    isStudentIdChecked && 
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
      <div className="flex-1 flex flex-col justify-between px-6 py-10 bg-white h-full overflow-y-auto">
        
        {/* 상단 폼 영역 묶음 */}
        <div className="space-y-6 mt-4">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">회원가입</h1>
          
          {/* 학번 입력 필드 + 중복확인 버튼 */}
          <div className="space-y-1.5">
            <label className="block text-gray-800 font-bold text-sm pl-1">학번</label>
            <div className="flex space-x-2">
              <input 
                name="studentId"
                inputMode="numeric"
                className="flex-1 p-4 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-[#FFC107] transition-all" 
                type="text" 
                placeholder="학번 (숫자만 입력)"
                value={formData.studentId}
                onChange={handleChange}
              />
              <button 
                type="button"
                onClick={checkStudentIdDuplicate}
                className={`px-4 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${isStudentIdChecked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'}`}
              >
                {isStudentIdChecked ? '확인 완료' : '중복 확인'}
              </button>
            </div>
          </div>

          {/* 아이디 입력 필드 + 중복확인 버튼 */}
          <div className="space-y-1.5">
            <label className="block text-gray-800 font-bold text-sm pl-1">아이디</label>
            <div className="flex space-x-2">
              <input 
                name="userId"
                className="flex-1 p-4 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-[#FFC107] transition-all" 
                type="text" 
                placeholder="사용할 아이디 입력"
                value={formData.userId}
                onChange={handleChange}
              />
              <button 
                type="button"
                onClick={checkIdDuplicate}
                className={`px-4 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${isIdChecked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'}`}
              >
                {isIdChecked ? '확인 완료' : '중복 확인'}
              </button>
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="space-y-1.5">
            <label className="block text-gray-800 font-bold text-sm pl-1">비밀번호</label>
            <input 
              name="password"
              className="w-full p-4 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-[#FFC107] transition-all" 
              type="password" 
              placeholder="비밀번호 입력"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* 비밀번호 확인 + 실시간 피드백 */}
          <div className="space-y-1.5">
            <label className="block text-gray-800 font-bold text-sm pl-1">비밀번호 확인</label>
            <input 
              name="confirmPassword"
              className="w-full p-4 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-[#FFC107] transition-all" 
              type="password" 
              placeholder="비밀번호 다시 입력"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            
            {/* 실시간 패스워드 일치 여부 시각화 피드백 */}
            {formData.confirmPassword && (
              formData.password === formData.confirmPassword ? (
                <p className="text-xs text-green-500 font-medium mt-1 pl-1">✓ 비밀번호가 일치합니다.</p>
              ) : (
                <p className="text-xs text-red-500 font-medium mt-1 pl-1">✗ 비밀번호가 일치하지 않습니다.</p>
              )
            )}
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="w-full mt-8 mb-2">
          <button 
            disabled={!isFormValid}
            onClick={handleRegister}
            className={`w-full py-4 rounded-xl text-base font-bold transition-all shadow-sm ${
              isFormValid 
                ? 'bg-[#FFC107] text-gray-900 active:scale-[0.98] hover:brightness-95 cursor-pointer' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            가입하기
          </button>
        </div>

      </div>
    </Layout>
  );
};

export default RegisterPage;
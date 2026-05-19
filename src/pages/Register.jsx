import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { authApi } from '../api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    studentId: '', 
    userId: '',
    password: '',
    confirmPassword: ''
  });

  const [isStudentIdChecked, setIsStudentIdChecked] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'studentId') {
      const onlyNumbers = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: onlyNumbers });
      setIsStudentIdChecked(false);
    } else {
      setFormData({ ...formData, [name]: value });
      if (name === 'userId') setIsIdChecked(false);
    }
  };

  const checkStudentIdDuplicate = () => {
    if (!formData.studentId.trim()) return alert('학번을 입력해주세요.');
    if (formData.studentId === '20261234') {
      alert('이미 가입된 학번입니다.');
      setIsStudentIdChecked(false);
    } else {
      alert('사용 가능한 학번입니다.');
      setIsStudentIdChecked(true);
    }
  };

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

  const isFormValid = 
    formData.studentId.trim() &&
    formData.userId.trim() &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    isStudentIdChecked && 
    isIdChecked;      

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    try {
      setIsLoading(true); // 로딩 시작
      
      // 가상 API 호출
      await authApi.register(formData);
      
      alert('회원가입이 완료되었습니다!');
      navigate('/'); // 성공 시 로그인 화면으로 이동
    } catch (error) {
      alert('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <Layout hideNav>
      <div className="flex-1 flex flex-col justify-between px-6 py-10 bg-white h-full overflow-y-auto">
        
        <div className="space-y-6 mt-4">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">회원가입</h1>
          
          <div className="space-y-1.5">
            <label className="block text-gray-800 font-bold text-sm pl-1">학번</label>
            <div className="flex space-x-2">
              <input 
                name="studentId"
                inputMode="numeric"
                className="flex-1 p-4 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-[#FFC107] transition-all" 
                type="text" 
                placeholder="학번"
                value={formData.studentId}
                onChange={handleChange}
                disabled={isLoading}
              />
              <button 
                type="button"
                onClick={checkStudentIdDuplicate}
                disabled={isLoading}
                className={`px-4 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${isStudentIdChecked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'}`}
              >
                {isStudentIdChecked ? '확인 완료' : '중복 확인'}
              </button>
            </div>
          </div>

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
                disabled={isLoading}
              />
              <button 
                type="button"
                onClick={checkIdDuplicate}
                disabled={isLoading}
                className={`px-4 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${isIdChecked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'}`}
              >
                {isIdChecked ? '확인 완료' : '중복 확인'}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-gray-800 font-bold text-sm pl-1">비밀번호</label>
            <input 
              name="password"
              className="w-full p-4 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-[#FFC107] transition-all" 
              type="password" 
              placeholder="비밀번호 입력"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-gray-800 font-bold text-sm pl-1">비밀번호 확인</label>
            <input 
              name="confirmPassword"
              className="w-full p-4 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-[#FFC107] transition-all" 
              type="password" 
              placeholder="비밀번호 다시 입력"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
            
            {formData.confirmPassword && (
              formData.password === formData.confirmPassword ? (
                <p className="text-xs text-green-500 font-medium mt-1 pl-1">✓ 비밀번호가 일치합니다.</p>
              ) : (
                <p className="text-xs text-red-500 font-medium mt-1 pl-1">✗ 비밀번호가 일치하지 않습니다.</p>
              )
            )}
          </div>
        </div>

        <div className="w-full mt-8 mb-2">
          <button 
            disabled={!isFormValid || isLoading}
            onClick={handleRegister}
            className={`w-full py-4 rounded-xl text-base font-bold transition-all shadow-sm ${
              !isFormValid || isLoading 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-[#FFC107] text-gray-900 active:scale-[0.98] hover:brightness-95'
            }`}
          >
            {isLoading ? '가입 처리 중...' : '가입하기'}
          </button>
        </div>

      </div>
    </Layout>
  );
};

export default RegisterPage;
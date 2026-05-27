import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { authApi } from '../api'; 

const LoginPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (userId.trim() === '' || password.trim() === '') {
      return alert('아이디와 비밀번호를 모두 입력해주세요!');
    } 

    try {
      setIsLoading(true); // 로딩 시작
      
      // 가상 API 호출
      const response = await authApi.login(userId, password);
      
      if (response.success) {
        navigate('/home');
      }
    } catch (error) {
      alert(error.message); // 에러 메시지 띄우기
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <Layout hideNav>
      <div className="flex-1 flex flex-col justify-between px-6 py-10 bg-white h-full overflow-y-auto">
        <div className="space-y-10 mt-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold inline-block">
              <span className="bg-gradient-to-r from-[#464BAA] to-[#7B8FE0] text-transparent bg-clip-text">
                Match Catch!!
              </span>
            </h1>
          </div>

          <div className="w-full space-y-5">
            <div className="space-y-1.5">
              <label className="block text-gray-700 font-bold text-sm pl-1">아이디</label>
              <input 
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFC107] outline-none text-sm transition-all" 
                type="text" 
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder=""
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-gray-700 font-bold text-sm pl-1">비밀번호</label>
              <input 
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFC107] outline-none text-sm transition-all" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="w-full space-y-4 mb-2">
          <button 
            onClick={handleLogin} 
            disabled={isLoading}
            className={`w-full py-4 rounded-[28px] text-base font-bold transition-all shadow-sm ${
              isLoading 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#464BAA] to-[#7B8FE0] text-white active:scale-[0.98] hover:brightness-95'
            }`}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>

          <div className="text-center">
            <Link to="/register" className="text-xs text-gray-500 underline underline-offset-4 hover:text-gray-700 inline-block p-2">
              아직 회원이 아니신가요?
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';

const LoginPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (userId.trim() === '' || password.trim() === '') {
      alert('아이디와 비밀번호를 모두 입력해주세요!');
    } else {
      navigate('/home');
    }
  };

  return (
    <Layout hideNav>
    
      <div className="flex-1 flex flex-col justify-between px-6 py-10 bg-white h-full overflow-y-auto">
        
        {/* 1. 상단 콘텐츠 묶음 (로고 + 입력 필드들) */}
        <div className="space-y-10 mt-4">
          
          {/* 타이틀 로고 */}
          <h1 className="text-4xl font-extrabold text-center tracking-tight">
            <span className="text-[#FF8C69]">Match</span> <span className="text-[#FFC107]">Catch!!</span>
          </h1>

          {/* 입력창 구역 */}
          <div className="w-full space-y-5">
            {/* 아이디 */}
            <div className="space-y-1.5">
              <label className="block text-gray-700 font-bold text-sm pl-1">아이디</label>
              <input 
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFC107] outline-none text-sm transition-all" 
                type="text" 
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="example1234"
              />
            </div>

            {/* 비밀번호 */}
            <div className="space-y-1.5">
              <label className="block text-gray-700 font-bold text-sm pl-1">비밀번호</label>
              <input 
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FFC107] outline-none text-sm transition-all" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="****"
              />
            </div>
          </div>
        </div>

        {/* 2. 하단 콘텐츠 묶음 (로그인 버튼 + 회원가입 링크) */}
        <div className="w-full space-y-4 mb-2">
          <button 
            onClick={handleLogin} 
            className="w-full bg-[#FFC107] text-gray-900 py-4 rounded-xl text-base font-bold active:scale-[0.98] transition-all shadow-sm hover:brightness-95"
          >
            로그인
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
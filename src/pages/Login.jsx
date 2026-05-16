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
        <h1 className="text-5xl font-bold mb-20 text-center">
          <span className="text-[#FF8C69]">Match</span> <span className="text-[#FFC107]">Catch!!</span>
        </h1>

        <div className="w-full space-y-6">
          <div className="space-y-2">
            <label className="block text-gray-700 text-lg">아이디</label>
            <input 
              className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFC107] outline-none" 
              type="text" 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="example1234"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 text-lg">비밀번호</label>
            <input 
              className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFC107] outline-none" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="****"
            />
          </div>

          <button 
            onClick={handleLogin} 
            className="w-full bg-[#FFC107] text-gray-800 p-4 rounded-lg text-lg font-semibold active:scale-95 transition-all"
          >
            로그인
          </button>
        </div>

        <div className="mt-8 text-center">
          <Link to="/register" className="text-gray-600 underline p-2">
            아직 회원이 아니신가요?
          </Link>
        </div>
    </Layout>
  );
};

export default LoginPage;
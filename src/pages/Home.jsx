import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Layout from '../components/Layout';

const HomePage = () => {
  const navigate = useNavigate();

  const handleUpload = (mode) => {
    navigate('/upload', { state: { mode: mode } });
  };

  return (
    <Layout>
      
        {/* 상단 로고 영역 */}
        <div className="flex-1 flex flex-col items-center justify-start pt-32">
          <h1 className="text-4xl font-bold inline-block">
            <span className="bg-gradient-to-r from-primary to-primary-light text-transparent bg-clip-text">
              Match Catch!!
            </span>
          </h1>
        </div>

        {/* 중앙 게시판 버튼 영역 */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 px-6 pb-[100px]">
          {/* 습득물 등록: 'found' 모드로 이동 */}
          <button 
            onClick={() => handleUpload('found')}
            className="w-full bg-primary border border-gray-600 text-black py-8 rounded-md text-xl font-medium hover:bg-primary-dark transition-colors shadow-sm">
            습득물 등록
          </button>
          
          {/* 분실물 검색: 'lost' 모드로 이동 */}
          <button 
            onClick={() => handleUpload('lost')}
            className="w-full bg-primary border border-gray-600 text-black py-8 rounded-md text-xl font-medium hover:bg-primary-dark transition-colors shadow-sm">
            분실물 검색
          </button>
        </div>

    </Layout>
  );
};

export default HomePage;
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const isActive = (path) => location.pathname === path;

  return (
    <div className="absolute bottom-0 left-0 w-full h-[80px] bg-white border-t border-gray-100 flex justify-around items-center z-50">
      
      {/* 홈 버튼 */}
      <button 
        onClick={() => navigate('/home')} 
        className="flex flex-col items-center justify-center w-16 h-16 transition-all active:scale-95"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isActive('/home') ? "#FFD18F" : "#9CA3AF"} strokeWidth="2.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        </svg>
        <span className={`text-[11px] mt-1.5 ${isActive('/home') ? 'text-[#FFD18F] font-bold' : 'text-gray-400 font-medium'}`}>
          홈
        </span>
      </button>

      {/* 채팅 버튼 */}
      <button 
        onClick={() => navigate('/chatlist')} 
        className="flex flex-col items-center justify-center w-16 h-16 transition-all active:scale-95"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isActive('/chatlist') ? "#FFD18F" : "#9CA3AF"} strokeWidth="2.5">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
        <span className={`text-[11px] mt-1.5 ${isActive('/chat') ? 'text-[#FFD18F] font-bold' : 'text-gray-400 font-medium'}`}>
          채팅
        </span>
      </button>

      {/* 프로필 버튼 */}
      <button 
        onClick={() => navigate('/profile', {
          state: { 
            isOwnProfile: true,
            userId: "차차"
          }
        })} 
        className="flex flex-col items-center justify-center w-16 h-16 transition-all active:scale-95"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isActive('/profile') ? "#FFD18F" : "#9CA3AF"} strokeWidth="2.5">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        <span className={`text-[11px] mt-1.5 ${isActive('/profile') ? 'text-[#FFD18F] font-bold' : 'text-gray-400 font-medium'}`}>
          프로필
        </span>
      </button>

    </div>
  );
};

export default BottomNav;
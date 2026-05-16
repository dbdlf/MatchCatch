import React from 'react';
import BottomNav from './BottomNav';

const Layout = ({ children }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
      
      <div className="w-[412px] h-[917px] bg-white rounded-2xl shadow-xl flex flex-col relative overflow-hidden font-['Inter']">
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>

        <BottomNav />
        
      </div>
    </div>
  );
};

export default Layout;
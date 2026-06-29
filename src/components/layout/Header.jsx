import React from 'react';
import { useLocation } from 'react-router-dom';
import { usePlatform } from '../../context/PlatformContext';

const Header = () => {
  const { user } = usePlatform();
  const location = useLocation();

  // Get Page Title from path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Decision Control Dashboard';
      case '/processing':
        return 'Agent Pipeline Execution';
      case '/results':
        return 'Recommendation & Analysis Results';
      case '/evaluation':
        return 'Platform Evaluation Summary';
      default:
        return 'Agentic Decision Intelligence Platform';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
          {getPageTitle()}
        </h2>
      </div>

      {/* Profile Card */}
      {user && (
        <div className="flex items-center gap-2.5 pl-4">
          <div className="h-8 w-8 rounded-lg bg-blue-600/10 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-100">
            {user.avatar}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-slate-800 leading-tight">{user.name}</div>
            <div className="text-[10px] text-slate-400 font-semibold leading-none mt-0.5">{user.email}</div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Bell, 
  Search 
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

const Header = () => {
  const { user, flows } = usePlatform();
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

  // Compute live pipeline statistics
  const activeFlowsCount = flows.filter(f => f.status === 'processing').length;
  const pendingApprovalsCount = flows.filter(f => f.status === 'pending_approval').length;

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
          {getPageTitle()}
        </h2>
      </div>

      {/* Metrics & Actions */}
      <div className="flex items-center gap-6">


        {/* Global Search Mock */}
        <div className="relative w-48 xl:w-64 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search flows, logs, nodes..." 
            className="w-full text-xs pl-9 pr-3 py-1.75 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-700 placeholder-slate-400"
            disabled
          />
        </div>

        <div className="flex items-center gap-2.5">
          <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors relative" title="Notifications">
            <Bell className="h-5 w-5" />
            {(activeFlowsCount > 0 || pendingApprovalsCount > 0) && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-blue-600 rounded-full border border-white"></span>
            )}
          </button>
        </div>

        {/* Profile Card */}
        {user && (
          <div className="flex items-center gap-2.5 border-l border-slate-100 pl-4">
            <div className="h-8 w-8 rounded-lg bg-blue-600/10 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-100">
              {user.avatar}
            </div>
            <div className="text-left hidden xl:block">
              <div className="text-xs font-bold text-slate-800 leading-tight">{user.name}</div>
              <div className="text-[10px] text-slate-400 font-semibold leading-none mt-0.5">{user.email}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

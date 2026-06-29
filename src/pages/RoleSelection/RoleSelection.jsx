import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Eye, 
  Award, 
  Shield, 
  BrainCircuit, 
  ArrowRight,
  UserCheck,
  HeartHandshake,
  TrendingUp
} from 'lucide-react';
import { usePlatform, ROLES } from '../../context/PlatformContext';

const RoleIcon = ({ name, className }) => {
  switch (name) {
    case 'HeartHandshake':
      return <HeartHandshake className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'Brain':
      return <Brain className={className} />;
    case 'Eye':
      return <Eye className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    default:
      return <BrainCircuit className={className} />;
  }
};

const RoleSelection = () => {
  const { user, selectRole } = usePlatform();
  const navigate = useNavigate();

  const handleRoleSelect = (roleId) => {
    selectRole(roleId);
    navigate('/dashboard');
  };

  // Color mappings for roles
  const colors = {
    blue: {
      border: 'hover:border-blue-500/80',
      bg: 'bg-blue-500/10 text-blue-600',
      text: 'text-blue-700',
      pill: 'bg-blue-500'
    },
    indigo: {
      border: 'hover:border-indigo-500/80',
      bg: 'bg-indigo-500/10 text-indigo-600',
      text: 'text-indigo-700',
      pill: 'bg-indigo-500'
    },
    sky: {
      border: 'hover:border-sky-500/80',
      bg: 'bg-sky-500/10 text-sky-600',
      text: 'text-sky-700',
      pill: 'bg-sky-500'
    },
    slate: {
      border: 'hover:border-slate-500/80',
      bg: 'bg-slate-500/10 text-slate-600',
      text: 'text-slate-700',
      pill: 'bg-slate-500'
    }
  };

  return (
    <div className="max-w-[1050px] mx-auto w-full px-4 py-2 flex flex-col justify-start items-center gap-4 box-border text-slate-700 text-center">
      {/* Top logo & platform label */}
      <div className="flex items-center gap-2 justify-center mb-1 w-full relative">
        <div className="flex items-center gap-2 mx-auto">
          <div className="p-1.5 bg-blue-600 rounded-lg text-white shrink-0">
            <BrainCircuit className="h-4.5 w-4.5" />
          </div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50/70 border border-blue-100/50 px-2 py-0.5 rounded">
            Identity Authorization Clearances
          </span>
        </div>
        {user && (
          <div className="absolute right-0 hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-semibold shrink-0">
            <UserCheck className="h-3 w-3 text-emerald-500" />
            <span>Active: <strong className="text-slate-900">{user.name}</strong></span>
          </div>
        )}
      </div>

      {/* Heading & Description */}
      <div className="space-y-1.5 flex flex-col items-center">
        <h2 className="text-[30px] sm:text-[34px] md:text-[38px] font-bold text-slate-900 tracking-tight leading-[1.1] max-w-[700px] text-center">
          Select Your Access Persona
        </h2>
        <p className="text-[15px] sm:text-[16px] text-slate-500 font-light max-w-[650px] text-center leading-[1.4] mt-0.5">
          Choose a dashboard role to customize the platform interfaces, security clearances, and command centers.
        </p>
      </div>

      {/* Roles Cards Centered Flex Group */}
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 mt-2 w-full">
        {Object.values(ROLES).map((role) => {
          const style = colors[role.color] || colors.slate;
          return (
            <div 
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={`
                cursor-pointer bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs 
                transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                flex flex-col justify-between gap-6 group relative overflow-hidden h-full box-border
                w-full md:w-[440px] h-[270px] shrink-0 text-left
                ${style.border}
              `}
            >
              {/* Active hover overlay */}
              <div className={`absolute top-0 left-0 w-1.5 h-full ${style.pill}`}></div>

              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <div className={`p-2 rounded-lg ${style.bg}`}>
                    <RoleIcon name={role.icon} className="h-5 w-5" />
                  </div>
                  <span className="text-[12px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded border border-slate-100/50">
                    Clearance: {role.clearance || 'L2'}
                  </span>
                </div>

                <h3 className="text-[22px] md:text-[24px] font-bold text-slate-950 mt-1 group-hover:text-blue-600 transition-colors leading-tight">
                  {role.name}
                </h3>
                <p className="text-[14.5px] text-slate-500 leading-normal line-clamp-2">
                  {role.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[14px] md:text-[15px] font-semibold text-slate-500 group-hover:text-blue-600 transition-colors pt-2.5 border-t border-slate-100">
                <span>Enter console</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-[10px] text-slate-400 mt-4 pt-2 border-t border-slate-100 w-full text-center">
        Agentic Decision Platform • Session expires in 8 hours • Secure Socket IP: 192.168.10.15
      </div>
    </div>
  );
};

export default RoleSelection;

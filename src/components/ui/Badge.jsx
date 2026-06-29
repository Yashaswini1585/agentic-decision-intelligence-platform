import React from 'react';

const Badge = ({ 
  children, 
  variant = 'slate', 
  pulse = false, 
  className = '',
  ...props 
}) => {
  const baseStyle = "inline-flex items-center gap-1 py-0.5 px-2 text-[10px] font-semibold tracking-wider uppercase rounded-md border transition-all duration-200";
  
  const variants = {
    blue: "bg-blue-50/60 text-blue-700 border-blue-200/50",
    indigo: "bg-indigo-50/60 text-indigo-700 border-indigo-200/50",
    sky: "bg-sky-50/60 text-sky-700 border-sky-200/50",
    emerald: "bg-emerald-50/60 text-emerald-700 border-emerald-200/50",
    amber: "bg-amber-50/60 text-amber-700 border-amber-200/50",
    red: "bg-red-50/60 text-red-700 border-red-200/50",
    slate: "bg-slate-50 text-slate-600 border-slate-200/50"
  };

  const pulseColors = {
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    sky: "bg-sky-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    slate: "bg-slate-500"
  };

  return (
    <span 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColors[variant]}`}></span>
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${pulseColors[variant]}`}></span>
        </span>
      )}
      {children}
    </span>
  );
};

export default Badge;

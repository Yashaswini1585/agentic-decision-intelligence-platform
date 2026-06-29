import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hoverable = false,
  ...props 
}) => {
  return (
    <div 
      className={`
        bg-white border border-slate-200/50 rounded-xl 
        shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_12px_-3px_rgba(0,0,0,0.015)] 
        p-6 transition-all duration-300 ease-out
        ${hoverable ? 'hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.06),0_6px_10px_-6px_rgba(0,0,0,0.03)] hover:border-slate-350 hover:-translate-y-0.5' : ''} 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', border = false }) => (
  <div className={`flex flex-col space-y-1 pb-3 ${border ? 'border-b border-slate-100' : ''} ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-base font-semibold text-slate-900 tracking-tight leading-normal ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-xs text-slate-400 mt-0.5 leading-normal ${className}`}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`pt-2 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', border = false }) => (
  <div className={`flex items-center pt-4 ${border ? 'border-t border-slate-100 mt-4' : 'mt-2'} ${className}`}>
    {children}
  </div>
);

export default Card;

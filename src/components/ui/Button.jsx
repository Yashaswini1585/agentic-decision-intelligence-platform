import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_rgba(37,99,235,0.15)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.22)] focus:ring-blue-500",
    secondary: "bg-slate-100 hover:bg-slate-200/80 text-slate-700 shadow-xs focus:ring-slate-500",
    outline: "border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs focus:ring-blue-500",
    danger: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-sm focus:ring-red-500",
    success: "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-sm focus:ring-emerald-500",
    ghost: "text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:ring-slate-500"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

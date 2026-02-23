import React from 'react';

export const Benke IT SolutionsLogo = ({ className = "", size = "default" }) => {
  const sizes = {
    small: { container: "w-8 h-8", text: "text-base" },
    default: { container: "w-10 h-10", text: "text-xl" },
    large: { container: "w-16 h-16", text: "text-3xl" }
  };

  const currentSize = sizes[size] || sizes.default;

  return (
    <svg 
      className={className}
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle with Gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
        </filter>
      </defs>
      
      {/* Rounded Square Background */}
      <rect 
        x="20" 
        y="20" 
        width="160" 
        height="160" 
        rx="32" 
        fill="url(#logoGradient)"
        filter="url(#shadow)"
      />
      
      {/* Letter "I" */}
      <path
        d="M 100 60 L 100 140 M 85 60 L 115 60 M 85 140 L 115 140"
        stroke="white"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Checkmark accent (testing symbol) */}
      <path
        d="M 130 75 L 140 85 L 155 65"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
};

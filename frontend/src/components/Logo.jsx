import React from 'react';

export const BenkeLogo = ({ className = "", size = "default" }) => {
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
      
      {/* Letter "B" for Benke */}
      <path
        d="M 70 60 L 70 140 M 70 60 L 110 60 C 130 60 130 100 110 100 L 70 100 M 70 100 L 115 100 C 140 100 140 140 115 140 L 70 140"
        stroke="white"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Checkmark accent (testing symbol) */}
      <path
        d="M 135 75 L 145 85 L 160 65"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
};

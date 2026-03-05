import React from 'react';

export const PrecisionLogo = ({ className = "", size = "default" }) => {
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
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
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
      
      {/* Letter "P" for Precision */}
      <path
        d="M 65 60 L 65 140 M 65 60 L 115 60 C 145 60 145 100 115 100 L 65 100"
        stroke="white"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Checkmark accent (testing/precision symbol) */}
      <path
        d="M 130 110 L 145 125 L 165 95"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
};

// Keep BenkeLogo as alias for backwards compatibility during transition
export const BenkeLogo = PrecisionLogo;

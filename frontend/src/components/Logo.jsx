import React from 'react';

export const KeyperionLogo = ({ className = "" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="keyperionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="keyperionShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Rounded square background */}
      <rect
        x="20"
        y="20"
        width="160"
        height="160"
        rx="36"
        fill="url(#keyperionGradient)"
        filter="url(#keyperionShadow)"
      />

      {/* Letter "K" */}
      <path d="M 72 56 L 72 144" stroke="white" strokeWidth="15" strokeLinecap="round" />
      <path d="M 72 102 L 126 56" stroke="white" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 72 98 L 132 144" stroke="white" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />

      {/* Tech accent node */}
      <circle cx="142" cy="52" r="9" fill="white" fillOpacity="0.9" />
    </svg>
  );
};

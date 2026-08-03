import React from 'react';

export const WeboraLogo = ({ className = "" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="weboraBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="55%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="weboraStroke" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0F2FE" />
        </linearGradient>
        <filter id="weboraShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0C4A6E" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Rounded square background with sky gradient */}
      <rect x="18" y="18" width="164" height="164" rx="42" fill="url(#weboraBg)" filter="url(#weboraShadow)" />

      {/* Glossy top highlight */}
      <rect x="30" y="30" width="140" height="58" rx="29" fill="#FFFFFF" opacity="0.12" />

      {/* Faint hexagon frame for depth */}
      <path d="M100 40 L152 70 L152 130 L100 160 L48 130 L48 70 Z" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="3" fill="none" />

      {/* Back layer W (offset for depth) */}
      <path d="M51 62 L77 150 L100 101 L123 150 L149 62" stroke="#BAE6FD" strokeOpacity="0.55" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Main W monogram */}
      <path d="M46 58 L74 152 L100 98 L126 152 L154 58" stroke="url(#weboraStroke)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Accent nodes */}
      <circle cx="100" cy="98" r="7" fill="#FFFFFF" />
      <circle cx="154" cy="56" r="6" fill="#FFFFFF" fillOpacity="0.85" />
    </svg>
  );
};

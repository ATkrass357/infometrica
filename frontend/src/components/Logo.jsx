import React from 'react';

export const PrysmLogo = ({ className = "" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="prysmShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Light-blue rounded square */}
      <rect
        x="20"
        y="20"
        width="160"
        height="160"
        rx="38"
        fill="#0EA5E9"
        filter="url(#prysmShadow)"
      />

      {/* Prism triangle (white) */}
      <path d="M100 54 L150 148 L50 148 Z" fill="#FFFFFF" />

      {/* Facet split line giving a 3D prism look */}
      <path d="M100 54 L100 148" stroke="#0EA5E9" strokeWidth="6" strokeLinecap="round" />

      {/* Refracted light beams exiting the prism */}
      <path d="M138 128 L172 116" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
      <path d="M138 138 L172 138" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.6" />

      {/* Accent node */}
      <circle cx="150" cy="52" r="8" fill="#FFFFFF" fillOpacity="0.9" />
    </svg>
  );
};

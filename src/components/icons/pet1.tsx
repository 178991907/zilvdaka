import React from 'react';

const Pet1: React.FC = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="grad-pet1-body" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(var(--primary) / 0.7)', stopOpacity: 1 }} />
      </radialGradient>
      <filter id="glow-pet1" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#glow-pet1)">
      <path
        d="M 50,20 C 25,20 20,50 20,70 C 20,90 30,100 50,100 C 70,100 80,90 80,70 C 80,50 75,20 50,20 Z"
        fill="url(#grad-pet1-body)"
      />
      {/* Eyes */}
      <circle cx="40" cy="65" r="5" fill="white" />
      <circle cx="60" cy="65" r="5" fill="white" />
      <circle cx="41" cy="66" r="2.5" fill="black" />
      <circle cx="61" cy="66" r="2.5" fill="black" />
      {/* Blush */}
      <ellipse cx="30" cy="75" rx="5" ry="3" fill="hsl(var(--primary) / 0.5)" opacity="0.6" />
      <ellipse cx="70" cy="75" rx="5" ry="3" fill="hsl(var(--primary) / 0.5)" opacity="0.6" />
    </g>
  </svg>
);

export default Pet1;

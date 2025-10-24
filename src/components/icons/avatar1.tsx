import React from 'react';

const Avatar1: React.FC = () => (
  <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rocket-grad" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="100%" stopColor="#FF8E8E" />
      </linearGradient>
      <linearGradient id="window-grad" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#A2D2FF" />
        <stop offset="100%" stopColor="#BDE0FE" />
      </linearGradient>
    </defs>
    <path fill="#4A4A4A" d="M78 111.5c0 4.1-6.3 7.5-14 7.5s-14-3.4-14-7.5c0-4.1 6.3-9.5 14-9.5s14 5.4 14 9.5z" />
    <path fill="#FFD166" d="M64 122c-12.7 0-23-4-23-9s10.3-9 23-9 23 4 23 9-10.3 9-23 9z" />
    <path fill="#E0E0E0" d="M96 90c-17.7 0-32-14.3-32-32V30h64v28c0 17.7-14.3 32-32 32z" />
    <path fill="#F5F5F5" d="M91 85c-14.9 0-27-12.1-27-27V35h54v23c0 14.9-12.1 27-27 27z" />
    <path fill="url(#rocket-grad)" d="M78 35H50l-8-14h44l-8 14z" />
    <path fill="#4A4A4A" d="M64 9c0 5-6.3 9-14 9s-14-4-14-9c0-5 6.3-9 14-9s14 4 14 9z" />
    <path fill="url(#window-grad)" d="M64 58c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16z" />
    <path fill="#FFFFFF" d="M64 45c-7.2 0-13-5.8-13-13s5.8-13 13-13 13 5.8 13 13-5.8 13-13 1
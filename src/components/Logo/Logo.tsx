import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Logo({ width, height, style, className = '' }: LogoProps) {
  const styles = { width, height, display: 'inline-block', ...style };
  return (
    <div
      style={styles}
      className={`logo-system ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 150 150"
        preserveAspectRatio="xMidYMin slice"
      >
        <circle cx="75" cy="75" r="50" fill="none" stroke="#3b82f6" strokeWidth="6" />
        
        {/* Các nút kết nối */}
        <circle cx="75" cy="25" r="6" fill="#3b82f6" />
        <circle cx="75" cy="125" r="6" fill="#3b82f6" />
        <circle cx="25" cy="75" r="6" fill="#3b82f6" />
        <circle cx="125" cy="75" r="6" fill="#3b82f6" />

        {/* Các đường kết nối */}
        <line x1="75" y1="25" x2="75" y2="125" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
        <line x1="25" y1="75" x2="125" y2="75" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
        
        {/* Vòng tròn bên trong với các nút nhỏ hơn */}
        <circle cx="75" cy="75" r="30" fill="none" stroke="#34d399" strokeWidth="4" />
        <circle cx="95" cy="75" r="4" fill="#34d399" />
        <circle cx="75" cy="95" r="4" fill="#34d399" />
        <circle cx="55" cy="75" r="4" fill="#34d399" />
        <circle cx="75" cy="55" r="4" fill="#34d399" />

        {/* Trung tâm của logo */}
        <circle cx="75" cy="75" r="6" fill="#34d399" />
      </svg>
    </div>
  );
}

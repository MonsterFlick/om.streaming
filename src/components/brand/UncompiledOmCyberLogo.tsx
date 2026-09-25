"use client";

import React from "react";

interface UncompiledOmCyberLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  primaryColor?: string; // Default white/platinum
  accentColor?: string; // Default purple/violet #a855f7
  glowIntensity?: number;
  showBackground?: boolean;
}

export function UncompiledOmCyberLogo({
  className = "",
  width = 600,
  height = 200,
  primaryColor = "#FFFFFF",
  accentColor = "#a855f7",
  glowIntensity = 1,
  showBackground = true,
}: UncompiledOmCyberLogoProps) {
  const gradientId = React.useId();

  return (
    <svg
      viewBox="0 0 640 220"
      width={width}
      height={height}
      className={`select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Glow Filters */}
        <filter id={`${gradientId}-purple-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={6 * glowIntensity} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id={`${gradientId}-intense-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={12 * glowIntensity} result="blur" />
          <feColorMatrix
            type="matrix"
            values="
              1 0 0 0 0
              0 0.5 0 0 0
              0 0 1 0 0
              0 0 0 1.8 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Text & Shape Gradients */}
        <linearGradient id={`${gradientId}-purple-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3e8ff" />
          <stop offset="40%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>

        <linearGradient id={`${gradientId}-accent-glow-line`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0" />
          <stop offset="50%" stopColor={accentColor} stopOpacity="1" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Optional Pitch Black Background */}
      {showBackground && (
        <rect width="640" height="220" rx="16" fill="#050508" />
      )}

      {/* 1. Ambient Glow behind the bottom OM section */}
      <circle
        cx="440"
        cy="145"
        r="70"
        fill={accentColor}
        opacity={0.25 * glowIntensity}
        filter={`url(#${gradientId}-intense-glow)`}
      />

      {/* 2. Outer Cyber Tech Frame Path */}
      <g stroke={primaryColor} strokeWidth="3.5" fill="none" strokeLinecap="square" strokeLinejoin="miter">
        {/* Main stepped frame border */}
        <path
          d="
            M 135 35
            L 245 35
            L 255 45
            L 395 45
            L 405 35
            L 505 35
            L 525 55
            L 525 95
            L 520 105
            L 520 145
            L 510 155
            L 500 155
            L 490 165
            L 470 175
            L 330 175
            L 320 165
            L 190 165
            L 180 175
            L 130 175
            L 110 155
            L 110 65
            Z
          "
        />

        {/* Top-Left Chamfer Inner Accent Notch */}
        <path d="M 120 60 L 120 48 L 155 48" stroke={accentColor} strokeWidth="3" filter={`url(#${gradientId}-purple-glow)`} />

        {/* Bottom Horizontal Glowing Line */}
        <path d="M 195 165 L 295 165" stroke={accentColor} strokeWidth="4" filter={`url(#${gradientId}-purple-glow)`} />

        {/* Bottom-Right Step Outline */}
        <path d="M 330 175 L 470 175 L 490 165 L 500 155" stroke={primaryColor} strokeWidth="3.5" />

        {/* Outer Corner Reticle Lines */}
        <line x1="104" y1="95" x2="104" y2="115" stroke={primaryColor} strokeWidth="2.5" />
        <line x1="531" y1="95" x2="531" y2="115" stroke={primaryColor} strokeWidth="2.5" />
      </g>

      {/* Glowing Purple Corner Accents */}
      <g stroke={accentColor} strokeWidth="3" fill="none" filter={`url(#${gradientId}-purple-glow)`}>
        <path d="M 125 43 L 140 43" />
        <path d="M 485 167 L 500 160" />
      </g>

      {/* 3. Primary Top Text: UNCOMPILED */}
      <g fill={primaryColor}>
        {/* Custom Stencil 'U' */}
        <path d="M 130 65 h 14 v 22 q 0 8 7 8 t 7 -8 V 65 h 14 v 24 q 0 16 -16 16 t -26 -16 Z" />
        {/* Custom Stencil Cutout on U */}
        <polygon points="128,65 140,65 130,75" fill="#050508" />

        <text
          x="182"
          y="102"
          fontFamily="'Syne', 'Plus Jakarta Sans', sans-serif"
          fontWeight="900"
          fontSize="37"
          letterSpacing="2.5"
        >
          NCOMPILED
        </text>
      </g>

      {/* 4. Bottom Left Slanted Hazard Stripes (///) */}
      <g transform="translate(132, 132)">
        <polygon points="0,18 8,0 18,0 10,18" fill="#333642" />
        <polygon points="12,18 20,0 30,0 22,18" fill="#6b21a8" />
        <polygon points="24,18 32,0 42,0 34,18" fill={accentColor} filter={`url(#${gradientId}-purple-glow)`} />
        <polygon points="36,18 44,0 54,0 46,18" fill="#c084fc" filter={`url(#${gradientId}-purple-glow)`} />
        
        {/* Connecting Horizontal Separator Line */}
        <line x1="58" y1="10" x2="195" y2="10" stroke={primaryColor} strokeWidth="2" opacity="0.8" />
      </g>

      {/* 5. Bottom Right: ✦ OM ✦ */}
      <g transform="translate(350, 122)">
        {/* Left Spark Star ✦ */}
        <path
          d="M 18 20 Q 18 10 10 10 Q 18 10 18 0 Q 18 10 26 10 Q 18 10 18 20 Z"
          fill={accentColor}
          filter={`url(#${gradientId}-purple-glow)`}
          transform="scale(1.2) translate(-2, 2)"
        />

        {/* Text: OM */}
        <text
          x="36"
          y="28"
          fontFamily="'Syne', 'Plus Jakarta Sans', sans-serif"
          fontWeight="900"
          fontSize="36"
          letterSpacing="3"
          fill={`url(#${gradientId}-purple-grad)`}
          filter={`url(#${gradientId}-purple-glow)`}
        >
          OM
        </text>

        {/* Right Spark Star ✦ */}
        <path
          d="M 108 20 Q 108 10 100 10 Q 108 10 108 0 Q 108 10 116 10 Q 108 10 108 20 Z"
          fill={accentColor}
          filter={`url(#${gradientId}-purple-glow)`}
          transform="scale(1.2) translate(-6, 2)"
        />
      </g>
    </svg>
  );
}

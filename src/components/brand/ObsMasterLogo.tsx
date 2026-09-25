"use client";

import React from "react";
import { UncompiledOmCyberLogo } from "./UncompiledOmCyberLogo";

interface ObsMasterLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  accentColor?: string;
}

/**
 * Official UNCOMPILED OM Cyber Tech Logo Component (Matching user image)
 */
export function ObsMasterLogo({
  className = "",
  width = 320,
  height = 95,
  accentColor = "#a855f7",
}: ObsMasterLogoProps) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <UncompiledOmCyberLogo
        width={width}
        height={height}
        accentColor={accentColor}
        showBackground={false}
      />
    </div>
  );
}

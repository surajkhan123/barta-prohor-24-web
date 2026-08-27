import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'glass';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'light',
  showTagline = true,
}) => {
  return (
    <div className="flex flex-col items-center select-none group">
      {/* Authentic Bengali News Masthead with Zee 24 Ghanta style '24' */}
      <div className={`bg-[#b91c1c] text-white font-black tracking-tight shadow-sm flex items-center font-['Noto_Serif_Bengali'] rounded-xs border border-[#991b1b] ${
        size === 'sm' 
          ? 'px-2.5 py-1 text-base sm:text-lg gap-1.5' 
          : size === 'lg'
          ? 'px-4 py-2 text-2xl sm:text-3xl gap-2.5'
          : size === 'xl'
          ? 'px-5 py-2.5 text-3xl sm:text-4xl gap-3'
          : 'px-3 sm:px-3.5 py-1 sm:py-1.5 text-xl sm:text-2xl md:text-3xl gap-2'
      }`}>
        {/* "বার্তা প্রহর" (Clean bold text) */}
        <span className="leading-none text-white drop-shadow-xs font-black">বার্তা প্রহর</span>

        {/* "24" - Zee 24 Ghanta Style: Bold, Heavy Italic Slanted Font in ONE Solid Color (Golden Yellow #fbbf24) */}
        <div className={`bg-[#111827] border border-[#374151] rounded-xs flex items-center justify-center shadow-inner overflow-hidden transform -skew-x-6 ${
          size === 'sm'
            ? 'px-1.5 py-0.5'
            : size === 'lg'
            ? 'px-3 py-1'
            : size === 'xl'
            ? 'px-3.5 py-1.5'
            : 'px-2 sm:px-2.5 py-0.5 sm:py-1'
        }`}>
          <span className={`font-sans font-black italic tracking-tighter text-[#fbbf24] leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${
            size === 'sm'
              ? 'text-sm'
              : size === 'lg'
              ? 'text-2xl'
              : size === 'xl'
              ? 'text-3xl'
              : 'text-lg sm:text-xl md:text-2xl'
          }`}>
            24
          </span>
        </div>
      </div>

      {/* Subtitle / Tagline below logo */}
      {showTagline && (
        <div className={`text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mt-0.5 font-['Noto_Serif_Bengali'] ${
          variant === 'dark' ? 'text-[#a3a3a3]' : 'text-[#525252]'
        }`}>
          <span>BARTA PROHOR </span>
          <span className="text-[#fbbf24] font-black italic">24</span>
          <span> • নির্ভীক • নিরপেক্ষ • তাৎক্ষণিক</span>
        </div>
      )}
    </div>
  );
};

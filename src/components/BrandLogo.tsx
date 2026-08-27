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
      {/* Authentic Bengali News Masthead with Red, Blue, Black 24 */}
      <div className={`bg-[#b91c1c] text-white font-black tracking-tighter shadow-sm flex items-center font-['Noto_Serif_Bengali'] rounded-xs border border-[#991b1b] ${
        size === 'sm' 
          ? 'px-2.5 py-1 text-base sm:text-lg gap-1.5' 
          : size === 'lg'
          ? 'px-4 py-2 text-2xl sm:text-3xl gap-2.5'
          : size === 'xl'
          ? 'px-5 py-2.5 text-3xl sm:text-4xl gap-3'
          : 'px-3 sm:px-3.5 py-1 sm:py-1.5 text-xl sm:text-2xl md:text-3xl gap-1.5 sm:gap-2'
      }`}>
        {/* "বার্তা" */}
        <span className="leading-none text-white drop-shadow-xs font-black">বার্তা</span>

        {/* "প্রহর" (Classic Black Badge) */}
        <span className={`bg-[#1a1a1a] text-[#fbbf24] font-black rounded-xs flex items-center justify-center leading-none border border-[#333333] shadow-xs ${
          size === 'sm'
            ? 'px-1.5 py-0.5 text-xs'
            : size === 'lg'
            ? 'px-2.5 py-1 text-lg sm:text-xl'
            : size === 'xl'
            ? 'px-3 py-1 text-xl sm:text-2xl'
            : 'px-2 py-0.5 text-sm sm:text-base md:text-lg'
        }`}>
          প্রহর
        </span>

        {/* "24" - Styled specifically with Red, Blue, and Black */}
        <div className={`bg-[#111827] border border-[#1e40af] text-white rounded-xs font-black flex items-center font-['Playfair_Display',serif] shadow-xs overflow-hidden ${
          size === 'sm'
            ? 'px-1 py-0.5 text-xs gap-0.5'
            : size === 'lg'
            ? 'px-2.5 py-1 text-lg sm:text-xl gap-0.5'
            : size === 'xl'
            ? 'px-3 py-1 text-xl sm:text-2xl gap-1'
            : 'px-1.5 sm:px-2 py-0.5 text-sm sm:text-lg md:text-xl gap-0.5'
        }`}>
          {/* '2' in Vibrant Red */}
          <span className="text-[#ef4444] font-extrabold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">2</span>
          {/* '4' in Royal Blue / Sky Glow */}
          <span className="text-[#60a5fa] font-extrabold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">4</span>
        </div>
      </div>

      {/* Subtitle / Tagline below logo */}
      {showTagline && (
        <div className={`text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mt-0.5 font-['Noto_Serif_Bengali'] ${
          variant === 'dark' ? 'text-[#a3a3a3]' : 'text-[#525252]'
        }`}>
          <span>BARTA PROHOR </span>
          <span className="text-[#ef4444] font-black">2</span>
          <span className="text-[#2563eb] font-black">4</span>
          <span> • নির্ভীক • নিরপেক্ষ • তাৎক্ষণিক</span>
        </div>
      )}
    </div>
  );
};

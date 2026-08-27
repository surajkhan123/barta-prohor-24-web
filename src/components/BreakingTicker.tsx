import React, { useState, useEffect } from 'react';
import { Flame, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { BREAKING_TICKER } from '../data/newsData';

export const BreakingTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BREAKING_TICKER.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? BREAKING_TICKER.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % BREAKING_TICKER.length);
  };

  return (
    <div id="breaking-ticker-bar" className="w-full bg-[#1a1a1a] text-white border-b border-[#2d2d2d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-1.5 flex items-center justify-between gap-3">
        {/* Label with classic editorial kicker badge */}
        <div className="flex items-center gap-1.5 shrink-0 bg-[#b91c1c] text-white px-2 py-0.5 rounded-xs text-[11px] font-black tracking-wider uppercase font-['Noto_Serif_Bengali']">
          <Flame className="w-3.5 h-3.5 text-[#fbbf24] fill-[#fbbf24] animate-pulse" />
          <span>ব্রেকিং নিউজ</span>
        </div>

        {/* Ticker Text Content */}
        <div className="flex-1 overflow-hidden relative h-5 flex items-center">
          <div
            key={currentIndex}
            className="text-xs font-semibold tracking-normal text-[#f5f5f5] truncate transition-all duration-300 transform translate-y-0 opacity-100 font-['Noto_Serif_Bengali']"
          >
            {BREAKING_TICKER[currentIndex]}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0 text-[#a3a3a3]">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 hover:bg-[#2d2d2d] rounded-xs transition-colors hover:text-white cursor-pointer"
            title={isPlaying ? 'বিরতি' : 'চালান'}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <button
            onClick={handlePrev}
            className="p-1 hover:bg-[#2d2d2d] rounded-xs transition-colors hover:text-white cursor-pointer"
            title="পূর্ববর্তী"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 hover:bg-[#2d2d2d] rounded-xs transition-colors hover:text-white cursor-pointer"
            title="পরবর্তী"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

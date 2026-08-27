import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Headphones, 
  FastForward, 
  Sparkles,
  Check
} from 'lucide-react';

interface AudioNewsReaderProps {
  articleText: string;
  articleTitle: string;
  durationSeconds: number;
}

export const AudioNewsReader: React.FC<AudioNewsReaderProps> = ({
  articleText,
  articleTitle,
  durationSeconds,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<any>(null);

  // Check Web Speech support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setHasSpeechSupport(true);
    }
  }, []);

  const totalTime = durationSeconds;

  // Format seconds to mm:ss in Bengali digits
  const formatBengaliTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const bDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const pad = (n: number) => (n < 10 ? '0' + n : n.toString());
    const mStr = pad(m).split('').map(d => bDigits[parseInt(d, 10)] || d).join('');
    const sStr = pad(s).split('').map(d => bDigits[parseInt(d, 10)] || d).join('');
    return `${mStr}:${sStr}`;
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      // Pause
      if (hasSpeechSupport && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
      }
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      // Play
      setIsPlaying(true);

      if (hasSpeechSupport) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else {
          window.speechSynthesis.cancel();
          const cleanText = `${articleTitle}। ${articleText}`;
          const utterance = new SpeechSynthesisUtterance(cleanText);
          
          // Try to select a Bengali voice if present
          const voices = window.speechSynthesis.getVoices();
          const bnVoice = voices.find(v => v.lang.includes('bn') || v.lang.includes('Bengali') || v.lang.includes('IN'));
          if (bnVoice) {
            utterance.voice = bnVoice;
          }
          utterance.rate = playbackSpeed;
          utterance.lang = 'bn-IN';

          utterance.onend = () => {
            setIsPlaying(false);
            setProgress(100);
            setCurrentTime(totalTime);
            clearInterval(intervalRef.current);
          };

          utterance.onerror = () => {
            // fallback gracefully with visual playback
          };

          speechUtteranceRef.current = utterance;
          try {
            window.speechSynthesis.speak(utterance);
          } catch (e) {
            console.error('Speech synthesis error', e);
          }
        }
      }

      // Progress timer tracker
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalTime) {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
            return totalTime;
          }
          const next = prev + 1 * playbackSpeed;
          setProgress((next / totalTime) * 100);
          return next;
        });
      }, 1000);
    }
  };

  const handleReset = () => {
    if (hasSpeechSupport) {
      window.speechSynthesis.cancel();
    }
    clearInterval(intervalRef.current);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const handleSpeedChange = () => {
    const speeds = [1, 1.25, 1.5, 0.75];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setPlaybackSpeed(newSpeed);

    if (isPlaying && hasSpeechSupport && speechUtteranceRef.current) {
      window.speechSynthesis.cancel();
      const cleanText = `${articleTitle}। ${articleText}`;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = newSpeed;
      utterance.lang = 'bn-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div 
      id="audio-news-player" 
      className="my-6 p-4 sm:p-5 rounded-none sm:rounded-sm bg-[#1a1a1a] text-white shadow-xs border border-[#2d2d2d] border-l-4 border-l-[#b91c1c]"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left info */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xs bg-[#b91c1c] text-white flex items-center justify-center shrink-0 border border-[#7f1d1d]">
            <Headphones className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#b91c1c]/20 text-[#fca5a5] border border-[#b91c1c]/40 text-[10px] font-bold px-2 py-0.2 rounded-xs uppercase tracking-wider font-['Noto_Serif_Bengali']">
                অডিও বুলেটিন
              </span>
              <span className="text-[#a3a3a3] text-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#fbbf24]" />
                BARTA PROHOR 24 ভয়েস
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mt-0.5 line-clamp-1 font-['Noto_Serif_Bengali']">
              খবরের অডিও শুনুন: নেপালে খরাজ মুখোপাধ্যায়ের পরিস্থিতি
            </h4>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          {/* Reset / Rewind */}
          <button
            id="audio-reset-btn"
            onClick={handleReset}
            className="p-2 rounded-xs bg-[#262626] hover:bg-[#333333] text-[#d4d4d4] hover:text-white transition-colors cursor-pointer border border-[#404040]"
            title="শুরু থেকে শুনুন"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <button
            id="audio-speed-btn"
            onClick={handleSpeedChange}
            className="px-2.5 py-1.5 rounded-xs bg-[#262626] hover:bg-[#333333] text-[#f5f5f5] text-xs font-semibold tracking-wider transition-colors cursor-pointer border border-[#404040]"
            title="গতি পরিবর্তন করুন"
          >
            {playbackSpeed}x গতি
          </button>

          {/* Main Play / Pause Button */}
          <button
            id="audio-play-toggle-btn"
            onClick={handlePlayToggle}
            className="px-4 py-2 rounded-xs bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer border border-[#7f1d1d]"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>বিরতি</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>শুনুন</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress bar & Simulated Waveform */}
      <div className="mt-3.5 pt-3 border-t border-[#333333]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#a3a3a3]">
            {formatBengaliTime(currentTime)}
          </span>

          <div className="flex-1 relative h-1.5 bg-[#333333] rounded-xs overflow-hidden cursor-pointer">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#b91c1c] to-[#d97706] transition-all duration-300 rounded-xs"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>

          <span className="text-xs font-mono text-[#a3a3a3]">
            {formatBengaliTime(totalTime)}
          </span>
        </div>

        {/* Waveform graphic visualization */}
        <div className="mt-2 flex items-center justify-center gap-1 h-4 overflow-hidden opacity-80">
          {Array.from({ length: 36 }).map((_, i) => {
            const isBarActive = (i / 36) * 100 <= progress;
            const randomHeight = isPlaying 
              ? Math.sin((i + currentTime * 3) * 0.5) * 8 + 10 
              : ((i % 5) + 1) * 2.5;

            return (
              <span
                key={i}
                className={`w-1 rounded-xs transition-all duration-150 ${
                  isBarActive ? 'bg-[#b91c1c]' : 'bg-[#404040]'
                }`}
                style={{ height: `${Math.max(3, randomHeight)}px` }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

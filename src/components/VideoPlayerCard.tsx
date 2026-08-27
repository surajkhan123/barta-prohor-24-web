import React, { useState } from 'react';
import { Play, Video, ExternalLink, ShieldCheck, Film, Maximize2 } from 'lucide-react';
import { parseVideoUrl } from '../utils/videoHelper';

interface VideoPlayerCardProps {
  videoUrl?: string;
  videoCaption?: string;
  title?: string;
  category?: string;
}

export const VideoPlayerCard: React.FC<VideoPlayerCardProps> = ({
  videoUrl,
  videoCaption,
  title,
  category = 'বিশেষ ভিডিও প্রতিবেদন'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoUrl || !videoUrl.trim()) {
    return null;
  }

  const parsed = parseVideoUrl(videoUrl);
  if (!parsed) {
    return null;
  }

  return (
    <section 
      id="news-video-player"
      className="border-2 border-[#1a1a1a] rounded-none sm:rounded-xs bg-[#121212] text-white overflow-hidden shadow-lg"
    >
      {/* Header Bar */}
      <div className="bg-[#1f1f1f] px-3.5 sm:px-4 py-2.5 flex items-center justify-between border-b border-[#333333] flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-[#b91c1c] text-white text-xs font-black px-2.5 py-0.5 rounded-xs uppercase tracking-wider font-['Noto_Serif_Bengali']">
            <Video className="w-3.5 h-3.5 animate-pulse" />
            <span>ভিডিও সংবাদ</span>
          </span>
          <span className="text-xs text-[#d4d4d4] font-medium hidden sm:inline font-['Noto_Serif_Bengali']">
            {category}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#a3a3a3]">
          <span className="flex items-center gap-1 bg-[#262626] px-2 py-0.5 rounded-xs border border-[#404040]">
            <ShieldCheck className="w-3 h-3 text-[#10b981]" />
            <span>HD কোয়ালিটি</span>
          </span>
          {parsed.type === 'youtube' && (
            <span className="text-[#f87171] font-bold font-mono">YouTube</span>
          )}
        </div>
      </div>

      {/* Video Viewport Container (16:9 Responsive Ratio) */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
        {parsed.isIframe ? (
          <iframe
            src={parsed.embedUrl}
            title={title || 'সংবাদ ভিডিও'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0 absolute inset-0"
          />
        ) : (
          <video
            src={parsed.embedUrl}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain max-h-[500px]"
            poster="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80"
          >
            <source src={parsed.embedUrl} type="video/mp4" />
            আপনার ব্রাউজার ভিডিও প্লে করতে সমর্থন করছে না।
          </video>
        )}
      </div>

      {/* Caption and Video Details */}
      <div className="p-3.5 sm:p-4 bg-[#18181b] border-t border-[#27272a] space-y-1.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs sm:text-sm text-[#f4f4f5] font-['Noto_Serif_Bengali'] leading-relaxed">
            <strong className="text-[#f87171] mr-1.5">[ভিডিও কভারেজ]</strong>
            {videoCaption || title || 'সরাসরি ঘটনাস্থল থেকে বিশেষ ভিডিও প্রতিবেদন'}
          </p>

          <a
            href={parsed.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-[11px] text-[#93c5fd] hover:text-white flex items-center gap-1 hover:underline font-mono"
          >
            <span>সরাসরি লিঙ্ক</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="text-[11px] text-[#71717a] font-mono">
          BARTA PROHOR 24 ভিডিও ব্যুরো • সর্বস্বত্ব সংরক্ষিত
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Clock, ArrowUpRight, Flame, Sparkles } from 'lucide-react';
import { RELATED_STORIES } from '../data/newsData';

export const RelatedNewsGrid: React.FC = () => {
  return (
    <section id="related-news-section" className="space-y-4 my-8">
      <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-5 bg-[#b91c1c]" />
          <h3 className="text-lg sm:text-xl font-black text-[#1a1a1a] font-['Noto_Serif_Bengali']">
            সম্পর্কিত খবর ও বিশেষ প্রতিবেদন
          </h3>
        </div>
        <span className="text-xs font-bold text-[#b91c1c] hover:text-[#991b1b] transition-colors cursor-pointer flex items-center gap-1 font-['Noto_Serif_Bengali']">
          <span>সব খবর দেখুন</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {RELATED_STORIES.map((story) => (
          <article
            key={story.id}
            className="group bg-white rounded-none sm:rounded-xs border border-[#ded8cb] overflow-hidden shadow-2xs hover:border-[#b91c1c] transition-all duration-200 flex flex-col justify-between cursor-pointer"
          >
            <div className="relative h-40 overflow-hidden bg-[#f3efe6]">
              {story.imageUrl && (
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              )}
              {story.badge && (
                <span className="absolute top-2 left-2 bg-[#1a1a1a]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-xs shadow-xs font-['Noto_Serif_Bengali']">
                  {story.badge}
                </span>
              )}
              <span className="absolute bottom-2 right-2 bg-[#b91c1c] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs font-['Noto_Serif_Bengali']">
                {story.category}
              </span>
            </div>

            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-[#1a1a1a] group-hover:text-[#b91c1c] transition-colors leading-snug line-clamp-2 font-['Noto_Serif_Bengali']">
                {story.title}
              </h4>

              <div className="flex items-center justify-between text-[11px] text-[#737373] pt-2 border-t border-[#ded8cb]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#737373]" />
                  {story.time}
                </span>
                <span className="font-semibold text-[#b91c1c] flex items-center gap-0.5 font-['Noto_Serif_Bengali']">
                  পড়ুন <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { 
  Flame, 
  Clock, 
  ArrowUpRight, 
  Play, 
  Headphones, 
  Radio, 
  TrendingUp, 
  Video, 
  AlertTriangle, 
  ChevronRight,
  Eye,
  Sparkles,
  Share2,
  Bookmark,
  Layers,
  CheckCircle2,
  Calendar,
  Lock,
  QrCode
} from 'lucide-react';
import { NewsArticle } from '../types';
import { getCategoryFallbackImage } from '../utils/imageCompressor';

interface HomePageProps {
  articles: NewsArticle[];
  onSelectArticle: (articleId: string) => void;
  onSelectCategory: (categoryName: string) => void;
  onOpenAdmin: () => void;
  onOpenSubscribe: () => void;
  onOpenQR: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory,
  onOpenAdmin,
  onOpenSubscribe,
  onOpenQR,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('সব খবর');

  // Lead featured story (first breaking or first item)
  const leadArticle = articles.find(a => a.isBreaking) || articles[0];
  
  // Remaining articles
  const otherArticles = articles.filter(a => a.id !== leadArticle?.id);

  // Filtered list based on filter bar
  const filteredArticles = activeFilter === 'সব খবর'
    ? articles
    : activeFilter === 'ভিডিও ও লাইভ'
    ? articles.filter(a => a.videoUrl || a.category === 'ভিডিও ও লাইভ')
    : articles.filter(a => a.category.toLowerCase().includes(activeFilter.toLowerCase()) || activeFilter.toLowerCase().includes(a.category.toLowerCase()));

  // Category specific groups
  const entertainmentArticles = articles.filter(a => a.category.includes('বিনোদন'));
  const sportsArticles = articles.filter(a => a.category.includes('খেলাধুলা'));
  const statePoliticsArticles = articles.filter(a => a.category.includes('রাজ্য') || a.category.includes('রাজনীতি'));
  const weatherArticles = articles.filter(a => a.category.includes('আবহাওয়া') || a.category.includes('দুর্যোগ'));
  const videoArticles = articles.filter(a => a.videoUrl || a.category.includes('ভিডিও'));

  const categoriesList = [
    'সব খবর',
    'বিনোদন',
    'খেলাধুলা',
    'রাজ্য',
    'রাজনীতি',
    'আবহাওয়া ও দুর্যোগ',
    'দেশ-বিদেশ',
    'ভিডিও ও লাইভ'
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome / Newspaper Edition Banner */}
      <div className="bg-[#fffbeb] border-l-4 border-l-[#b91c1c] border-y border-r border-[#ded8cb] p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xs bg-[#b91c1c] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#b91c1c] font-['Noto_Serif_Bengali'] flex items-center gap-1.5">
              <span>আজকের ডিজিটাল প্রধান সংস্করণ • BARTA PROHOR 24</span>
            </span>
            <p className="text-xs sm:text-sm font-bold text-[#1a1a1a] font-['Noto_Serif_Bengali']">
              তাজা খবর, লাইভ ভিডিও বুলেটিন এবং নিরপেক্ষ সংবাদ বিশ্লেষণ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={onOpenAdmin}
            className="bg-[#1a1a1a] hover:bg-[#b91c1c] text-white text-xs font-bold px-3 py-1.5 rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer font-['Noto_Serif_Bengali'] shadow-xs"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>+ নতুন খবর যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Category Quick Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#ded8cb] py-1 font-['Noto_Serif_Bengali']">
        <span className="text-xs font-black text-[#525252] shrink-0 pl-1">বিভাগ অনুযায়ী খবর:</span>
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`shrink-0 px-3 py-1 text-xs font-bold rounded-xs transition-all duration-150 cursor-pointer flex items-center gap-1 ${
              activeFilter === cat
                ? 'bg-[#b91c1c] text-white shadow-xs'
                : 'bg-white hover:bg-[#eae5db] text-[#1a1a1a] border border-[#ded8cb]'
            }`}
          >
            {cat === 'ভিডিও ও লাইভ' && <Video className="w-3 h-3 text-[#fbbf24]" />}
            {cat === 'বিনোদন' && <Sparkles className="w-3 h-3 text-[#fbbf24]" />}
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* If a filter other than 'সব খবর' is chosen, display that custom feed directly */}
      {activeFilter !== 'সব খবর' ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-6 bg-[#b91c1c]" />
              <h2 className="text-xl sm:text-2xl font-black text-[#1a1a1a] font-['Noto_Serif_Bengali']">
                {activeFilter} বিভাগীয় সংবাদ
              </h2>
            </div>
            <span className="text-xs font-bold text-[#525252] bg-white px-2.5 py-1 border border-[#ded8cb] rounded-xs">
              মোট খবর: {filteredArticles.length} টি
            </span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="bg-white p-12 text-center border border-[#ded8cb] rounded-xs space-y-3">
              <AlertTriangle className="w-8 h-8 text-[#f59e0b] mx-auto" />
              <h3 className="font-bold text-base text-[#1a1a1a] font-['Noto_Serif_Bengali']">
                এই বিভাগে এখনও কোনো খবর যুক্ত করা হয়নি
              </h3>
              <p className="text-xs text-[#666666]">
                অ্যাডমিন প্যানেল থেকে এই ক্যাটাগরিতে নতুন খবর বা ভিডিও যুক্ত করতে পারেন।
              </p>
              <button
                onClick={onOpenAdmin}
                className="bg-[#b91c1c] text-white text-xs font-bold px-4 py-2 rounded-xs font-['Noto_Serif_Bengali'] cursor-pointer"
              >
                + এখনই খবর যোগ করুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((item) => (
                <article
                  key={item.id}
                  onClick={() => onSelectArticle(item.id)}
                  className="group bg-white rounded-xs border border-[#ded8cb] hover:border-[#b91c1c] overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-48 overflow-hidden bg-[#f3efe6]">
                    <img
                      src={item.featuredImage?.url || getCategoryFallbackImage(item.category)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 bg-[#b91c1c] text-white text-[11px] font-bold px-2 py-0.5 rounded-xs font-['Noto_Serif_Bengali']">
                      {item.category}
                    </span>
                    {item.videoUrl && (
                      <span className="absolute bottom-2 left-2 bg-[#1a1a1a]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-xs flex items-center gap-1 font-['Noto_Serif_Bengali']">
                        <Play className="w-3 h-3 fill-white text-white" />
                        <span>ভিডিও</span>
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[11px] text-[#737373] flex items-center gap-2 mb-1.5">
                        <Clock className="w-3 h-3 text-[#737373]" />
                        <span>{item.publishedAt}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#1a1a1a] group-hover:text-[#b91c1c] transition-colors leading-snug line-clamp-2 font-['Noto_Serif_Bengali']">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#525252] line-clamp-2 mt-1.5 leading-relaxed font-['Noto_Serif_Bengali']">
                        {item.subtitle || item.paragraphs?.[0]}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#ded8cb] flex items-center justify-between text-xs font-bold font-['Noto_Serif_Bengali']">
                      <span className="text-[#525252]">{item.author?.name || 'বার্তা প্রহর ডেস্ক'}</span>
                      <span className="text-[#b91c1c] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        <span>সম্পূর্ণ পড়ুন</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Default Rich Newspaper Home Page View */
        <>
          {/* Top Section: Lead Story (8 cols) + Live/Trending News Sidebar (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Lead Spotlight Story */}
            <div className="lg:col-span-8 space-y-6">
              {leadArticle && (
                <div 
                  onClick={() => onSelectArticle(leadArticle.id)}
                  className="group bg-white border-2 border-[#1a1a1a] rounded-xs overflow-hidden shadow-md hover:border-[#b91c1c] transition-all duration-200 cursor-pointer"
                >
                  {/* Lead Image with Overlays */}
                  <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-[#1a1a1a]">
                    <img
                      src={leadArticle.featuredImage?.url || getCategoryFallbackImage(leadArticle.category)}
                      alt={leadArticle.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Breaking / Category Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      <span className="bg-[#b91c1c] text-white text-xs font-black px-2.5 py-1 rounded-xs flex items-center gap-1 shadow-md font-['Noto_Serif_Bengali']">
                        <Flame className="w-3.5 h-3.5 fill-white" />
                        <span>শীর্ষ ব্রেকিং নিউজ</span>
                      </span>
                      <span className="bg-[#1a1a1a]/90 text-[#fbbf24] text-xs font-bold px-2 py-1 rounded-xs border border-[#fbbf24]/40 font-['Noto_Serif_Bengali']">
                        {leadArticle.category}
                      </span>
                    </div>

                    {/* Video and Audio indicator badges */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      {leadArticle.videoUrl && (
                        <span className="bg-[#b91c1c] text-white text-xs font-bold px-2.5 py-1 rounded-xs flex items-center gap-1.5 shadow-md font-['Noto_Serif_Bengali']">
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>ভিডিও রিপোর্ট</span>
                        </span>
                      )}
                      <span className="bg-[#1a1a1a]/90 text-[#fbbf24] text-xs font-bold px-2 py-1 rounded-xs flex items-center gap-1.5 border border-[#333] shadow-md font-['Noto_Serif_Bengali']">
                        <Headphones className="w-3.5 h-3.5" />
                        <span>অডিও বুলেটিন</span>
                      </span>
                    </div>
                  </div>

                  {/* Lead Headline & Text */}
                  <div className="p-5 sm:p-6 space-y-3 bg-white">
                    <div className="flex items-center gap-3 text-xs text-[#737373]">
                      <span className="font-bold text-[#b91c1c]">{leadArticle.author?.name || 'বার্তা প্রহর ব্যুরো'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {leadArticle.publishedAt}
                      </span>
                      <span>•</span>
                      <span>{leadArticle.location}</span>
                    </div>

                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1a1a1a] group-hover:text-[#b91c1c] transition-colors leading-tight font-['Noto_Serif_Bengali']">
                      {leadArticle.title}
                    </h1>

                    <p className="text-xs sm:text-sm text-[#404040] leading-relaxed line-clamp-3 font-['Noto_Serif_Bengali']">
                      {leadArticle.subtitle || leadArticle.paragraphs?.[0]}
                    </p>

                    <div className="pt-4 border-t border-[#ded8cb] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-[#fef2f2] text-[#991b1b] font-bold px-2 py-0.5 rounded-xs border border-[#fecaca] font-['Noto_Serif_Bengali']">
                          {leadArticle.statusBadge?.text || 'যাচাইকৃত তথ্য'}
                        </span>
                      </div>

                      <div className="bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xs flex items-center gap-1.5 font-['Noto_Serif_Bengali'] shadow-xs">
                        <span>সম্পূর্ণ প্রতিবেদন পড়ুন</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2-Column Sub-Lead Stories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherArticles.slice(0, 4).map((story) => (
                  <article
                    key={story.id}
                    onClick={() => onSelectArticle(story.id)}
                    className="group bg-white rounded-xs border border-[#ded8cb] hover:border-[#b91c1c] overflow-hidden shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative h-44 overflow-hidden bg-[#f3efe6]">
                      <img
                        src={story.featuredImage?.url || getCategoryFallbackImage(story.category)}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 bg-[#1a1a1a]/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-xs font-['Noto_Serif_Bengali']">
                        {story.category}
                      </span>
                      {story.videoUrl && (
                        <span className="absolute bottom-2 right-2 bg-[#b91c1c] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs flex items-center gap-1 font-['Noto_Serif_Bengali']">
                          <Play className="w-2.5 h-2.5 fill-white" />
                          <span>ভিডিও</span>
                        </span>
                      )}
                    </div>

                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="text-[11px] text-[#737373] flex items-center gap-1.5 mb-1">
                          <Clock className="w-3 h-3 text-[#737373]" />
                          <span>{story.publishedAt}</span>
                        </div>
                        <h3 className="text-sm font-bold text-[#1a1a1a] group-hover:text-[#b91c1c] transition-colors leading-snug line-clamp-2 font-['Noto_Serif_Bengali']">
                          {story.title}
                        </h3>
                      </div>

                      <div className="pt-2 border-t border-[#ded8cb] flex items-center justify-between text-[11px] font-bold font-['Noto_Serif_Bengali']">
                        <span className="text-[#737373]">{story.author?.name || 'ডেস্ক'}</span>
                        <span className="text-[#b91c1c] flex items-center gap-0.5">
                          পড়ুন <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar Column: Live Updates + Trending */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Live Breaking News Feed */}
              <div className="bg-white rounded-xs p-5 border border-[#ded8cb] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-2">
                  <h3 className="font-bold text-sm text-[#1a1a1a] flex items-center gap-2 font-['Noto_Serif_Bengali']">
                    <Radio className="w-4 h-4 text-[#b91c1c] animate-pulse" />
                    <span>তাজা খবরের লাইভ ফিড</span>
                  </h3>
                  <span className="text-[10px] bg-[#ecfdf5] text-[#065f46] font-bold px-2 py-0.5 rounded-xs border border-[#a7f3d0]">
                    সর্বশেষ
                  </span>
                </div>

                <div className="space-y-3">
                  {articles.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectArticle(item.id)}
                      className="group cursor-pointer p-2.5 rounded-xs hover:bg-[#fcf3f3] border-b border-[#eeeae0] last:border-0 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] bg-[#fef2f2] text-[#991b1b] font-bold px-1.5 py-0.2 rounded-xs border border-[#fecaca]">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-[#737373] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.publishedAt}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#1f2937] group-hover:text-[#b91c1c] transition-colors leading-snug font-['Noto_Serif_Bengali'] line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Stories Ranking (১, ২, ৩, ৪, ৫) */}
              <div className="bg-white rounded-xs p-5 border border-[#ded8cb] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-2">
                  <h3 className="font-bold text-sm text-[#1a1a1a] flex items-center gap-2 font-['Noto_Serif_Bengali']">
                    <TrendingUp className="w-4 h-4 text-[#b91c1c]" />
                    <span>সবচেয়ে পঠিত খবর</span>
                  </h3>
                  <span className="text-[10px] text-[#737373]">আজকের ট্রেন্ডিং</span>
                </div>

                <div className="space-y-3">
                  {articles.slice(0, 5).map((item, index) => {
                    const banglaDigits = ['১', '২', '৩', '৪', '৫'];
                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelectArticle(item.id)}
                        className="group cursor-pointer flex items-start gap-3 p-2 rounded-xs hover:bg-[#fcf8f0] transition-colors border-b border-[#f3efe6] last:border-0"
                      >
                        <span className="text-2xl font-black text-[#b91c1c]/40 group-hover:text-[#b91c1c] transition-colors font-['Noto_Serif_Bengali'] shrink-0 w-6">
                          {banglaDigits[index] || index + 1}
                        </span>
                        <div className="space-y-1 flex-1">
                          <span className="text-[10px] text-[#737373] font-bold">{item.category}</span>
                          <h4 className="text-xs font-bold text-[#1a1a1a] group-hover:text-[#b91c1c] transition-colors line-clamp-2 font-['Noto_Serif_Bengali']">
                            {item.title}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick QR & Subscription Card */}
              <div className="bg-[#1a1a1a] text-white p-5 rounded-xs space-y-3 border-t-3 border-t-[#b91c1c]">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#fbbf24]" />
                  <h4 className="text-xs font-bold text-[#e5e5e5] uppercase tracking-wider font-['Noto_Serif_Bengali']">
                    মোবাইলে পড়তে QR স্ক্যান করুন
                  </h4>
                </div>
                <p className="text-xs text-[#a3a3a3] leading-relaxed">
                  BARTA PROHOR 24 সরাসরি আপনার মোবাইল ফোনে পড়তে বা শেয়ার করতে QR কোড ব্যবহার করুন।
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 font-['Noto_Serif_Bengali']">
                  <button
                    onClick={onOpenQR}
                    className="bg-[#262626] hover:bg-[#333] text-[#fbbf24] font-bold py-2 rounded-xs text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-[#404040]"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR দেখুন</span>
                  </button>
                  <button
                    onClick={onOpenSubscribe}
                    className="bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold py-2 rounded-xs text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>সাবস্ক্রাইব</span>
                  </button>
                </div>
              </div>
            </aside>
          </div>

          {/* Video Highlights Section (Dedicated Video Showcase Row) */}
          {videoArticles.length > 0 && (
            <section className="bg-[#141414] text-white p-6 rounded-xs space-y-4 border border-[#2d2d2d] shadow-md">
              <div className="flex items-center justify-between border-b border-[#333333] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#b91c1c] text-white flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white font-['Noto_Serif_Bengali'] flex items-center gap-2">
                      <span>ভিডিও বুলেটিন ও এক্সক্লুসিভ ফুটেজ</span>
                      <span className="w-2 h-2 rounded-full bg-[#b91c1c] animate-ping" />
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => onSelectCategory('ভিডিও ও লাইভ')}
                  className="text-xs font-bold text-[#fbbf24] hover:underline cursor-pointer flex items-center gap-1 font-['Noto_Serif_Bengali']"
                >
                  <span>সব ভিডিও দেখুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videoArticles.map((vItem) => (
                  <div
                    key={vItem.id}
                    onClick={() => onSelectArticle(vItem.id)}
                    className="group bg-[#1e1e1e] rounded-xs overflow-hidden border border-[#333] hover:border-[#b91c1c] transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative h-44 overflow-hidden bg-black">
                      <img
                        src={vItem.featuredImage?.url || getCategoryFallbackImage(vItem.category)}
                        alt={vItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#b91c1c]/90 group-hover:bg-[#b91c1c] group-hover:scale-110 text-white flex items-center justify-center shadow-lg transition-transform">
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 left-2 bg-[#b91c1c] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs font-['Noto_Serif_Bengali']">
                        {vItem.category}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#fbbf24] transition-colors leading-snug line-clamp-2 font-['Noto_Serif_Bengali']">
                        {vItem.title}
                      </h4>
                      <p className="text-[11px] text-[#a3a3a3] line-clamp-1">
                        {vItem.videoCaption || vItem.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: বিনোদন ও খেলাধুলা (Entertainment & Sports Showcase) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* বিনোদন Column */}
            <div className="bg-white p-5 rounded-xs border border-[#ded8cb] shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-5 bg-[#b91c1c]" />
                  <h3 className="text-base sm:text-lg font-black text-[#1a1a1a] font-['Noto_Serif_Bengali']">
                    বিনোদন ও টলিউড
                  </h3>
                </div>
                <button
                  onClick={() => onSelectCategory('বিনোদন')}
                  className="text-xs font-bold text-[#b91c1c] hover:underline cursor-pointer flex items-center gap-0.5 font-['Noto_Serif_Bengali']"
                >
                  <span>সব দেখুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {entertainmentArticles.map((eItem) => (
                  <div
                    key={eItem.id}
                    onClick={() => onSelectArticle(eItem.id)}
                    className="group cursor-pointer flex gap-3 pb-3 border-b border-[#eeeae0] last:border-0 last:pb-0"
                  >
                    <div className="w-28 h-20 shrink-0 overflow-hidden rounded-xs bg-[#f3efe6]">
                      <img
                        src={eItem.featuredImage?.url || getCategoryFallbackImage(eItem.category)}
                        alt={eItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] text-[#b91c1c] font-bold">{eItem.subcategory || 'সিনেমা'}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-[#1a1a1a] group-hover:text-[#b91c1c] transition-colors leading-snug line-clamp-2 font-['Noto_Serif_Bengali']">
                        {eItem.title}
                      </h4>
                      <span className="text-[10px] text-[#737373] block">{eItem.publishedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* খেলাধুলা Column */}
            <div className="bg-white p-5 rounded-xs border border-[#ded8cb] shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-5 bg-[#047857]" />
                  <h3 className="text-base sm:text-lg font-black text-[#1a1a1a] font-['Noto_Serif_Bengali']">
                    খেলাধুলা ও স্পোর্টস
                  </h3>
                </div>
                <button
                  onClick={() => onSelectCategory('খেলাধুলা')}
                  className="text-xs font-bold text-[#047857] hover:underline cursor-pointer flex items-center gap-0.5 font-['Noto_Serif_Bengali']"
                >
                  <span>সব দেখুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {sportsArticles.map((sItem) => (
                  <div
                    key={sItem.id}
                    onClick={() => onSelectArticle(sItem.id)}
                    className="group cursor-pointer flex gap-3 pb-3 border-b border-[#eeeae0] last:border-0 last:pb-0"
                  >
                    <div className="w-28 h-20 shrink-0 overflow-hidden rounded-xs bg-[#f3efe6]">
                      <img
                        src={sItem.featuredImage?.url || getCategoryFallbackImage(sItem.category)}
                        alt={sItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] text-[#047857] font-bold">{sItem.subcategory || 'ফুটবল / ক্রিকেট'}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-[#1a1a1a] group-hover:text-[#047857] transition-colors leading-snug line-clamp-2 font-['Noto_Serif_Bengali']">
                        {sItem.title}
                      </h4>
                      <span className="text-[10px] text-[#737373] block">{sItem.publishedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

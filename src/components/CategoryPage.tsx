import React from 'react';
import { 
  ArrowLeft, 
  Clock, 
  ArrowUpRight, 
  Play, 
  Flame, 
  Sparkles, 
  AlertTriangle,
  FolderOpen,
  Lock,
  Headphones
} from 'lucide-react';
import { NewsArticle } from '../types';
import { getCategoryFallbackImage } from '../utils/imageCompressor';

interface CategoryPageProps {
  categoryName: string;
  articles: NewsArticle[];
  onSelectArticle: (articleId: string) => void;
  onGoHome: () => void;
  onOpenAdmin: () => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categoryName,
  articles,
  onSelectArticle,
  onGoHome,
  onOpenAdmin,
}) => {
  // Filter articles for this category
  const filteredArticles = categoryName === 'ভিডিও ও লাইভ'
    ? articles.filter(a => a.videoUrl || a.category.includes('ভিডিও'))
    : articles.filter(a => 
        a.category.toLowerCase().includes(categoryName.toLowerCase()) || 
        categoryName.toLowerCase().includes(a.category.toLowerCase())
      );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Category Header & Breadcrumb */}
      <div className="bg-white border border-[#ded8cb] p-4 sm:p-6 rounded-xs space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#737373] font-['Noto_Serif_Bengali']">
            <button
              onClick={onGoHome}
              className="text-[#b91c1c] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>প্রচ্ছদে ফিরে যান</span>
            </button>
            <span>/</span>
            <span className="text-[#1a1a1a] font-bold">বিভাগ: {categoryName}</span>
          </div>

          <button
            onClick={onOpenAdmin}
            className="bg-[#1a1a1a] hover:bg-[#b91c1c] text-white text-xs font-bold px-3 py-1.5 rounded-xs transition-colors flex items-center gap-1 font-['Noto_Serif_Bengali'] cursor-pointer"
          >
            <Lock className="w-3 h-3" />
            <span>+ এই বিভাগে খবর যোগ করুন</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#ded8cb] pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xs bg-[#b91c1c] text-white flex items-center justify-center font-bold text-lg font-['Noto_Serif_Bengali'] shadow-xs">
              {categoryName.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1a1a1a] font-['Noto_Serif_Bengali'] flex items-center gap-2">
                <span>{categoryName} সংবাদ ও আপডেট</span>
                {categoryName.includes('বিনোদন') && <Sparkles className="w-5 h-5 text-[#fbbf24]" />}
                {categoryName.includes('খেলা') && <Flame className="w-5 h-5 text-[#f97316]" />}
              </h1>
              <p className="text-xs text-[#525252] mt-0.5 font-['Noto_Serif_Bengali']">
                {categoryName} সংক্রান্ত সমস্ত তাজা খবর ও বিশ্লেষণ
              </p>
            </div>
          </div>

          <div className="self-start sm:self-auto bg-[#f8f6f0] border border-[#ded8cb] px-3 py-1 rounded-xs text-xs font-bold text-[#1a1a1a] font-['Noto_Serif_Bengali']">
            মোট খবর: <span className="text-[#b91c1c]">{filteredArticles.length}</span> টি
          </div>
        </div>
      </div>

      {/* Articles Grid or Empty State */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white p-12 text-center border border-[#ded8cb] rounded-xs space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#fef2f2] text-[#b91c1c] flex items-center justify-center mx-auto">
            <FolderOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-[#1a1a1a] font-['Noto_Serif_Bengali']">
              '{categoryName}' বিভাগে এখনও কোনো খবর নেই
            </h3>
            <p className="text-xs text-[#737373] max-w-md mx-auto">
              আপনি অ্যাডমিন প্যানেল থেকে খুব সহজেই এই বিভাগে ফটো, ভিডিও ও অডিও সহ নতুন খবর প্রকাশ করতে পারেন।
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onGoHome}
              className="bg-white hover:bg-[#f3efe6] text-[#1a1a1a] border border-[#ded8cb] text-xs font-bold px-4 py-2 rounded-xs font-['Noto_Serif_Bengali'] cursor-pointer"
            >
              ← হোমপেজে ফিরুন
            </button>
            <button
              onClick={onOpenAdmin}
              className="bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold px-4 py-2 rounded-xs font-['Noto_Serif_Bengali'] cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>+ খবর প্রকাশ করুন</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article.id)}
              className="group bg-white rounded-xs border border-[#ded8cb] hover:border-[#b91c1c] overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden bg-[#f3efe6]">
                <img
                  src={article.featuredImage?.url || getCategoryFallbackImage(article.category)}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 bg-[#b91c1c] text-white text-[11px] font-bold px-2 py-0.5 rounded-xs font-['Noto_Serif_Bengali']">
                  {article.category}
                </span>

                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  {article.videoUrl && (
                    <span className="bg-[#1a1a1a]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-xs flex items-center gap-1 font-['Noto_Serif_Bengali']">
                      <Play className="w-3 h-3 fill-white text-white" />
                      <span>ভিডিও</span>
                    </span>
                  )}
                  {article.audioUrl && (
                    <span className="bg-[#1a1a1a]/90 text-[#fbbf24] text-[10px] font-bold px-2 py-0.5 rounded-xs flex items-center gap-1 font-['Noto_Serif_Bengali']">
                      <Headphones className="w-3 h-3" />
                      <span>অডিও</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[11px] text-[#737373] flex items-center gap-2 mb-1.5">
                    <Clock className="w-3 h-3 text-[#737373]" />
                    <span>{article.publishedAt}</span>
                    <span>•</span>
                    <span>{article.location}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#1a1a1a] group-hover:text-[#b91c1c] transition-colors leading-snug line-clamp-2 font-['Noto_Serif_Bengali']">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#525252] line-clamp-2 mt-1.5 leading-relaxed font-['Noto_Serif_Bengali']">
                    {article.subtitle || article.paragraphs?.[0]}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#ded8cb] flex items-center justify-between text-xs font-bold font-['Noto_Serif_Bengali']">
                  <span className="text-[#737373]">{article.author?.name || 'বার্তা প্রহর ব্যুরো'}</span>
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
    </div>
  );
};

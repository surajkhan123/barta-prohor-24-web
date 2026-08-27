import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  CheckCircle, 
  ShieldCheck, 
  AlertTriangle, 
  Share2, 
  Bookmark, 
  Flame, 
  User, 
  Eye, 
  Tv, 
  Maximize2, 
  X, 
  Camera,
  Heart,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';
import { NewsArticle } from '../types';

interface ArticleHeroProps {
  article: NewsArticle;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onShareClick: () => void;
}

export const ArticleHero: React.FC<ArticleHeroProps> = ({
  article,
  isBookmarked,
  onToggleBookmark,
  onShareClick,
}) => {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Combine featured image and any gallery images
  const allImages = [
    ...(article.featuredImage ? [article.featuredImage] : []),
    ...(article.galleryImages || [])
  ];

  const currentPhoto = allImages[selectedPhotoIndex] || article.featuredImage;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (allImages.length > 0) {
      setSelectedPhotoIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (allImages.length > 0) {
      setSelectedPhotoIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  return (
    <header id="article-hero-section" className="space-y-5">
      {/* Category and Badges Breadcrumb with Crisp Editorial Rules */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ded8cb] pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#b91c1c] text-white font-extrabold text-xs px-2.5 py-0.5 rounded-xs tracking-wider font-['Noto_Serif_Bengali']">
            {article.category}
          </span>
          {article.subcategory && (
            <span className="bg-white text-[#1a1a1a] border border-[#ded8cb] font-bold text-xs px-2 py-0.5 rounded-xs">
              {article.subcategory}
            </span>
          )}
          <span className="bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] font-medium text-xs px-2 py-0.5 rounded-xs flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
            <span>পরিবারের সূত্র: দুজনেই সুরক্ষিত</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="hero-bookmark-btn"
            onClick={onToggleBookmark}
            className={`p-1.5 rounded-xs border transition-all cursor-pointer ${
              isBookmarked 
                ? 'bg-[#fef2f2] border-[#f87171] text-[#b91c1c]' 
                : 'bg-white border-[#ded8cb] text-[#525252] hover:text-[#1a1a1a] hover:bg-[#f3efe6]'
            }`}
            title={isBookmarked ? 'সংরক্ষণ সরানো হয়েছে' : 'খবরটি সংরক্ষণ করুন'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#b91c1c]' : ''}`} />
          </button>
          <button
            id="hero-share-btn"
            onClick={onShareClick}
            className="p-1.5 rounded-xs border border-[#ded8cb] bg-white text-[#525252] hover:text-[#1a1a1a] hover:bg-[#f3efe6] transition-colors cursor-pointer"
            title="শেয়ার করুন"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Headline - Classic Newspaper Bengali Serif */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black leading-[1.25] text-[#1a1a1a] font-['Noto_Serif_Bengali'] tracking-tight">
        {article.title}
      </h1>

      {/* Subtitle / Lead Summary with Editorial Pullout Styling */}
      <p className="text-base sm:text-lg lg:text-xl text-[#262626] leading-relaxed font-normal border-l-4 border-[#b91c1c] pl-4 py-2.5 bg-[#f3efe6] rounded-r-xs font-['Noto_Serif_Bengali']">
        {article.subtitle}
      </p>

      {/* Author & Timestamp Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#525252] py-2 border-y border-[#ded8cb]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xs bg-[#1a1a1a] text-white flex items-center justify-center font-bold text-xs border border-[#404040]">
            BP
          </div>
          <div>
            <div className="font-bold text-[#1a1a1a]">{article.author.name}</div>
            <div className="text-[#737373] text-[11px]">{article.author.role}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#525252]">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#737373]" />
            <span>প্রকাশিত: {article.publishedAt}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#b91c1c]" />
            <span>{article.location}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-[#1a1a1a] bg-white border border-[#ded8cb] px-2 py-0.5 rounded-xs">
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>

      {/* Lead Press Photograph / Multiple Photos Carousel */}
      <figure className="relative bg-white border border-[#ded8cb] rounded-none sm:rounded-xs overflow-hidden shadow-2xs">
        <div 
          className="relative bg-[#1a1a1a] overflow-hidden group cursor-pointer"
          onClick={() => {
            setSelectedPhotoIndex(0);
            setIsPhotoModalOpen(true);
          }}
        >
          {/* Main Photo Layout */}
          <div className="relative min-h-[300px] sm:min-h-[420px] lg:min-h-[460px] flex items-center justify-center bg-gradient-to-b from-[#262626] to-[#121212]">
            {article.featuredImage?.url && (
              <img
                src={article.featuredImage.url}
                alt={article.featuredImage.alt}
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[520px] object-contain sm:object-cover mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
              />
            )}

            {/* Editorial overlay badge */}
            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
              <span className="bg-[#b91c1c] text-white text-[11px] font-bold px-2.5 py-1 rounded-xs flex items-center gap-1.5 shadow-md font-['Noto_Serif_Bengali']">
                <Camera className="w-3.5 h-3.5" />
                <span>{article.featuredImage?.caption || 'সংবাদের এক্সক্লুসিভ ছবি'}</span>
              </span>
              {allImages.length > 1 && (
                <span className="bg-[#1d4ed8] text-white text-[11px] font-bold px-2.5 py-1 rounded-xs flex items-center gap-1 shadow-md">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{allImages.length} টি ছবি</span>
                </span>
              )}
            </div>

            {/* Click to expand overlay hint */}
            <div className="absolute bottom-3 right-3 bg-[#1a1a1a]/85 hover:bg-[#b91c1c] text-white text-xs px-2.5 py-1 rounded-xs flex items-center gap-1.5 border border-[#404040] shadow-md transition-colors">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>বড় করে দেখুন</span>
            </div>
          </div>
        </div>

        {/* Thumbnail gallery strip underneath lead image if multiple images exist */}
        {allImages.length > 1 && (
          <div className="p-2.5 bg-[#121212] border-t border-[#262626] flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-[#a3a3a3] shrink-0 font-['Noto_Serif_Bengali'] flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#f87171]" />
              সব ছবি:
            </span>
            {allImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedPhotoIndex(idx);
                  setIsPhotoModalOpen(true);
                }}
                className={`relative shrink-0 rounded-xs overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedPhotoIndex === idx ? 'border-[#b91c1c] scale-105' : 'border-[#404040] opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.alt || `Photo ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-14 h-10 sm:w-16 sm:h-11 object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Caption & Photo Credits */}
        <figcaption className="p-3.5 sm:p-4 bg-[#fbf9f4] border-t border-[#ded8cb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="text-[#262626] font-['Noto_Serif_Bengali'] leading-relaxed">
            <strong className="text-[#b91c1c] font-bold mr-1.5">[বিশেষ প্রতিবেদন]</strong>
            {article.featuredImage?.caption || 'অভিনেতা খরাজ মুখোপাধ্যায় ও তাঁর স্ত্রী প্রতিভা মুখোপাধ্যায়।'}
          </div>
          {article.featuredImage?.credit && (
            <div className="shrink-0 text-[#737373] text-[11px] font-mono border-t sm:border-t-0 sm:border-l border-[#ded8cb] pt-1 sm:pt-0 sm:pl-3">
              {article.featuredImage.credit}
            </div>
          )}
        </figcaption>
      </figure>

      {/* Editorial Graphic Visual Feature Box with News Artwork Framing */}
      <div className="relative rounded-none sm:rounded-sm overflow-hidden bg-[#1a1a1a] text-white border border-[#2d2d2d] shadow-sm">
        <div className="p-5 sm:p-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex-1 space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-[#b91c1c] text-white text-[11px] font-bold uppercase tracking-wider font-['Noto_Serif_Bengali']">
              <Tv className="w-3.5 h-3.5" />
              <span>BARTA PROHOR 24 স্পেশাল কভারেজ</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-['Noto_Serif_Bengali'] leading-snug">
              নেপালে শুটিং ও বন্যা: খরাজ মুখোপাধ্যায়ের সুস্থতার বার্তা
            </h3>
            <p className="text-[#d4d4d4] text-xs sm:text-sm leading-relaxed max-w-xl">
              নতুন বাংলা ছবির আউটডোর শুটিংয়ে স্ত্রী প্রতিভা মুখোপাধ্যায়কে নিয়ে কাঠমান্ডু গিয়েছিলেন প্রবীণ অভিনেতা। পাহাড়ি অঞ্চলে হড়পা বানের মধ্যেও দুজনেই সম্পূর্ণ সুরক্ষিত রয়েছেন।
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <span className="bg-[#262626] border border-[#404040] text-[#fcd34d] text-xs px-2.5 py-1 rounded-xs font-medium">
                ⚠️ পাহাড়ি সড়কপথে ধস ও যোগাযোগ ব্যাহত
              </span>
              <span className="bg-[#064e3b] border border-[#059669] text-[#6ee7b7] text-xs px-2.5 py-1 rounded-xs font-medium">
                🛡️ হোটেল ও নিরাপদ স্থানে সুরক্ষিত অবস্থান
              </span>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-56 bg-[#262626] border border-[#404040] p-3.5 rounded-xs text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#1a1a1a] text-[#f87171] flex items-center justify-center font-bold text-base border border-[#b91c1c]">
              🎭
            </div>
            <h4 className="text-white font-bold text-sm font-['Noto_Serif_Bengali']">খরাজ মুখোপাধ্যায়</h4>
            <p className="text-xs text-[#a3a3a3]">বিশিষ্ট অভিনেতা ও নাট্যব্যক্তিত্ব</p>
            <div className="text-[11px] bg-[#1a1a1a] text-[#fbbf24] px-2 py-1 rounded-xs border border-[#333333] font-['Noto_Serif_Bengali']">
              সহধর্মিণী: প্রতিভা মুখোপাধ্যায়
            </div>
          </div>
        </div>

        {/* Subtle halftone backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#b91c1c_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
      </div>

      {/* Fullscreen Photo Lightbox Modal with Multi-Photo Navigation */}
      {isPhotoModalOpen && currentPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-[#1a1a1a] border border-[#333333] rounded-xs overflow-hidden shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 bg-[#121212] border-b border-[#333333]">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#b91c1c]" />
                <h4 className="font-bold text-sm font-['Noto_Serif_Bengali']">
                  {currentPhoto.caption || article.title}
                </h4>
                {allImages.length > 1 && (
                  <span className="text-xs bg-[#262626] text-[#fcd34d] px-2 py-0.5 rounded-xs font-mono">
                    {selectedPhotoIndex + 1} / {allImages.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-1 rounded-xs bg-[#262626] hover:bg-[#b91c1c] text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative p-2 sm:p-4 bg-black flex items-center justify-center min-h-[300px]">
              <img
                src={currentPhoto.url}
                alt={currentPhoto.alt || article.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain rounded-xs"
              />

              {/* Prev / Next buttons if multiple photos */}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-[#b91c1c] text-white transition-colors cursor-pointer"
                    title="আগের ছবি"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-[#b91c1c] text-white transition-colors cursor-pointer"
                    title="পরের ছবি"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="p-4 bg-[#1a1a1a] border-t border-[#333333] space-y-1">
              <p className="text-xs sm:text-sm text-[#e5e5e5] font-['Noto_Serif_Bengali']">
                {currentPhoto.caption}
              </p>
              <div className="text-[11px] text-[#a3a3a3] font-mono">
                {currentPhoto.credit || 'BARTA PROHOR 24 ডিজিটাল ডেস্ক'}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};


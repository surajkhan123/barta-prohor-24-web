import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Search, 
  Bell, 
  Share2, 
  Globe, 
  Menu, 
  X, 
  Radio, 
  Calendar, 
  CloudRain,
  Bookmark,
  CheckCircle2,
  Lock,
  QrCode
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onSubscribeClick: () => void;
  onBookmarkClick: () => void;
  onAdminClick: () => void;
  onQRClick: () => void;
  bookmarkedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSubscribeClick, 
  onBookmarkClick, 
  onAdminClick,
  onQRClick,
  bookmarkedCount 
}) => {
  const [currentDate, setCurrentDate] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('বিনোদন');
  const [subscribedToast, setSubscribedToast] = useState(false);

  useEffect(() => {
    // Format Bengali current date
    const now = new Date();
    const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    
    // Bengali digits helper
    const toBengaliNumber = (n: number) => {
      const bDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return n.toString().split('').map(d => bDigits[parseInt(d, 10)] || d).join('');
    };

    const dayName = days[now.getDay()];
    const dateNum = toBengaliNumber(now.getDate());
    const monthName = months[now.getMonth()];
    const yearNum = toBengaliNumber(now.getFullYear());

    setCurrentDate(`${dayName}, ${dateNum} ${monthName} ${yearNum}`);
  }, []);

  const categories = [
    { name: 'প্রচ্ছদ', slug: 'home' },
    { name: 'বিনোদন', slug: 'entertainment', hot: true },
    { name: 'দেশ-বিদেশ', slug: 'national-international' },
    { name: 'রাজ্য', slug: 'state' },
    { name: 'আবহাওয়া ও দুর্যোগ', slug: 'weather', alert: true },
    { name: 'রাজনীতি', slug: 'politics' },
    { name: 'খেলাধুলা', slug: 'sports' },
    { name: 'ভিডিও ও লাইভ', slug: 'live-tv', isLive: true },
  ];

  return (
    <header id="main-header" className="w-full bg-[#f8f7f2] border-b border-[#ded8cb] sticky top-0 z-40">
      {/* Top Utility Dateline Bar */}
      <div className="bg-[#1a1a1a] text-[#d4d4d4] text-xs py-1 px-4 sm:px-8 border-b border-[#2d2d2d]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[#e5e5e5] font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#b91c1c]" />
              <span>{currentDate || 'বৃহস্পতিবার, ২৭ আগস্ট ২০২৬'}</span>
            </div>
            <div className="hidden md:flex items-center gap-2 border-l border-[#404040] pl-4 text-xs">
              <CloudRain className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span className="text-[#e5e5e5]">কাঠমান্ডু: ২২°C (ভারী বৃষ্টিপাত)</span>
              <span className="text-[#525252]">|</span>
              <span className="text-[#a3a3a3]">কলকাতা: ৩০°C (আংশিক মেঘলা)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5">
              <button
                id="header-qr-btn"
                onClick={onQRClick}
                className="bg-[#262626] hover:bg-[#b91c1c] text-[#fbbf24] hover:text-white px-2 py-0.5 rounded-xs text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer border border-[#404040]"
                title="কিউআর কোড ডাউনলোড ও শেয়ার"
              >
                <QrCode className="w-3 h-3" />
                <span>QR কোড</span>
              </button>

              <button
                id="header-admin-btn"
                onClick={onAdminClick}
                className="bg-[#b91c1c] hover:bg-[#991b1b] text-white px-2.5 py-0.5 rounded-xs text-[11px] font-bold tracking-wide transition-colors flex items-center gap-1 cursor-pointer border border-[#7f1d1d]"
                title="নিউজডেস্ক অ্যাডমিন প্যানেল"
              >
                <Lock className="w-3 h-3" />
                <span>অ্যাডমিন নিউজডেস্ক</span>
              </button>
            </div>

            <div className="flex items-center gap-1 text-[#34d399] bg-[#064e3b]/80 border border-[#059669]/60 px-2 py-0.5 rounded-xs text-[11px] font-medium animate-pulse hidden sm:flex">
              <Radio className="w-3 h-3 text-[#34d399]" />
              <span>লাইভ</span>
            </div>

            <button
              id="top-subscribe-btn"
              onClick={onSubscribeClick}
              className="bg-[#1a1a1a] hover:bg-[#333333] text-white px-2.5 py-0.5 rounded-xs text-xs font-semibold tracking-wide transition-colors flex items-center gap-1 cursor-pointer border border-[#404040]"
            >
              <Bell className="w-3 h-3" />
              <span>সাবস্ক্রাইব</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Newspaper Masthead Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left edition info (desktop) */}
        <div className="hidden lg:flex flex-col text-[11px] text-[#525252] space-y-0.5">
          <span className="font-bold text-[#1a1a1a]">কলকাতা ও ঢাকা সংস্করণ</span>
          <span>রেজিঃ WB/NEWS/2024/782</span>
          <span>বর্ষ ৪ • সংখ্যা ৩১৮ • পৃষ্ঠা ১২</span>
        </div>

        {/* Brand Masthead with Classic News Typography */}
        <div className="flex items-center gap-3 select-none cursor-pointer">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#1a1a1a] hover:bg-[#eae5db] rounded-xs transition-colors"
            aria-label="মেনু খুলুন"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <BrandLogo size="md" showTagline={true} />
        </div>

        {/* Action icons on right */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden sm:block">
            {isSearchOpen ? (
              <div className="flex items-center gap-1 bg-white border border-[#1a1a1a] rounded-xs px-2.5 py-1">
                <Search className="w-3.5 h-3.5 text-[#737373]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="খবর খুঁজুন..."
                  className="bg-transparent border-none text-xs text-[#1a1a1a] focus:outline-hidden w-32 lg:w-44 placeholder-[#a3a3a3]"
                  autoFocus
                />
                <button 
                  onClick={() => setIsSearchOpen(false)} 
                  className="text-[#737373] hover:text-[#1a1a1a] p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                id="search-open-btn"
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 text-[#1a1a1a] hover:bg-[#eae5db] rounded-xs transition-colors flex items-center gap-1.5 text-xs font-semibold border border-[#ded8cb] bg-white cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden md:inline">অনুসন্ধান</span>
              </button>
            )}
          </div>

          <button
            id="header-bookmarks-btn"
            onClick={onBookmarkClick}
            className="p-1.5 text-[#1a1a1a] hover:bg-[#eae5db] rounded-xs transition-colors relative border border-[#ded8cb] bg-white cursor-pointer"
            title="সংরক্ষিত খবর"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarkedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#b91c1c] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {bookmarkedCount}
              </span>
            )}
          </button>

          <button
            id="header-share-btn"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'নেপালে আটকে টলিউড অভিনেতা খরাজ মুখোপাধ্যায় | BARTA PROHOR 24',
                  url: window.location.href,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                setSubscribedToast(true);
                setTimeout(() => setSubscribedToast(false), 3000);
              }
            }}
            className="hidden sm:flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#333333] text-white px-2.5 py-1.5 rounded-xs text-xs font-semibold transition-colors cursor-pointer border border-[#1a1a1a]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>শেয়ার</span>
          </button>
        </div>
      </div>

      {/* Classic Double-Ruled Categories Navigation Bar */}
      <nav className="bg-[#f3efe6] border-y-2 border-[#1a1a1a] hidden lg:block">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <ul className="flex items-center space-x-1 text-xs font-bold py-1">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <button
                  id={`cat-nav-${cat.slug}`}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-3 py-1 rounded-xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer font-['Noto_Serif_Bengali'] ${
                    activeCategory === cat.name
                      ? 'bg-[#b91c1c] text-white shadow-xs'
                      : 'text-[#1a1a1a] hover:bg-[#e4ded2]'
                  }`}
                >
                  {cat.hot && <Flame className="w-3 h-3 text-[#fbbf24] fill-[#fbbf24]" />}
                  {cat.isLive && <span className="w-2 h-2 rounded-full bg-white animate-ping mr-0.5" />}
                  <span>{cat.name}</span>
                  {cat.alert && (
                    <span className="bg-[#fef3c7] text-[#92400e] border border-[#f59e0b] text-[9px] font-bold px-1 py-0.1 rounded-xs">
                      সতর্কবার্তা
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 text-xs font-bold text-[#b91c1c] font-['Noto_Serif_Bengali']">
            <span className="w-2 h-2 rounded-full bg-[#b91c1c] animate-pulse"></span>
            <span>বিশেষ কভারেজ: নেপাল পাহাড়ি বন্যা পরিস্থিতি</span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fbfaf6] border-t-2 border-[#1a1a1a] px-4 py-4 space-y-3">
          <div className="mb-3">
            <div className="flex items-center gap-2 bg-white border border-[#ded8cb] rounded-xs px-3 py-2">
              <Search className="w-4 h-4 text-[#737373]" />
              <input
                type="text"
                placeholder="খবর বা বিষয় দিয়ে খুঁজুন..."
                className="bg-transparent w-full text-xs text-[#1a1a1a] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => {
                  setActiveCategory(cat.name);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-xs text-xs font-bold transition-colors font-['Noto_Serif_Bengali'] ${
                  activeCategory === cat.name
                    ? 'bg-[#b91c1c] text-white'
                    : 'bg-white border border-[#e5dfd3] text-[#1a1a1a] hover:bg-[#f3efe6]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#ded8cb] flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onQRClick();
                }}
                className="bg-[#1a1a1a] hover:bg-[#333333] text-[#fbbf24] py-2 rounded-xs font-bold text-xs flex items-center justify-center gap-1.5 border border-[#333333] cursor-pointer font-['Noto_Serif_Bengali']"
              >
                <QrCode className="w-4 h-4" />
                <span>QR কোড শেয়ার</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onAdminClick();
                }}
                className="bg-[#b91c1c] hover:bg-[#991b1b] text-white py-2 rounded-xs font-bold text-xs flex items-center justify-center gap-1.5 border border-[#7f1d1d] cursor-pointer font-['Noto_Serif_Bengali']"
              >
                <Lock className="w-4 h-4" />
                <span>নিউজ এডিটর</span>
              </button>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSubscribeClick();
              }}
              className="w-full bg-[#1a1a1a] text-white py-2 rounded-xs font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border border-[#333333]"
            >
              <Bell className="w-4 h-4 text-[#fbbf24]" />
              <span>BARTA PROHOR 24 সাবস্ক্রাইব করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification when link copied */}
      {subscribedToast && (
        <div className="fixed bottom-6 right-6 bg-[#1a1a1a] text-white text-xs px-4 py-2.5 rounded-sm shadow-xl z-50 flex items-center gap-2 border border-[#333333] animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
          <span>সংবাদের লিংক সফলভাবে কপি করা হয়েছে!</span>
        </div>
      )}
    </header>
  );
};

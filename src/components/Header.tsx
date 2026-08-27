import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Search, 
  Bell, 
  Share2, 
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
  activeCategory: string;
  onSelectCategory: (categoryName: string) => void;
  onGoHome: () => void;
  onSubscribeClick: () => void;
  onBookmarkClick: () => void;
  onAdminClick: () => void;
  onQRClick: () => void;
  bookmarkedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeCategory,
  onSelectCategory,
  onGoHome,
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
  const [subscribedToast, setSubscribedToast] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  // Track scroll position to collapse header on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'প্রচ্ছদ', slug: 'home', isHome: true },
    { name: 'বিনোদন', slug: 'entertainment', hot: true },
    { name: 'দেশ-বিদেশ', slug: 'national-international' },
    { name: 'রাজ্য', slug: 'state' },
    { name: 'আবহাওয়া ও দুর্যোগ', slug: 'weather', alert: true },
    { name: 'রাজনীতি', slug: 'politics' },
    { name: 'খেলাধুলা', slug: 'sports' },
    { name: 'ভিডিও ও লাইভ', slug: 'live-tv', isLive: true },
  ];

  const handleCategoryClick = (cat: typeof categories[0]) => {
    if (cat.isHome || cat.name === 'প্রচ্ছদ') {
      onGoHome();
    } else {
      onSelectCategory(cat.name);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header id="main-header" className="w-full bg-[#f8f7f2] border-b border-[#ded8cb]">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left edition info (desktop) */}
        <div className="hidden lg:flex flex-col text-[11px] text-[#525252] space-y-0.5">
          <span className="font-bold text-[#1a1a1a]">কলকাতা ও ঢাকা সংস্করণ</span>
          <span>রেজিঃ WB/NEWS/2024/782</span>
          <span>বর্ষ ৪ • সংখ্যা ৩১৮ • পৃষ্ঠা ১২</span>
        </div>

        {/* Brand Masthead (Clicking goes to Homepage) */}
        <div 
          onClick={onGoHome}
          className="flex items-center gap-3 select-none cursor-pointer"
          title="হোমপেজে ফিরে যান"
        >
          <button
            id="mobile-menu-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
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
                  title: 'BARTA PROHOR 24 | সত্যের সন্ধানে নির্ভীক সাংবাদিকতা',
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

      {/* Sleek, Compact Sticky Navigation Bar */}
      <nav className={`w-full transition-all duration-200 z-40 bg-[#f3efe6] border-y-2 border-[#1a1a1a] ${
        isScrolled 
          ? 'sticky top-0 shadow-md bg-[#f3efe6]/95 backdrop-blur-xs py-0.5' 
          : 'relative py-1 hidden lg:block'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Left section in sticky mode */}
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger when scrolled */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1 text-[#1a1a1a] hover:bg-[#eae5db] rounded-xs transition-colors"
              aria-label="মেনু"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {isScrolled && (
              <div 
                className="flex items-center gap-2 cursor-pointer pr-2 border-r border-[#ded8cb]"
                onClick={onGoHome}
                title="হোমপেজে ফিরে যান"
              >
                <div className="bg-[#b91c1c] text-white px-2 py-0.5 rounded-xs text-xs font-black font-['Noto_Serif_Bengali'] flex items-center gap-1">
                  <span>বার্তা প্রহর</span>
                  <span className="bg-[#111827] text-[#fbbf24] px-1 rounded-xs font-sans text-[11px] italic font-black">24</span>
                </div>
              </div>
            )}

            {/* Category tabs */}
            <ul className="hidden lg:flex items-center space-x-1 text-xs font-bold">
              {categories.map((cat) => {
                const isActive = (cat.isHome && activeCategory === 'প্রচ্ছদ') || activeCategory === cat.name;
                return (
                  <li key={cat.slug}>
                    <button
                      id={`cat-nav-${cat.slug}`}
                      onClick={() => handleCategoryClick(cat)}
                      className={`px-2.5 py-1 rounded-xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer font-['Noto_Serif_Bengali'] ${
                        isActive
                          ? 'bg-[#b91c1c] text-white shadow-xs'
                          : 'text-[#1a1a1a] hover:bg-[#e4ded2]'
                      }`}
                    >
                      {cat.hot && <Flame className="w-3 h-3 text-[#fbbf24] fill-[#fbbf24]" />}
                      {cat.isLive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping mr-0.5" />}
                      <span>{cat.name}</span>
                      {cat.alert && (
                        <span className="bg-[#fef3c7] text-[#92400e] border border-[#f59e0b] text-[9px] font-bold px-1 py-0.1 rounded-xs">
                          সতর্কবার্তা
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 text-xs font-bold font-['Noto_Serif_Bengali']">
            {isScrolled ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onQRClick}
                  className="bg-[#1a1a1a] text-[#fbbf24] hover:bg-[#333] px-2 py-0.5 rounded-xs text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  title="কিউআর কোড"
                >
                  <QrCode className="w-3 h-3" />
                  <span className="hidden sm:inline">QR</span>
                </button>
                <button
                  onClick={onAdminClick}
                  className="bg-[#b91c1c] text-white hover:bg-[#991b1b] px-2 py-0.5 rounded-xs text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  title="অ্যাডমিন"
                >
                  <Lock className="w-3 h-3" />
                  <span className="hidden sm:inline">নিউজডেস্ক</span>
                </button>
                <button
                  onClick={onBookmarkClick}
                  className="p-1 text-[#1a1a1a] hover:bg-[#eae5db] rounded-xs relative border border-[#ded8cb] bg-white cursor-pointer"
                  title="বুকমার্ক"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  {bookmarkedCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#b91c1c] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                      {bookmarkedCount}
                    </span>
                  )}
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2 text-[#b91c1c]">
                <span className="w-2 h-2 rounded-full bg-[#b91c1c] animate-pulse"></span>
                <span>২৪ ঘণ্টা সত্য ও দ্রুত সংবাদ পরিবেশন</span>
              </div>
            )}
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
            {categories.map((cat) => {
              const isActive = (cat.isHome && activeCategory === 'প্রচ্ছদ') || activeCategory === cat.name;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryClick(cat)}
                  className={`text-left px-3 py-2 rounded-xs text-xs font-bold transition-colors font-['Noto_Serif_Bengali'] ${
                    isActive
                      ? 'bg-[#b91c1c] text-white'
                      : 'bg-white border border-[#e5dfd3] text-[#1a1a1a] hover:bg-[#f3efe6]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
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

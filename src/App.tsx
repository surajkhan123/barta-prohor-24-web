import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BreakingTicker } from './components/BreakingTicker';
import { HomePage } from './components/HomePage';
import { CategoryPage } from './components/CategoryPage';
import { ArticleHero } from './components/ArticleHero';
import { AudioNewsReader } from './components/AudioNewsReader';
import { ArticleBody } from './components/ArticleBody';
import { ReactionAndPoll } from './components/ReactionAndPoll';
import { CommentSection } from './components/CommentSection';
import { FollowSubscribeCard } from './components/FollowSubscribeCard';
import { RelatedNewsGrid } from './components/RelatedNewsGrid';
import { Footer } from './components/Footer';
import { SubscribeModal } from './components/SubscribeModal';
import { BookmarksModal } from './components/BookmarksModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { QRCodeModal } from './components/QRCodeModal';
import { VideoPlayerCard } from './components/VideoPlayerCard';
import { MAIN_ARTICLE, DEFAULT_ARTICLES } from './data/newsData';
import { NewsArticle, Subscriber } from './types';
import { loadStoredSubscribers, saveSubscribersToStorage } from './data/subscriberStore';
import { 
  Radio, 
  Flame, 
  Clock, 
  ArrowUpRight, 
  ShieldAlert, 
  Sparkles, 
  Eye, 
  Share2, 
  Check, 
  MapPin, 
  Tv, 
  TrendingUp,
  AlertTriangle,
  Lock,
  QrCode,
  Video,
  Headphones,
  Bookmark,
  MessageSquare,
  Home,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

export default function App() {
  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem('bp24_all_articles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_ARTICLES;
  });

  // Current view state: 'home' | 'article' | 'category'
  const [currentView, setCurrentView] = useState<'home' | 'article' | 'category'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('প্রচ্ছদ');
  const [currentArticleId, setCurrentArticleId] = useState<string>(MAIN_ARTICLE.id);

  const article = articles.find(a => a.id === currentArticleId) || articles[0] || MAIN_ARTICLE;

  // Subscriber state loaded from store
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    return loadStoredSubscribers();
  });

  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    return localStorage.getItem(`bp24_bookmark_${article.id}`) === 'true';
  });
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [shareToast, setShareToast] = useState(false);
  const [subToast, setSubToast] = useState<string | null>(null);

  // Sync bookmark state when article changes
  useEffect(() => {
    setIsBookmarked(localStorage.getItem(`bp24_bookmark_${article.id}`) === 'true');
  }, [article.id]);

  // Persist articles list
  useEffect(() => {
    localStorage.setItem('bp24_all_articles', JSON.stringify(articles));
  }, [articles]);

  // Persist subscribers list whenever it changes
  useEffect(() => {
    saveSubscribersToStorage(subscribers);
  }, [subscribers]);

  // Navigation handlers
  const handleGoHome = () => {
    setCurrentView('home');
    setSelectedCategory('প্রচ্ছদ');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catName: string) => {
    if (catName === 'প্রচ্ছদ' || catName === 'home') {
      handleGoHome();
    } else {
      setSelectedCategory(catName);
      setCurrentView('category');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectArticle = (articleId: string) => {
    setCurrentArticleId(articleId);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Subscriber management functions
  const handleAddSubscriber = (subData: Omit<Subscriber, 'id' | 'subscribedAt' | 'timestamp'>) => {
    const dateFormatted = new Intl.DateTimeFormat('bn-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date());

    const newSub: Subscriber = {
      ...subData,
      id: 'sub_' + Math.random().toString(36).substring(2, 9),
      subscribedAt: `আজ, ${dateFormatted}`,
      timestamp: Date.now(),
      status: subData.status || 'active'
    };

    setSubscribers(prev => [newSub, ...prev]);
    setSubToast(subData.email || subData.phone || 'আপনার সাবস্ক্রিপশন');
    setTimeout(() => setSubToast(null), 4000);
  };

  const handleDeleteSubscriber = (id: string) => {
    setSubscribers(prev => prev.filter(s => s.id !== id));
  };

  const handleToggleSubscriberStatus = (id: string) => {
    setSubscribers(prev =>
      prev.map(s =>
        s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s
      )
    );
  };

  // Track scroll progress for reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleBookmark = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    localStorage.setItem(`bp24_bookmark_${article.id}`, nextState.toString());
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.subtitle,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    }
  };

  const handleSaveArticle = (newArticle: NewsArticle) => {
    setArticles(prev => {
      const existingIdx = prev.findIndex(a => a.id === newArticle.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newArticle;
        return updated;
      }
      return [newArticle, ...prev];
    });
    setCurrentArticleId(newArticle.id);
    setCurrentView('article');
  };

  const handleDeleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    if (currentArticleId === id) {
      setCurrentArticleId(MAIN_ARTICLE.id);
      setCurrentView('home');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#1a1a1a] flex flex-col selection:bg-[#b91c1c] selection:text-white font-['Hind_Siliguri',sans-serif]">
      {/* Top Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#991b1b] via-[#b91c1c] to-[#991b1b] z-50 transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Main Header with full interactive category and home routing */}
      <Header
        activeCategory={currentView === 'home' ? 'প্রচ্ছদ' : currentView === 'category' ? selectedCategory : article.category}
        onSelectCategory={handleSelectCategory}
        onGoHome={handleGoHome}
        onSubscribeClick={() => setIsSubscribeOpen(true)}
        onBookmarkClick={() => setIsBookmarksOpen(true)}
        onAdminClick={() => setIsAdminOpen(true)}
        onQRClick={() => setIsQROpen(true)}
        bookmarkedCount={isBookmarked ? 1 : 0}
      />

      {/* Breaking News Ticker */}
      <BreakingTicker />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full pb-20 lg:pb-8">
        {/* VIEW 1: HOMEPAGE (প্রচ্ছদ) */}
        {currentView === 'home' && (
          <HomePage
            articles={articles}
            onSelectArticle={handleSelectArticle}
            onSelectCategory={handleSelectCategory}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onOpenSubscribe={() => setIsSubscribeOpen(true)}
            onOpenQR={() => setIsQROpen(true)}
          />
        )}

        {/* VIEW 2: CATEGORY VIEW (বিভাগ অনুযায়ী সংবাদ) */}
        {currentView === 'category' && (
          <CategoryPage
            categoryName={selectedCategory}
            articles={articles}
            onSelectArticle={handleSelectArticle}
            onGoHome={handleGoHome}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />
        )}

        {/* VIEW 3: SINGLE ARTICLE DETAIL VIEW (বিস্তারিত সংবাদ) */}
        {currentView === 'article' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Breadcrumb Bar */}
            <div className="bg-white border border-[#ded8cb] px-4 py-2.5 rounded-xs flex flex-wrap items-center justify-between gap-2 shadow-2xs font-['Noto_Serif_Bengali'] text-xs">
              <div className="flex items-center gap-2 text-[#737373]">
                <button
                  onClick={handleGoHome}
                  className="text-[#b91c1c] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>প্রচ্ছদ</span>
                </button>
                <ChevronRight className="w-3.5 h-3.5" />
                <button
                  onClick={() => handleSelectCategory(article.category)}
                  className="text-[#1a1a1a] hover:underline font-bold"
                >
                  {article.category}
                </button>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#525252] truncate max-w-xs sm:max-w-md">
                  {article.title}
                </span>
              </div>

              <button
                onClick={handleGoHome}
                className="bg-[#f3efe6] hover:bg-[#ded8cb] text-[#1a1a1a] px-3 py-1 rounded-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>সকল খবর (প্রচ্ছদ)</span>
              </button>
            </div>

            {/* Live Emergency Alert Banner */}
            <div className="p-4 rounded-xs bg-[#fffbeb] border-l-4 border-l-[#b45309] border-y border-r border-[#e6dfd3] text-[#451a03] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xs bg-[#fef3c7] flex items-center justify-center shrink-0 border border-[#f59e0b]/50">
                  <AlertTriangle className="w-4 h-4 text-[#b45309]" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#92400e] flex items-center gap-1.5 font-['Noto_Serif_Bengali']">
                    <span className="w-2 h-2 rounded-full bg-[#b45309] animate-ping" />
                    জরুরি বুলেটিন ডেস্ক:
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-[#78350f] mt-0.5 leading-relaxed">
                    {article.category} ডেস্ক থেকে সর্বশেষ পরিস্থিতি ও সত্যনিষ্ঠ রিপোর্ট
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="shrink-0 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold px-3 py-1.5 rounded-xs transition-colors cursor-pointer border border-[#7f1d1d] flex items-center gap-1 font-['Noto_Serif_Bengali']"
                >
                  <Lock className="w-3 h-3" />
                  <span>নতুন খবর যোগ করুন</span>
                </button>

                {article.videoUrl && (
                  <button
                    onClick={() => {
                      const el = document.getElementById('news-video-player');
                      el?.scrollIntoView({ behavior: 'smooth' });
                      el?.classList.add('ring-4', 'ring-[#b91c1c]');
                      setTimeout(() => el?.classList.remove('ring-4', 'ring-[#b91c1c]'), 2000);
                    }}
                    className="shrink-0 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold px-3 py-1.5 rounded-xs transition-colors cursor-pointer border border-[#7f1d1d] flex items-center gap-1.5 animate-pulse font-['Noto_Serif_Bengali'] shadow-xs"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>ভিডিও দেখুন</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    const el = document.getElementById('audio-news-player');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="shrink-0 bg-[#78350f] hover:bg-[#451a03] text-white text-xs font-bold px-3.5 py-1.5 rounded-xs transition-colors cursor-pointer border border-[#451a03]"
                >
                  অডিও বুলেটিন শুনুন
                </button>
              </div>
            </div>

            {/* 2-Column Content Layout (Article + Sidebar) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Main Story Column (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Headline and Hero */}
                <ArticleHero
                  article={article}
                  isBookmarked={isBookmarked}
                  onToggleBookmark={handleToggleBookmark}
                  onShareClick={handleShareClick}
                />

                {/* Audio News Reader */}
                <AudioNewsReader
                  articleText={article.paragraphs.join(' ')}
                  articleTitle={article.title}
                  durationSeconds={article.audioDuration}
                  audioUrl={article.audioUrl}
                  audioName={article.audioName}
                />

                {/* Dedicated Video Player Card */}
                {article.videoUrl && (
                  <VideoPlayerCard 
                    videoUrl={article.videoUrl}
                    videoCaption={article.videoCaption}
                    title={article.title}
                    category={article.category}
                  />
                )}

                {/* Full Body Article with Reader Controls */}
                <ArticleBody
                  article={article}
                  onShareClick={handleShareClick}
                />

                {/* Follow & Subscribe Section */}
                <FollowSubscribeCard 
                  onOpenModal={() => setIsSubscribeOpen(true)} 
                  onSubscribe={handleAddSubscriber}
                />

                {/* Reader Reactions & Live Opinion Poll */}
                <ReactionAndPoll />

                {/* Reader Comments Section */}
                <CommentSection />
              </div>

              {/* Sidebar Column (4 cols) */}
              <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                {/* Quick Status & Fact-Check Card */}
                <div className="bg-white rounded-xs p-5 border border-[#ded8cb] shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-2">
                    <span className="text-xs font-black uppercase text-[#1a1a1a] tracking-wider flex items-center gap-1.5 font-['Noto_Serif_Bengali']">
                      <Flame className="w-3.5 h-3.5 text-[#b91c1c] fill-[#b91c1c]" />
                      সংক্ষেপ ও ফ্যাক্ট-চেক
                    </span>
                    <span className="text-[10px] bg-[#ecfdf5] text-[#065f46] font-bold px-2 py-0.5 rounded-xs border border-[#a7f3d0]">
                      যাচাইকৃত তথ্য
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="bg-[#fcfbf9] p-3 rounded-xs border-l-3 border-l-[#059669] border-y border-r border-[#e8e4db] space-y-1">
                      <div className="font-bold text-[#1a1a1a]">সংবাদের বর্তমান অবস্থা:</div>
                      <div className="text-[#047857] font-semibold flex items-center gap-1">
                        <span>✓ {article.statusBadge?.text || 'সম্পূর্ণ তথ্য যাচাইকৃত'}</span>
                      </div>
                    </div>

                    <div className="bg-[#fcfbf9] p-3 rounded-xs border-l-3 border-l-[#b91c1c] border-y border-r border-[#e8e4db] space-y-1">
                      <div className="font-bold text-[#1a1a1a]">স্থান ও উৎস:</div>
                      <div className="text-[#4b5563]">{article.location} • {article.author?.name}</div>
                    </div>

                    <div className="bg-[#fcfbf9] p-3 rounded-xs border-l-3 border-l-[#d97706] border-y border-r border-[#e8e4db] space-y-1">
                      <div className="font-bold text-[#1a1a1a]">বিভাগ ও বিষয়:</div>
                      <div className="text-[#4b5563]">{article.category} {article.subcategory ? `• ${article.subcategory}` : ''}</div>
                    </div>
                  </div>
                </div>

                {/* BARTA PROHOR 24 Fast Updates Sidebar */}
                <div className="bg-white rounded-xs p-5 border border-[#ded8cb] shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-2">
                    <h3 className="font-bold text-sm text-[#1a1a1a] flex items-center gap-1.5 font-['Noto_Serif_Bengali']">
                      <Radio className="w-4 h-4 text-[#b91c1c] animate-pulse" />
                      <span>অন্যান্য তাজা খবর</span>
                    </h3>
                    <button
                      onClick={handleGoHome}
                      className="text-[11px] text-[#b91c1c] font-bold hover:underline cursor-pointer"
                    >
                      সব খবর দেখুন
                    </button>
                  </div>

                  <div className="space-y-3">
                    {articles.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => handleSelectArticle(item.id)}
                        className={`group cursor-pointer p-2.5 rounded-xs transition-colors border-b border-[#eeeae0] last:border-0 ${
                          item.id === currentArticleId ? 'bg-[#fcf3f3] border-l-2 border-l-[#b91c1c]' : 'hover:bg-[#f8f6f0]'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] bg-[#fef2f2] text-[#991b1b] font-bold px-1.5 py-0.2 rounded-xs border border-[#fecaca]">
                            {item.category}
                          </span>
                          <span className="text-[11px] text-[#6b7280] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#9ca3af]" />
                            {item.publishedAt}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#1f2937] group-hover:text-[#b91c1c] transition-colors leading-snug font-['Noto_Serif_Bengali'] line-clamp-2">
                          {item.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Share via QR Code Box */}
                <div className="bg-[#1a1a1a] rounded-xs p-5 text-white space-y-3.5 shadow-xs border-t-3 border-t-[#b91c1c] border border-[#2d2d2d]">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#fbbf24]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#e5e5e5] font-['Noto_Serif_Bengali']">
                      পাঠকদের সাথে শেয়ার ও QR কোড
                    </h4>
                  </div>
                  <p className="text-xs text-[#d4d4d4] leading-relaxed">
                    মোবাইল দিয়ে কিউআর কোড স্ক্যান করে যে কেউ তাৎক্ষণিক এই ডিজিটাল সংবাদপত্র পড়তে পারবেন।
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-['Noto_Serif_Bengali']">
                    <button
                      onClick={() => setIsQROpen(true)}
                      className="bg-[#262626] hover:bg-[#333333] text-[#fbbf24] font-bold py-2 rounded-xs text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#404040]"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>QR কোড দেখুন</span>
                    </button>
                    <button
                      onClick={() => setIsSubscribeOpen(true)}
                      className="bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold py-2 rounded-xs text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#7f1d1d]"
                    >
                      <span>সাবস্ক্রাইব</span>
                    </button>
                  </div>
                </div>
              </aside>
            </div>

            {/* Related News Grid Section */}
            <RelatedNewsGrid 
              onSelectCategory={handleSelectCategory}
              onGoHome={handleGoHome}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer 
        onAdminClick={() => setIsAdminOpen(true)}
        onQRClick={() => setIsQROpen(true)}
      />

      {/* Mobile-Friendly Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141414]/95 backdrop-blur-md text-white border-t border-[#2e2e2e] px-2 py-2 flex items-center justify-around shadow-2xl safe-area-bottom font-['Noto_Serif_Bengali']">
        {/* Home Button */}
        <button
          onClick={handleGoHome}
          className={`flex flex-col items-center justify-center p-1 active:scale-95 transition-transform ${
            currentView === 'home' ? 'text-[#fbbf24]' : 'text-[#e5e5e5] hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 font-bold">প্রচ্ছদ</span>
        </button>

        {/* Audio Button */}
        <button
          onClick={() => {
            if (currentView !== 'article') {
              handleSelectArticle(articles[0].id);
            }
            setTimeout(() => {
              const el = document.getElementById('audio-news-player');
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          className="flex flex-col items-center justify-center p-1 text-[#e5e5e5] hover:text-[#fbbf24] active:scale-95 transition-transform"
        >
          <Headphones className="w-4 h-4 text-[#fbbf24]" />
          <span className="text-[10px] mt-0.5 font-bold">অডিও শুনুন</span>
        </button>

        {/* Video Button */}
        <button
          onClick={() => {
            handleSelectCategory('ভিডিও ও লাইভ');
          }}
          className="flex flex-col items-center justify-center p-1.5 px-3 bg-[#b91c1c] text-white rounded-xs shadow-md active:scale-95 transition-transform relative"
        >
          <div className="flex items-center gap-1">
            <Video className="w-4 h-4" />
            <span className="text-[11px] font-black">ভিডিও</span>
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#fef08a] rounded-full animate-ping" />
        </button>

        {/* Share Button */}
        <button
          onClick={handleShareClick}
          className="flex flex-col items-center justify-center p-1 text-[#e5e5e5] hover:text-[#38bdf8] active:scale-95 transition-transform"
        >
          <Share2 className="w-4 h-4 text-[#38bdf8]" />
          <span className="text-[10px] mt-0.5">শেয়ার</span>
        </button>

        {/* Bookmark Button */}
        <button
          onClick={handleToggleBookmark}
          className={`flex flex-col items-center justify-center p-1 active:scale-95 transition-transform ${
            isBookmarked ? 'text-[#f87171]' : 'text-[#e5e5e5] hover:text-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#b91c1c] text-[#b91c1c]' : ''}`} />
          <span className="text-[10px] mt-0.5">{isBookmarked ? 'সংরক্ষিত' : 'সেভ'}</span>
        </button>

        {/* Admin Quick Link */}
        <button
          onClick={() => setIsAdminOpen(true)}
          className="flex flex-col items-center justify-center p-1 text-[#a3a3a3] hover:text-white active:scale-95 transition-transform"
        >
          <Lock className="w-3.5 h-3.5 text-[#a3a3a3]" />
          <span className="text-[9px] mt-0.5">অ্যাডমিন</span>
        </button>
      </div>

      {/* Modals */}
      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
        onSubscribe={handleAddSubscriber}
      />

      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedArticle={isBookmarked ? article : null}
        onRemoveBookmark={() => {
          setIsBookmarked(false);
          localStorage.removeItem(`bp24_bookmark_${article.id}`);
        }}
      />

      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        articles={articles}
        currentArticleId={currentArticleId}
        onSelectArticle={(art) => handleSelectArticle(art.id)}
        onSaveArticle={handleSaveArticle}
        onDeleteArticle={handleDeleteArticle}
        onOpenQRModal={() => setIsQROpen(true)}
        subscribers={subscribers}
        onAddSubscriber={handleAddSubscriber}
        onDeleteSubscriber={handleDeleteSubscriber}
        onToggleSubscriberStatus={handleToggleSubscriberStatus}
      />

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        newsTitle={article.title}
      />

      {/* Share Toast */}
      {shareToast && (
        <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 bg-[#1a1a1a] text-white text-xs px-4 py-2.5 rounded-sm shadow-xl z-50 flex items-center gap-2 border border-[#333333] animate-bounce font-['Noto_Serif_Bengali']">
          <Check className="w-4 h-4 text-[#34d399]" />
          <span>সংবাদের লিংক সফলভাবে কপি করা হয়েছে!</span>
        </div>
      )}

      {/* Subscription Success Notification Toast */}
      {subToast && (
        <div className="fixed bottom-16 sm:bottom-6 left-4 sm:left-6 bg-[#065f46] text-white text-xs px-4 py-3 rounded-xs shadow-2xl z-50 flex items-center gap-2.5 border border-[#10b981] font-['Noto_Serif_Bengali'] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-5 h-5 rounded-full bg-[#10b981] text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold">সফলভাবে সাবস্ক্রিপশন সম্পন্ন হয়েছে!</div>
            <div className="text-[11px] opacity-90">{subToast} এ প্রতিদিনের তাজা খবর ও ই-পেপার পৌঁছে যাবে।</div>
          </div>
        </div>
      )}
    </div>
  );
}

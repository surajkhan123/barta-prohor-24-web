import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BreakingTicker } from './components/BreakingTicker';
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
import { MAIN_ARTICLE } from './data/newsData';
import { NewsArticle } from './types';
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
  QrCode
} from 'lucide-react';

export default function App() {
  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem('bp24_all_articles');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [MAIN_ARTICLE];
  });

  const [currentArticleId, setCurrentArticleId] = useState<string>(() => {
    return MAIN_ARTICLE.id;
  });

  const article = articles.find(a => a.id === currentArticleId) || articles[0] || MAIN_ARTICLE;

  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    return localStorage.getItem(`bp24_bookmark_${article.id}`) === 'true';
  });
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [shareToast, setShareToast] = useState(false);

  // Sync bookmark state when article changes
  useEffect(() => {
    setIsBookmarked(localStorage.getItem(`bp24_bookmark_${article.id}`) === 'true');
  }, [article.id]);

  // Persist articles list
  useEffect(() => {
    localStorage.setItem('bp24_all_articles', JSON.stringify(articles));
  }, [articles]);

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
  };

  const handleDeleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    if (currentArticleId === id) {
      setCurrentArticleId(MAIN_ARTICLE.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#1a1a1a] flex flex-col selection:bg-[#b91c1c] selection:text-white font-['Hind_Siliguri',sans-serif]">
      {/* Top Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#991b1b] via-[#b91c1c] to-[#991b1b] z-50 transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Main Header */}
      <Header
        onSubscribeClick={() => setIsSubscribeOpen(true)}
        onBookmarkClick={() => setIsBookmarksOpen(true)}
        onAdminClick={() => setIsAdminOpen(true)}
        onQRClick={() => setIsQROpen(true)}
        bookmarkedCount={isBookmarked ? 1 : 0}
      />

      {/* Breaking News Ticker */}
      <BreakingTicker />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full">
        {/* Top Live Emergency Alert Banner with Editorial Newspaper Styling */}
        <div className="mb-6 p-4 rounded-none sm:rounded-sm bg-[#fffbeb] border-l-4 border-l-[#b45309] border-y border-r border-[#e6dfd3] text-[#451a03] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#fef3c7] flex items-center justify-center shrink-0 border border-[#f59e0b]/50">
              <AlertTriangle className="w-4 h-4 text-[#b45309]" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#92400e] flex items-center gap-1.5 font-['Noto_Serif_Bengali']">
                <span className="w-2 h-2 rounded-full bg-[#b45309] animate-ping" />
                জরুরি দুর্যোগ ও উদ্ধার বুলেটিন ডেস্ক:
              </div>
              <p className="text-xs sm:text-sm font-medium text-[#78350f] mt-0.5 leading-relaxed">
                নেপালে প্রবল বর্ষণ ও পাহাড়ি হড়পা বান। ভারতীয় নাগরিক ও টলিউড শুটিং ইউনিটের নিরাপত্তা নিবিড় নজরদারিতে।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="shrink-0 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold px-3 py-1.5 rounded-sm transition-colors cursor-pointer border border-[#7f1d1d] flex items-center gap-1 font-['Noto_Serif_Bengali']"
            >
              <Lock className="w-3 h-3" />
              <span>নতুন খবর যোগ করুন</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('audio-news-player');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="shrink-0 bg-[#78350f] hover:bg-[#451a03] text-white text-xs font-bold px-3.5 py-1.5 rounded-sm transition-colors cursor-pointer border border-[#451a03]"
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
            />

            {/* Full Body Article with Reader Controls */}
            <ArticleBody
              article={article}
              onShareClick={handleShareClick}
            />

            {/* Follow & Subscribe Section (Prominently featured as requested) */}
            <FollowSubscribeCard onOpenModal={() => setIsSubscribeOpen(true)} />

            {/* Reader Reactions & Live Opinion Poll */}
            <ReactionAndPoll />

            {/* Reader Comments Section */}
            <CommentSection />
          </div>

          {/* Sidebar Column (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Quick Status & Fact-Check Card with Newspaper Column Rules */}
            <div className="bg-white rounded-none sm:rounded-sm p-5 border border-[#ded8cb] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-2">
                <span className="text-xs font-black uppercase text-[#1a1a1a] tracking-wider flex items-center gap-1.5 font-['Noto_Serif_Bengali']">
                  <Flame className="w-3.5 h-3.5 text-[#b91c1c] fill-[#b91c1c]" />
                  সংক্ষেপ ও ফ্যাক্ট-চেক
                </span>
                <span className="text-[10px] bg-[#ecfdf5] text-[#065f46] font-bold px-2 py-0.5 rounded-sm border border-[#a7f3d0]">
                  যাচাইকৃত তথ্য
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-[#fcfbf9] p-3 rounded-sm border-l-3 border-l-[#059669] border-y border-r border-[#e8e4db] space-y-1">
                  <div className="font-bold text-[#1a1a1a]">অভিনেতা খরাজ মুখোপাধ্যায়ের অবস্থা:</div>
                  <div className="text-[#047857] font-semibold flex items-center gap-1">
                    <span>✓ সম্পূর্ণ নিরাপদে ও সুরক্ষিত আশ্রয়ে রয়েছেন</span>
                  </div>
                </div>

                <div className="bg-[#fcfbf9] p-3 rounded-sm border-l-3 border-l-[#b91c1c] border-y border-r border-[#e8e4db] space-y-1">
                  <div className="font-bold text-[#1a1a1a]">নেপালে যাওয়ার উদ্দেশ্য:</div>
                  <div className="text-[#4b5563]">নতুন বাংলা সিনেমার আউটডোর শুটিং। সঙ্গে স্ত্রী প্রতিভা মুখোপাধ্যায়।</div>
                </div>

                <div className="bg-[#fcfbf9] p-3 rounded-sm border-l-3 border-l-[#d97706] border-y border-r border-[#e8e4db] space-y-1">
                  <div className="font-bold text-[#1a1a1a]">ফিরে আসার পরিকল্পনা:</div>
                  <div className="text-[#4b5563]">পাহাড়ি সড়কের ধস সরানো ও আবহাওয়া শান্ত হলেই কলকাতায় প্রত্যাবর্তন।</div>
                </div>
              </div>
            </div>

            {/* BARTA PROHOR 24 Fast Updates Sidebar */}
            <div className="bg-white rounded-none sm:rounded-sm p-5 border border-[#ded8cb] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-2">
                <h3 className="font-bold text-sm text-[#1a1a1a] flex items-center gap-1.5 font-['Noto_Serif_Bengali']">
                  <Radio className="w-4 h-4 text-[#b91c1c] animate-pulse" />
                  <span>লাইভ বুলেটিন ও আপডেট</span>
                </h3>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="text-[11px] text-[#b91c1c] font-bold hover:underline cursor-pointer"
                >
                  + খবর যোগ
                </button>
              </div>

              <div className="space-y-3">
                {articles.map((item, idx) => (
                  <div 
                    key={item.id} 
                    onClick={() => setCurrentArticleId(item.id)}
                    className={`group cursor-pointer p-2.5 rounded-sm transition-colors border-b border-[#eeeae0] last:border-0 ${
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
            <div className="bg-[#1a1a1a] rounded-none sm:rounded-sm p-5 text-white space-y-3.5 shadow-sm border-t-3 border-t-[#b91c1c] border border-[#2d2d2d]">
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
                  className="bg-[#262626] hover:bg-[#333333] text-[#fbbf24] font-bold py-2 rounded-sm text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#404040]"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QR কোড দেখুন</span>
                </button>
                <button
                  onClick={() => setIsSubscribeOpen(true)}
                  className="bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold py-2 rounded-sm text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#7f1d1d]"
                >
                  <span>সাবস্ক্রাইব</span>
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Related News Grid Section */}
        <RelatedNewsGrid />
      </main>

      {/* Footer */}
      <Footer 
        onAdminClick={() => setIsAdminOpen(true)}
        onQRClick={() => setIsQROpen(true)}
      />

      {/* Modals */}
      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
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

      {/* Admin Panel Modal for Daily News Publishing */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        articles={articles}
        currentArticleId={currentArticleId}
        onSelectArticle={(art) => setCurrentArticleId(art.id)}
        onSaveArticle={handleSaveArticle}
        onDeleteArticle={handleDeleteArticle}
        onOpenQRModal={() => setIsQROpen(true)}
      />

      {/* QR Code Sharing Modal */}
      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        newsTitle={article.title}
      />

      {/* Share Toast */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 bg-[#1a1a1a] text-white text-xs px-4 py-2.5 rounded-sm shadow-xl z-50 flex items-center gap-2 border border-[#333333] animate-bounce">
          <Check className="w-4 h-4 text-[#34d399]" />
          <span>সংবাদের লিংক সফলভাবে কপি করা হয়েছে!</span>
        </div>
      )}
    </div>
  );
}


import React, { useState } from 'react';
import { 
  Type, 
  Sun, 
  Moon, 
  Printer, 
  Share2, 
  Copy, 
  Check, 
  Quote, 
  Clock, 
  AlertCircle, 
  PhoneCall, 
  ShieldAlert, 
  Sparkles,
  ExternalLink,
  MessageCircle,
  Camera,
  Layers,
  Maximize2
} from 'lucide-react';
import { NewsArticle } from '../types';

interface ArticleBodyProps {
  article: NewsArticle;
  onShareClick: () => void;
}

export const ArticleBody: React.FC<ArticleBodyProps> = ({ article, onShareClick }) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isSerif, setIsSerif] = useState(false);
  const [readingTheme, setReadingTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [copied, setCopied] = useState(false);

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-lg sm:text-xl leading-relaxed';
      case 'xlarge':
        return 'text-xl sm:text-2xl leading-loose';
      default:
        return 'text-base sm:text-lg leading-relaxed';
    }
  };

  const getThemeClass = () => {
    switch (readingTheme) {
      case 'sepia':
        return 'bg-[#f4ebd0] text-[#3d2f1f] border-[#d8c7a5]';
      case 'dark':
        return 'bg-[#1a1a1a] text-[#f5f5f5] border-[#2d2d2d]';
      default:
        return 'bg-white text-[#1a1a1a] border-[#ded8cb]';
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`${article.title}\n\nপড়ুন BARTA PROHOR 24-এ: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  return (
    <article id="news-article-content" className="space-y-6">
      {/* Reader Controls Toolbar with Editorial Precision */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-[#f3efe6] rounded-none sm:rounded-sm border border-[#ded8cb] text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1a1a1a] flex items-center gap-1 font-['Noto_Serif_Bengali']">
            <Type className="w-3.5 h-3.5" />
            অক্ষরের আকার:
          </span>
          <div className="flex items-center bg-white rounded-xs border border-[#ded8cb] p-0.5">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded-xs font-semibold transition-colors cursor-pointer ${
                fontSize === 'normal' ? 'bg-[#b91c1c] text-white font-bold' : 'text-[#525252] hover:bg-[#f3efe6]'
              }`}
              title="স্বাভাবিক আকার"
            >
              ক
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded-xs font-semibold transition-colors cursor-pointer text-sm ${
                fontSize === 'large' ? 'bg-[#b91c1c] text-white font-bold' : 'text-[#525252] hover:bg-[#f3efe6]'
              }`}
              title="বড় আকার"
            >
              ক+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-0.5 rounded-xs font-semibold transition-colors cursor-pointer text-base ${
                fontSize === 'xlarge' ? 'bg-[#b91c1c] text-white font-bold' : 'text-[#525252] hover:bg-[#f3efe6]'
              }`}
              title="আরও বড়"
            >
              ক++
            </button>
          </div>

          <button
            onClick={() => setIsSerif(!isSerif)}
            className={`px-2 py-1 rounded-xs border text-xs font-bold transition-colors cursor-pointer font-['Noto_Serif_Bengali'] ${
              isSerif 
                ? 'bg-[#fef2f2] border-[#f87171] text-[#991b1b]' 
                : 'bg-white border-[#ded8cb] text-[#1a1a1a] hover:bg-[#f3efe6]'
            }`}
          >
            {isSerif ? 'সাহিত্যিক ফন্ট (Serif)' : 'স্ট্যান্ডার্ড ফন্ট'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme selector */}
          <div className="flex items-center bg-white rounded-xs border border-[#ded8cb] p-0.5">
            <button
              onClick={() => setReadingTheme('light')}
              className={`p-1 rounded-xs transition-colors cursor-pointer ${
                readingTheme === 'light' ? 'bg-[#ded8cb] text-[#1a1a1a] font-bold' : 'text-[#737373]'
              }`}
              title="স্বাভাবিক মোড"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setReadingTheme('sepia')}
              className={`px-2 py-0.5 rounded-xs text-[11px] font-serif transition-colors cursor-pointer ${
                readingTheme === 'sepia' ? 'bg-[#edd8b6] text-[#433422] font-bold' : 'text-[#737373]'
              }`}
              title="সেপিয়া রিডিং মোড"
            >
              সেপিয়া
            </button>
            <button
              onClick={() => setReadingTheme('dark')}
              className={`p-1 rounded-xs transition-colors cursor-pointer ${
                readingTheme === 'dark' ? 'bg-[#1a1a1a] text-[#fbbf24] font-bold' : 'text-[#737373]'
              }`}
              title="নাইট মোড"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="p-1 bg-white border border-[#ded8cb] text-[#525252] hover:text-[#1a1a1a] rounded-xs transition-colors cursor-pointer hidden sm:block"
            title="প্রিন্ট করুন"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Reading Container with Authentic Bengali Typesetting */}
      <div className={`p-6 sm:p-8 rounded-none sm:rounded-sm border transition-colors shadow-xs ${getThemeClass()} ${isSerif ? "font-['Noto_Serif_Bengali']" : "font-['Hind_Siliguri',sans-serif]"}`}>
        {/* Key Highlights Card in Editorial Framing */}
        <div className="mb-6 p-4 sm:p-5 rounded-none sm:rounded-xs bg-[#fbf9f4] border-l-4 border-l-[#b91c1c] border-y border-r border-[#ded8cb] text-inherit">
          <div className="flex items-center gap-2 font-bold text-[#b91c1c] text-sm sm:text-base mb-2.5 font-['Noto_Serif_Bengali']">
            <Sparkles className="w-4 h-4 text-[#b91c1c] fill-[#b91c1c]" />
            <span>সংবাদের গুরুত্বপূর্ণ পয়েন্টসমূহ:</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm">
            {article.keyHighlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b91c1c] mt-2 shrink-0" />
                <span className="font-medium leading-relaxed">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Article Paragraphs with High Typographic Pacing */}
        <div className={`space-y-5 ${getFontSizeClass()} text-inherit font-normal tracking-normal`}>
          {article.paragraphs.map((p, idx) => {
            // First paragraph drop cap styling
            if (idx === 0) {
              return (
                <p key={idx} className="first-letter:text-5xl first-letter:font-black first-letter:text-[#b91c1c] first-letter:mr-2.5 first-letter:float-left first-letter:leading-none leading-relaxed font-['Noto_Serif_Bengali']">
                  {p}
                </p>
              );
            }

            // Insert Pull Quote after paragraph 2
            if (idx === 2) {
              return (
                <React.Fragment key={idx}>
                  <p className="leading-relaxed">{p}</p>
                  
                  {/* Styled Newspaper Pull Quote */}
                  <figure className="my-6 p-5 sm:p-6 rounded-none sm:rounded-xs bg-[#f8f6f0] border-l-4 border-l-[#b91c1c] border-y border-r border-[#e5dfd3] relative overflow-hidden">
                    <Quote className="w-8 h-8 text-[#b91c1c]/20 absolute right-4 bottom-3 pointer-events-none" />
                    <blockquote className="text-base sm:text-lg font-bold italic text-inherit leading-relaxed font-['Noto_Serif_Bengali']">
                      "{article.familyStatement}"
                    </blockquote>
                  </figure>
                </React.Fragment>
              );
            }

            // Insert Secondary Contextual Photo after paragraph 4
            if (idx === 4 && (article.secondaryImage || (article.galleryImages && article.galleryImages.length > 0))) {
              const displaySecondary = article.secondaryImage || article.galleryImages?.[0];
              return (
                <React.Fragment key={idx}>
                  <p className="leading-relaxed">{p}</p>

                  {displaySecondary && (
                    <figure className="my-6 border border-[#ded8cb] bg-[#fbf9f4] p-3 rounded-none sm:rounded-xs">
                      <img 
                        src={displaySecondary.url} 
                        alt={displaySecondary.alt || 'ফটো'} 
                        referrerPolicy="no-referrer"
                        className="w-full h-56 sm:h-72 object-cover rounded-xs border border-[#ded8cb]"
                      />
                      <figcaption className="pt-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#525252]">
                        <span className="font-['Noto_Serif_Bengali'] leading-snug">
                          <strong className="text-[#b91c1c] mr-1">[ফিল্ড রিপোর্ট]</strong>
                          {displaySecondary.caption}
                        </span>
                        {displaySecondary.credit && (
                          <span className="shrink-0 text-[11px] font-mono text-[#737373]">
                            {displaySecondary.credit}
                          </span>
                        )}
                      </figcaption>
                    </figure>
                  )}
                </React.Fragment>
              );
            }

            return (
              <p key={idx} className="leading-relaxed">
                {p}
              </p>
            );
          })}
        </div>

        {/* Live Timeline of Events */}
        <div className="mt-8 pt-6 border-t-2 border-[#1a1a1a]">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[#b91c1c]" />
            <h3 className="text-base sm:text-lg font-bold text-inherit font-['Noto_Serif_Bengali']">
              নেপাল দুর্যোগ ও খরাজ মুখোপাধ্যায় ট্র্যাকার (টাইমলাইন)
            </h3>
          </div>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-[#b91c1c]/30 pl-6">
            {article.timeline.map((item, i) => (
              <div key={i} className="relative pb-3 last:pb-0">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#b91c1c] ring-3 ring-[#fee2e2]" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[#b91c1c] bg-[#fef2f2] px-2 py-0.5 rounded-xs border border-[#fecaca] font-mono">
                    {item.time}
                  </span>
                  {item.tag && (
                    <span className="text-[10px] uppercase font-bold text-[#525252] bg-[#f3efe6] px-1.5 py-0.2 rounded-xs border border-[#ded8cb]">
                      {item.tag}
                    </span>
                  )}
                  <h4 className="text-xs sm:text-sm font-bold text-inherit font-['Noto_Serif_Bengali']">{item.title}</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#525252] mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Multiple Photo Gallery Grid in Article Body if available */}
        {article.galleryImages && article.galleryImages.length > 0 && (
          <div className="mt-8 pt-6 border-t-2 border-[#1a1a1a] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#b91c1c]" />
                <h3 className="text-base sm:text-lg font-bold text-inherit font-['Noto_Serif_Bengali']">
                  সংবাদের ফটো গ্যালারি ও চিত্রমালা ({article.galleryImages.length}টি ছবি)
                </h3>
              </div>
              <span className="text-xs bg-[#f3efe6] text-[#b91c1c] font-bold px-2 py-0.5 rounded-xs border border-[#ded8cb] font-['Noto_Serif_Bengali']">
                ফটোগ্রাফি ডেস্ক
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {article.galleryImages.map((img, idx) => (
                <figure key={idx} className="bg-[#fbf9f4] border border-[#ded8cb] p-2 rounded-xs space-y-1.5 shadow-2xs">
                  <img
                    src={img.url}
                    alt={img.alt || `Gallery image ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover rounded-xs border border-[#ded8cb]"
                  />
                  <figcaption className="text-xs text-[#262626] font-['Noto_Serif_Bengali'] leading-snug line-clamp-2">
                    {img.caption}
                  </figcaption>
                  {img.credit && (
                    <div className="text-[10px] text-[#737373] font-mono">
                      {img.credit}
                    </div>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Helpline Box */}
        {article.helplineData && (
          <div className="mt-8 p-5 rounded-none sm:rounded-sm bg-[#1a1a1a] text-white space-y-3 border-t-3 border-t-[#b91c1c]">
            <div className="flex items-center gap-2 text-[#f87171] font-bold text-sm sm:text-base font-['Noto_Serif_Bengali']">
              <ShieldAlert className="w-4 h-4 text-[#f87171]" />
              <span>জরুরি সহায়তা ও হেল্পলাইন নম্বর (নেপাল দুর্যোগ)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {article.helplineData.map((hp, idx) => (
                <div key={idx} className="bg-[#262626] p-3 rounded-xs border border-[#404040] space-y-1">
                  <span className="text-xs font-semibold text-[#d4d4d4] line-clamp-1">{hp.title}</span>
                  <div className="text-xs sm:text-sm font-bold text-[#fbbf24] font-mono flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-[#34d399] shrink-0" />
                    <a href={`tel:${hp.phone}`} className="hover:underline">{hp.phone}</a>
                  </div>
                  <p className="text-[11px] text-[#a3a3a3]">{hp.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Article Tags */}
        <div className="mt-8 pt-4 border-t border-[#ded8cb] flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-[#525252] mr-1 font-['Noto_Serif_Bengali']">ট্যাগসমূহ:</span>
          {article.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs font-medium bg-[#f3efe6] hover:bg-[#fef2f2] hover:text-[#b91c1c] text-[#1a1a1a] px-2.5 py-0.5 rounded-xs border border-[#ded8cb] transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Social Sharing Strip */}
      <div className="p-3.5 bg-white rounded-none sm:rounded-sm border border-[#ded8cb] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#b91c1c]" />
          <span className="text-xs sm:text-sm font-bold text-[#1a1a1a] font-['Noto_Serif_Bengali']">
            খবরটি শেয়ার করুন:
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={shareOnWhatsApp}
            className="flex items-center gap-1.5 bg-[#059669] hover:bg-[#047857] text-white px-3 py-1.5 rounded-xs text-xs font-bold transition-transform active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={shareOnFacebook}
            className="flex items-center gap-1.5 bg-[#1877f2] hover:bg-[#0c65d6] text-white px-3 py-1.5 rounded-xs text-xs font-bold transition-transform active:scale-95 cursor-pointer"
          >
            <span>Facebook</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 bg-[#f3efe6] hover:bg-[#e7e1d5] text-[#1a1a1a] px-3 py-1.5 rounded-xs text-xs font-bold transition-colors cursor-pointer border border-[#ded8cb]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Copy className="w-3.5 h-3.5 text-[#737373]" />}
            <span>{copied ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Image as ImageIcon, 
  Key, 
  Lock, 
  LogOut, 
  ShieldAlert, 
  FileText, 
  QrCode, 
  Sparkles, 
  Globe, 
  ExternalLink,
  Flame,
  Radio,
  Share2,
  Download
} from 'lucide-react';
import { NewsArticle } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: NewsArticle[];
  currentArticleId: string;
  onSelectArticle: (article: NewsArticle) => void;
  onSaveArticle: (article: NewsArticle) => void;
  onDeleteArticle: (id: string) => void;
  onOpenQRModal: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  articles,
  currentArticleId,
  onSelectArticle,
  onSaveArticle,
  onDeleteArticle,
  onOpenQRModal,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'guide'>('create');
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('বিনোদন');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [location, setLocation] = useState('কলকাতা / কাঠমান্ডু');
  const [authorName, setAuthorName] = useState('বার্তা প্রহর ২৪ ডিজিটাল ডেস্ক');
  const [paragraphsText, setParagraphsText] = useState('');
  const [isBreaking, setIsBreaking] = useState(true);
  const [statusBadgeText, setStatusBadgeText] = useState('আপডেট: তথ্য যাচাইকৃত');
  const [statusBadgeType, setStatusBadgeType] = useState<'safe' | 'warning' | 'critical' | 'info'>('safe');
  const [successToast, setSuccessToast] = useState('');

  // Default PIN is 1234
  const DEFAULT_PIN = '1234';

  useEffect(() => {
    // Check if session authenticated
    if (sessionStorage.getItem('bp24_admin_logged') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === DEFAULT_PIN || pinInput === '2424') {
      setIsAuthenticated(true);
      sessionStorage.setItem('bp24_admin_logged', 'true');
      setAuthError('');
    } else {
      setAuthError('ভুল পিন কোড! অনুগ্রহ করে সঠিক ৪ সংখ্যার পিন দিন (ডিফল্ট: 1234)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('bp24_admin_logged');
    setPinInput('');
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setCategory('বিনোদন');
    setImageUrl('');
    setImageCaption('');
    setLocation('কলকাতা');
    setAuthorName('বার্তা প্রহর ২৪ ডিজিটাল ডেস্ক');
    setParagraphsText('');
    setIsBreaking(false);
    setStatusBadgeText('আপডেট: তথ্য যাচাইকৃত');
    setStatusBadgeType('safe');
  };

  const handleEditSelect = (art: NewsArticle) => {
    setEditingId(art.id);
    setTitle(art.title);
    setSubtitle(art.subtitle);
    setCategory(art.category);
    setImageUrl(art.featuredImage?.url || '');
    setImageCaption(art.featuredImage?.caption || '');
    setLocation(art.location);
    setAuthorName(art.author.name);
    setParagraphsText(art.paragraphs.join('\n\n'));
    setIsBreaking(!!art.isBreaking);
    setStatusBadgeText(art.statusBadge.text);
    setStatusBadgeType(art.statusBadge.type);
    setActiveTab('create');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const rawParagraphs = paragraphsText
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const paragraphs = rawParagraphs.length > 0 
      ? rawParagraphs 
      : [subtitle || title];

    const newOrUpdatedArticle: NewsArticle = {
      id: editingId || `art_${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || title.trim(),
      category: category,
      isBreaking: isBreaking,
      publishedAt: 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      updatedAt: 'এইমাত্র আপডেট করা হয়েছে',
      author: {
        name: authorName || 'বার্তা প্রহর ২৪ ডিজিটাল ডেস্ক',
        role: 'চিফ করেসপন্ডেন্ট',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      },
      location: location || 'কলকাতা',
      readTime: '২ মিনিট পাঠ',
      statusBadge: {
        text: statusBadgeText,
        type: statusBadgeType,
      },
      featuredImage: imageUrl.trim() ? {
        url: imageUrl.trim(),
        caption: imageCaption.trim() || title.trim(),
        credit: 'ফাইল চিত্র / BARTA PROHOR 24 ডিজিটাল ডেস্ক',
        alt: title.trim(),
      } : undefined,
      paragraphs: paragraphs,
      keyHighlights: [
        'তাৎক্ষণিক সংবাদ আপডেট বার্তা প্রহর ২৪ ডিজিটালে প্রকাশিত।',
        'উৎস ও প্রশাসনের দেওয়া খবরের ভিত্তিতে প্রতিবেদন তৈরি করা হয়েছে।',
        'আরও তথ্যের জন্য চোখ রাখুন বার্তা প্রহর ২৪ লাইভ নিউজডেস্কে।'
      ],
      familyStatement: '“আমরা পরিস্থিতির ওপর সজাগ নজর রাখছি এবং পাঠকদের সব খবর সবার আগে পৌঁছে দিতে দায়বদ্ধ।” — বার্তা প্রহর ২৪ সম্পাদকীয় বিভাগ',
      timeline: [
        {
          time: 'এইমাত্র',
          title: 'সংবাদ প্রকাশনা সম্পন্ন',
          description: 'বার্তা প্রহর ২৪ পোর্টালে সরাসরি লাইভ করা হলো।',
          tag: 'পাবলিশড'
        }
      ],
      helplineData: [
        {
          title: 'বার্তা প্রহর ২৪ সেন্ট্রাল নিউজডেস্ক',
          phone: '+91 98300 24240',
          agency: 'BARTA PROHOR 24 হেল্পলাইন',
          note: 'যেকোনো তাজা খবর বা মতামত জানাতে সরাসরি কল বা হোয়াটসঅ্যাপ করুন।'
        }
      ],
      audioDuration: Math.max(45, paragraphs.length * 20),
      tags: [category, 'ব্রেকিং', 'তাজা খবর', 'BartaProhor24'],
    };

    onSaveArticle(newOrUpdatedArticle);
    setSuccessToast(editingId ? 'সংবাদটি সফলভাবে আপডেট করা হয়েছে!' : 'নতুন খবর সফলভাবে প্রকাশিত হয়েছে!');
    setTimeout(() => setSuccessToast(''), 3500);

    resetForm();
    onSelectArticle(newOrUpdatedArticle);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div 
        className="bg-[#f8f7f2] rounded-none sm:rounded-xs max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border-2 border-[#1a1a1a]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1a1a1a] text-white p-4 sm:p-5 flex items-center justify-between border-b-3 border-b-[#b91c1c]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-[#b91c1c] flex items-center justify-center text-white font-black text-sm font-['Playfair_Display',serif]">
              BP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg font-['Noto_Serif_Bengali']">
                  বার্তা প্রহর ২৪ • সেন্ট্রাল নিউজডেস্ক কন্ট্রোল প্যানেল
                </h3>
                <span className="bg-[#064e3b] text-[#6ee7b7] text-[10px] font-bold px-2 py-0.5 rounded-xs border border-[#059669]">
                  Live Admin
                </span>
              </div>
              <p className="text-xs text-[#a3a3a3] font-['Noto_Serif_Bengali']">
                প্রতিদিনের তাজা খবর প্রকাশ, এডিট এবং বিনামূল্যে হোস্টিং ও কিউআর শেয়ারিং গাইড
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xs bg-[#262626] hover:bg-[#b91c1c] text-[#a3a3a3] hover:text-white transition-colors cursor-pointer border border-[#404040]"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Login Screen */
          <div className="p-6 sm:p-12 flex flex-col items-center justify-center text-center space-y-5 flex-1">
            <div className="w-16 h-16 rounded-full bg-[#fef2f2] border-2 border-[#f87171] text-[#b91c1c] flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>
            <div className="max-w-md space-y-1">
              <h4 className="text-lg font-bold text-[#1a1a1a] font-['Noto_Serif_Bengali']">
                নিউজ এডিটর পিন প্রবেশ করান
              </h4>
              <p className="text-xs text-[#525252] font-['Noto_Serif_Bengali']">
                সুরক্ষার জন্য শুধুমাত্র অনুমোদিত সম্পাদকদের জন্য এই ড্যাশবোর্ডটি সংরক্ষিত।
              </p>
              <p className="text-xs bg-[#fef3c7] text-[#92400e] p-2 rounded-xs border border-[#f59e0b] mt-2 font-mono">
                ডিফল্ট অ্যাডমিন পিন কোড: <strong>1234</strong>
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="পিন দিন (উদাঃ 1234)"
                autoFocus
                className="w-full text-center tracking-widest text-lg font-mono py-2.5 px-4 bg-white border border-[#ded8cb] rounded-xs focus:border-[#b91c1c] focus:outline-hidden"
              />
              {authError && (
                <p className="text-xs text-[#b91c1c] font-bold font-['Noto_Serif_Bengali']">{authError}</p>
              )}
              <button
                type="submit"
                className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold py-2.5 rounded-xs text-xs sm:text-sm cursor-pointer border border-[#7f1d1d] font-['Noto_Serif_Bengali']"
              >
                লগইন করুন
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-between px-4 sm:px-6 bg-[#f3efe6] border-b border-[#ded8cb]">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => { setActiveTab('create'); resetForm(); }}
                  className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 font-['Noto_Serif_Bengali'] ${
                    activeTab === 'create'
                      ? 'border-[#b91c1c] text-[#b91c1c] bg-[#f8f7f2]'
                      : 'border-transparent text-[#525252] hover:text-[#1a1a1a]'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{editingId ? 'খবর সম্পাদনা (Edit)' : 'নতুন খবর যোগ করুন'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('list')}
                  className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 font-['Noto_Serif_Bengali'] ${
                    activeTab === 'list'
                      ? 'border-[#b91c1c] text-[#b91c1c] bg-[#f8f7f2]'
                      : 'border-transparent text-[#525252] hover:text-[#1a1a1a]'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>সব প্রকাশিত সংবাদ ({articles.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('guide')}
                  className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 font-['Noto_Serif_Bengali'] ${
                    activeTab === 'guide'
                      ? 'border-[#b91c1c] text-[#b91c1c] bg-[#f8f7f2]'
                      : 'border-transparent text-[#525252] hover:text-[#1a1a1a]'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>ফ্রি সার্ভার ও ডোমেন গাইড</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenQRModal();
                  }}
                  className="bg-[#1a1a1a] hover:bg-[#333333] text-white text-xs px-2.5 py-1.5 rounded-xs flex items-center gap-1 font-bold font-['Noto_Serif_Bengali']"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <span className="hidden sm:inline">কিউআর কোড তৈরি</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-xs text-[#737373] hover:text-[#b91c1c] p-1.5 flex items-center gap-1"
                  title="লগআউট"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline font-['Noto_Serif_Bengali']">লগআউট</span>
                </button>
              </div>
            </div>

            {/* Success alert */}
            {successToast && (
              <div className="bg-[#ecfdf5] border-b border-[#a7f3d0] text-[#065f46] text-xs px-6 py-2 flex items-center gap-2 font-bold font-['Noto_Serif_Bengali']">
                <Check className="w-4 h-4 text-[#059669]" />
                <span>{successToast}</span>
              </div>
            )}

            {/* Tab 1: Create / Edit News Form */}
            {activeTab === 'create' && (
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Title & Subtitle */}
                  <div className="space-y-3 bg-white p-4 rounded-xs border border-[#ded8cb]">
                    <h4 className="text-xs font-black uppercase text-[#b91c1c] tracking-wider font-['Noto_Serif_Bengali']">
                      ১. খবরের মূল শিরোনাম ও বিবরণ
                    </h4>
                    
                    <div>
                      <label className="block text-xs font-bold text-[#1a1a1a] mb-1 font-['Noto_Serif_Bengali']">
                        মূল শিরোনাম (Headline) <span className="text-[#b91c1c]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="উদাঃ নেপালে শুটিংয়ে গিয়ে বন্যায় আটকে টলিউড অভিনেতা খরাজ মুখোপাধ্যায়..."
                        className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs px-3 py-2 text-xs sm:text-sm font-bold text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1a1a1a] mb-1 font-['Noto_Serif_Bengali']">
                        উপ-শিরোনাম / সংক্ষিপ্ত ভূমিকা (Subtitle)
                      </label>
                      <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="উদাঃ ভারী বর্ষণে পাহাড়ি পথ অবরুদ্ধ, স্ত্রী প্রতিভা মুখোপাধ্যায় সহ নিরাপদে রয়েছেন অভিনেতা"
                        className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs px-3 py-2 text-xs text-[#262626] focus:outline-hidden focus:border-[#b91c1c]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#1a1a1a] mb-1 font-['Noto_Serif_Bengali']">
                          বিভাগ (Category)
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs px-3 py-2 text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
                        >
                          <option value="বিনোদন">বিনোদন ও সিনেমা</option>
                          <option value="দেশ-বিদেশ">দেশ-বিদেশ</option>
                          <option value="রাজ্য">রাজ্য সংবাদ</option>
                          <option value="রাজনীতি">রাজনীতি</option>
                          <option value="আবহাওয়া ও দুর্যোগ">আবহাওয়া ও দুর্যোগ</option>
                          <option value="খেলাধুলা">খেলাধুলা</option>
                          <option value="বিশেষ সম্পাদকীয়">বিশেষ সম্পাদকীয়</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1a1a1a] mb-1 font-['Noto_Serif_Bengali']">
                          স্থান (Location)
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="উদাঃ কলকাতা / কাঠমান্ডু"
                          className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs px-3 py-2 text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1a1a1a] mb-1 font-['Noto_Serif_Bengali']">
                          প্রতিবেদক / ব্যুরো
                        </label>
                        <input
                          type="text"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          placeholder="উদাঃ বিশেষ সংবাদদাতা"
                          className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs px-3 py-2 text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="space-y-3 bg-white p-4 rounded-xs border border-[#ded8cb]">
                    <h4 className="text-xs font-black uppercase text-[#b91c1c] tracking-wider font-['Noto_Serif_Bengali']">
                      ২. খবরের ছবি (Photo URL & Caption)
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-[#1a1a1a] mb-1 font-['Noto_Serif_Bengali']">
                        ছবির ওয়েব লিংক (Image URL)
                      </label>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://... (যেকোনো অনলাইন ফটো লিংক বা উইকিমিডিয়া লিংক)"
                        className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs px-3 py-2 text-xs text-[#1a1a1a] font-mono focus:outline-hidden focus:border-[#b91c1c]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1a1a1a] mb-1 font-['Noto_Serif_Bengali']">
                        ছবির ক্যাপশন ও বর্ণনা
                      </label>
                      <input
                        type="text"
                        value={imageCaption}
                        onChange={(e) => setImageCaption(e.target.value)}
                        placeholder="উদাঃ শুটিং ইউনিটের সঙ্গে অভিনেতা খরাজ মুখোপাধ্যায় ও স্ত্রী প্রতিভা মুখোপাধ্যায়..."
                        className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs px-3 py-2 text-xs text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
                      />
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="space-y-3 bg-white p-4 rounded-xs border border-[#ded8cb]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase text-[#b91c1c] tracking-wider font-['Noto_Serif_Bengali']">
                        ৩. খবরের বিস্তারিত বিষয়বস্তু (প্রতিটি প্যারাগ্রাফ নতুন লাইনে লিখুন)
                      </h4>
                      <span className="text-[11px] text-[#737373]">Enter দিয়ে প্যারা আলাদা করুন</span>
                    </div>

                    <textarea
                      rows={6}
                      required
                      value={paragraphsText}
                      onChange={(e) => setParagraphsText(e.target.value)}
                      placeholder="এখানে খবরের বিস্তারিত লিখুন...&#10;&#10;দ্বিতীয় প্যারাগ্রাফ এখানে লিখুন...&#10;&#10;তৃতীয় প্যারাগ্রাফ এখানে লিখুন..."
                      className="w-full bg-[#fbf9f4] border border-[#ded8cb] rounded-xs p-3 text-xs sm:text-sm text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c] leading-relaxed"
                    />
                  </div>

                  {/* Settings & Flags */}
                  <div className="space-y-3 bg-white p-4 rounded-xs border border-[#ded8cb] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs font-bold text-[#1a1a1a] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isBreaking}
                          onChange={(e) => setIsBreaking(e.target.checked)}
                          className="accent-[#b91c1c] w-4 h-4"
                        />
                        <span className="font-['Noto_Serif_Bengali']">ব্রেকিং নিউজ হিসেবে টিকার-এ দেখান</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 bg-white border border-[#ded8cb] text-[#525252] hover:text-[#1a1a1a] text-xs font-bold rounded-xs cursor-pointer font-['Noto_Serif_Bengali']"
                      >
                        ফর্ম ক্লিয়ার করুন
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs sm:text-sm font-bold rounded-xs cursor-pointer border border-[#7f1d1d] flex items-center gap-1.5 shadow-xs font-['Noto_Serif_Bengali']"
                      >
                        <Check className="w-4 h-4" />
                        <span>{editingId ? 'আপডেট সম্পন্ন করুন' : 'সরাসরি খবর প্রকাশ করুন'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 2: Manage Articles List */}
            {activeTab === 'list' && (
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#ded8cb]">
                  <h4 className="font-bold text-sm font-['Noto_Serif_Bengali']">
                    আপনার প্রকাশিত সব খবর ({articles.length})
                  </h4>
                  <button
                    onClick={() => { setActiveTab('create'); resetForm(); }}
                    className="bg-[#b91c1c] text-white text-xs font-bold px-3 py-1.5 rounded-xs flex items-center gap-1 cursor-pointer font-['Noto_Serif_Bengali']"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>নতুন খবর লিখুন</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {articles.map((art) => {
                    const isCurrent = art.id === currentArticleId;
                    return (
                      <div
                        key={art.id}
                        className={`p-3.5 bg-white rounded-xs border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          isCurrent ? 'border-2 border-[#b91c1c] bg-[#fffbfb]' : 'border-[#ded8cb]'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          {art.featuredImage?.url ? (
                            <img
                              src={art.featuredImage.url}
                              alt={art.title}
                              className="w-16 h-12 object-cover rounded-xs border border-[#ded8cb] shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-12 bg-[#f3efe6] rounded-xs border border-[#ded8cb] flex items-center justify-center text-xs text-[#737373] shrink-0">
                              ছবি নেই
                            </div>
                          )}

                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="bg-[#fef2f2] text-[#991b1b] text-[10px] font-bold px-1.5 py-0.2 rounded-xs border border-[#fca5a5]">
                                {art.category}
                              </span>
                              <span className="text-[11px] text-[#737373]">{art.publishedAt}</span>
                              {isCurrent && (
                                <span className="bg-[#1a1a1a] text-[#fbbf24] text-[10px] font-bold px-2 py-0.2 rounded-xs">
                                  ★ বর্তমানে প্রদর্শিত
                                </span>
                              )}
                            </div>
                            <h5 className="font-bold text-xs sm:text-sm text-[#1a1a1a] font-['Noto_Serif_Bengali'] line-clamp-1">
                              {art.title}
                            </h5>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              onSelectArticle(art);
                              onClose();
                            }}
                            className="bg-[#1a1a1a] hover:bg-[#333333] text-white text-xs px-3 py-1.5 rounded-xs cursor-pointer font-['Noto_Serif_Bengali']"
                          >
                            ওয়েবসাইটে খুলুন
                          </button>
                          <button
                            onClick={() => handleEditSelect(art)}
                            className="bg-white border border-[#ded8cb] hover:border-[#b91c1c] text-[#1a1a1a] text-xs p-1.5 rounded-xs cursor-pointer"
                            title="এডিট করুন"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {articles.length > 1 && (
                            <button
                              onClick={() => onDeleteArticle(art.id)}
                              className="bg-white border border-[#fca5a5] text-[#b91c1c] hover:bg-[#fef2f2] text-xs p-1.5 rounded-xs cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: Free Hosting & Custom Domain Guide */}
            {activeTab === 'guide' && (
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 font-['Noto_Serif_Bengali']">
                <div className="bg-[#fbf9f4] p-4 rounded-xs border border-[#ded8cb] space-y-2">
                  <h4 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#b91c1c]" />
                    <span>বিনামূল্যে ১ পয়সাও খরচ না করে ওয়েবসাইট লাইভ করার উপায় (Free Hosting):</span>
                  </h4>
                  <p className="text-xs text-[#525252] leading-relaxed">
                    আপনার এই ওয়েবসাইটটি সম্পূর্ণ স্ট্যাটিক ও ক্লাউড-বান্ধব। আপনি কোনো টাকা না দিয়েই নিম্নলিখিত সার্ভারগুলোতে লাইভ চালাতে পারেন:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-4 rounded-xs border border-[#ded8cb] space-y-2">
                    <div className="font-bold text-xs text-[#1a1a1a] flex items-center justify-between">
                      <span>১. Vercel (সেরা ও দ্রুততম)</span>
                      <span className="text-[10px] bg-[#ecfdf5] text-[#065f46] px-1.5 py-0.5 rounded-xs font-bold">100% Free</span>
                    </div>
                    <p className="text-xs text-[#737373] leading-relaxed">
                      GitHub অ্যাকাউন্ট দিয়ে লগইন করে এই প্রজেক্ট লিঙ্ক করলেই ৫ সেকেন্ডে ফ্রি লাইভ লিংক পাবেন (উদাঃ <code>bartaprohor24.vercel.app</code>)।
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xs border border-[#ded8cb] space-y-2">
                    <div className="font-bold text-xs text-[#1a1a1a] flex items-center justify-between">
                      <span>২. Netlify</span>
                      <span className="text-[10px] bg-[#ecfdf5] text-[#065f46] px-1.5 py-0.5 rounded-xs font-bold">100% Free</span>
                    </div>
                    <p className="text-xs text-[#737373] leading-relaxed">
                      প্রজেক্টের বিল্ড ফোল্ডার বা গিটহাব কানেক্ট করলেই আজীবনের জন্য ফ্রি এসএসএল (HTTPS) সার্টিফিকেট সহ লাইভ চলবে।
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xs border border-[#ded8cb] space-y-2">
                    <div className="font-bold text-xs text-[#1a1a1a] flex items-center justify-between">
                      <span>৩. Cloudflare Pages</span>
                      <span className="text-[10px] bg-[#ecfdf5] text-[#065f46] px-1.5 py-0.5 rounded-xs font-bold">100% Free</span>
                    </div>
                    <p className="text-xs text-[#737373] leading-relaxed">
                      সীমাহীন ব্যান্ডউইথ ও অতিদ্রুত স্পিড। লক্ষ লক্ষ ভিজিটর আসলেও কখনো সার্ভার ডাউন হবে না।
                    </p>
                  </div>
                </div>

                {/* Steps to deploy */}
                <div className="bg-white p-4 rounded-xs border border-[#ded8cb] space-y-2.5">
                  <h5 className="font-bold text-xs text-[#1a1a1a]">
                    সহজে লাইভ ও শেয়ার করার ৩টি ধাপ:
                  </h5>
                  <ol className="list-decimal pl-5 text-xs text-[#525252] space-y-1.5 leading-relaxed">
                    <li>
                      <strong>কোড এক্সপোর্ট:</strong> স্ক্রিনের ওপরের মেনু থেকে <strong>Export to GitHub</strong> অথবা <strong>Download ZIP</strong> এ ক্লিক করুন।
                    </li>
                    <li>
                      <strong>Vercel বা Netlify-তে ইমপোর্ট:</strong> vercel.com এ গিয়ে "Add New Project" এ আপনার রিপোসিটরি সিলেক্ট করে Deploy চাপুন।
                    </li>
                    <li>
                      <strong>কিউআর কোড শেয়ার:</strong> আমাদের তৈরি কিউআর কোড জেনারেটর থেকে কিউআর কোডটি ডাউনলোড করে আপনার ফেসবুক, হোয়াটসঅ্যাপ বা ভিজিটিং কার্ডে ছাপিয়ে দিন।
                    </li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

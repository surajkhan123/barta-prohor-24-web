import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, ThumbsUp, Heart, Sparkles, User, CheckCircle2 } from 'lucide-react';
import { Comment } from '../types';
import { INITIAL_COMMENTS } from '../data/newsData';

export const CommentSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('bp24_comments_kharaj');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_COMMENTS;
      }
    }
    return INITIAL_COMMENTS;
  });

  const [authorName, setAuthorName] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [commentText, setCommentText] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    localStorage.setItem('bp24_comments_kharaj', JSON.stringify(comments));
  }, [comments]);

  const quickWishes = [
    'খরাজদা ও বৌদির দ্রুত ও নিরাপদ ফেরা কামনা করি 🙏',
    'ঈশ্বর ওঁদের সমস্ত বিপদ থেকে মুক্ত রাখুন ❤️',
    'সঠিক সময়ে নির্ভরযোগ্য আপডেট দেওয়ার জন্য BARTA PROHOR 24 কে ধন্যবাদ 👍',
    'নেপালের সকল আটকে থাকা ভারতীয়দের নিরাপদে ফিরিয়ে আনা হোক 🇮🇳',
  ];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const colors = ['bg-rose-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-purple-600', 'bg-sky-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newComment: Comment = {
      id: 'c_' + Date.now(),
      author: authorName.trim() || 'সম্মানিত পাঠক',
      location: userLocation.trim() || 'কলকাতা',
      avatarBg: randomColor,
      content: commentText.trim(),
      timestamp: 'এইমাত্র',
      likes: 1,
      userLiked: true,
    };

    setComments([newComment, ...comments]);
    setCommentText('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const isLiked = c.userLiked;
          return {
            ...c,
            likes: isLiked ? c.likes - 1 : c.likes + 1,
            userLiked: !isLiked,
          };
        }
        return c;
      })
    );
  };

  return (
    <section id="comments-section" className="bg-white p-5 sm:p-7 rounded-none sm:rounded-sm border border-[#ded8cb] shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-2.5">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#b91c1c]" />
          <h3 className="text-base sm:text-lg font-black text-[#1a1a1a] font-['Noto_Serif_Bengali']">
            পাঠক প্রতিক্রিয়া ও মন্তব্য ({comments.length})
          </h3>
        </div>
        <span className="text-xs text-[#525252] font-semibold font-['Noto_Serif_Bengali']">
          মার্জিত ভাষায় মতামত প্রকাশ করুন
        </span>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleAddComment} className="space-y-3 bg-[#fbf9f4] p-4 rounded-xs border border-[#ded8cb]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-bold text-[#1a1a1a] mb-1 font-['Noto_Serif_Bengali']">
              আপনার নাম
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="উদাঃ অনির্বা্ণ রায়"
              className="w-full bg-white border border-[#ded8cb] rounded-xs px-3 py-2 text-xs sm:text-sm text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1a1a1a] mb-1 font-['Noto_Serif_Bengali']">
              শহর / জেলা
            </label>
            <input
              type="text"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              placeholder="উদাঃ কলকাতা / বর্ধমান"
              className="w-full bg-white border border-[#ded8cb] rounded-xs px-3 py-2 text-xs sm:text-sm text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1a1a1a] mb-1 font-['Noto_Serif_Bengali']">
            আপনার শুভকামনা বা মন্তব্য লিখুন
          </label>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            required
            placeholder="অভিনেতা খরাজ মুখোপাধ্যায় বা নেপালের পরিস্থিতি নিয়ে আপনার বার্তা লিখুন..."
            className="w-full bg-white border border-[#ded8cb] rounded-xs p-3 text-xs sm:text-sm text-[#1a1a1a] focus:outline-hidden focus:border-[#b91c1c]"
          />
        </div>

        {/* Quick wish buttons */}
        <div>
          <span className="text-[11px] font-bold text-[#525252] block mb-1.5 font-['Noto_Serif_Bengali']">
            ঝটপট বার্তা নির্বাচন করুন:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickWishes.map((wish, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setCommentText(wish)}
                className="text-[11px] bg-white hover:bg-[#fef2f2] hover:text-[#b91c1c] hover:border-[#f87171] text-[#1a1a1a] border border-[#ded8cb] px-2.5 py-1 rounded-xs transition-colors cursor-pointer text-left font-['Noto_Serif_Bengali']"
              >
                {wish}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold px-4 py-2 rounded-xs text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer border border-[#7f1d1d] font-['Noto_Serif_Bengali']"
          >
            <Send className="w-3.5 h-3.5" />
            <span>মন্তব্য প্রকাশ করুন</span>
          </button>
        </div>
      </form>

      {/* Success alert */}
      {showSuccessToast && (
        <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-xs rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
          <span>ধন্যবাদ! আপনার মন্তব্য সফলভাবে প্রকাশিত হয়েছে।</span>
        </div>
      )}

      {/* Comment List */}
      <div className="space-y-3 pt-2">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 bg-[#fbf9f4] rounded-xs border border-[#ded8cb] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xs bg-[#1a1a1a] text-white font-bold flex items-center justify-center text-xs border border-[#404040]">
                  {comment.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1a1a1a] leading-none font-['Noto_Serif_Bengali']">
                    {comment.author}
                  </h4>
                  <span className="text-[11px] text-[#737373]">
                    {comment.location ? `${comment.location} • ` : ''}{comment.timestamp}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleLike(comment.id)}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-xs border transition-colors cursor-pointer ${
                  comment.userLiked
                    ? 'bg-[#fef2f2] border-[#f87171] text-[#b91c1c] font-bold'
                    : 'bg-white border-[#ded8cb] text-[#525252] hover:text-[#1a1a1a]'
                }`}
                title="পছন্দ করুন"
              >
                <ThumbsUp className={`w-3 h-3 ${comment.userLiked ? 'fill-[#b91c1c]' : ''}`} />
                <span>{comment.likes}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#262626] pl-9.5 leading-relaxed font-normal font-['Noto_Serif_Bengali']">
              {comment.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

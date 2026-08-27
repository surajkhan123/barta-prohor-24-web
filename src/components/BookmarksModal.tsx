import React from 'react';
import { X, Bookmark, Trash2, ExternalLink, ArrowRight } from 'lucide-react';
import { NewsArticle } from '../types';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedArticle: NewsArticle | null;
  onRemoveBookmark: () => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarkedArticle,
  onRemoveBookmark,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className="bg-[#f8f7f2] rounded-none sm:rounded-xs max-w-lg w-full overflow-hidden shadow-2xl border border-[#ded8cb]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#1a1a1a] text-white p-4 flex items-center justify-between border-b-2 border-b-[#b91c1c]">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#b91c1c] fill-[#b91c1c]" />
            <h3 className="font-bold text-base font-['Noto_Serif_Bengali']">সংরক্ষিত সংবাদ তালিকা</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xs bg-[#262626] hover:bg-[#b91c1c] text-[#a3a3a3] hover:text-white transition-colors cursor-pointer border border-[#404040]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {bookmarkedArticle ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xs bg-white border border-[#ded8cb] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-[#fef2f2] text-[#991b1b] border border-[#fca5a5] font-bold px-2 py-0.5 rounded-xs font-['Noto_Serif_Bengali']">
                    {bookmarkedArticle.category}
                  </span>
                  <span className="text-[#737373] font-['Noto_Serif_Bengali']">{bookmarkedArticle.publishedAt}</span>
                </div>
                <h4 className="font-bold text-[#1a1a1a] text-sm font-['Noto_Serif_Bengali'] leading-snug">
                  {bookmarkedArticle.title}
                </h4>
                <p className="text-xs text-[#525252] line-clamp-2 font-['Noto_Serif_Bengali']">
                  {bookmarkedArticle.subtitle}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-[#ded8cb]">
                  <button
                    onClick={() => {
                      onClose();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-[#b91c1c] hover:text-[#991b1b] flex items-center gap-1 cursor-pointer font-['Noto_Serif_Bengali']"
                  >
                    <span>সম্পূর্ণ খবর পড়ুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={onRemoveBookmark}
                    className="text-xs font-semibold text-[#737373] hover:text-[#b91c1c] flex items-center gap-1 cursor-pointer font-['Noto_Serif_Bengali']"
                    title="তালিকা থেকে সরান"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>মুছে ফেলুন</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-2">
              <Bookmark className="w-10 h-10 text-[#a3a3a3] mx-auto stroke-1" />
              <h4 className="font-bold text-[#1a1a1a] text-sm font-['Noto_Serif_Bengali']">কোনো খবর সংরক্ষণ করা নেই</h4>
              <p className="text-xs text-[#737373] font-['Noto_Serif_Bengali']">
                খবরের বুকমার্ক আইকনে ক্লিক করে পরে পড়ার জন্য সংরক্ষণ করুন।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

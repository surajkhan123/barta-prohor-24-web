import React, { useState } from 'react';
import { Heart, Sparkles, AlertCircle, ThumbsUp, CheckCircle, BarChart3, MessageSquareHeart } from 'lucide-react';

export const ReactionAndPoll: React.FC = () => {
  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    love: 142,
    prayers: 298,
    concerned: 54,
    informative: 89,
  });
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  // Poll state
  const [pollVoted, setPollVoted] = useState<string | null>(null);
  const [pollCounts, setPollCounts] = useState<{ [key: string]: number }>({
    yes: 420,
    no: 45,
    notSure: 32,
  });

  const handleReaction = (type: string) => {
    if (selectedReaction === type) {
      // unselect
      setReactions((prev) => ({ ...prev, [type]: prev[type] - 1 }));
      setSelectedReaction(null);
    } else {
      // change selection
      setReactions((prev) => {
        const next = { ...prev };
        if (selectedReaction) {
          next[selectedReaction] = Math.max(0, next[selectedReaction] - 1);
        }
        next[type] = (next[type] || 0) + 1;
        return next;
      });
      setSelectedReaction(type);
    }
  };

  const handleVote = (option: string) => {
    if (pollVoted) return;
    setPollCounts((prev) => ({
      ...prev,
      [option]: (prev[option] || 0) + 1,
    }));
    setPollVoted(option);
  };

  const totalPollVotes = (Object.values(pollCounts) as number[]).reduce((a: number, b: number) => a + b, 0);

  const getPercent = (count: number) => {
    if (totalPollVotes === 0) return 0;
    return Math.round((count / totalPollVotes) * 100);
  };

  return (
    <div id="reactions-and-poll-section" className="space-y-6 my-8">
      {/* Reader Reactions Container */}
      <div className="bg-white p-5 sm:p-6 rounded-none sm:rounded-sm border border-[#ded8cb] shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-4 border-b border-[#ded8cb] pb-3">
          <div className="flex items-center gap-2">
            <MessageSquareHeart className="w-4 h-4 text-[#b91c1c]" />
            <h3 className="font-bold text-[#1a1a1a] text-sm sm:text-base font-['Noto_Serif_Bengali']">
              এই সংবাদের ওপর আপনার অনুভূতি ব্যক্ত করুন
            </h3>
          </div>
          <span className="text-xs text-[#525252] font-semibold">
            মোট প্রতিক্রিয়া: {(Object.values(reactions) as number[]).reduce((a: number, b: number) => a + b, 0)}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => handleReaction('prayers')}
            className={`p-3 rounded-xs border flex flex-col items-center gap-1 transition-all cursor-pointer ${
              selectedReaction === 'prayers'
                ? 'bg-[#fef2f2] border-[#f87171] text-[#991b1b]'
                : 'bg-[#fbf9f4] border-[#ded8cb] text-[#1a1a1a] hover:bg-[#f3efe6]'
            }`}
          >
            <span className="text-2xl">🙏</span>
            <span className="text-xs font-bold font-['Noto_Serif_Bengali']">শুভকামনা ও প্রার্থনা</span>
            <span className="text-[11px] font-mono text-[#737373]">{reactions.prayers}</span>
          </button>

          <button
            onClick={() => handleReaction('love')}
            className={`p-3 rounded-xs border flex flex-col items-center gap-1 transition-all cursor-pointer ${
              selectedReaction === 'love'
                ? 'bg-[#fef2f2] border-[#f87171] text-[#991b1b]'
                : 'bg-[#fbf9f4] border-[#ded8cb] text-[#1a1a1a] hover:bg-[#f3efe6]'
            }`}
          >
            <span className="text-2xl">❤️</span>
            <span className="text-xs font-bold font-['Noto_Serif_Bengali']">ভালোবাসা ও স্বস্তি</span>
            <span className="text-[11px] font-mono text-[#737373]">{reactions.love}</span>
          </button>

          <button
            onClick={() => handleReaction('concerned')}
            className={`p-3 rounded-xs border flex flex-col items-center gap-1 transition-all cursor-pointer ${
              selectedReaction === 'concerned'
                ? 'bg-[#fffbeb] border-[#fde68a] text-[#92400e]'
                : 'bg-[#fbf9f4] border-[#ded8cb] text-[#1a1a1a] hover:bg-[#f3efe6]'
            }`}
          >
            <span className="text-2xl">😢</span>
            <span className="text-xs font-bold font-['Noto_Serif_Bengali']">উদ্বেগ প্রকাশ</span>
            <span className="text-[11px] font-mono text-[#737373]">{reactions.concerned}</span>
          </button>

          <button
            onClick={() => handleReaction('informative')}
            className={`p-3 rounded-xs border flex flex-col items-center gap-1 transition-all cursor-pointer ${
              selectedReaction === 'informative'
                ? 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]'
                : 'bg-[#fbf9f4] border-[#ded8cb] text-[#1a1a1a] hover:bg-[#f3efe6]'
            }`}
          >
            <span className="text-2xl">👍</span>
            <span className="text-xs font-bold font-['Noto_Serif_Bengali']">জরুরি তথ্য</span>
            <span className="text-[11px] font-mono text-[#737373]">{reactions.informative}</span>
          </button>
        </div>
      </div>

      {/* Reader Opinion Poll with Editorial Styling */}
      <div className="bg-[#1a1a1a] text-white p-5 sm:p-6 rounded-none sm:rounded-sm shadow-xs border border-[#2d2d2d] border-t-3 border-t-[#b91c1c]">
        <div className="flex items-center gap-2 mb-3 text-[#fbbf24]">
          <BarChart3 className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider bg-[#b91c1c] text-white px-2 py-0.5 rounded-xs font-['Noto_Serif_Bengali']">
            পাঠক মতামত সমীক্ষা (Poll)
          </span>
        </div>

        <h4 className="text-base sm:text-lg font-bold font-['Noto_Serif_Bengali'] mb-4 leading-snug text-[#f5f5f5]">
          পাহাড়ি অঞ্চলে শুটিং ও পর্যটনের ক্ষেত্রে দুর্যোগপূর্ণ আবহাওয়ায় কি আরও কড়া নজরদারি ও পূর্বাভাস ব্যবস্থা প্রয়োজন?
        </h4>

        <div className="space-y-2.5">
          {[
            { id: 'yes', label: 'হ্যাঁ, আরও কড়া নির্দেশিকা ও সুরক্ষা প্রয়োজন', count: pollCounts.yes },
            { id: 'no', label: 'না, বর্তমান সতর্কতাই যথেষ্ট', count: pollCounts.no },
            { id: 'notSure', label: 'মন্তব্য করতে চাই না / অনিশ্চিত', count: pollCounts.notSure },
          ].map((opt) => {
            const pct = getPercent(opt.count);
            const isSelected = pollVoted === opt.id;

            return (
              <button
                key={opt.id}
                onClick={() => handleVote(opt.id)}
                disabled={!!pollVoted}
                className={`w-full p-3 rounded-xs border text-left transition-all relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'border-[#b91c1c] bg-[#262626]'
                    : 'border-[#404040] bg-[#262626]/80 hover:bg-[#333333]'
                }`}
              >
                {/* Progress bar background fill if voted */}
                {pollVoted && (
                  <div
                    className={`absolute top-0 left-0 bottom-0 ${
                      isSelected ? 'bg-[#b91c1c]/40' : 'bg-[#404040]/40'
                    } transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                )}

                <div className="relative z-10 flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center text-[9px] ${
                      isSelected ? 'border-[#b91c1c] bg-[#b91c1c] text-white font-bold' : 'border-[#737373]'
                    }`}>
                      {isSelected && '✓'}
                    </span>
                    <span className="font-['Noto_Serif_Bengali']">{opt.label}</span>
                  </div>

                  {pollVoted && (
                    <span className="font-mono font-bold text-[#fbbf24]">
                      {pct}% ({opt.count})
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {pollVoted && (
          <div className="mt-3 flex items-center justify-between text-xs text-[#a3a3a3] border-t border-[#333333] pt-2">
            <span className="text-[#34d399] flex items-center gap-1 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              আপনার ভোট গৃহীত হয়েছে।
            </span>
            <span className="font-mono">মোট ভোট: {totalPollVotes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

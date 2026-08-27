import React, { useState } from 'react';
import { X, Bell, CheckCircle2, MessageCircle, Send, Radio, ShieldCheck, Mail } from 'lucide-react';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['বিনোদন', 'ব্রেকিং নিউজ']);

  if (!isOpen) return null;

  const topics = [
    { id: 'breaking', label: 'ব্রেকিং নিউজ' },
    { id: 'entertainment', label: 'বিনোদন ও টলিউড' },
    { id: 'weather', label: 'আবহাওয়া ও দুর্যোগ' },
    { id: 'politics', label: 'রাজনীতি ও রাজ্য' },
    { id: 'national', label: 'দেশ-বিদেশ' },
  ];

  const toggleTopic = (label: string) => {
    if (selectedTopics.includes(label)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== label));
    } else {
      setSelectedTopics([...selectedTopics, label]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className="bg-[#f8f7f2] rounded-none sm:rounded-xs max-w-lg w-full overflow-hidden shadow-2xl border border-[#ded8cb] relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#1a1a1a] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-b-[#b91c1c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-[#b91c1c] flex items-center justify-center text-white font-black text-xs font-['Playfair_Display',serif]">
              BP
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-none font-['Noto_Serif_Bengali']">BARTA PROHOR 24 সাবস্ক্রিপশন</h3>
              <p className="text-[11px] text-[#a3a3a3] mt-1 font-['Noto_Serif_Bengali']">সব খবর সবার আগে আপনার হাতে</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xs bg-[#262626] hover:bg-[#b91c1c] text-[#a3a3a3] hover:text-white transition-colors cursor-pointer border border-[#404040]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {subscribed ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#064e3b]/20 text-[#059669] mx-auto flex items-center justify-center border border-[#059669]/40">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#1a1a1a] font-['Noto_Serif_Bengali']">আপনি সফলভাবে সাবস্ক্রাইব করেছেন!</h4>
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed font-['Noto_Serif_Bengali']">
                BARTA PROHOR 24-এর সাথে থাকার জন্য ধন্যবাদ। গুরুত্বপূর্ণ খবর প্রকাশিত হওয়া মাত্রই আপনাকে অবহিত করা হবে।
              </p>
              <button
                onClick={onClose}
                className="bg-[#1a1a1a] text-white text-xs font-bold px-6 py-2.5 rounded-xs hover:bg-[#333333] transition-colors cursor-pointer font-['Noto_Serif_Bengali']"
              >
                পড়া চালিয়ে যান
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed font-['Noto_Serif_Bengali']">
                দেশ-বিদেশের তাজা খবর, বিনোদন এবং এক্সক্লুসিভ লাইভ কভারেজ নিয়মিত পেতে পছন্দের ক্যাটাগরি বেছে নিন:
              </p>

              {/* Topics checkbox pills */}
              <div>
                <label className="block text-xs font-bold text-[#1a1a1a] mb-1.5 font-['Noto_Serif_Bengali']">
                  পছন্দের বিষয় নির্বাচন করুন:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {topics.map((t) => {
                    const isSelected = selectedTopics.includes(t.label);
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => toggleTopic(t.label)}
                        className={`text-xs px-2.5 py-1 rounded-xs border transition-colors cursor-pointer font-['Noto_Serif_Bengali'] ${
                          isSelected
                            ? 'bg-[#b91c1c] border-[#b91c1c] text-white font-bold'
                            : 'bg-white border-[#ded8cb] text-[#1a1a1a] hover:bg-[#f3efe6]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-2.5 pt-1">
                <div>
                  <label className="block text-xs font-bold text-[#1a1a1a] mb-1 font-['Noto_Serif_Bengali']">
                    ইমেল আইডি
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#737373] absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2 border border-[#ded8cb] bg-white rounded-xs text-xs sm:text-sm focus:outline-hidden focus:border-[#b91c1c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1a1a1a] mb-1 font-['Noto_Serif_Bengali']">
                    হোয়াটসঅ্যাপ বা মোবাইল নম্বর (ঐচ্ছিক)
                  </label>
                  <div className="relative">
                    <MessageCircle className="w-4 h-4 text-[#737373] absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full pl-9 pr-3 py-2 border border-[#ded8cb] bg-white rounded-xs text-xs sm:text-sm focus:outline-hidden focus:border-[#b91c1c]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold py-2.5 rounded-xs text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer border border-[#7f1d1d] font-['Noto_Serif_Bengali']"
              >
                <Bell className="w-4 h-4" />
                <span>সাবস্ক্রাইব কনফার্ম করুন</span>
              </button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-[#737373] font-['Noto_Serif_Bengali']">
                <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                <span>আপনার কোনো তথ্য তৃতীয় পক্ষকে প্রদান করা হয় না</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

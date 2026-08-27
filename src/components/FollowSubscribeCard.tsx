import React, { useState } from 'react';
import { Bell, Mail, CheckCircle2, MessageCircle, Send, Radio, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';

interface FollowSubscribeCardProps {
  onOpenModal: () => void;
  onSubscribe?: (data: { email?: string; phone?: string; name?: string; topics?: string[]; source: string }) => void;
}

export const FollowSubscribeCard: React.FC<FollowSubscribeCardProps> = ({ onOpenModal, onSubscribe }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() && !phone.trim()) return;

    if (onSubscribe) {
      onSubscribe({
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        topics: ['ব্রেকিং নিউজ', 'সারাদিনের হেডলাইন্স'],
        source: 'ফলো ও নিউজলেটার বক্স'
      });
    }

    setIsSuccess(true);
    setTimeout(() => {
      setEmail('');
      setPhone('');
    }, 4000);
  };

  return (
    <section 
      id="follow-subscribe-card" 
      className="my-8 rounded-none sm:rounded-sm bg-[#1a1a1a] text-white p-6 sm:p-8 border border-[#2d2d2d] border-t-4 border-t-[#b91c1c] relative overflow-hidden"
    >
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left message & branding */}
        <div className="lg:col-span-7 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-[#b91c1c] text-white text-[11px] font-bold uppercase tracking-wider font-['Noto_Serif_Bengali']">
            <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>সবার আগে সঠিক খবর</span>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-['Noto_Serif_Bengali'] text-white leading-tight">
            দেশ-বিদেশের গুরুত্বপূর্ণ খবর সবার আগে পেতে,
            <span className="text-[#fbbf24] block mt-1">BARTA PROHOR 24 ফলো এবং সাবস্ক্রাইব করুন।</span>
          </h3>

          <p className="text-[#d4d4d4] text-xs sm:text-sm leading-relaxed max-w-xl font-['Noto_Serif_Bengali']">
            টলিউড, জাতীয় ও আন্তর্জাতিক ব্রেকিং নিউজ, প্রাকৃতিক দুর্যোগের লাইভ কভারেজ সরাসরি আপনার ফোনে পেতে যুক্ত হোন আমাদের ডিজিটাল কমিউনিটিতে।
          </p>

          {/* Social and instant channels */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noreferrer"
              className="bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold px-3 py-1.5 rounded-xs flex items-center gap-1.5 transition-transform active:scale-95 border border-[#047857] font-['Noto_Serif_Bengali']"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp চ্যানেল যুক্ত করুন</span>
            </a>

            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="bg-[#229ED9] hover:bg-[#1e8cc0] text-white text-xs font-bold px-3 py-1.5 rounded-xs flex items-center gap-1.5 transition-transform active:scale-95 border border-[#1e8cc0] font-['Noto_Serif_Bengali']"
            >
              <Send className="w-4 h-4 fill-white" />
              <span>Telegram এ ফলো করুন</span>
            </a>

            <button
              onClick={onOpenModal}
              className="bg-[#333333] hover:bg-[#444444] text-[#fbbf24] text-xs font-bold px-3 py-1.5 rounded-xs flex items-center gap-1.5 transition-colors border border-[#555555] cursor-pointer font-['Noto_Serif_Bengali']"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>কাস্টম বিষয় বেছে নিন</span>
            </button>
          </div>
        </div>

        {/* Right input box / Quick subscribe */}
        <div className="lg:col-span-5 bg-[#262626] border border-[#404040] p-5 sm:p-6 rounded-xs shadow-xs">
          {isSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#064e3b] text-[#34d399] mx-auto flex items-center justify-center border border-[#059669]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-white font-['Noto_Serif_Bengali']">অভিনন্দন! আপনার সাবস্ক্রিপশন সংরক্ষিত হয়েছে</h4>
              <p className="text-xs text-[#d4d4d4] font-['Noto_Serif_Bengali']">
                BARTA PROHOR 24 এর বিশেষ ব্রেকিং নিউজ অ্যালার্ট আপনার ইমেল বা নম্বরে পৌঁছে দেওয়া হবে।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-[#f5f5f5] flex items-center gap-1.5 font-['Noto_Serif_Bengali']">
                <Bell className="w-4 h-4 text-[#b91c1c]" />
                <span>নিউজলেটার ও ব্রেকিং নোটিফিকেশন</span>
              </h4>

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="আপনার ইমেল / Gmail লিখুন..."
                  className="w-full bg-[#1a1a1a] border border-[#404040] rounded-xs px-3 py-2 text-xs sm:text-sm text-white placeholder-[#737373] focus:outline-hidden focus:border-[#b91c1c]"
                />
              </div>

              <div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="অথবা মোবাইল নম্বর (SMS / WhatsApp আপডেট)"
                  className="w-full bg-[#1a1a1a] border border-[#404040] rounded-xs px-3 py-2 text-xs sm:text-sm text-white placeholder-[#737373] focus:outline-hidden focus:border-[#b91c1c]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold py-2 rounded-xs text-xs sm:text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer border border-[#7f1d1d] font-['Noto_Serif_Bengali']"
              >
                <span>সাবস্ক্রাইব সম্পন্ন করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-[#a3a3a3] pt-1 font-['Noto_Serif_Bengali']">
                <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
                <span>আপনার গোপনীয়তা সুরক্ষিত • নো-স্প্যাম গ্যারান্টি</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

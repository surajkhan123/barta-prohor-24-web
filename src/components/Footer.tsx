import React from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Tv, 
  Flame, 
  Radio, 
  ArrowUp,
  Lock,
  QrCode
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onAdminClick?: () => void;
  onQRClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick, onQRClick }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="news-footer" className="bg-[#1a1a1a] text-[#d4d4d4] border-t-3 border-t-[#b91c1c] mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Top Row: Brand & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-3.5">
            <div className="flex items-start justify-start">
              <BrandLogo size="sm" variant="dark" showTagline={false} />
            </div>
            <p className="text-xs text-[#a3a3a3] leading-relaxed font-['Noto_Serif_Bengali']">
              BARTA PROHOR 24 — নির্ভীক ও নিরপেক্ষ ডিজিটাল বাংলা সংবাদ মাধ্যম। দেশ-বিদেশ, টলিউড, রাজনীতি, আবহাওয়া ও ব্রেকিং নিউজের বিশ্বস্ত ডিজিটাল ঠিকানা।
            </p>
            <div className="pt-1 flex items-center gap-3 text-[#a3a3a3] text-xs">
              <span className="flex items-center gap-1 font-['Noto_Serif_Bengali']">
                <Radio className="w-3.5 h-3.5 text-[#b91c1c]" />
                ২৪x৭ লাইভ নিউজডেস্ক
              </span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#404040] pb-2 font-['Noto_Serif_Bengali']">
              বিভাগসমূহ
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs text-[#a3a3a3] font-['Noto_Serif_Bengali']">
              {['বিনোদন ও সিনেমা', 'দেশ-বিদেশ', 'রাজ্য সংবাদ', 'রাজনীতি', 'খেলাধুলা', 'আবহাওয়া ও দুর্যোগ', 'লাইফস্টাইল', 'বিশেষ সম্পাদকীয়'].map((item, idx) => (
                <li key={idx}>
                  <a href="#main-header" className="hover:text-[#fbbf24] transition-colors">
                    • {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Editorial & Ethics */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#404040] pb-2 font-['Noto_Serif_Bengali']">
              নীতিমালা ও প্রকাশনা
            </h4>
            <ul className="space-y-1.5 text-xs text-[#a3a3a3] font-['Noto_Serif_Bengali']">
              <li><a href="#main-header" className="hover:text-[#fbbf24] transition-colors">আমাদের সম্পাদকীয় নীতি</a></li>
              <li><a href="#main-header" className="hover:text-[#fbbf24] transition-colors">ফ্যাক্ট-চেকিং পলিসি</a></li>
              <li><a href="#main-header" className="hover:text-[#fbbf24] transition-colors">গোপনীয়তা সুরক্ষা</a></li>
              <li><a href="#main-header" className="hover:text-[#fbbf24] transition-colors">বিজ্ঞাপন ও যোগাযোগ</a></li>
              <li><a href="#main-header" className="hover:text-[#fbbf24] transition-colors">অভিযোগ নিষ্পত্তি অফিসার</a></li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#404040] pb-2 font-['Noto_Serif_Bengali']">
              নিউজডেস্ক যোগাযোগ
            </h4>
            <div className="space-y-2 text-xs text-[#a3a3a3]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#b91c1c] mt-0.5 shrink-0" />
                <span className="font-['Noto_Serif_Bengali']">বার্তা প্রহর ২৪ ভবন, সেক্টর ৫, সল্টলেক, কলকাতা - ৭০০০৯১</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#b91c1c] shrink-0" />
                <a href="mailto:bartaprohor24news@gmail.com" className="hover:text-[#fbbf24] transition-colors">
                  bartaprohor24news@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#b91c1c] shrink-0" />
                <span>+91 (033) 2345-6789 / +91 98300 24240</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#333333] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <div className="flex flex-wrap items-center gap-3 font-['Noto_Serif_Bengali']">
            <span>© {new Date().getFullYear()} BARTA PROHOR 24 (বার্তা প্রহর ২৪) | সর্বস্বত্ব সংরক্ষিত।</span>
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="text-[#fbbf24] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>নিউজডেস্ক অ্যাডমিন লগইন</span>
              </button>
            )}
            {onQRClick && (
              <button
                onClick={onQRClick}
                className="text-[#38bdf8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <QrCode className="w-3 h-3" />
                <span>পাঠক QR কোড</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[#a3a3a3] font-['Noto_Serif_Bengali']">
              দেশ-বিদেশের খবর সবার আগে পেতে BARTA PROHOR 24 ফলো ও সাবস্ক্রাইব করুন
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xs bg-[#262626] hover:bg-[#b91c1c] hover:text-white text-[#d4d4d4] transition-colors cursor-pointer border border-[#404040]"
              title="উপরে যান"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

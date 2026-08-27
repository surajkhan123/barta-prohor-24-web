import React, { useState, useRef } from 'react';
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  X, 
  Share2, 
  ExternalLink, 
  Smartphone, 
  Globe, 
  Send,
  Printer,
  Sparkles,
  Tv,
  Camera,
  Radio,
  Layers
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsTitle: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  newsTitle,
}) => {
  const [currentUrl, setCurrentUrl] = useState('https://barta-prohor-24-web.vercel.app/');
  const [copied, setCopied] = useState(false);
  const [cardStyle, setCardStyle] = useState<'news-card' | 'classic'>('news-card');
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // High-res QR code generated for the verified Vercel web link
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    currentUrl
  )}&color=1a1a1a&bgcolor=ffffff&margin=1`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = `📰 *BARTA PROHOR 24 (বার্তা প্রহর ২৪)*\n২৪x৭ বাংলা ডিজিটাল নিউজ পোর্টাল ও ব্রডশিট সংবাদপত্র।\n\n📌 সরাসরি খবর পড়তে ও লাইভ আপডেট দেখতে ক্লিক করুন:\n${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-[#f8f7f2] rounded-none sm:rounded-xs max-w-xl w-full max-h-[94vh] flex flex-col overflow-hidden shadow-2xl border-2 border-[#1a1a1a] animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#1a1a1a] text-white p-3.5 sm:p-4 flex items-center justify-between border-b-3 border-b-[#b91c1c] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-[#b91c1c] flex items-center justify-center text-white font-black text-xs font-['Playfair_Display',serif]">
              BP
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-none font-['Noto_Serif_Bengali'] flex items-center gap-2">
                <span>পাঠকদের জন্য ফটো নিউজ কিউআর কার্ড</span>
                <span className="bg-[#b91c1c] text-white text-[10px] px-1.5 py-0.5 rounded-xs font-mono">
                  VERCEL LIVE
                </span>
              </h3>
              <p className="text-[11px] text-[#a3a3a3] mt-1 font-['Noto_Serif_Bengali']">
                {currentUrl}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xs bg-[#262626] hover:bg-[#b91c1c] text-[#a3a3a3] hover:text-white transition-colors cursor-pointer border border-[#404040]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Style Switcher Bar */}
        <div className="bg-[#f3efe6] border-b border-[#ded8cb] px-4 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCardStyle('news-card')}
              className={`text-xs font-bold px-3 py-1 rounded-xs transition-colors flex items-center gap-1.5 font-['Noto_Serif_Bengali'] cursor-pointer ${
                cardStyle === 'news-card' 
                  ? 'bg-[#1a1a1a] text-[#fbbf24]' 
                  : 'bg-white text-[#525252] border border-[#ded8cb]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>ফটো প্রেস কার্ড স্টাইল</span>
            </button>
            <button
              onClick={() => setCardStyle('classic')}
              className={`text-xs font-bold px-3 py-1 rounded-xs transition-colors flex items-center gap-1.5 font-['Noto_Serif_Bengali'] cursor-pointer ${
                cardStyle === 'classic' 
                  ? 'bg-[#1a1a1a] text-[#fbbf24]' 
                  : 'bg-white text-[#525252] border border-[#ded8cb]'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>সাধারণ কিউআর</span>
            </button>
          </div>

          <span className="text-[11px] text-[#737373] hidden sm:inline font-mono">
            320 x 320 DPI Ready
          </span>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {cardStyle === 'news-card' ? (
            /* Beautiful Newspaper Press Poster Frame */
            <div 
              ref={printRef}
              id="printable-news-card"
              className="bg-white border-2 border-[#1a1a1a] p-4 sm:p-6 shadow-md relative overflow-hidden rounded-xs font-['Noto_Serif_Bengali'] text-left space-y-4 max-w-md mx-auto"
            >
              {/* Card Top Border Line */}
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-2 text-[11px] text-[#525252] font-mono">
                <span className="font-bold text-[#b91c1c]">BARTA PROHOR 24 • ডিজিটাল সংস্করণ</span>
                <span>ONLINE 24x7</span>
              </div>

              {/* Masthead Header with New Logo */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <BrandLogo size="md" showTagline={false} />
                </div>
                <div className="text-[12px] font-bold text-[#b91c1c] tracking-wider uppercase">
                  সত্যের সন্ধানে নির্ভীক প্রতিদিন • ২৪x৭ ডিজিটাল বাংলা নিউজ
                </div>
                <div className="w-28 h-0.5 bg-[#b91c1c] mx-auto" />
              </div>

              {/* Photo & QR Centerpiece */}
              <div className="relative bg-[#f8f7f2] border border-[#ded8cb] p-3 rounded-xs flex flex-col sm:flex-row items-center gap-4">
                <div className="shrink-0 bg-white p-2 border border-[#ded8cb] shadow-xs rounded-xs">
                  <img
                    src={qrCodeImageUrl}
                    alt="Barta Prohor 24 Live QR"
                    className="w-32 h-32 sm:w-36 sm:h-36 object-contain"
                  />
                  <div className="text-[9px] text-center font-mono font-bold text-[#737373] mt-1 uppercase">
                    SCAN TO READ
                  </div>
                </div>

                <div className="space-y-1.5 text-center sm:text-left flex-1">
                  <div className="inline-flex items-center gap-1 bg-[#b91c1c] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>লাইভ নিউজডেস্ক</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#1a1a1a] leading-snug">
                    মোবাইল দিয়ে স্ক্যান করে সরাসরি পড়ুন ডিজিটাল সংবাদপত্র
                  </h4>
                  <p className="text-[11px] text-[#525252] leading-relaxed">
                    তাজা খবর, বিনোদন, ভিডিও ও অডিও বুলেটিন একসাথে আপনার আঙুলের ডগায়।
                  </p>
                </div>
              </div>

              {/* Web Link Highlight Box */}
              <div className="bg-[#1a1a1a] text-white p-2.5 rounded-xs text-center space-y-0.5">
                <div className="text-[10px] text-[#fbbf24] font-bold tracking-wider uppercase font-mono">
                  অফিসিয়াল ওয়েব পোর্টাল লিঙ্ক
                </div>
                <div className="text-xs sm:text-sm font-mono font-bold text-white break-all">
                  https://barta-prohor-24-web.vercel.app/
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-[10px] text-center text-[#737373] border-t border-[#ded8cb] pt-2 flex items-center justify-between">
                <span>পশ্চিমবঙ্গ ও বিশ্বের তাজা সংবাদ</span>
                <span className="font-mono">VERCEL CLOUD LIVE</span>
              </div>
            </div>
          ) : (
            /* Classic Large QR Frame */
            <div className="p-6 bg-white border-2 border-[#ded8cb] rounded-xs shadow-xs text-center space-y-4 max-w-sm mx-auto">
              <div className="p-3 bg-[#f8f7f2] border border-[#ded8cb] rounded-xs inline-block">
                <img
                  src={qrCodeImageUrl}
                  alt="Barta Prohor 24 Live QR"
                  className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain"
                />
              </div>

              <div className="space-y-1 font-['Noto_Serif_Bengali']">
                <h4 className="text-sm font-bold text-[#1a1a1a]">
                  barta-prohor-24-web.vercel.app
                </h4>
                <p className="text-xs text-[#525252]">
                  যে কোনো কিউআর স্ক্যানার বা ক্যামেরা দিয়ে স্ক্যান করুন
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-['Noto_Serif_Bengali'] pt-1">
            <a
              href={qrCodeImageUrl}
              download="BartaProhor24_Vercel_QRCode.png"
              target="_blank"
              rel="noreferrer"
              className="bg-[#1a1a1a] hover:bg-[#333333] text-white text-xs font-bold py-2.5 px-3 rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#1a1a1a]"
            >
              <Download className="w-4 h-4 text-[#fbbf24]" />
              <span>QR ইমেজ সেভ</span>
            </a>

            <button
              onClick={handleWhatsAppShare}
              className="bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold py-2.5 px-3 rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#14532d]"
            >
              <Send className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে পাঠান</span>
            </button>

            <button
              onClick={handlePrint}
              className="col-span-2 sm:col-span-1 bg-white hover:bg-[#f3efe6] text-[#1a1a1a] border border-[#ded8cb] text-xs font-bold py-2.5 px-3 rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#b91c1c]" />
              <span>প্রিন্ট / PDF</span>
            </button>
          </div>

          {/* URL Bar & Copy */}
          <div className="bg-white border border-[#ded8cb] p-2.5 rounded-xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#525252] font-['Noto_Serif_Bengali']">
              <span>আপনার ভেরিফাইড Vercel লাইভ লিংক:</span>
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#b91c1c] hover:underline flex items-center gap-1"
              >
                <span>সাইটটি খুলুন</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <div className="flex items-center gap-1 bg-[#f8f7f2] border border-[#ded8cb] p-1.5 rounded-xs">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="bg-transparent text-xs text-[#1a1a1a] font-mono flex-1 outline-hidden px-1 truncate font-bold"
              />
              <button
                onClick={handleCopyLink}
                className="bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs px-3 py-1 rounded-xs font-bold flex items-center gap-1 cursor-pointer font-['Noto_Serif_Bengali'] shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে' : 'কপি লিংক'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

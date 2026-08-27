import React, { useState, useEffect } from 'react';
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
  Send
} from 'lucide-react';

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
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrSize, setQrSize] = useState(240);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Google Chart API / QR Server URL for standard dynamic QR code generation
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(
    currentUrl || 'https://bartaprohor24.in'
  )}&color=1a1a1a&bgcolor=f8f7f2&margin=1`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = `📰 *BARTA PROHOR 24 (বার্তা প্রহর ২৪)*\n${newsTitle}\n\nখবরটি সরাসরি পড়তে লিংকে ক্লিক করুন:\n${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div 
        className="bg-[#f8f7f2] rounded-none sm:rounded-xs max-w-md w-full overflow-hidden shadow-2xl border-2 border-[#1a1a1a] animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#1a1a1a] text-white p-4 flex items-center justify-between border-b-3 border-b-[#b91c1c]">
          <div className="flex items-center gap-2.5">
            <QrCode className="w-5 h-5 text-[#fbbf24]" />
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-none font-['Noto_Serif_Bengali']">
                পাঠকদের সাথে শেয়ার ও কিউআর কোড
              </h3>
              <p className="text-[11px] text-[#a3a3a3] mt-0.5 font-['Noto_Serif_Bengali']">
                যেকোনো স্মার্টফোনে স্ক্যান করলেই সরাসরি ওয়েবসাইট খুলবে
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

        {/* Modal Body */}
        <div className="p-6 text-center space-y-4">
          {/* Printable QR Display Frame */}
          <div className="p-4 bg-white border-2 border-[#ded8cb] rounded-xs shadow-xs inline-block mx-auto relative group">
            <img
              src={qrCodeImageUrl}
              alt="BARTA PROHOR 24 QR Code"
              className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain"
            />
            <div className="mt-2 text-[11px] font-bold text-[#1a1a1a] uppercase tracking-wider font-mono">
              BARTA PROHOR 24
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#1a1a1a] font-['Noto_Serif_Bengali']">
              মোবাইলের ক্যামেরা বা স্ক্যানার দিয়ে স্ক্যান করুন
            </h4>
            <p className="text-xs text-[#525252] font-['Noto_Serif_Bengali']">
              এই কিউআর কোডটি ডাউনলোড করে আপনার ফেসবুক পেজে পোস্ট করতে পারেন বা কার্ড/ব্যানারে ছাপাতে পারেন।
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1 font-['Noto_Serif_Bengali']">
            <a
              href={qrCodeImageUrl}
              download="BartaProhor24_QRCode.png"
              target="_blank"
              rel="noreferrer"
              className="bg-[#1a1a1a] hover:bg-[#333333] text-white text-xs font-bold py-2.5 px-3 rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#1a1a1a]"
            >
              <Download className="w-4 h-4 text-[#fbbf24]" />
              <span>QR ডাউনলোড</span>
            </a>

            <button
              onClick={handleWhatsAppShare}
              className="bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold py-2.5 px-3 rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#14532d]"
            >
              <Send className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে পাঠান</span>
            </button>
          </div>

          {/* Quick URL Copy Bar */}
          <div className="pt-2 border-t border-[#ded8cb]">
            <label className="block text-left text-[11px] font-bold text-[#737373] mb-1 font-['Noto_Serif_Bengali']">
              ওয়েবসাইটের সরাসরি লাইভ লিংক:
            </label>
            <div className="flex items-center gap-1 bg-white border border-[#ded8cb] p-1.5 rounded-xs">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="bg-transparent text-xs text-[#1a1a1a] font-mono flex-1 outline-hidden px-1 truncate"
              />
              <button
                onClick={handleCopyLink}
                className="bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs px-2.5 py-1 rounded-xs font-bold flex items-center gap-1 cursor-pointer font-['Noto_Serif_Bengali']"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

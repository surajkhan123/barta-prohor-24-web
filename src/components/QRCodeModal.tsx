import React, { useState } from 'react';
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  X, 
  ExternalLink, 
  Send,
  Printer,
  Camera,
  Radio,
  Loader2
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
}) => {
  const [currentUrl] = useState('https://barta-prohor-24-web.vercel.app/');
  const [copied, setCopied] = useState(false);
  const [cardStyle, setCardStyle] = useState<'news-card' | 'classic'>('news-card');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  // High-res QR code image URL
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
    currentUrl
  )}&color=111827&bgcolor=ffffff&margin=1`;

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

  // Helper to load image for canvas safely
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Retry without crossOrigin if CORS issues
        const retryImg = new Image();
        retryImg.onload = () => resolve(retryImg);
        retryImg.onerror = (e) => reject(e);
        retryImg.src = src;
      };
      img.src = src;
    });
  };

  // High-Definition Canvas Generator (Exact pixel coordinates, zero overlapping, perfect padding)
  const generatePressCardImage = async (): Promise<string | null> => {
    const width = 800;
    const height = 960;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 1. Background
    ctx.fillStyle = '#fdfbf7';
    ctx.fillRect(0, 0, width, height);

    // 2. Outer Border & Inner Hairline
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    ctx.strokeStyle = '#d6cebf';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(28, 28, width - 56, height - 56);

    // 3. Top Dateline
    ctx.fillStyle = '#b91c1c';
    ctx.font = 'bold 14px "Noto Serif Bengali", serif, sans-serif';
    ctx.fillText('BARTA PROHOR 24 • ডিজিটাল সংস্করণ', 44, 58);

    ctx.fillStyle = '#4b5563';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('ONLINE 24x7', width - 44, 58);
    ctx.textAlign = 'left';

    // Divider Line
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(40, 72);
    ctx.lineTo(width - 40, 72);
    ctx.stroke();

    // 4. Masthead Logo Box
    const logoW = 460;
    const logoH = 68;
    const logoX = (width - logoW) / 2;
    const logoY = 96;

    // Red banner
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(logoX, logoY, logoW, logoH, 6);
    } else {
      ctx.rect(logoX, logoY, logoW, logoH);
    }
    ctx.fill();
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Text "বার্তা প্রহর"
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Noto Serif Bengali", serif, sans-serif';
    ctx.fillText('বার্তা প্রহর', logoX + 25, logoY + 46);

    // Zee 24 Ghanta style "24" badge
    const badgeW = 90;
    const badgeH = 48;
    const badgeX = logoX + logoW - badgeW - 12;
    const badgeY = logoY + 10;

    ctx.fillStyle = '#111827';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
    } else {
      ctx.rect(badgeX, badgeY, badgeW, badgeH);
    }
    ctx.fill();

    // Single Solid Golden Yellow "24"
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'italic 900 34px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('24', badgeX + badgeW / 2, badgeY + 36);
    ctx.textAlign = 'left';

    // 5. Tagline underneath
    ctx.fillStyle = '#b91c1c';
    ctx.font = 'bold 15px "Noto Serif Bengali", serif';
    ctx.textAlign = 'center';
    ctx.fillText('সত্যের সন্ধানে নির্ভীক প্রতিদিন • ২৪x৭ ডিজিটাল বাংলা নিউজ', width / 2, 192);

    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(width / 2 - 70, 206, 140, 2.5);
    ctx.textAlign = 'left';

    // 6. Center Card Box (QR on left, clean structured text on right)
    const cardY = 226;
    const cardW = width - 80;
    const cardH = 390;
    const cardX = 40;

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ded8cb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(cardX, cardY, cardW, cardH, 8);
    } else {
      ctx.rect(cardX, cardY, cardW, cardH);
    }
    ctx.fill();
    ctx.stroke();

    // Load & Render QR Image
    try {
      const qrImg = await loadImage(qrCodeImageUrl);
      const qrSize = 280;
      const qrX = cardX + 25;
      const qrY = cardY + 28;

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12);

      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // "SCAN TO READ" text
      ctx.fillStyle = '#4b5563';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SCAN TO READ 24x7', qrX + qrSize / 2, qrY + qrSize + 22);
      ctx.textAlign = 'left';

      // Right Text Info
      const textX = qrX + qrSize + 35;
      
      // Live badge
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(textX, cardY + 36, 145, 28, 4);
      } else {
        ctx.rect(textX, cardY + 36, 145, 28);
      }
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px "Noto Serif Bengali", serif';
      ctx.fillText('● লাইভ নিউজডেস্ক', textX + 12, cardY + 55);

      // Heading lines
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 20px "Noto Serif Bengali", serif';
      ctx.fillText('মোবাইল ক্যামেরা দিয়ে স্ক্যান করে', textX, cardY + 104);
      ctx.fillText('সরাসরি পড়ুন ডিজিটাল পত্রিকা', textX, cardY + 134);

      // Body lines
      ctx.fillStyle = '#4b5563';
      ctx.font = '15px "Noto Serif Bengali", serif';
      ctx.fillText('তাজা খবর, বিনোদন, ভিডিও ও অডিও', textX, cardY + 180);
      ctx.fillText('বুলেটিন একসাথে সরাসরি পড়ুন বার্তা প্রহর', textX, cardY + 208);
      ctx.fillText('২৪ ডিজিটাল পোর্টালে।', textX, cardY + 236);

      // Feature highlight box
      ctx.fillStyle = '#fef3c7';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(textX, cardY + 265, cardW - qrSize - 80, 44, 4);
      } else {
        ctx.rect(textX, cardY + 265, cardW - qrSize - 80, 44);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#92400e';
      ctx.font = 'bold 13px "Noto Serif Bengali", serif';
      ctx.fillText('⚡ ব্রেকিং নিউজ ও ইনস্ট্যান্ট লাইভ কভারেজ', textX + 12, cardY + 293);
    } catch (e) {
      console.error('Failed to render QR on canvas:', e);
    }

    // 7. Official Web Portal Link Bar
    const linkY = 636;
    const linkH = 100;
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(40, linkY, width - 80, linkH, 6);
    } else {
      ctx.rect(40, linkY, width - 80, linkH);
    }
    ctx.fill();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px "Noto Serif Bengali", serif';
    ctx.textAlign = 'center';
    ctx.fillText('অফিসিয়াল ওয়েব পোর্টাল লিঙ্ক', width / 2, linkY + 34);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 21px monospace';
    ctx.fillText('https://barta-prohor-24-web.vercel.app/', width / 2, linkY + 72);

    // 8. Footer Section
    const footerY = 760;
    ctx.strokeStyle = '#ded8cb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, footerY);
    ctx.lineTo(width - 40, footerY);
    ctx.stroke();

    ctx.fillStyle = '#6b7280';
    ctx.font = '13px "Noto Serif Bengali", serif';
    ctx.textAlign = 'left';
    ctx.fillText('পশ্চিমবঙ্গ ও বিশ্বের তাজা সংবাদ • সর্বস্বত্ব সংরক্ষিত', 45, footerY + 32);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('BARTA PROHOR 24 DIGITAL', width - 45, footerY + 32);
    ctx.textAlign = 'left';

    return canvas.toDataURL('image/png', 1.0);
  };

  // Classic Large QR Canvas Generator
  const generateClassicQRImage = async (): Promise<string | null> => {
    const width = 640;
    const height = 760;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Header Logo
    const logoW = 340;
    const logoH = 56;
    const logoX = (width - logoW) / 2;
    const logoY = 45;

    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(logoX, logoY, logoW, logoH, 4);
    } else {
      ctx.rect(logoX, logoY, logoW, logoH);
    }
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px "Noto Serif Bengali", serif';
    ctx.fillText('বার্তা প্রহর', logoX + 20, logoY + 38);

    const bW = 65;
    const bH = 40;
    const bX = logoX + logoW - bW - 10;
    const bY = logoY + 8;
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(bX, bY, bW, bH, 4);
    } else {
      ctx.rect(bX, bY, bW, bH);
    }
    ctx.fill();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'italic 900 26px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('24', bX + bW / 2, bY + 30);
    ctx.textAlign = 'left';

    // QR Image
    try {
      const qrImg = await loadImage(qrCodeImageUrl);
      const qrSize = 360;
      const qrX = (width - qrSize) / 2;
      const qrY = 125;

      ctx.fillStyle = '#fdfbf7';
      ctx.strokeStyle = '#ded8cb';
      ctx.lineWidth = 2;
      ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
    } catch (e) {
      console.error('Failed to load QR:', e);
    }

    // Text underneath
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('barta-prohor-24-web.vercel.app', width / 2, 570);

    ctx.fillStyle = '#4b5563';
    ctx.font = '16px "Noto Serif Bengali", serif';
    ctx.fillText('যেকোনো মোবাইল ক্যামেরা বা স্ক্যানার দিয়ে স্ক্যান করুন', width / 2, 610);

    ctx.fillStyle = '#b91c1c';
    ctx.font = 'bold 14px "Noto Serif Bengali", serif';
    ctx.fillText('২৪x৭ ডিজিটাল বাংলা সংবাদ', width / 2, 645);

    return canvas.toDataURL('image/png', 1.0);
  };

  // Trigger Download as PNG image
  const handleDownloadCardImage = async () => {
    try {
      setIsDownloading(true);
      
      if (document.fonts) {
        await document.fonts.ready;
      }

      const dataUrl = cardStyle === 'news-card' 
        ? await generatePressCardImage() 
        : await generateClassicQRImage();

      if (!dataUrl) {
        throw new Error('Canvas data URL is empty');
      }

      const link = document.createElement('a');
      link.download = cardStyle === 'news-card' ? 'BartaProhor24_PressCard.png' : 'BartaProhor24_QRCode.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to generate canvas image:', err);
      window.open(qrCodeImageUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
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
              </h3>
              <p className="text-[11px] text-[#a3a3a3] mt-1 font-mono">
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

          <span className="text-[11px] text-[#737373] hidden sm:inline font-mono font-bold">
            HD PNG Format (100% Fitted)
          </span>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {cardStyle === 'news-card' ? (
            /* Newspaper Press Poster Frame Preview */
            <div 
              id="printable-news-card"
              className="bg-[#fdfbf7] border-2 border-[#1a1a1a] p-4 sm:p-6 shadow-md relative overflow-hidden rounded-xs font-['Noto_Serif_Bengali'] text-left space-y-4 max-w-md mx-auto"
            >
              {/* Card Top Border Line */}
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-2 text-[11px] text-[#525252] font-mono">
                <span className="font-bold text-[#b91c1c]">BARTA PROHOR 24 • ডিজিটাল সংস্করণ</span>
                <span>ONLINE 24x7</span>
              </div>

              {/* Masthead Header with Brand Logo */}
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
              <div className="relative bg-white border border-[#ded8cb] p-3.5 rounded-xs flex flex-col sm:flex-row items-center gap-4">
                <div className="shrink-0 bg-white p-2 border border-[#1a1a1a] shadow-xs rounded-xs">
                  <img
                    src={qrCodeImageUrl}
                    alt="Barta Prohor 24 Live QR"
                    crossOrigin="anonymous"
                    className="w-32 h-32 sm:w-36 sm:h-36 object-contain"
                  />
                  <div className="text-[9px] text-center font-mono font-bold text-[#737373] mt-1 uppercase">
                    SCAN TO READ
                  </div>
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="inline-flex items-center gap-1 bg-[#b91c1c] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>লাইভ নিউজডেস্ক</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#1a1a1a] leading-relaxed">
                    মোবাইল দিয়ে স্ক্যান করে সরাসরি পড়ুন ডিজিটাল সংবাদপত্র
                  </h4>
                  <p className="text-[12px] text-[#525252] leading-normal">
                    তাজা খবর, বিনোদন, ভিডিও ও অডিও বুলেটিন একসাথে আপনার আঙুলের ডগায়।
                  </p>
                </div>
              </div>

              {/* Web Link Highlight Box */}
              <div className="bg-[#111827] text-white p-3 rounded-xs text-center space-y-1">
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
                <span className="font-mono font-bold text-[#1a1a1a]">BARTA PROHOR 24</span>
              </div>
            </div>
          ) : (
            /* Classic Large QR Frame Preview */
            <div 
              className="p-6 bg-white border-2 border-[#1a1a1a] rounded-xs shadow-xs text-center space-y-4 max-w-sm mx-auto"
            >
              <div className="flex items-center justify-center mb-2">
                <BrandLogo size="sm" showTagline={false} />
              </div>
              <div className="p-3 bg-[#fdfbf7] border border-[#ded8cb] rounded-xs inline-block">
                <img
                  src={qrCodeImageUrl}
                  alt="Barta Prohor 24 Live QR"
                  crossOrigin="anonymous"
                  className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain"
                />
              </div>

              <div className="space-y-1 font-['Noto_Serif_Bengali']">
                <h4 className="text-sm font-bold text-[#1a1a1a] font-mono">
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
            <button
              onClick={handleDownloadCardImage}
              disabled={isDownloading}
              className="bg-[#1a1a1a] hover:bg-[#333333] text-white text-xs font-bold py-2.5 px-3 rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#1a1a1a] disabled:opacity-50 shadow-xs"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#fbbf24]" />
                  <span>ইমেজ তৈরি হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#fbbf24]" />
                  <span>PNG ইমেজ ডাউনলোড</span>
                </>
              )}
            </button>

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
              <span>অফিসিয়াল নিউজ পোর্টাল লিংক:</span>
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

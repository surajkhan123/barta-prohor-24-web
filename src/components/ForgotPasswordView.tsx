import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCw, 
  Send,
  ShieldCheck,
  LockKeyhole
} from 'lucide-react';
import { 
  getRecoveryEmail, 
  generatePasswordResetOTP, 
  verifyPasswordResetOTP, 
  updateStoredAdminPassword 
} from '../data/authStore';

interface ForgotPasswordViewProps {
  onBackToLogin: () => void;
  onResetSuccess: (newPassword: string) => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  onBackToLogin,
  onResetSuccess
}) => {
  const [step, setStep] = useState<'request_otp' | 'verify_otp' | 'set_new_password'>('request_otp');
  const [emailInput, setEmailInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  
  // OTP States
  const [sentOtpCode, setSentOtpCode] = useState<string | null>(null);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  
  // New Password States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status Alerts
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const registeredEmail = getRecoveryEmail();

  // Masked email for display (e.g. su***al@gmail.com)
  const maskedEmail = registeredEmail.replace(/(.{2})(.*)(@.*)/, (_match, p1, p2, p3) => {
    return p1 + '*'.repeat(Math.max(3, p2.length)) + p3;
  });

  // Countdown timer for OTP
  useEffect(() => {
    let timer: any;
    if (otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpCountdown]);

  // Handle Send OTP
  const handleSendOTP = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanInputEmail = emailInput.trim().toLowerCase();
    const cleanTargetEmail = registeredEmail.trim().toLowerCase();

    // Check if entered email matches registered admin email
    if (cleanInputEmail !== cleanTargetEmail) {
      setErrorMessage(`প্রদত্ত জিমেইল অ্যাড্রেসটি অ্যাডমিন অ্যাকাউন্টের সাথে মেলেনি! সঠিক জিমেইল লিখুন।`);
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      const { code } = generatePasswordResetOTP(registeredEmail);
      setSentOtpCode(code);
      setIsSending(false);
      setStep('verify_otp');
      setOtpCountdown(60);
      setSuccessMessage(`আপনার জিমেইলে (${registeredEmail}) একটি ৬ সংখ্যার ওটিপি (OTP) পাঠানো হয়েছে।`);
    }, 600);
  };

  // Handle Verify OTP
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!otpInput.trim()) {
      setErrorMessage('৬ সংখ্যার ওটিপি লিখুন!');
      return;
    }

    if (verifyPasswordResetOTP(otpInput)) {
      setSuccessMessage('ইমেইল ওটিপি সফলভাবে যাচাই হয়েছে! এবার নতুন পাসওয়ার্ড সেট করুন।');
      setTimeout(() => {
        setStep('set_new_password');
        setSuccessMessage('');
      }, 800);
    } else {
      setErrorMessage('ভুল ওটিপি কোড! অনুগ্রহ করে আপনার জিমেইলে আসা ৬ সংখ্যার সঠিক ওটিপি লিখুন।');
    }
  };

  // Handle Setting New Password
  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.trim().length < 4) {
      setErrorMessage('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের বা সংখ্যার হতে হবে!');
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      setErrorMessage('নতুন পাসওয়ার্ড ও নিশ্চিতকরণ পাসওয়ার্ড মেলেনি!');
      return;
    }

    const result = updateStoredAdminPassword(newPassword.trim());
    if (result.success) {
      setSuccessMessage('পাসওয়ার্ড সফলভাবে পরিবর্তিত ও ডেটাবেজে সংরক্ষিত হয়েছে!');
      setTimeout(() => {
        onResetSuccess(newPassword.trim());
      }, 1000);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="p-4 sm:p-8 flex flex-col items-center justify-center max-w-md mx-auto w-full font-['Noto_Serif_Bengali'] space-y-4">
      {/* Top Header Card */}
      <div className="w-full text-center space-y-1">
        <div className="w-14 h-14 rounded-full bg-[#fef2f2] border-2 border-[#b91c1c] text-[#b91c1c] flex items-center justify-center mx-auto mb-2 shadow-xs">
          <Mail className="w-7 h-7" />
        </div>
        <h3 className="text-lg sm:text-xl font-black text-[#1a1a1a]">
          {step === 'set_new_password' ? 'নতুন পাসওয়ার্ড নির্ধারণ করুন' : 'জিমেইল ওটিপি রিকভারি'}
        </h3>
        <p className="text-xs text-[#525252]">
          {step === 'request_otp' && 'আপনার নিবন্ধিত জিমেইল অ্যাড্রেসটি লিখুন, সেখানে একটি ৬ সংখ্যার ওটিপি কোড পাঠানো হবে।'}
          {step === 'verify_otp' && `আপনার জিমেইলে পাঠানো ৬ সংখ্যার ওটিপি কোডটি নিচে লিখে যাচাই করুন।`}
          {step === 'set_new_password' && 'পাসওয়ার্ড সফলভাবে রিসেট করতে নতুন পাসওয়ার্ড প্রবেশ করান।'}
        </p>
      </div>

      {/* Alert Messages */}
      {errorMessage && (
        <div className="w-full p-3 bg-[#fef2f2] border border-[#fca5a5] rounded-xs text-[#b91c1c] text-xs font-bold flex items-start gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="w-full p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xs text-[#065f46] text-xs font-bold flex items-start gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* STEP 1: Enter Gmail to receive OTP */}
      {step === 'request_otp' && (
        <form onSubmit={handleSendOTP} className="w-full space-y-4 bg-white p-5 rounded-xs border border-[#ded8cb] shadow-xs">
          <div>
            <label className="block text-xs font-bold text-[#1a1a1a] mb-1.5">
              নিবন্ধিত জিমেইল অ্যাড্রেস (Admin Gmail):
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="যেমন: surajkhanghatal@gmail.com"
                className="w-full bg-[#fbf9f4] border-2 border-[#ded8cb] focus:border-[#b91c1c] rounded-xs px-3 py-2 text-xs font-mono text-[#1a1a1a] focus:outline-hidden"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-[#737373] mt-1.5">
              নিবন্ধিত সিকিউরিটি অ্যাকাউন্ট: <strong className="font-mono text-[#1a1a1a]">{maskedEmail}</strong>
            </p>
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white py-2.5 px-4 rounded-xs font-bold text-xs cursor-pointer border border-[#7f1d1d] flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-70"
          >
            {isSending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>ওটিপি পাঠানো হচ্ছে...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>জিমেইলে ওটিপি (OTP) কোড পাঠান</span>
              </>
            )}
          </button>

          <div className="pt-2 text-center border-t border-[#ded8cb]">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-xs font-bold text-[#525252] hover:text-[#b91c1c] flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>লগইন স্ক্রিনে ফিরে যান</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: Enter & Verify OTP */}
      {step === 'verify_otp' && (
        <form onSubmit={handleVerifyOTP} className="w-full space-y-4 bg-white p-5 rounded-xs border border-[#ded8cb] shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#1a1a1a]">
                জিমেইলে আসা ৬ সংখ্যার OTP কোড:
              </label>
              <span className="text-[11px] font-mono text-[#059669] font-bold">
                {maskedEmail}
              </span>
            </div>

            {/* OTP Quick Paste Simulator Notification */}
            {sentOtpCode && (
              <div className="p-2.5 bg-[#eff6ff] border border-[#bfdbfe] rounded-xs text-xs text-[#1e40af] flex items-center justify-between my-2">
                <div>
                  <span className="font-bold">ইমেইল OTP কোড: </span>
                  <strong className="font-mono text-base text-[#b91c1c] tracking-widest">{sentOtpCode}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpInput(sentOtpCode)}
                  className="bg-[#2563eb] text-white px-2 py-0.5 rounded-xs text-[10px] font-bold cursor-pointer hover:bg-[#1d4ed8]"
                >
                  কোড বসান
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                placeholder="৬ সংখ্যার কোড"
                className="flex-1 bg-[#fbf9f4] border-2 border-[#ded8cb] focus:border-[#b91c1c] rounded-xs px-3 py-2 text-center text-lg font-mono tracking-widest text-[#1a1a1a] focus:outline-hidden"
                autoFocus
              />

              <button
                type="button"
                disabled={otpCountdown > 0}
                onClick={() => handleSendOTP()}
                className={`px-3 py-2.5 rounded-xs text-xs font-bold border transition-colors flex items-center gap-1 shrink-0 ${
                  otpCountdown > 0
                    ? 'bg-[#f3efe6] text-[#a3a3a3] border-[#ded8cb] cursor-not-allowed'
                    : 'bg-white text-[#1a1a1a] border-[#ded8cb] hover:bg-[#f3efe6] cursor-pointer'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${otpCountdown > 0 ? 'animate-spin' : ''}`} />
                <span>{otpCountdown > 0 ? `${otpCountdown}s` : 'পুনরায় পাঠান'}</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white py-2.5 px-4 rounded-xs font-bold text-xs cursor-pointer border border-[#7f1d1d] flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ওটিপি যাচাই করে পাসওয়ার্ড রিসেটে যান</span>
          </button>

          <div className="flex items-center justify-between pt-2 border-t border-[#ded8cb] text-xs">
            <button
              type="button"
              onClick={() => setStep('request_otp')}
              className="text-[#525252] hover:text-[#b91c1c] font-bold cursor-pointer"
            >
              ইমেইল পরিবর্তন করুন
            </button>
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-[#525252] hover:text-[#b91c1c] font-bold flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>লগইন স্ক্রিন</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Set New Password */}
      {step === 'set_new_password' && (
        <form onSubmit={handleSaveNewPassword} className="w-full bg-white p-5 rounded-xs border border-[#ded8cb] space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#ded8cb] text-xs font-bold text-[#059669]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>ওটিপি যাচাই সফল হয়েছে! এবার আপনার নতুন পাসওয়ার্ড নির্ধারণ করুন:</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
              নতুন পাসওয়ার্ড (কমপক্ষে ৪ অক্ষর বা সংখ্যা):
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                maxLength={30}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="যেমন: Barta2026 বা নতুন পিন"
                className="w-full bg-[#fbf9f4] border border-[#ded8cb] focus:border-[#059669] rounded-xs px-3 py-2 pr-10 text-sm font-mono text-[#1a1a1a] focus:outline-hidden"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#1a1a1a] p-1 cursor-pointer"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1a1a1a] mb-1">
              একই পাসওয়ার্ড পুনরায় লিখুন (নিশ্চিতকরণ):
            </label>
            <input
              type={showNewPassword ? 'text' : 'password'}
              maxLength={30}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="নতুন পাসওয়ার্ড আবার লিখুন"
              className="w-full bg-[#fbf9f4] border border-[#ded8cb] focus:border-[#059669] rounded-xs px-3 py-2 text-sm font-mono text-[#1a1a1a] focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-2.5 px-4 rounded-xs text-xs cursor-pointer border border-[#065f46] flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>নতুন পাসওয়ার্ড ডেটাবেজে সেভ করে সরাসরি লগইন করুন</span>
          </button>

          <div className="text-center pt-2 border-t border-[#ded8cb]">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-xs font-bold text-[#525252] hover:text-[#b91c1c] flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>বাতিল করে লগইনে ফিরুন</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Mail, 
  HelpCircle, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCw, 
  Send,
  ShieldCheck,
  Lock,
  ExternalLink
} from 'lucide-react';
import { 
  getRecoveryEmail, 
  getSecurityQuestion,
  verifyMasterRecoveryKey,
  verifySecurityAnswer,
  sendPasswordResetEmailOTP, 
  verifyPasswordResetOTP, 
  updateStoredAdminPassword 
} from '../data/authStore';

interface ForgotPasswordViewProps {
  onBackToLogin: () => void;
  onResetSuccess: (newPassword: string) => void;
}

type RecoveryMethod = 'gmail_otp' | 'master_key' | 'security_question';

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  onBackToLogin,
  onResetSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<RecoveryMethod>('gmail_otp');
  const [step, setStep] = useState<'verify' | 'set_new_password'>('verify');
  
  // Method 1: Gmail OTP states
  const registeredEmail = getRecoveryEmail() || 'surajkhanghatal@gmail.com';
  const [emailInput, setEmailInput] = useState(registeredEmail);
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Method 2: Master Key state
  const [masterKeyInput, setMasterKeyInput] = useState('');
  const [showMasterKey, setShowMasterKey] = useState(false);

  // Method 3: Security Question state
  const [securityAnswerInput, setSecurityAnswerInput] = useState('');

  // Step 2: New Password states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status Alerts
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { question } = getSecurityQuestion();

  // Masked email for display (e.g. su*******....@gmail.com)
  const getMaskedEmail = (email: string) => {
    const [name, domain] = email.split('@');
    if (!name || !domain) return 'su*******....@gmail.com';
    const prefix = name.slice(0, 2);
    return `${prefix}*******....@${domain}`;
  };
  const maskedEmail = getMaskedEmail(registeredEmail);

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
  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanInputEmail = emailInput.trim().toLowerCase();
    const cleanTargetEmail = registeredEmail.trim().toLowerCase();

    if (!cleanInputEmail) {
      setErrorMessage('অনুগ্রহ করে আপনার নিবন্ধিত জিমেইল অ্যাড্রেসটি লিখুন।');
      return;
    }

    if (cleanInputEmail !== cleanTargetEmail) {
      setErrorMessage('অননুমোদিত জিমেইল! শুধুমাত্র নিবন্ধিত মূল অ্যাডমিন জিমেইল ছাড়া অন্য কোনো ঠিকানায় ওটিপি কোড পাঠানো সম্ভব নয়।');
      return;
    }

    setIsSendingOtp(true);
    try {
      // Calls backend dispatch to send real email
      const result = await sendPasswordResetEmailOTP(registeredEmail);
      setIsSendingOtp(false);
      setOtpSent(true);
      setOtpCountdown(60);
      setSuccessMessage(`৬ সংখ্যার ওটিপি কোড পাঠানো হয়েছে ${maskedEmail} এ`);
    } catch (err) {
      setIsSendingOtp(false);
      setErrorMessage('ওটিপি পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  // Handle Verification across all 3 methods
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (selectedMethod === 'gmail_otp') {
      if (!otpSent) {
        handleSendOTP();
        return;
      }
      if (!otpInput.trim()) {
        setErrorMessage('জিমেইলে আসা ৬ সংখ্যার ওটিপি কোডটি লিখুন।');
        return;
      }
      if (verifyPasswordResetOTP(otpInput)) {
        setSuccessMessage('জিমেইল ওটিপি সফলভাবে যাচাই হয়েছে! এবার নতুন পাসওয়ার্ড দিন।');
        setTimeout(() => {
          setStep('set_new_password');
          setSuccessMessage('');
        }, 700);
      } else {
        setErrorMessage('ভুল ওটিপি কোড! অনুগ্রহ করে আপনার জিমেইলে আসা সঠিক ৬ সংখ্যার কোড লিখুন।');
      }
    } else if (selectedMethod === 'master_key') {
      if (!masterKeyInput.trim()) {
        setErrorMessage('মাস্টার সিকিউরিটি কি (Master Key) লিখুন।');
        return;
      }
      if (verifyMasterRecoveryKey(masterKeyInput)) {
        setSuccessMessage('মাস্টার কি সফলভাবে গৃহীত হয়েছে!');
        setTimeout(() => {
          setStep('set_new_password');
          setSuccessMessage('');
        }, 700);
      } else {
        setErrorMessage('অকার্যকর মাস্টার কি! সঠিক সিকিউরিটি কি প্রবেশ করান।');
      }
    } else if (selectedMethod === 'security_question') {
      if (!securityAnswerInput.trim()) {
        setErrorMessage('সিকিউরিটি প্রশ্নের সঠিক উত্তর লিখুন।');
        return;
      }
      if (verifySecurityAnswer(securityAnswerInput)) {
        setSuccessMessage('সিকিউরিটি প্রশ্নের উত্তর সফলভাবে যাচাই হয়েছে!');
        setTimeout(() => {
          setStep('set_new_password');
          setSuccessMessage('');
        }, 700);
      } else {
        setErrorMessage('ভুল উত্তর! সঠিক সিকিউরিটি উত্তর প্রবেশ করান।');
      }
    }
  };

  // Handle Save New Password
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
      }, 900);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-3 sm:p-6 flex flex-col items-center justify-center font-['Noto_Serif_Bengali'] overflow-y-auto">
      {/* Header */}
      <div className="w-full text-center space-y-1.5 mb-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#fef2f2] border-2 border-[#b91c1c] text-[#b91c1c] flex items-center justify-center mx-auto shadow-xs">
          {step === 'verify' ? <Lock className="w-6 h-6 sm:w-7 sm:h-7" /> : <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-[#059669]" />}
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#1a1a1a]">
          {step === 'verify' ? 'অ্যাডমিন পাসওয়ার্ড পুনরুদ্ধার (Password Recovery)' : 'নতুন পাসওয়ার্ড নির্ধারণ করুন'}
        </h3>
        <p className="text-xs text-[#525252] max-w-sm mx-auto leading-relaxed">
          {step === 'verify' 
            ? 'পাসওয়ার্ড ভুলে গেলে নিচে উল্লেখিত যেকোনো একটি নিরাপদ মাধ্যমে অ্যাকাউন্ট আনলক করুন।'
            : 'আপনার পছন্দের নতুন পাসওয়ার্ড লিখুন যা সরাসরি ডেটাবেজে সংরক্ষিত হয়ে যাবে।'
          }
        </p>
      </div>

      {/* Alert Messages */}
      {errorMessage && (
        <div className="w-full mb-3 p-3 bg-[#fef2f2] border border-[#fca5a5] rounded-xs text-[#b91c1c] text-xs font-bold flex items-start gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="flex-1">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="w-full mb-3 p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xs text-[#065f46] text-xs font-bold flex items-start gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
          <span className="flex-1">{successMessage}</span>
        </div>
      )}

      {/* Step 1: Method Selection & Verification */}
      {step === 'verify' ? (
        <div className="w-full space-y-4">
          {/* Recovery Methods Switcher Tabs (Responsive Grid) */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#f3efe6] rounded-xs border border-[#ded8cb] text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setSelectedMethod('gmail_otp');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`py-2 px-1.5 rounded-xs transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-[11px] sm:text-xs text-center ${
                selectedMethod === 'gmail_otp'
                  ? 'bg-[#1a1a1a] text-white shadow-xs'
                  : 'text-[#525252] hover:text-[#1a1a1a] hover:bg-[#eae5db]'
              }`}
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">১. জিমেইল ওটিপি</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedMethod('master_key');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`py-2 px-1.5 rounded-xs transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-[11px] sm:text-xs text-center ${
                selectedMethod === 'master_key'
                  ? 'bg-[#1a1a1a] text-white shadow-xs'
                  : 'text-[#525252] hover:text-[#1a1a1a] hover:bg-[#eae5db]'
              }`}
            >
              <Key className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">২. মাস্টার কি</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedMethod('security_question');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`py-2 px-1.5 rounded-xs transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-[11px] sm:text-xs text-center ${
                selectedMethod === 'security_question'
                  ? 'bg-[#1a1a1a] text-white shadow-xs'
                  : 'text-[#525252] hover:text-[#1a1a1a] hover:bg-[#eae5db]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">৩. সিকিউরিটি প্রশ্ন</span>
            </button>
          </div>

          {/* Form Container */}
          <form onSubmit={handleVerify} className="w-full bg-white p-4 sm:p-5 rounded-xs border border-[#ded8cb] shadow-xs space-y-4">
            {/* METHOD 1: GMAIL OTP */}
            {selectedMethod === 'gmail_otp' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#ded8cb]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1a1a1a]">
                    <Mail className="w-4 h-4 text-[#b91c1c]" />
                    <span>জিমেইল ভেরিফিকেশন (Email OTP)</span>
                  </div>
                  <span className="text-[10px] text-[#737373] font-bold">
                    সুরক্ষিত মাধ্যম
                  </span>
                </div>

                {!otpSent ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1a1a1a] mb-1.5">
                        আপনার নিবন্ধিত জিমেইল অ্যাড্রেস লিখুন:
                      </label>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter your gmail"
                        className="w-full bg-[#fbf9f4] border-2 border-[#ded8cb] focus:border-[#b91c1c] rounded-xs px-3 py-2 text-xs sm:text-sm font-mono text-[#1a1a1a] focus:outline-hidden"
                        autoFocus
                      />
                    </div>

                    <button
                      type="button"
                      disabled={isSendingOtp}
                      onClick={handleSendOTP}
                      className="w-full bg-[#1a1a1a] hover:bg-[#333333] text-white py-2.5 px-4 rounded-xs font-bold text-xs cursor-pointer flex items-center justify-center gap-2 transition-colors border border-[#333333] disabled:opacity-70"
                    >
                      {isSendingOtp ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>ওটিপি পাঠানো হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-[#fbbf24]" />
                          <span>জিমেইলে ওটিপি (OTP) পাঠান</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1a1a1a] mb-1.5">
                        জিমেইলে আসা ৬ সংখ্যার কোডটি লিখুন:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                          placeholder="৬ সংখ্যার কোড"
                          className="flex-1 bg-[#fbf9f4] border-2 border-[#ded8cb] focus:border-[#b91c1c] rounded-xs px-3 py-2 text-center text-base sm:text-lg font-mono tracking-widest text-[#1a1a1a] focus:outline-hidden"
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

                    <div className="pt-1 text-center">
                      <a
                        href="https://mail.google.com/mail/u/0/#search/Barta+Prohor+24+OR+OTP"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#2563eb] hover:underline font-bold bg-[#eff6ff] px-3 py-1.5 rounded-xs border border-[#bfdbfe]"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>সরাসরি Gmail ইনবক্স ওপেন করুন</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* METHOD 2: MASTER RECOVERY KEY */}
            {selectedMethod === 'master_key' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#ded8cb]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1a1a1a]">
                    <Key className="w-4 h-4 text-[#b91c1c]" />
                    <span>মাস্টার সিকিউরিটি কি (Master Recovery Key)</span>
                  </div>
                  <span className="text-[10px] bg-[#fef2f2] text-[#b91c1c] px-2 py-0.5 rounded-xs border border-[#fca5a5] font-bold">
                    গোপন
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1a1a1a] mb-1.5">
                    আপনার গোপন মাস্টার কি লিখুন:
                  </label>
                  <div className="relative">
                    <input
                      type={showMasterKey ? 'text' : 'password'}
                      value={masterKeyInput}
                      onChange={(e) => setMasterKeyInput(e.target.value)}
                      placeholder="মাস্টার কি প্রবেশ করান"
                      className="w-full bg-[#fbf9f4] border-2 border-[#ded8cb] focus:border-[#b91c1c] rounded-xs px-3 py-2 pr-10 text-xs sm:text-sm font-mono text-[#1a1a1a] focus:outline-hidden"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowMasterKey(!showMasterKey)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#1a1a1a] p-1 cursor-pointer"
                    >
                      {showMasterKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white py-2.5 px-4 rounded-xs font-bold text-xs cursor-pointer border border-[#7f1d1d] flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>মাস্টার কি যাচাই করে রিসেট করুন</span>
                </button>
              </div>
            )}

            {/* METHOD 3: SECURITY QUESTION */}
            {selectedMethod === 'security_question' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#ded8cb]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1a1a1a]">
                    <HelpCircle className="w-4 h-4 text-[#b91c1c]" />
                    <span>সিকিউরিটি প্রশ্ন ও উত্তর</span>
                  </div>
                  <span className="text-[10px] bg-[#eff6ff] text-[#1d4ed8] px-2 py-0.5 rounded-xs border border-[#bfdbfe] font-bold">
                    নিরাপত্তা প্রশ্ন
                  </span>
                </div>

                <div className="p-3 bg-[#fcfbf9] border border-[#e5dfd3] rounded-xs">
                  <span className="block text-[11px] text-[#737373] mb-0.5">নির্ধারিত সিকিউরিটি প্রশ্ন:</span>
                  <span className="font-bold text-xs sm:text-sm text-[#1a1a1a]">"{question}"</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1a1a1a] mb-1.5">
                    আপনার গোপন নিরাপত্তা উত্তরটি লিখুন:
                  </label>
                  <input
                    type="text"
                    value={securityAnswerInput}
                    onChange={(e) => setSecurityAnswerInput(e.target.value)}
                    placeholder="আপনার গোপন উত্তর লিখুন"
                    className="w-full bg-[#fbf9f4] border-2 border-[#ded8cb] focus:border-[#b91c1c] rounded-xs px-3 py-2 text-xs sm:text-sm text-[#1a1a1a] focus:outline-hidden"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white py-2.5 px-4 rounded-xs font-bold text-xs cursor-pointer border border-[#7f1d1d] flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>উত্তর যাচাই করে পাসওয়ার্ড রিসেট পেজে যান</span>
                </button>
              </div>
            )}
          </form>

          {/* Back to Login Button */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-xs font-bold text-[#525252] hover:text-[#b91c1c] flex items-center gap-1.5 mx-auto cursor-pointer py-1 px-3 rounded-xs hover:bg-[#f3efe6]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>লগইন স্ক্রিনে ফিরে যান</span>
            </button>
          </div>
        </div>
      ) : (
        /* Step 2: Set New Password */
        <div className="w-full space-y-4">
          <form onSubmit={handleSaveNewPassword} className="w-full bg-white p-4 sm:p-5 rounded-xs border border-[#ded8cb] shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-[#ded8cb] text-xs font-bold text-[#059669]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>যাচাইকরণ সফল হয়েছে! এবার আপনার নতুন পাসওয়ার্ড নির্ধারণ করুন:</span>
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
                  className="w-full bg-[#fbf9f4] border border-[#ded8cb] focus:border-[#059669] rounded-xs px-3 py-2 pr-10 text-xs sm:text-sm font-mono text-[#1a1a1a] focus:outline-hidden"
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
                className="w-full bg-[#fbf9f4] border border-[#ded8cb] focus:border-[#059669] rounded-xs px-3 py-2 text-xs sm:text-sm font-mono text-[#1a1a1a] focus:outline-hidden"
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
                className="text-xs font-bold text-[#525252] hover:text-[#b91c1c] flex items-center gap-1.5 mx-auto cursor-pointer py-1 px-2 rounded-xs hover:bg-[#f3efe6]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>বাতিল করে লগইনে ফিরুন</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

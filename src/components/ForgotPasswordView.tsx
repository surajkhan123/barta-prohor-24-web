import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Mail, 
  HelpCircle, 
  ShieldAlert, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCw, 
  Lock,
  Send,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { 
  getRecoveryEmail, 
  getSecurityQuestion, 
  verifyMasterRecoveryKey, 
  verifySecurityAnswer, 
  generatePasswordResetOTP, 
  verifyPasswordResetOTP, 
  updateStoredAdminPassword,
  MASTER_EMERGENCY_KEYS
} from '../data/authStore';

interface ForgotPasswordViewProps {
  onBackToLogin: () => void;
  onResetSuccess: (newPassword: string) => void;
}

type RecoveryMethod = 'master_key' | 'email_otp' | 'security_question';

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  onBackToLogin,
  onResetSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<RecoveryMethod>('master_key');
  const [step, setStep] = useState<'verify' | 'set_new_password'>('verify');
  
  // Verification States
  const [masterKeyInput, setMasterKeyInput] = useState('');
  const [securityAnswerInput, setSecurityAnswerInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  
  // OTP Simulation States
  const [otpSent, setOtpSent] = useState(false);
  const [sentOtpCode, setSentOtpCode] = useState<string | null>(null);
  const [otpCountdown, setOtpCountdown] = useState(0);
  
  // New Password States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status Alerts
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const registeredEmail = getRecoveryEmail();
  const { question } = getSecurityQuestion();

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
  const handleSendOTP = () => {
    setErrorMessage('');
    const { code } = generatePasswordResetOTP(registeredEmail);
    setSentOtpCode(code);
    setOtpSent(true);
    setOtpCountdown(60);
    setSuccessMessage(`৬ সংখ্যার ওটিপি কোড পাঠানো হয়েছে ${registeredEmail} এ`);
  };

  // Handle Verification
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (selectedMethod === 'master_key') {
      if (!masterKeyInput.trim()) {
        setErrorMessage('মাস্টার রিকভারি কি লিখুন!');
        return;
      }
      if (verifyMasterRecoveryKey(masterKeyInput)) {
        setSuccessMessage('মাস্টার কি সঠিকভাবে যাচাই হয়েছে! এবার নতুন পাসওয়ার্ড সেট করুন।');
        setTimeout(() => {
          setStep('set_new_password');
          setSuccessMessage('');
        }, 800);
      } else {
        setErrorMessage('ভুল মাস্টার কি! অনুগ্রহ করে সঠিক রিকভারি কি দিন (যেমন: BP24-ADMIN বা 7780)');
      }
    } else if (selectedMethod === 'email_otp') {
      if (!otpInput.trim()) {
        setErrorMessage('৬ সংখ্যার ওটিপি লিখুন!');
        return;
      }
      if (verifyPasswordResetOTP(otpInput)) {
        setSuccessMessage('ইমেইল ওটিপি সফলভাবে যাচাই হয়েছে!');
        setTimeout(() => {
          setStep('set_new_password');
          setSuccessMessage('');
        }, 800);
      } else {
        setErrorMessage('ভুল ওটিপি কোড! অনুগ্রহ করে আপনার পাঠানো ৬ সংখ্যার কোডটি সঠিকভাবে লিখুন।');
      }
    } else if (selectedMethod === 'security_question') {
      if (!securityAnswerInput.trim()) {
        setErrorMessage('নিরাপত্তা প্রশ্নের উত্তর লিখুন!');
        return;
      }
      if (verifySecurityAnswer(securityAnswerInput)) {
        setSuccessMessage('নিরাপত্তা প্রশ্ন সঠিকভাবে যাচাই হয়েছে!');
        setTimeout(() => {
          setStep('set_new_password');
          setSuccessMessage('');
        }, 800);
      } else {
        setErrorMessage('সঠিক উত্তর নয়! আবার চেষ্টা করুন (উত্তর: বার্তা প্রহর)');
      }
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
      setSuccessMessage('পাসওয়ার্ড সফলভাবে রিকভার ও ডেটাবেজে সংরক্ষিত হয়েছে!');
      setTimeout(() => {
        onResetSuccess(newPassword.trim());
      }, 1000);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="p-4 sm:p-8 flex flex-col items-center justify-center max-w-lg mx-auto w-full font-['Noto_Serif_Bengali'] space-y-4">
      {/* Top Header Card */}
      <div className="w-full text-center space-y-1">
        <div className="w-14 h-14 rounded-full bg-[#fef2f2] border-2 border-[#b91c1c] text-[#b91c1c] flex items-center justify-center mx-auto mb-2 shadow-xs">
          <Key className="w-7 h-7" />
        </div>
        <h3 className="text-lg sm:text-xl font-black text-[#1a1a1a]">
          {step === 'verify' ? 'অ্যাডমিন পাসওয়ার্ড পুনরুদ্ধার (Password Recovery)' : 'নতুন পাসওয়ার্ড নির্ধারণ করুন'}
        </h3>
        <p className="text-xs text-[#525252]">
          {step === 'verify' 
            ? 'পাসওয়ার্ড ভুলে গেলে নিচে উল্লেখিত যেকোনো একটি পদ্ধতি ব্যবহার করে পাসওয়ার্ড রিসেট করুন।'
            : 'আপনার পছন্দের নতুন পাসওয়ার্ড লিখুন যা সরাসরি ডেটাবেজে সংরক্ষিত হবে।'
          }
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

      {step === 'verify' ? (
        <div className="w-full space-y-4">
          {/* Method Selection Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#f3efe6] rounded-xs border border-[#ded8cb] text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setSelectedMethod('master_key');
                setErrorMessage('');
              }}
              className={`py-2 px-1 rounded-xs transition-all flex flex-col items-center gap-1 cursor-pointer text-[11px] ${
                selectedMethod === 'master_key'
                  ? 'bg-[#1a1a1a] text-white shadow-xs'
                  : 'text-[#525252] hover:text-[#1a1a1a] hover:bg-[#eae5db]'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>মাস্টার কি</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedMethod('email_otp');
                setErrorMessage('');
              }}
              className={`py-2 px-1 rounded-xs transition-all flex flex-col items-center gap-1 cursor-pointer text-[11px] ${
                selectedMethod === 'email_otp'
                  ? 'bg-[#1a1a1a] text-white shadow-xs'
                  : 'text-[#525252] hover:text-[#1a1a1a] hover:bg-[#eae5db]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>ইমেইল ওটিপি</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedMethod('security_question');
                setErrorMessage('');
              }}
              className={`py-2 px-1 rounded-xs transition-all flex flex-col items-center gap-1 cursor-pointer text-[11px] ${
                selectedMethod === 'security_question'
                  ? 'bg-[#1a1a1a] text-white shadow-xs'
                  : 'text-[#525252] hover:text-[#1a1a1a] hover:bg-[#eae5db]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>নিরাপত্তা প্রশ্ন</span>
            </button>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            {/* METHOD 1: Master Emergency Key */}
            {selectedMethod === 'master_key' && (
              <div className="bg-white p-4 rounded-xs border border-[#ded8cb] space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#1a1a1a] font-bold">
                  <Key className="w-4 h-4 text-[#b91c1c]" />
                  <span>মাস্টার এমার্জেন্সি রিকভারি কি (Master Key):</span>
                </div>
                <p className="text-[11px] text-[#737373]">
                  পোর্টালের মূল মাস্টার রিকভারি কোড প্রবেশ করিয়ে সাথে সাথে পাসওয়ার্ড রিসেট করুন।
                </p>

                <div>
                  <input
                    type="text"
                    value={masterKeyInput}
                    onChange={(e) => setMasterKeyInput(e.target.value)}
                    placeholder="মাস্টার কি লিখুন (যেমন: BP24-ADMIN বা 7780)"
                    className="w-full bg-[#fbf9f4] border-2 border-[#ded8cb] focus:border-[#b91c1c] rounded-xs px-3 py-2 text-sm font-mono text-[#1a1a1a] focus:outline-hidden"
                    autoFocus
                  />
                  <div className="flex items-center justify-between text-[10px] text-[#737373] mt-1.5">
                    <span>ডিফল্ট মাস্টার কোড: <strong className="font-mono text-[#b91c1c]">BP24-ADMIN</strong> বা <strong className="font-mono text-[#b91c1c]">7780</strong></span>
                    <button
                      type="button"
                      onClick={() => setMasterKeyInput('BP24-ADMIN')}
                      className="text-[#b91c1c] hover:underline font-bold cursor-pointer"
                    >
                      অটো ফিল করুন
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* METHOD 2: Email OTP */}
            {selectedMethod === 'email_otp' && (
              <div className="bg-white p-4 rounded-xs border border-[#ded8cb] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#1a1a1a] font-bold">
                    <Mail className="w-4 h-4 text-[#b91c1c]" />
                    <span>রেজিস্টার্ড অ্যাডমিন ইমেইল:</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#059669] font-bold">
                    {maskedEmail}
                  </span>
                </div>

                <p className="text-[11px] text-[#737373]">
                  আপনার ইমেইলে ৬ সংখ্যার তাৎক্ষণিক ভেরিফিকেশন ওটিপি পাঠানো হবে।
                </p>

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="w-full bg-[#1a1a1a] hover:bg-[#333333] text-white py-2.5 px-4 rounded-xs font-bold text-xs cursor-pointer flex items-center justify-center gap-2 transition-colors border border-[#333333]"
                  >
                    <Send className="w-3.5 h-3.5 text-[#fbbf24]" />
                    <span>ইমেইলে ওটিপি (OTP) পাঠান</span>
                  </button>
                ) : (
                  <div className="space-y-2.5">
                    {/* Simulated OTP Notification Banner for convenience */}
                    {sentOtpCode && (
                      <div className="p-2.5 bg-[#eff6ff] border border-[#bfdbfe] rounded-xs text-xs text-[#1e40af] flex items-center justify-between">
                        <div>
                          <span className="font-bold">ভেরিফিকেশন ওটিপি: </span>
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

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="৬ সংখ্যার OTP কোড লিখুন"
                        className="flex-1 bg-[#fbf9f4] border-2 border-[#ded8cb] focus:border-[#b91c1c] rounded-xs px-3 py-2 text-center text-base font-mono tracking-widest text-[#1a1a1a] focus:outline-hidden"
                        autoFocus
                      />

                      <button
                        type="button"
                        disabled={otpCountdown > 0}
                        onClick={handleSendOTP}
                        className={`px-3 py-2 rounded-xs text-xs font-bold border transition-colors flex items-center gap-1 ${
                          otpCountdown > 0
                            ? 'bg-[#f3efe6] text-[#a3a3a3] border-[#ded8cb] cursor-not-allowed'
                            : 'bg-white text-[#1a1a1a] border-[#ded8cb] hover:bg-[#f3efe6] cursor-pointer'
                        }`}
                      >
                        <RefreshCw className={`w-3 h-3 ${otpCountdown > 0 ? 'animate-spin' : ''}`} />
                        <span>{otpCountdown > 0 ? `${otpCountdown}s` : 'পুনরায় পাঠান'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* METHOD 3: Security Question */}
            {selectedMethod === 'security_question' && (
              <div className="bg-white p-4 rounded-xs border border-[#ded8cb] space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#1a1a1a] font-bold">
                  <HelpCircle className="w-4 h-4 text-[#b91c1c]" />
                  <span>নিরাপত্তা প্রশ্ন:</span>
                </div>

                <div className="p-2.5 bg-[#fcfbf9] border border-[#e5dfd3] rounded-xs font-bold text-xs text-[#1a1a1a]">
                  "{question}"
                </div>

                <div>
                  <input
                    type="text"
                    value={securityAnswerInput}
                    onChange={(e) => setSecurityAnswerInput(e.target.value)}
                    placeholder="আপনার সঠিক উত্তরটি লিখুন (যেমন: বার্তা প্রহর)"
                    className="w-full bg-[#fbf9f4] border-2 border-[#ded8cb] focus:border-[#b91c1c] rounded-xs px-3 py-2 text-sm text-[#1a1a1a] focus:outline-hidden"
                    autoFocus
                  />
                  <div className="flex items-center justify-between text-[10px] text-[#737373] mt-1.5">
                    <span>ডিফল্ট উত্তর: <strong className="text-[#b91c1c]">বার্তা প্রহর</strong></span>
                    <button
                      type="button"
                      onClick={() => setSecurityAnswerInput('বার্তা প্রহর')}
                      className="text-[#b91c1c] hover:underline font-bold cursor-pointer"
                    >
                      অটো ফিল করুন
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Action Button */}
            <button
              type="submit"
              className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white py-2.5 px-4 rounded-xs font-bold text-xs cursor-pointer border border-[#7f1d1d] flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>যাচাই করে পাসওয়ার্ড রিসেট পেজে যান</span>
            </button>
          </form>

          {/* Back to Login Button */}
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
        </div>
      ) : (
        /* STEP 2: SET NEW PASSWORD */
        <div className="w-full space-y-4">
          <form onSubmit={handleSaveNewPassword} className="bg-white p-5 rounded-xs border border-[#ded8cb] space-y-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-[#ded8cb] text-xs font-bold text-[#059669]">
              <CheckCircle2 className="w-4 h-4" />
              <span>যাচাইকরণ সফল হয়েছে! এবার নতুন পাসওয়ার্ড দিন:</span>
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
                  placeholder="যেমন: Barta2026 বা 7780"
                  className="w-full bg-[#fbf9f4] border border-[#ded8cb] focus:border-[#b91c1c] rounded-xs px-3 py-2 pr-10 text-sm font-mono text-[#1a1a1a] focus:outline-hidden"
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
                className="w-full bg-[#fbf9f4] border border-[#ded8cb] focus:border-[#b91c1c] rounded-xs px-3 py-2 text-sm font-mono text-[#1a1a1a] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-2.5 px-4 rounded-xs text-xs cursor-pointer border border-[#065f46] flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>নতুন পাসওয়ার্ড ডেটাবেজে সেভ করে লগইন করুন</span>
            </button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-xs font-bold text-[#525252] hover:text-[#b91c1c] flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>বাতিল করে লগইনে ফিরুন</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

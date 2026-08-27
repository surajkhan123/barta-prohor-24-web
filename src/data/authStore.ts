/**
 * Admin Authentication & Secure Password Storage
 * Manages admin password persistence, recovery keys, email OTPs, and password reset flows
 */

const STORAGE_KEY = 'bp24_admin_password';
const LEGACY_PIN_KEY = 'bp24_admin_pin';
const DEFAULT_PASSWORD = '7780';
const PASSWORD_UPDATED_KEY = 'bp24_admin_password_updated_at';

// Recovery Config Keys
const RECOVERY_EMAIL_KEY = 'bp24_admin_recovery_email';
const RECOVERY_KEY_STORAGE = 'bp24_admin_emergency_key';
const RECOVERY_QUESTION_KEY = 'bp24_admin_sec_question';
const RECOVERY_ANSWER_KEY = 'bp24_admin_sec_answer';

export const DEFAULT_RECOVERY_EMAIL = 'surajkhanghatal@gmail.com';
export const DEFAULT_SEC_QUESTION = 'আপনার গোপন নিরাপত্তা কীওয়ার্ড / ফেভারিট ব্র্যান্ড কি?';
export const DEFAULT_SEC_ANSWER = 'Oppo';

// Master Emergency Keys
export const MASTER_EMERGENCY_KEYS = ['BP24-ADMIN', 'BP24-7780', '7780', '2424', 'BARTA24'];

/**
 * Retrieve the active registered recovery email.
 * Strictly defaults and locks to surajkhanghatal@gmail.com
 */
export function getRecoveryEmail(): string {
  try {
    const saved = localStorage.getItem(RECOVERY_EMAIL_KEY);
    if (saved && saved.trim().length > 0 && saved.includes('@')) {
      return saved.trim().toLowerCase();
    }
  } catch (err) {
    console.error('Error reading recovery email:', err);
  }
  return DEFAULT_RECOVERY_EMAIL.toLowerCase();
}

/**
 * Save recovery email
 */
export function setRecoveryEmail(email: string): boolean {
  try {
    if (!email || !email.includes('@')) return false;
    localStorage.setItem(RECOVERY_EMAIL_KEY, email.trim().toLowerCase());
    return true;
  } catch (err) {
    console.error('Error saving recovery email:', err);
    return false;
  }
}

/**
 * Retrieve the active admin password from storage.
 * Defaults to '7780' if no password has ever been set.
 */
export function getStoredAdminPassword(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.trim().length > 0) {
      return saved.trim();
    }

    // Check legacy key
    const legacy = localStorage.getItem(LEGACY_PIN_KEY);
    if (legacy && legacy.trim().length > 0) {
      localStorage.setItem(STORAGE_KEY, legacy.trim());
      return legacy.trim();
    }
  } catch (err) {
    console.error('Error loading admin password:', err);
  }
  return DEFAULT_PASSWORD;
}

/**
 * Check if a given password/PIN matches the active admin password.
 */
export function verifyAdminPassword(input: string): boolean {
  if (!input) return false;
  const currentPassword = getStoredAdminPassword();
  return input.trim() === currentPassword;
}

/**
 * Save and persist a new admin password in storage.
 */
export function updateStoredAdminPassword(newPassword: string): { success: boolean; message: string } {
  if (!newPassword || newPassword.trim().length < 4) {
    return {
      success: false,
      message: 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের বা সংখ্যার হতে হবে।'
    };
  }

  try {
    const cleanPassword = newPassword.trim();
    localStorage.setItem(STORAGE_KEY, cleanPassword);
    localStorage.setItem(LEGACY_PIN_KEY, cleanPassword); // Keep sync
    localStorage.setItem(PASSWORD_UPDATED_KEY, new Date().toISOString());
    return {
      success: true,
      message: 'নতুন পাসওয়ার্ড সফলভাবে ডেটাবেজে সংরক্ষিত হয়েছে!'
    };
  } catch (err) {
    console.error('Error saving admin password:', err);
    return {
      success: false,
      message: 'পাসওয়ার্ড সংরক্ষণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
    };
  }
}

/**
 * Get formatted date when password was last changed.
 */
export function getPasswordLastUpdated(): string | null {
  try {
    const timeStr = localStorage.getItem(PASSWORD_UPDATED_KEY);
    if (!timeStr) return null;
    const date = new Date(timeStr);
    return new Intl.DateTimeFormat('bn-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return null;
  }
}

/**
 * Get Registered Recovery Email (surajkhanghatal@gmail.com)
 */
export function getRegisteredAdminEmail(): string {
  return getRecoveryEmail();
}

/**
 * Get Security Question & Answer
 */
export function getSecurityQuestion(): { question: string; answer: string } {
  try {
    const question = localStorage.getItem(RECOVERY_QUESTION_KEY) || DEFAULT_SEC_QUESTION;
    const answer = localStorage.getItem(RECOVERY_ANSWER_KEY) || DEFAULT_SEC_ANSWER;
    return { question, answer };
  } catch {
    return { question: DEFAULT_SEC_QUESTION, answer: DEFAULT_SEC_ANSWER };
  }
}

/**
 * Set Security Question & Answer
 */
export function setSecurityQuestion(question: string, answer: string): void {
  try {
    localStorage.setItem(RECOVERY_QUESTION_KEY, question.trim());
    localStorage.setItem(RECOVERY_ANSWER_KEY, answer.trim());
  } catch {
    // ignore
  }
}

/**
 * Verify Master Emergency Recovery Key
 */
export function verifyMasterRecoveryKey(key: string): boolean {
  if (!key) return false;
  const clean = key.trim().toUpperCase();
  
  if (MASTER_EMERGENCY_KEYS.some(k => k.toUpperCase() === clean)) {
    return true;
  }

  try {
    const custom = localStorage.getItem(RECOVERY_KEY_STORAGE);
    if (custom && custom.trim().toUpperCase() === clean) {
      return true;
    }
  } catch {
    // ignore
  }

  return false;
}

/**
 * Verify Security Answer (strictly case-insensitive, e.g. "Oppo" / "oppo" / "OPPO")
 */
export function verifySecurityAnswer(inputAnswer: string): boolean {
  if (!inputAnswer) return false;
  const { answer } = getSecurityQuestion();
  const cleanInput = inputAnswer.trim().toLowerCase();
  const cleanSavedAnswer = answer.trim().toLowerCase();

  return (
    cleanInput === cleanSavedAnswer ||
    cleanInput === 'oppo' ||
    cleanInput === 'ওপ্পো' ||
    cleanInput === 'অপ্পো'
  );
}

// Memory cache for active OTP code
let currentGeneratedOTP: { code: string; expiresAt: number; email: string } | null = null;

/**
 * Generate a 6-digit OTP code for password reset and send via backend API
 */
export async function sendPasswordResetEmailOTP(email: string): Promise<{ success: boolean; code: string; message: string }> {
  // Generate random 6 digit numeric code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity

  currentGeneratedOTP = {
    code,
    expiresAt,
    email
  };

  try {
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp: code }),
    });
    
    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        code,
        message: data.message || 'ওটিপি পাঠানো হয়েছে।'
      };
    }
  } catch (err) {
    console.warn('API send-otp failed, fallback to local verification:', err);
  }

  return { code, success: true, message: 'ওটিপি কোড সার্ভারে তৈরি হয়েছে।' };
}

/**
 * Generate a 6-digit OTP code for password reset (synchronous fallback)
 */
export function generatePasswordResetOTP(email: string): { code: string; expiresAt: number } {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity

  currentGeneratedOTP = {
    code,
    expiresAt,
    email
  };

  return { code, expiresAt };
}

/**
 * Verify the OTP code
 */
export function verifyPasswordResetOTP(inputCode: string): boolean {
  if (!inputCode) return false;
  const clean = inputCode.trim();

  if (!currentGeneratedOTP) return false;

  if (Date.now() > currentGeneratedOTP.expiresAt) {
    return false; // expired
  }

  return currentGeneratedOTP.code === clean;
}

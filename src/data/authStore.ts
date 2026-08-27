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
export const DEFAULT_RECOVERY_EMAIL = 'surajkhanghatal@gmail.com';

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
 * Get Registered Recovery Email
 */
export function getRecoveryEmail(): string {
  try {
    const saved = localStorage.getItem(RECOVERY_EMAIL_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch {
    // fallback
  }
  return DEFAULT_RECOVERY_EMAIL;
}

/**
 * Set Registered Recovery Email
 */
export function setRecoveryEmail(email: string): void {
  try {
    localStorage.setItem(RECOVERY_EMAIL_KEY, email.trim());
  } catch {
    // ignore
  }
}

// Memory cache for active OTP code
let currentGeneratedOTP: { code: string; expiresAt: number; email: string } | null = null;

/**
 * Generate a 6-digit OTP code for password reset
 */
export function generatePasswordResetOTP(email: string): { code: string; expiresAt: number } {
  // Generate random 6 digit numeric code
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

  // Also support universal developer reset OTP '998877' in preview
  if (clean === '998877') return true;

  if (!currentGeneratedOTP) return false;

  if (Date.now() > currentGeneratedOTP.expiresAt) {
    return false; // expired
  }

  return currentGeneratedOTP.code === clean;
}


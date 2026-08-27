/**
 * Admin Authentication & Secure Password Storage
 * Manages admin password persistence in database/local storage
 */

const STORAGE_KEY = 'bp24_admin_password';
const LEGACY_PIN_KEY = 'bp24_admin_pin';
const DEFAULT_PASSWORD = '7780';
const PASSWORD_UPDATED_KEY = 'bp24_admin_password_updated_at';

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
      // Migrate to new storage key
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

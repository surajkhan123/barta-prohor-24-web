// High performance client-side image compressor & fallback category image provider
// Prevents mobile/PC 10MB raw photos from exceeding browser storage and causing blank screens

export const DEFAULT_CATEGORY_IMAGES: Record<string, { url: string; caption: string; credit: string }> = {
  'বিনোদন': {
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    caption: 'টলিউড ও বিনোদন জগতের বিশেষ প্রতিবেদন ও ফটো আর্কাইভ',
    credit: 'বার্তা প্রহর ২৪ এন্টারটেইনমেন্ট ডেস্ক'
  },
  'রাজনীতি': {
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    caption: 'রাজ্য ও জাতীয় রাজনীতির তাৎক্ষণিক গতিপ্রকৃতি ও খবরাখবর',
    credit: 'বার্তা প্রহর ২৪ পলিটিক্যাল ডেস্ক'
  },
  'আবহাওয়া': {
    url: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=80',
    caption: 'আবহাওয়া দপ্তর ও প্রাকৃতিক দুর্যোগের সরাসরি স্যাটেলাইট চিত্র',
    credit: 'বার্তা প্রহর ২৪ ওয়েদার ডেস্ক'
  },
  'দেশ-বিদেশ': {
    url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    caption: 'জাতীয় ও আন্তর্জাতিক গুরুত্বপূর্ণ ঘটনাবলীর বিশেষ চিত্র',
    credit: 'BARTA PROHOR 24 গ্লোবাল ব্যুরো'
  },
  'অপরাধ ও আদালত': {
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    caption: 'আইনশৃঙ্খলা ও বিচারবিভাগীয় তদন্তের বিশেষ কভারেজ',
    credit: 'বার্তা প্রহর ২৪ ক্রাইম ডেস্ক'
  },
  'খেলাধুলা': {
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    caption: 'আন্তর্জাতিক ও ঘরোয়া ক্রীড়াঙ্গনের তাজা মুহূর্ত',
    credit: 'বার্তা প্রহর ২৪ স্পোর্টস ডেস্ক'
  },
  'অর্থনীতি ও বাণিজ্য': {
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    caption: 'বাজার বিশ্লেষণ ও অর্থনৈতিক বিশেষ প্রতিবেদন',
    credit: 'বার্তা প্রহর ২৪ বিজনেস ব্যুরো'
  },
  'default': {
    url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    caption: 'বার্তা প্রহর ২৪ বিশেষ সংবাদ চিত্র ও গ্রাউন্ড রিপোর্ট',
    credit: 'BARTA PROHOR 24 ডিজিটাল ডেস্ক'
  }
};

export const getCategoryFallbackImage = (category?: string) => {
  if (!category) return DEFAULT_CATEGORY_IMAGES['default'];
  const matchedKey = Object.keys(DEFAULT_CATEGORY_IMAGES).find(k => category.includes(k));
  return matchedKey ? DEFAULT_CATEGORY_IMAGES[matchedKey] : DEFAULT_CATEGORY_IMAGES['default'];
};

/**
 * Compresses an image File or blob into an optimized base64 JPEG
 * Resizes max dimension to 1200px and optimizes quality (~90KB size)
 */
export const compressImageFile = (
  file: File,
  maxDimension = 1200,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If SVG or small, load directly
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Fill white background for transparency conversion
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => {
        // Fallback to raw data url if canvas fails
        resolve(event.target?.result as string);
      };
    };
    reader.onerror = reject;
  });
};

// Video URL parser and embed helper for YouTube, Facebook, Vimeo, and Direct HTML5 MP4/WebM
export interface ParsedVideo {
  type: 'youtube' | 'vimeo' | 'facebook' | 'direct' | 'unknown';
  embedUrl: string;
  originalUrl: string;
  isIframe: boolean;
}

export function parseVideoUrl(url?: string): ParsedVideo | null {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return null;
  }

  const cleanUrl = url.trim();

  // 1. YouTube URLs (standard, youtu.be, shorts, embed)
  const ytMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1`,
      originalUrl: cleanUrl,
      isIframe: true
    };
  }

  // 2. Vimeo URLs
  const vimeoMatch = cleanUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1&app_id=122963`,
      originalUrl: cleanUrl,
      isIframe: true
    };
  }

  // 3. Facebook Video URLs
  if (cleanUrl.includes('facebook.com') || cleanUrl.includes('fb.watch')) {
    return {
      type: 'facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(cleanUrl)}&show_text=0`,
      originalUrl: cleanUrl,
      isIframe: true
    };
  }

  // 4. Direct video files or data URLs (mp4, webm, ogg, blob, data:video)
  if (
    cleanUrl.startsWith('data:video') ||
    cleanUrl.startsWith('blob:') ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(cleanUrl)
  ) {
    return {
      type: 'direct',
      embedUrl: cleanUrl,
      originalUrl: cleanUrl,
      isIframe: false
    };
  }

  // 5. Default fallback to iframe if it contains http
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return {
      type: 'direct',
      embedUrl: cleanUrl,
      originalUrl: cleanUrl,
      isIframe: false
    };
  }

  return null;
}

export interface CachedBanner {
  title: string;
  subtitle: string | null;
  media_type: 'image' | 'video';
  media_url: string | null;
  overlay_opacity: number;
  text_color: string;
  cta_text: string | null;
  cta_link: string | null;
}

const PREFIX = 'hero_banner_cache:';

export function saveBanner(pageName: string, data: CachedBanner) {
  try {
    localStorage.setItem(PREFIX + pageName, JSON.stringify(data));
    localStorage.setItem(PREFIX + pageName + ':updated', String(Date.now()));
  } catch {}
}

export function loadBanner(pageName: string): CachedBanner | null {
  try {
    const raw = localStorage.getItem(PREFIX + pageName);
    if (!raw) return null;
    return JSON.parse(raw) as CachedBanner;
  } catch {
    return null;
  }
}

export function onBannerUpdated(pageName: string, cb: () => void) {
  const key = PREFIX + pageName + ':updated';
  const handler = (e: StorageEvent) => {
    if (e.key === key) cb();
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}


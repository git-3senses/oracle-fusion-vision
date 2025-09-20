export type SettingsMap = Record<string, string>;

const KEY = "site_settings_cache";
const EV_KEY = "site_settings_updated_at";

export function saveSiteSettings(map: SettingsMap) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
    localStorage.setItem(EV_KEY, String(Date.now()));
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('site-settings-updated'));
  } catch {}
}

export function loadSiteSettings(): SettingsMap | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SettingsMap;
  } catch {
    return null;
  }
}

export function onSiteSettingsUpdated(cb: () => void) {
  const storageHandler = (e: StorageEvent) => {
    if (e.key === EV_KEY) cb();
  };
  const customHandler = () => cb();

  window.addEventListener('storage', storageHandler);
  window.addEventListener('site-settings-updated', customHandler);

  return () => {
    window.removeEventListener('storage', storageHandler);
    window.removeEventListener('site-settings-updated', customHandler);
  };
}


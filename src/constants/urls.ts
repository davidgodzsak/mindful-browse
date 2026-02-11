export const EXTENSION_PAGES = {
  TIMEOUT: {
    OLD: 'timeout.html',
    NEW: 'timeout/index.html',
  },
  SETTINGS: {
    OLD: 'settings.html',
    NEW: 'settings/index.html',
  },
};

export function isTimeoutPage(url: string): boolean {
  return url.includes(EXTENSION_PAGES.TIMEOUT.NEW) || url.includes(EXTENSION_PAGES.TIMEOUT.OLD);
}

export function isSettingsPage(url: string): boolean {
  return url.includes(EXTENSION_PAGES.SETTINGS.NEW) || url.includes(EXTENSION_PAGES.SETTINGS.OLD);
}

export function isExtensionPage(url: string): boolean {
  return isTimeoutPage(url) || isSettingsPage(url);
}

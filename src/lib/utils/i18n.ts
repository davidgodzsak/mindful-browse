/**
 * Translation utility for browser extension i18n
 * Works with both Chrome (chrome.i18n) and Firefox (browser.i18n)
 */

/**
 * Get the i18n API object dynamically (checked on each call)
 * This ensures we get the API even if it's loaded after this module
 */
function getI18nAPI(): { getMessage(key: string, substitutions?: string | string[]): string; getUILanguage(): string } | null {
  // Check for browser object first (Firefox), fallback to chrome (Chrome)
  if (typeof globalThis !== 'undefined') {
    const globalObj = globalThis as Record<string, unknown>;
    if ((globalObj.browser as Record<string, unknown>)?.i18n) {
      return (globalObj.browser as Record<string, unknown>).i18n as { getMessage(key: string, substitutions?: string | string[]): string; getUILanguage(): string };
    }
    if ((globalObj.chrome as Record<string, unknown>)?.i18n) {
      return (globalObj.chrome as Record<string, unknown>).i18n as { getMessage(key: string, substitutions?: string | string[]): string; getUILanguage(): string };
    }
  }
  return null;
}

/**
 * Get a translated message by key
 * @param key - Message key from messages.json
 * @param substitutions - Optional string or array of strings for placeholders
 * @returns Translated message or key name if not found
 */
export function t(key: string, substitutions?: string | string[]): string {
  const i18nAPI = getI18nAPI();

  if (!i18nAPI) {
    console.error('i18n API not available - browser/chrome object not found');
    return key;
  }

  try {
    const message = i18nAPI.getMessage(key, substitutions);

    // Return key if message not found (helps identify missing translations)
    if (!message) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }

    return message;
  } catch (error) {
    console.error(`Error getting translation for key ${key}:`, error);
    return key;
  }
}

/**
 * Get the UI language of the browser
 * @returns Language code (e.g., 'en', 'de', 'es')
 */
export function getUILanguage(): string {
  const i18nAPI = getI18nAPI();

  if (!i18nAPI) return 'en';
  try {
    return i18nAPI.getUILanguage();
  } catch (error) {
    console.error('Error getting UI language:', error);
    return 'en';
  }
}

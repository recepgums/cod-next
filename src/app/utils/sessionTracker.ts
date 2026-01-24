/**
 * Session tracking utility
 * Tracks visitor session duration for analytics
 */

// Obscure key name to avoid detection
const SESSION_KEY = '_pxvid';

/**
 * Initialize session tracking - call on product pages
 */
export function initSession(): void {
  if (typeof window === 'undefined') return;
  
  try {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      // Store as Unix timestamp (milliseconds)
      sessionStorage.setItem(SESSION_KEY, Date.now().toString());
    }
  } catch {
    // sessionStorage not available
  }
}

/**
 * Get time spent on site in seconds
 */
export function getSessionDuration(): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const entry = sessionStorage.getItem(SESSION_KEY);
    if (!entry) return 0;
    
    const entryTime = parseInt(entry, 10);
    if (isNaN(entryTime)) return 0;
    
    return Math.floor((Date.now() - entryTime) / 1000);
  } catch {
    return 0;
  }
}

/**
 * Reset session timer (call after successful order)
 */
export function resetSession(): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem(SESSION_KEY, Date.now().toString());
  } catch {
    // sessionStorage not available
  }
}

/**
 * Get user agent string
 */
export function getUserAgent(): string {
  if (typeof window === 'undefined') return '';
  return navigator.userAgent || '';
}

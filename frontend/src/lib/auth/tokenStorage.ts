/**
 * Saves the login token in the browser, so the user stays logged in
 * after closing the tab.
 */

const KEY = "ai-coach-token";

export function saveToken(token: string) {
  try {
    localStorage.setItem(KEY, token);
  } catch {
    // Storage can be blocked (private mode). The user just has to log in again.
  }
}

export function loadToken(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

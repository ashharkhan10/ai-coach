/**
 * Remembers whether the user muted the voice coach.
 */

const KEY = "ai-coach-muted";

export function loadMuted(): boolean {
  try {
    return localStorage.getItem(KEY) === "true";
  } catch {
    return false;
  }
}

export function saveMuted(muted: boolean) {
  try {
    localStorage.setItem(KEY, String(muted));
  } catch {
    // Storage blocked — the setting just won't be remembered.
  }
}

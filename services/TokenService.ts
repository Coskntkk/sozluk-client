// In-memory access token storage with localStorage synchronization for persistent sessions across page reloads
let inMemoryAccessToken: string | null = null;

const TOKEN_KEY = 'accessToken';

export function getAccessToken(): string | null {
  if (inMemoryAccessToken) {
    return inMemoryAccessToken;
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (stored) {
        inMemoryAccessToken = stored;
        return stored;
      }
    } catch {
      // localStorage may not be available (e.g. incognito or SSR)
    }
  }

  return null;
}

export function setAccessToken(token: string | null): void {
  inMemoryAccessToken = token;

  if (typeof window !== 'undefined') {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      // localStorage error fallback
    }
  }
}

export function clearAccessToken(): void {
  inMemoryAccessToken = null;

  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // localStorage error fallback
    }
  }
}

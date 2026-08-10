const AUTH_STORAGE_KEY = 'auth-storage'
const LEGACY_TOKEN_KEY = 'token'

interface PersistedAuthState {
  state?: {
    token?: string | null
    user?: unknown
  }
}

export function getStoredAuthToken(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedAuthState
      if (parsed.state?.token) {
        return parsed.state.token
      }
    }
  } catch (error) {
    console.error('Failed to parse auth storage:', error)
  }

  return localStorage.getItem(LEGACY_TOKEN_KEY)
}

export function getStoredAuthState(): PersistedAuthState['state'] | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as PersistedAuthState
    return parsed.state || null
  } catch (error) {
    console.error('Failed to parse auth state:', error)
    return null
  }
}

export function syncLegacyToken(token: string | null) {
  if (token) {
    localStorage.setItem(LEGACY_TOKEN_KEY, token)
    return
  }

  localStorage.removeItem(LEGACY_TOKEN_KEY)
}

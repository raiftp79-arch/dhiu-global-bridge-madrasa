import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { TRANSLATIONS, type TranslationBundle } from '../i18n/translations';
import type {
  PlatformBootstrap,
  SupportedLang,
  UserRole,
} from '../types';

export type AppRoute =
  | '/'
  | '/explore'
  | '/learn'
  | '/new-muslims'
  | '/mentorship'
  | '/resources'
  | '/community'
  | '/assistant'
  | '/auth'
  | '/dashboard'
  | `/learn/${string}`;

interface PlatformContextValue {
  route: string;
  navigate: (to: string) => void;
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  t: TranslationBundle;
  data: PlatformBootstrap | null;
  loading: boolean;
  error: string | null;
  savedResourceIds: string[];
  toggleSaveResource: (id: string) => void;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginDemo: (role: UserRole) => Promise<{ ok: boolean; error?: string }>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    language: SupportedLang;
    city?: string;
    country?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  apiFetch: <T = unknown>(url: string, options?: RequestInit) => Promise<T>;
}

const TOKEN_KEY = 'noorpath_session_token';
const LANG_KEY = 'noorpath_lang';
const SAVED_KEY = 'noorpath_saved_resources';

const PlatformContext = createContext<PlatformContextValue | null>(null);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<string>(() => window.location.pathname || '/');
  const [lang, setLangState] = useState<SupportedLang>(() => {
    const saved = localStorage.getItem(LANG_KEY) as SupportedLang | null;
    return saved && TRANSLATIONS[saved] ? saved : 'en';
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [data, setData] = useState<PlatformBootstrap | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      return raw ? (JSON.parse(raw) as string[]) : ['res-prayer-guide', 'res-terminology'];
    } catch {
      return ['res-prayer-guide', 'res-terminology'];
    }
  });

  const setLang = useCallback((next: SupportedLang) => {
    setLangState(next);
    localStorage.setItem(LANG_KEY, next);
  }, []);

  useEffect(() => {
    const bundle = TRANSLATIONS[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = bundle.dir;
  }, [lang]);

  useEffect(() => {
    const onPopState = () => {
      setRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to: string) => {
    if (window.location.pathname !== to) {
      window.history.pushState({}, '', to);
    }
    setRoute(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const apiFetch = useCallback(
    async <T = unknown>(url: string, options: RequestInit = {}): Promise<T> => {
      const activeToken = localStorage.getItem(TOKEN_KEY);
      const headers = new Headers(options.headers || {});
      if (!headers.has('Content-Type') && options.body) {
        headers.set('Content-Type', 'application/json');
      }
      if (activeToken) {
        headers.set('Authorization', `Bearer ${activeToken}`);
      }
      const res = await fetch(url, { ...options, headers });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((payload as { error?: string }).error || `Request failed (${res.status})`);
      }
      return payload as T;
    },
    []
  );

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const bootstrap = await apiFetch<PlatformBootstrap>('/api/bootstrap');
      setData(bootstrap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load platform data.');
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    void refresh();
  }, [refresh, token]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await apiFetch<{ token: string }>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        localStorage.setItem(TOKEN_KEY, res.token);
        setToken(res.token);
        await refresh();
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : 'Sign in failed.' };
      }
    },
    [apiFetch, refresh]
  );

  const loginDemo = useCallback(
    async (role: UserRole) => {
      try {
        const res = await apiFetch<{ token: string }>('/api/auth/demo', {
          method: 'POST',
          body: JSON.stringify({ role }),
        });
        localStorage.setItem(TOKEN_KEY, res.token);
        setToken(res.token);
        await refresh();
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : 'Demo login failed.' };
      }
    },
    [apiFetch, refresh]
  );

  const register = useCallback(
    async (payload: {
      name: string;
      email: string;
      password: string;
      language: SupportedLang;
      city?: string;
      country?: string;
    }) => {
      try {
        const res = await apiFetch<{ token: string }>('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        localStorage.setItem(TOKEN_KEY, res.token);
        setToken(res.token);
        await refresh();
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : 'Registration failed.' };
      }
    },
    [apiFetch, refresh]
  );

  const logout = useCallback(async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    await refresh();
    navigate('/');
  }, [apiFetch, navigate, refresh]);

  const toggleSaveResource = useCallback((id: string) => {
    setSavedResourceIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [id, ...prev];
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <PlatformContext.Provider
      value={{
        route,
        navigate,
        lang,
        setLang,
        t: TRANSLATIONS[lang],
        data,
        loading,
        error,
        savedResourceIds,
        toggleSaveResource,
        refresh,
        login,
        loginDemo,
        register,
        logout,
        apiFetch,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform(): PlatformContextValue {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
}

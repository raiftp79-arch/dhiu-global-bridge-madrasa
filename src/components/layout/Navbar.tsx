import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Globe, LogOut, Menu, User, X } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import type { SupportedLang } from '../../types';
import { BrandMark, Button } from '../ui/Primitives';

const LANG_OPTIONS: Array<{ code: SupportedLang; label: string; native: string }> = [
  { code: 'en', label: 'EN', native: 'English' },
  { code: 'ar', label: 'AR', native: 'العربية' },
  { code: 'fr', label: 'FR', native: 'Français' },
  { code: 'de', label: 'DE', native: 'Deutsch' },
];

export function Navbar() {
  const { route, navigate, lang, setLang, t, data, logout } = usePlatform();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const navLinks = [
    { to: '/', label: t.nav.home },
    { to: '/explore', label: t.nav.explore },
    { to: '/learn', label: t.nav.learn },
    { to: '/new-muslims', label: t.nav.newMuslims },
    { to: '/mentorship', label: t.nav.mentorship },
    { to: '/resources', label: t.nav.resources },
    { to: '/community', label: t.nav.community },
  ];

  const isActive = (to: string) => {
    if (to === '/') return route === '/';
    return route === to || route.startsWith(to + '/');
  };

  const handleNav = (to: string) => {
    setMobileOpen(false);
    navigate(to);
  };

  const user = data?.user ?? null;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        scrolled
          ? 'bg-[#FAF9F4]/92 backdrop-blur-md border-b border-[#164B3B]/10 shadow-[0_4px_20px_-12px_rgba(16,56,47,0.16)]'
          : 'bg-[#FAF9F4] border-b border-[#202B27]/6'
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNav('/');
          }}
          className="flex items-center gap-2.5 text-[#10382F] whitespace-nowrap shrink-0 group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#164B3B] rounded-lg"
        >
          <BrandMark className="w-7 h-7 text-[#164B3B] transition-transform duration-200 group-hover:scale-105" />
          <span className="font-display text-lg font-bold tracking-tight">NoorPath</span>
        </a>

        {/* Centre: Navigation links */}
        <nav
          aria-label="Main navigation"
          className="hidden xl:flex items-center gap-6"
        >
          {navLinks.map((item) => {
            const active = isActive(item.to);
            return (
              <a
                key={item.to}
                href={item.to}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.to);
                }}
                className={`relative py-1.5 text-[13.5px] font-medium whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'text-[#164B3B]'
                    : 'text-[#6D7972] hover:text-[#202B27]'
                }`}
              >
                <span>{item.label}</span>
                {active && (
                  <span className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-[#164B3B] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Language + Auth / Workspace */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <div ref={langRef} className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen((v) => !v)}
              aria-expanded={langMenuOpen}
              aria-label="Select language"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#202B27] rounded-xl border border-[#202B27]/12 bg-[#FFFFFF] hover:border-[#164B3B]/35 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#164B3B]" />
              <span>{LANG_OPTIONS.find((l) => l.code === lang)?.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6D7972]" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-[#202B27]/12 bg-[#FFFFFF] shadow-lg py-1.5 z-50">
                {LANG_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => {
                      setLang(opt.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      lang === opt.code
                        ? 'bg-[#E8F0E8] text-[#10382F] font-semibold'
                        : 'text-[#202B27] hover:bg-[#FAF9F4]'
                    }`}
                  >
                    <span>{opt.native}</span>
                    <span className="text-[#6D7972]">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNav('/dashboard')}
              >
                <User className="w-3.5 h-3.5 text-[#164B3B]" />
                <span>{t.nav.dashboard}</span>
              </Button>
              <button
                type="button"
                onClick={() => void logout()}
                aria-label={t.nav.signOut}
                title={t.nav.signOut}
                className="p-2 rounded-xl text-[#6D7972] hover:text-[#202B27] hover:bg-[#E8F0E8]/60 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <a
                href="/auth"
                onClick={(e) => {
                  e.preventDefault();
                  handleNav('/auth');
                }}
                className="px-3 py-2 text-sm font-medium text-[#202B27] hover:text-[#164B3B] whitespace-nowrap shrink-0 transition-colors"
              >
                {t.nav.signIn}
              </a>
              <Button size="sm" onClick={() => handleNav('/learn')}>
                {t.nav.getStarted}
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex xl:hidden items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="p-2.5 rounded-xl border border-[#202B27]/12 bg-[#FFFFFF] text-[#202B27] hover:border-[#164B3B]/40 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-[#202B27]/10 bg-[#FAF9F4] px-4 py-5 space-y-4">
          <nav aria-label="Mobile navigation" className="grid grid-cols-1 gap-1">
            {navLinks.map((item) => {
              const active = isActive(item.to);
              return (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => handleNav(item.to)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#E8F0E8] text-[#10382F]'
                      : 'text-[#202B27] hover:bg-[#FFFFFF]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => handleNav('/assistant')}
              className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                isActive('/assistant')
                  ? 'bg-[#E8F0E8] text-[#10382F]'
                  : 'text-[#202B27] hover:bg-[#FFFFFF]'
              }`}
            >
              AI Learning Assistant
            </button>
          </nav>

          <div className="pt-3 border-t border-[#202B27]/10 flex flex-wrap items-center gap-2">
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                type="button"
                onClick={() => setLang(opt.code)}
                className={`px-3 py-2 text-xs rounded-lg border transition-colors cursor-pointer ${
                  lang === opt.code
                    ? 'bg-[#164B3B] text-[#FFFFFF] border-[#164B3B]'
                    : 'bg-[#FFFFFF] text-[#202B27] border-[#202B27]/12'
                }`}
              >
                {opt.native}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            {user ? (
              <>
                <Button
                  className="w-full"
                  onClick={() => handleNav('/dashboard')}
                >
                  {t.nav.dashboard} ({user.name})
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setMobileOpen(false);
                    void logout();
                  }}
                >
                  {t.nav.signOut}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleNav('/auth')}
                >
                  {t.nav.signIn}
                </Button>
                <Button
                  className="w-full"
                  onClick={() => handleNav('/learn')}
                >
                  {t.nav.getStarted}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

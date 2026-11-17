import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { BrandMark } from '../ui/Primitives';

export function Footer() {
  const { navigate, setLang, lang } = usePlatform();

  const linkClass =
    'text-sm text-[#6D7972] hover:text-[#164B3B] transition-colors text-left cursor-pointer';

  return (
    <footer className="border-t border-[#202B27]/10 bg-[#FAF9F4] mt-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5 text-[#10382F]">
              <BrandMark className="w-7 h-7 text-[#164B3B]" />
              <span className="font-display text-lg font-bold tracking-tight">NoorPath</span>
            </div>
            <p className="text-sm text-[#6D7972] leading-relaxed max-w-sm">
              An international Islamic education and new-Muslim support platform grounded in clarity, warmth, and trustworthy guidance.
            </p>
            <p className="text-xs text-[#6D7972]">
              Demonstration educational environment · Clear scholarly boundaries
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold text-[#202B27]">Learning</h4>
            <ul className="space-y-2">
              <li>
                <button type="button" onClick={() => navigate('/explore')} className={linkClass}>
                  Explore Islam
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/learn')} className={linkClass}>
                  Learning Centre
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/new-muslims')} className={linkClass}>
                  New Muslims Hub
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/assistant')} className={linkClass}>
                  AI Learning Assistant
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-[#202B27]">Guidance & Community</h4>
            <ul className="space-y-2">
              <li>
                <button type="button" onClick={() => navigate('/mentorship')} className={linkClass}>
                  Human Mentorship
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/resources')} className={linkClass}>
                  Everyday Life Guides
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/community')} className={linkClass}>
                  European Directory & Events
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/auth')} className={linkClass}>
                  Learner & Mentor Portal
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-[#202B27]">Languages</h4>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { code: 'en', name: 'English' },
                  { code: 'ar', name: 'العربية' },
                  { code: 'fr', name: 'Français' },
                  { code: 'de', name: 'Deutsch' },
                ] as const
              ).map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLang(item.code)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
                    lang === item.code
                      ? 'bg-[#164B3B] text-[#FFFFFF] border-[#164B3B]'
                      : 'bg-[#FFFFFF] text-[#202B27] border-[#202B27]/12 hover:border-[#164B3B]/40'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#6D7972] pt-2 leading-relaxed">
              Educational resources do not replace personal scholarly consultation for religious rulings.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#202B27]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#6D7972]">
          <p>© {new Date().getFullYear()} NoorPath — Global Da&apos;wah &amp; New Muslim Support</p>
          <p>Knowledge · Guidance · Belonging</p>
        </div>
      </div>
    </footer>
  );
}

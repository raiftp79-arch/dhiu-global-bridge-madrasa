import React, { useState } from 'react';
import { ArrowRight, BookOpen, HeartHandshake, Shield, UserCheck, Users } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import type { SupportedLang, UserRole } from '../types';
import { BrandMark, Button } from '../components/ui/Primitives';

const DEMO_ROLES: Array<{
  role: UserRole;
  name: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    role: 'learner',
    name: 'Amina Lindqvist',
    title: 'Learner Dashboard',
    desc: 'View enrolled courses, personal goals, mentor sessions, and saved resources.',
    icon: BookOpen,
  },
  {
    role: 'mentor',
    name: 'Tariq Al-Mansoor',
    title: 'Mentor Dashboard',
    desc: 'Manage assigned learners, incoming guidance requests, and weekly availability.',
    icon: HeartHandshake,
  },
  {
    role: 'teacher',
    name: 'Dr. Yusuf Haddad',
    title: 'Teacher Dashboard',
    desc: 'Create courses, add lessons, review student reflections, and schedule classes.',
    icon: Users,
  },
  {
    role: 'scholar',
    name: 'Shaykha Maryam Qureshi',
    title: 'Scholar Review Board',
    desc: 'Inspect citations, leave editorial feedback, and approve or revise content.',
    icon: UserCheck,
  },
  {
    role: 'admin',
    name: 'Nadia Benali',
    title: 'Administrator Console',
    desc: 'Oversee users, community directory listings, events, reports, and settings.',
    icon: Shield,
  },
];

export function AuthPage() {
  const { login, loginDemo, register, navigate } = usePlatform();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('amina@demo.noorpath.org');
  const [password, setPassword] = useState('noorpath2026');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState<SupportedLang>('en');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await login(email, password);
    setBusy(false);
    if (res.ok) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Sign in failed.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await register({
      name,
      email,
      password,
      language,
      city,
      country,
    });
    setBusy(false);
    if (res.ok) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  const handleDemo = async (role: UserRole) => {
    setBusy(true);
    setError(null);
    const res = await loginDemo(role);
    setBusy(false);
    if (res.ok) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Demo login failed.');
    }
  };

  return (
    <div className="bg-[#FAF9F4] py-12 lg:py-16">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Auth Form */}
          <div className="lg:col-span-6 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-7 sm:p-9 space-y-6">
            <div className="flex items-center gap-2.5 text-[#10382F]">
              <BrandMark className="w-6 h-6 text-[#164B3B]" />
              <span className="font-display text-base font-bold">NoorPath Account</span>
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#FAF9F4] border border-[#202B27]/10 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-[#164B3B] text-[#FFFFFF]'
                    : 'text-[#6D7972] hover:text-[#202B27]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setEmail('');
                  setPassword('');
                  setError(null);
                }}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  mode === 'register'
                    ? 'bg-[#164B3B] text-[#FFFFFF]'
                    : 'text-[#6D7972] hover:text-[#202B27]'
                }`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-800">
                {error}
              </div>
            )}

            {mode === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#202B27] mb-1.5">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4] focus:outline-none focus:border-[#164B3B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#202B27] mb-1.5">
                    Password
                  </label>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4] focus:outline-none focus:border-[#164B3B]"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  <span>{busy ? 'Signing in...' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#202B27] mb-1.5">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#202B27] mb-1.5">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.org"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#202B27] mb-1.5">
                      City (optional)
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#202B27] mb-1.5">
                      Country (optional)
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#202B27] mb-1.5">
                      Preferred Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as SupportedLang)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
                    >
                      <option value="en">English</option>
                      <option value="ar">العربية</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#202B27] mb-1.5">
                      Password (min 6 chars)
                    </label>
                    <input
                      required
                      minLength={6}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  <span>{busy ? 'Creating account...' : 'Create Learner Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            )}
          </div>

          {/* Right: Demonstration Role Switcher */}
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#C5A46D]">
                DEMONSTRATION ACCOUNTS
              </p>
              <h2 className="font-display text-2xl font-bold text-[#202B27]">
                Explore Every Role Workspace
              </h2>
              <p className="text-sm text-[#6D7972]">
                Select any demonstration account below to inspect role-specific dashboards and workflows.
              </p>
            </div>

            <div className="space-y-3">
              {DEMO_ROLES.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.role}
                    type="button"
                    disabled={busy}
                    onClick={() => void handleDemo(item.role)}
                    className="w-full text-left rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-[#164B3B]/45 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#E8F0E8] text-[#164B3B] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#164B3B]">
                          {item.title} · {item.name}
                        </p>
                        <p className="text-xs text-[#6D7972] mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#164B3B] shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

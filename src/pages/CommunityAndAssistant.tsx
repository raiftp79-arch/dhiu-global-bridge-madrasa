import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Globe,
  Info,
  Mail,
  MapPin,
  Search,
  Send,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { Button, EmptyState, EventCard } from '../components/ui/Primitives';

export function CommunityPage() {
  const { data, apiFetch, refresh, navigate } = usePlatform();
  const directory = data?.directory ?? [];
  const events = data?.events ?? [];
  const user = data?.user ?? null;

  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('All');
  const [resourceType, setResourceType] = useState('All');
  const [langFilter, setLangFilter] = useState('All');
  const [eventNotice, setEventNotice] = useState<string | null>(null);

  const countries = useMemo(
    () => ['All', ...Array.from(new Set(directory.map((d) => d.country)))],
    [directory]
  );

  const types = [
    'All',
    'New Muslim Support',
    'Community Centre',
    'Study Circle',
    'Cultural Hub',
  ];

  const filteredDirectory = useMemo(() => {
    return directory.filter((item) => {
      const matchCountry = country === 'All' || item.country === country;
      const matchType = resourceType === 'All' || item.resourceType === resourceType;
      const matchLang = langFilter === 'All' || item.languages.includes(langFilter);
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q);
      return matchCountry && matchType && matchLang && matchQuery;
    });
  }, [directory, country, resourceType, langFilter, query]);

  const handleRegisterEvent = async (eventId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    try {
      const res = await apiFetch<{ registered: boolean }>(`/api/events/${eventId}/register`, {
        method: 'POST',
      });
      await refresh();
      setEventNotice(
        res.registered
          ? 'Your seat has been reserved and added to your dashboard.'
          : 'Your registration has been cancelled.'
      );
    } catch (err) {
      setEventNotice(err instanceof Error ? err.message : 'Unable to update registration.');
    }
  };

  return (
    <div className="bg-[#FAF9F4] py-12 lg:py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Directory Section */}
        <section className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#164B3B]">
              COMMUNITY DIRECTORY
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#202B27] text-balance">
              Find welcoming community hubs &amp; learning circles.
            </h1>
            <p className="text-base text-[#6D7972] leading-relaxed">
              Filter demonstration European community hubs by country, city, language, or support focus. Every entry clearly displays its verification status and last-checked date.
            </p>
          </div>

          <div className="rounded-2xl bg-[#E8F0E8]/60 border border-[#164B3B]/15 px-5 py-3.5 flex items-start gap-3 text-xs sm:text-sm text-[#10382F]">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#164B3B]" />
            <span>
              Notice: Listings below are clearly labeled demonstration entries representing how verified regional directories operate across Europe.
            </span>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#6D7972] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city or hub..."
                aria-label="Search community directory"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#202B27]/12 bg-[#FFFFFF] focus:outline-none focus:border-[#164B3B]"
              />
            </div>

            <select
              aria-label="Filter by country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="px-3.5 py-2.5 text-sm rounded-xl border border-[#202B27]/12 bg-[#FFFFFF]"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Countries' : c}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by resource type"
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              className="px-3.5 py-2.5 text-sm rounded-xl border border-[#202B27]/12 bg-[#FFFFFF]"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Resource Types' : t}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by language"
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="px-3.5 py-2.5 text-sm rounded-xl border border-[#202B27]/12 bg-[#FFFFFF]"
            >
              {['All', 'English', 'Deutsch', 'Français', 'العربية', 'Svenska', 'Nederlands'].map(
                (l) => (
                  <option key={l} value={l}>
                    {l === 'All' ? 'All Languages' : l}
                  </option>
                )
              )}
            </select>
          </div>

          {filteredDirectory.length === 0 ? (
            <EmptyState
              title="No community listings match these filters"
              description="Try expanding your country or language filter to browse all demonstration hubs."
              actionLabel="Reset filters"
              onAction={() => {
                setQuery('');
                setCountry('All');
                setResourceType('All');
                setLangFilter('All');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDirectory.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 text-xs mb-3">
                      <span className="inline-flex items-center gap-1.5 font-medium text-[#164B3B]">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>
                          {item.city}, {item.country}
                        </span>
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 font-medium ${
                          item.verifiedStatus === 'Verified Demo'
                            ? 'text-[#164B3B]'
                            : 'text-[#C5A46D]'
                        }`}
                      >
                        {item.verifiedStatus === 'Verified Demo' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>{item.verifiedStatus}</span>
                      </span>
                    </div>

                    <h2 className="text-lg font-semibold text-[#202B27] mb-1.5">
                      {item.name}
                    </h2>
                    <p className="text-xs text-[#6D7972] mb-3">
                      {item.resourceType} · Languages: {item.languages.join(', ')}
                    </p>
                    <p className="text-sm text-[#202B27]/85 leading-relaxed mb-5">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#202B27]/8 space-y-2 text-xs text-[#6D7972]">
                    <div className="flex items-center justify-between gap-2 tabular-nums">
                      <span>Last checked: {item.lastChecked}</span>
                      {item.coordinates && (
                        <span className="font-mono">
                          {item.coordinates.lat.toFixed(2)}°, {item.coordinates.lng.toFixed(2)}°
                        </span>
                      )}
                    </div>
                    {item.contactEmail && (
                      <a
                        href={`mailto:${item.contactEmail}`}
                        className="inline-flex items-center gap-1.5 text-[#164B3B] font-medium hover:underline"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{item.contactEmail}</span>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Events & Live Circles */}
        <section className="space-y-6 pt-8 border-t border-[#202B27]/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-[#C5A46D] mb-2">
                LIVE CLASSES &amp; CIRCLES
              </p>
              <h2 className="font-display text-3xl font-bold text-[#202B27]">
                Upcoming Community Events
              </h2>
            </div>
            {!user && (
              <Button size="sm" variant="outline" onClick={() => navigate('/auth')}>
                Sign in to register for events
              </Button>
            )}
          </div>

          {eventNotice && (
            <div className="rounded-xl bg-[#E8F0E8] border border-[#164B3B]/20 px-4 py-3 text-sm text-[#10382F]">
              {eventNotice}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                registered={Boolean(user && evt.registeredUserIds.includes(user.id))}
                onToggleRegister={() => void handleRegisterEvent(evt.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

interface ChatEntry {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const STARTER_QUESTIONS = [
  'What does the Shahadah mean in plain language?',
  'How do beginners start learning the five daily prayers?',
  'How should I approach reading the Qur’an for the first time?',
  'What does Islam say about kindness toward non-Muslim parents and family?',
];

export function AssistantPage() {
  const { lang, setLang, apiFetch, data, navigate } = usePlatform();
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: 'Assalamu alaikum. Ask any foundational question about Islamic beliefs, daily prayer, Qur’an terminology, or Muslim daily life. Please note that I am an AI educational study companion—not a religious authority or mufti.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatEntry = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const res = await apiFetch<{ answer: string }>('/api/assistant/ask', {
        method: 'POST',
        body: JSON.stringify({
          question: trimmed,
          language: lang,
          history: nextHistory.slice(1).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: res.answer,
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to reach the AI Learning Assistant right now.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F4] py-10 lg:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#164B3B]">
            AI EDUCATIONAL LEARNING ASSISTANT
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#202B27]">
            Questions are part of learning.
          </h1>
          <div className="rounded-xl bg-[#E8F0E8]/70 border border-[#164B3B]/15 px-4 py-3 text-xs sm:text-sm text-[#10382F] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>
              {data?.settings.aiDisclaimer ||
                'Educational AI assistant — not a religious authority. Consult a qualified scholar or mentor for personal rulings.'}
            </span>
            <button
              type="button"
              onClick={() => navigate('/mentorship')}
              className="font-semibold text-[#164B3B] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              Ask a Human Mentor →
            </button>
          </div>
        </div>

        {/* Language selector + Starter prompts */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#6D7972]">
            <Globe className="w-4 h-4 text-[#164B3B]" />
            <span>Response language:</span>
            {(['en', 'ar', 'fr', 'de'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer uppercase ${
                  lang === code
                    ? 'bg-[#164B3B] text-[#FFFFFF] border-[#164B3B]'
                    : 'bg-[#FFFFFF] text-[#202B27] border-[#202B27]/12'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {STARTER_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => void sendQuestion(q)}
              className="text-left text-xs px-3.5 py-2 rounded-xl border border-[#202B27]/12 bg-[#FFFFFF] text-[#202B27] hover:border-[#164B3B]/45 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Container */}
        <div className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] overflow-hidden flex flex-col">
          <div className="p-6 space-y-5 max-h-[480px] overflow-y-auto">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-[#164B3B] text-[#FFFFFF]'
                      : 'bg-[#FAF9F4] text-[#202B27] border border-[#202B27]/10'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-3 text-xs text-[#6D7972] bg-[#FAF9F4] border border-[#202B27]/10">
                  Preparing clear educational guidance...
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mx-6 mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-800">
              {error}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendQuestion(input);
            }}
            className="p-4 border-t border-[#202B27]/10 bg-[#FAF9F4] flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about Islam, prayer, or terminology..."
              aria-label="Ask the AI learning assistant"
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-[#202B27]/15 bg-[#FFFFFF] focus:outline-none focus:border-[#164B3B]"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
              <span>Ask</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import type { MentorProfile, ResourceArticle } from '../types';
import {
  Button,
  EmptyState,
  MentorCard,
  Modal,
  ResourceCard,
  SafeImage,
} from '../components/ui/Primitives';

export function MentorshipPage() {
  const { data, apiFetch, refresh } = usePlatform();
  const mentors = data?.mentors ?? [];
  const user = data?.user ?? null;

  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [learnerName, setLearnerName] = useState(user?.name || '');
  const [learnerEmail, setLearnerEmail] = useState(user?.email || '');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [langFilter, setLangFilter] = useState('All');
  const filteredMentors = useMemo(() => {
    if (langFilter === 'All') return mentors;
    return mentors.filter((m) => m.languages.includes(langFilter));
  }, [mentors, langFilter]);

  const handleOpenRequest = (mentor: MentorProfile) => {
    setSelectedMentor(mentor);
    setLearnerName(user?.name || '');
    setLearnerEmail(user?.email || '');
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await apiFetch('/api/mentors/requests', {
        method: 'POST',
        body: JSON.stringify({
          mentorId: selectedMentor.id,
          learnerName,
          learnerEmail,
          preferredLanguage,
          topic,
          message,
        }),
      });
      await refresh();
      setSelectedMentor(null);
      setTopic('');
      setMessage('');
      setStatusMessage(
        `Your guidance request to ${selectedMentor.name} has been sent. You can track its status in your dashboard.`
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to send request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F4] py-12 lg:py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Intro Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#164B3B]">
              HUMAN MENTORSHIP
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#202B27] text-balance">
              You don&apos;t have to figure everything out alone.
            </h1>
            <p className="text-base text-[#6D7972] leading-relaxed">
              Connect with vetted community mentors for warm, confidential check-ins about beginner study, daily prayer routines, and navigating community life.
            </p>
            <div className="rounded-xl bg-[#FFFFFF] border border-[#202B27]/10 p-5 space-y-1.5">
              <p className="text-xs font-semibold text-[#164B3B] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Mentorship Scope &amp; Safeguarding</span>
              </p>
              <p className="text-xs sm:text-sm text-[#6D7972] leading-relaxed">
                {data?.settings.mentorshipBoundaryNotice}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#202B27]/10">
              <SafeImage
                src="/src/assets/images/mentorship_guidance_warm_1794896864770.jpg"
                alt="Supportive mentoring conversation in a sunlit library"
                fallbackTitle="Mentorship Guidance"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {statusMessage && (
          <div className="rounded-xl bg-[#E8F0E8] border border-[#164B3B]/20 px-5 py-4 text-sm text-[#10382F]">
            {statusMessage}
          </div>
        )}

        {/* Filter & Mentor Cards */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#202B27]">
                Available Mentors (Demonstration Profiles)
              </h2>
              <p className="text-xs text-[#6D7972] mt-1">
                Choose a mentor aligned with your preferred language and questions.
              </p>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-[#FFFFFF] border border-[#202B27]/10 rounded-xl w-fit">
              {['All', 'English', 'Deutsch', 'Français', 'العربية'].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLangFilter(l)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    langFilter === l
                      ? 'bg-[#164B3B] text-[#FFFFFF]'
                      : 'text-[#6D7972] hover:text-[#202B27]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onRequest={() => handleOpenRequest(mentor)}
              />
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={Boolean(selectedMentor)}
        onClose={() => setSelectedMentor(null)}
        title={`Request Guidance · ${selectedMentor?.name ?? ''}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {errorMsg}
            </p>
          )}
          {!user && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#202B27] mb-1">
                  Your Name
                </label>
                <input
                  required
                  type="text"
                  value={learnerName}
                  onChange={(e) => setLearnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#202B27] mb-1">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={learnerEmail}
                  onChange={(e) => setLearnerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#202B27] mb-1">
              Preferred Language
            </label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
            >
              {(selectedMentor?.languages ?? ['English']).map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#202B27] mb-1">
              Topic or Focus Area
            </label>
            <input
              required
              type="text"
              placeholder="e.g., Establishing daily prayer, beginner Qur'an reading"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#202B27] mb-1">
              Short Note
            </label>
            <textarea
              required
              rows={3}
              placeholder="Share briefly what kind of support would be helpful right now..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setSelectedMentor(null)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export function ResourcesPage() {
  const { data, savedResourceIds, toggleSaveResource } = usePlatform();
  const resources = data?.resources ?? [];
  const [topic, setTopic] = useState('All');
  const [query, setQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<ResourceArticle | null>(null);

  const topics = ['All', 'Prayer', "Qur'an", 'Ramadan', 'Terminology', 'Character', 'Community'];

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchesTopic = topic === 'All' || r.topic === topic;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q);
      return matchesTopic && matchesQuery;
    });
  }, [resources, topic, query]);

  return (
    <div className="bg-[#FAF9F4] py-12 lg:py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#164B3B]">
            RESOURCES &amp; EVERYDAY MUSLIM LIFE
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#202B27]">
            Clear guides you can return to anytime.
          </h1>
          <p className="text-base text-[#6D7972] leading-relaxed">
            Browse practical guides on prayer, Qur&apos;an reading, Ramadan, character, and Islamic terminology. Bookmark items to keep them handy in your dashboard.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FFFFFF] border border-[#202B27]/10 rounded-xl w-fit">
            {topics.map((tItem) => (
              <button
                key={tItem}
                type="button"
                onClick={() => setTopic(tItem)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  topic === tItem
                    ? 'bg-[#164B3B] text-[#FFFFFF]'
                    : 'text-[#6D7972] hover:text-[#202B27]'
                }`}
              >
                {tItem}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-[#6D7972] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides & terms..."
              aria-label="Search resources"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#202B27]/12 bg-[#FFFFFF] focus:outline-none focus:border-[#164B3B]"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No resources match your search"
            description="Reset your filter or search for another topic such as Prayer or Ramadan."
            actionLabel="Show all guides"
            onAction={() => {
              setTopic('All');
              setQuery('');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((res) => (
              <ResourceCard
                key={res.id}
                resource={res}
                saved={savedResourceIds.includes(res.id)}
                onToggleSave={() => toggleSaveResource(res.id)}
                onRead={() => setActiveArticle(res)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        open={Boolean(activeArticle)}
        onClose={() => setActiveArticle(null)}
        title={activeArticle?.title ?? ''}
      >
        {activeArticle && (
          <div className="space-y-4">
            <p className="text-xs font-medium text-[#6D7972]">
              {activeArticle.topic} · {activeArticle.language} · {activeArticle.readTime}
            </p>
            <p className="text-sm font-medium text-[#164B3B]">
              {activeArticle.summary}
            </p>
            <div className="space-y-3 text-sm text-[#202B27] leading-relaxed pt-2 border-t border-[#202B27]/10">
              {activeArticle.body.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
            <div className="pt-4 flex items-center justify-between border-t border-[#202B27]/10">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => toggleSaveResource(activeArticle.id)}
              >
                {savedResourceIds.includes(activeArticle.id)
                  ? 'Saved in Dashboard'
                  : 'Save to Dashboard'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setActiveArticle(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

import React, { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import type { UserRole } from '../../types';
import { Button } from '../../components/ui/Primitives';

/* ============================================================================
   MENTOR DASHBOARD
   ============================================================================ */
export function MentorDashboard({ activeTab }: { activeTab: string }) {
  const { data, apiFetch, refresh, navigate } = usePlatform();
  const user = data?.user;
  const mentorProfile =
    data?.mentors.find((m) => m.userId === user?.id) || data?.mentors[0];
  const requests = data?.mentorRequests ?? [];
  const sessions = data?.mentorSessions ?? [];
  const resources = data?.resources ?? [];

  const [weeklyHours, setWeeklyHours] = useState(
    mentorProfile?.weeklyHours || 'Tue & Thu · 18:00–20:30 CET'
  );
  const [availability, setAvailability] = useState(
    mentorProfile?.availabilityStatus || 'Available'
  );
  const [sessTitle, setSessTitle] = useState('');
  const [sessLearner, setSessLearner] = useState('Amina Lindqvist');
  const [notice, setNotice] = useState<string | null>(null);

  const handleRequestAction = async (
    id: string,
    status: 'accepted' | 'referred' | 'declined'
  ) => {
    await apiFetch(`/api/mentors/requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        referralNote:
          status === 'referred'
            ? 'Referred to bilingual regional coordinator for specialist follow-up.'
            : undefined,
      }),
    });
    await refresh();
    setNotice(`Request updated to ${status}.`);
  };

  const handleSaveAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/api/mentors/availability', {
      method: 'PATCH',
      body: JSON.stringify({
        mentorId: mentorProfile?.id,
        availabilityStatus: availability,
        weeklyHours,
      }),
    });
    await refresh();
    setNotice('Availability schedule saved.');
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessTitle.trim()) return;
    await apiFetch('/api/mentors/sessions', {
      method: 'POST',
      body: JSON.stringify({
        learnerName: sessLearner,
        title: sessTitle,
        format: 'Video Call',
      }),
    });
    setSessTitle('');
    await refresh();
    setNotice('Mentorship session scheduled.');
  };

  const handleCompleteSession = async (id: string) => {
    await apiFetch(`/api/mentors/sessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'completed' }),
    });
    await refresh();
  };

  const assignedLearners = Array.from(
    new Set(
      requests
        .filter((r) => r.status === 'accepted')
        .map((r) => `${r.learnerName} · ${r.topic}`)
    )
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.14em] text-[#164B3B] mb-1">
          MENTOR WORKSPACE
        </p>
        <h1 className="font-display text-3xl font-bold text-[#202B27]">
          Assalamu alaikum, {user?.name}
        </h1>
      </div>

      {notice && (
        <div className="rounded-xl bg-[#E8F0E8] border border-[#164B3B]/20 px-4 py-3 text-sm text-[#10382F]">
          {notice}
        </div>
      )}

      {(activeTab === 'overview' || activeTab === 'requests') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Requests & Referrals */}
          <section className="lg:col-span-7 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-[#202B27]">
              Requests &amp; Referrals ({requests.length})
            </h2>
            <div className="space-y-3">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-xl bg-[#FAF9F4] border border-[#202B27]/10 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#202B27]">
                        {r.learnerName} · {r.preferredLanguage}
                      </p>
                      <p className="text-xs text-[#6D7972]">{r.topic}</p>
                    </div>
                    <span className="text-xs font-medium capitalize text-[#164B3B]">
                      {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#202B27]/85 leading-relaxed">{r.message}</p>
                  {r.status === 'pending' && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => void handleRequestAction(r.id, 'accepted')}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => void handleRequestAction(r.id, 'referred')}
                      >
                        Refer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => void handleRequestAction(r.id, 'declined')}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Availability */}
          <section className="lg:col-span-5 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-5">
            <h2 className="font-display text-lg font-bold text-[#202B27]">
              Availability &amp; Assigned Learners
            </h2>
            <form onSubmit={handleSaveAvailability} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#202B27] mb-1">
                  Status
                </label>
                <select
                  value={availability}
                  onChange={(e) =>
                    setAvailability(e.target.value as 'Available' | 'Limited' | 'Paused')
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
                >
                  <option value="Available">Available</option>
                  <option value="Limited">Limited</option>
                  <option value="Paused">Paused</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#202B27] mb-1">
                  Weekly Mentoring Hours
                </label>
                <input
                  type="text"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
                />
              </div>
              <Button type="submit" size="sm">
                Save Availability
              </Button>
            </form>

            <div className="pt-4 border-t border-[#202B27]/10 space-y-2">
              <p className="text-xs font-semibold text-[#6D7972]">Assigned Learners</p>
              {assignedLearners.length === 0 ? (
                <p className="text-xs text-[#6D7972]">No accepted learners yet.</p>
              ) : (
                assignedLearners.map((item) => (
                  <p key={item} className="text-sm text-[#202B27]">
                    {item}
                  </p>
                ))
              )}
            </div>
          </section>

          {/* Upcoming Sessions */}
          <section className="lg:col-span-7 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-[#202B27]">
              Upcoming &amp; Recent Sessions
            </h2>
            <form onSubmit={handleCreateSession} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={sessLearner}
                onChange={(e) => setSessLearner(e.target.value)}
                placeholder="Learner name"
                className="px-3 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
              />
              <input
                type="text"
                value={sessTitle}
                onChange={(e) => setSessTitle(e.target.value)}
                placeholder="Session topic"
                className="px-3 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
              />
              <Button type="submit" size="sm">
                <Plus className="w-4 h-4" />
                <span>Schedule</span>
              </Button>
            </form>
            <div className="space-y-2.5">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-xl bg-[#FAF9F4] border border-[#202B27]/10 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#202B27]">{s.title}</p>
                    <p className="text-xs text-[#6D7972] tabular-nums">
                      {s.learnerName} · {s.scheduledAt.slice(0, 10)} · {s.status}
                    </p>
                  </div>
                  {s.status === 'scheduled' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => void handleCompleteSession(s.id)}
                    >
                      Mark Completed
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Learning Support Materials */}
          <section className="lg:col-span-5 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-3">
            <h2 className="font-display text-lg font-bold text-[#202B27]">
              Learning Support Materials
            </h2>
            {resources.slice(0, 4).map((res) => (
              <button
                key={res.id}
                type="button"
                onClick={() => navigate('/resources')}
                className="w-full text-left p-3 rounded-xl bg-[#FAF9F4] border border-[#202B27]/8 hover:border-[#164B3B]/40 cursor-pointer"
              >
                <p className="text-xs text-[#6D7972]">{res.topic}</p>
                <p className="text-sm font-medium text-[#202B27]">{res.title}</p>
              </button>
            ))}
          </section>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   TEACHER DASHBOARD
   ============================================================================ */
export function TeacherDashboard() {
  const { data, apiFetch, refresh, navigate } = usePlatform();
  const user = data?.user;
  const courses = data?.courses ?? [];
  const submissions = data?.submissions ?? [];
  const events = data?.events ?? [];

  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [lessonCourseId, setLessonCourseId] = useState(courses[0]?.id || '');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonSummary, setLessonSummary] = useState('');
  const [classTitle, setClassTitle] = useState('');
  const [classDate, setClassDate] = useState('2026-12-08');
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseDesc.trim()) return;
    await apiFetch('/api/courses', {
      method: 'POST',
      body: JSON.stringify({
        title: courseTitle,
        description: courseDesc,
        category: 'Foundations',
        level: 'Beginner',
        language: 'English',
      }),
    });
    setCourseTitle('');
    setCourseDesc('');
    await refresh();
    setNotice('New course published to the Learning Centre.');
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = lessonCourseId || courses[0]?.id;
    if (!targetId || !lessonTitle.trim() || !lessonSummary.trim()) return;
    await apiFetch(`/api/courses/${targetId}/lessons`, {
      method: 'POST',
      body: JSON.stringify({
        title: lessonTitle,
        summary: lessonSummary,
        durationMinutes: 15,
      }),
    });
    setLessonTitle('');
    setLessonSummary('');
    await refresh();
    setNotice('Lesson added to course syllabus.');
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classTitle.trim()) return;
    await apiFetch('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        title: classTitle,
        dateISO: classDate,
        category: 'Live Class',
        format: 'Online',
      }),
    });
    setClassTitle('');
    await refresh();
    setNotice('Live class added to schedule.');
  };

  const handleSendFeedback = async (id: string) => {
    const text = feedbackDrafts[id] || 'Thoughtful reflection — thank you for sharing.';
    await apiFetch(`/api/submissions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ teacherFeedback: text }),
    });
    await refresh();
    setNotice('Feedback sent to learner.');
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.14em] text-[#164B3B] mb-1">
          TEACHER WORKSPACE
        </p>
        <h1 className="font-display text-3xl font-bold text-[#202B27]">
          Assalamu alaikum, {user?.name}
        </h1>
      </div>

      {notice && (
        <div className="rounded-xl bg-[#E8F0E8] border border-[#164B3B]/20 px-4 py-3 text-sm text-[#10382F]">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Courses & Create Course */}
        <section className="lg:col-span-6 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-[#202B27]">
            Courses ({courses.length})
          </h2>
          <div className="space-y-2">
            {courses.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/learn/${c.id}`)}
                className="p-3.5 rounded-xl bg-[#FAF9F4] border border-[#202B27]/10 flex items-center justify-between gap-3 cursor-pointer hover:border-[#164B3B]/40"
              >
                <div>
                  <p className="text-sm font-semibold text-[#202B27]">{c.title}</p>
                  <p className="text-xs text-[#6D7972] tabular-nums">
                    {c.language} · {c.lessons.length} lessons
                  </p>
                </div>
                <span className="text-xs font-medium text-[#164B3B]">Open</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleCreateCourse} className="pt-4 border-t border-[#202B27]/10 space-y-2.5">
            <p className="text-xs font-semibold text-[#202B27]">Create New Course</p>
            <input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="Course title"
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
            />
            <textarea
              rows={2}
              value={courseDesc}
              onChange={(e) => setCourseDesc(e.target.value)}
              placeholder="Short summary for learners..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
            />
            <Button type="submit" size="sm">
              Publish Course
            </Button>
          </form>
        </section>

        {/* Add Lessons & Class Schedules */}
        <section className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-3">
            <h2 className="font-display text-lg font-bold text-[#202B27]">
              Add Lesson to Syllabus
            </h2>
            <form onSubmit={handleAddLesson} className="space-y-2.5">
              <select
                value={lessonCourseId || courses[0]?.id || ''}
                onChange={(e) => setLessonCourseId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="Lesson title"
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
              />
              <input
                type="text"
                value={lessonSummary}
                onChange={(e) => setLessonSummary(e.target.value)}
                placeholder="Lesson summary"
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
              />
              <Button type="submit" size="sm" variant="secondary">
                Add Lesson
              </Button>
            </form>
          </div>

          <div className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-3">
            <h2 className="font-display text-lg font-bold text-[#202B27]">
              Class Schedules ({events.length})
            </h2>
            <form onSubmit={handleCreateClass} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={classTitle}
                onChange={(e) => setClassTitle(e.target.value)}
                placeholder="New live class title"
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
              />
              <input
                type="date"
                value={classDate}
                onChange={(e) => setClassDate(e.target.value)}
                className="px-3 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
              />
              <Button type="submit" size="sm">
                Schedule
              </Button>
            </form>
          </div>
        </section>

        {/* Learner Reflections & Progress */}
        <section className="lg:col-span-12 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-[#202B27]">
            Assignments &amp; Learner Reflections ({submissions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-xl bg-[#FAF9F4] border border-[#202B27]/10 space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-[#6D7972]">
                  <span className="font-semibold text-[#202B27]">{sub.userName}</span>
                  <span className="capitalize text-[#164B3B]">{sub.status}</span>
                </div>
                <p className="text-sm text-[#202B27] leading-relaxed">{sub.responseText}</p>
                {sub.status === 'reviewed' ? (
                  <p className="text-xs text-[#164B3B] bg-[#E8F0E8]/60 p-2.5 rounded-lg">
                    Feedback: {sub.teacherFeedback}
                  </p>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={feedbackDrafts[sub.id] || ''}
                      onChange={(e) =>
                        setFeedbackDrafts((prev) => ({
                          ...prev,
                          [sub.id]: e.target.value,
                        }))
                      }
                      placeholder="Write constructive feedback..."
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#202B27]/15 bg-[#FFFFFF]"
                    />
                    <Button size="sm" onClick={() => void handleSendFeedback(sub.id)}>
                      Send
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ============================================================================
   SCHOLAR REVIEW DASHBOARD
   ============================================================================ */
export function ScholarDashboard() {
  const { data, apiFetch, refresh } = usePlatform();
  const user = data?.user;
  const reviews = data?.reviews ?? [];
  const [comments, setComments] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);

  const handleDecision = async (
    id: string,
    status: 'approved' | 'revision_requested' | 'rejected'
  ) => {
    await apiFetch(`/api/reviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        reviewerComment: comments[id] || `Marked as ${status.replace('_', ' ')}.`,
      }),
    });
    await refresh();
    setNotice(`Item updated to ${status.replace('_', ' ')}.`);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.14em] text-[#164B3B] mb-1">
          SCHOLARLY REVIEW BOARD
        </p>
        <h1 className="font-display text-3xl font-bold text-[#202B27]">
          Assalamu alaikum, {user?.name}
        </h1>
      </div>

      {notice && (
        <div className="rounded-xl bg-[#E8F0E8] border border-[#164B3B]/20 px-4 py-3 text-sm text-[#10382F]">
          {notice}
        </div>
      )}

      <div className="space-y-5">
        {reviews.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[#6D7972]">
                  {item.contentType} · {item.language} · Submitted by {item.authorName}
                </p>
                <h2 className="font-display text-xl font-bold text-[#202B27] mt-1">
                  {item.title}
                </h2>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-[#164B3B]">
                {item.status.replace('_', ' ')}
              </span>
            </div>

            <p className="text-sm text-[#202B27]/90 leading-relaxed">{item.excerpt}</p>

            <div className="rounded-xl bg-[#FAF9F4] border border-[#202B27]/10 p-4 space-y-1.5">
              <p className="text-xs font-semibold text-[#164B3B]">Primary References</p>
              <ul className="text-xs text-[#6D7972] list-disc list-inside space-y-1">
                {item.references.map((ref) => (
                  <li key={ref}>{ref}</li>
                ))}
              </ul>
            </div>

            {item.reviewerComment && (
              <p className="text-xs text-[#10382F] bg-[#E8F0E8]/60 rounded-xl px-4 py-2.5">
                Reviewer Note: {item.reviewerComment}
              </p>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                type="text"
                value={comments[item.id] ?? ''}
                onChange={(e) =>
                  setComments((prev) => ({ ...prev, [item.id]: e.target.value }))
                }
                placeholder="Add scholarly review comment or citation note..."
                className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => void handleDecision(item.id, 'approved')}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => void handleDecision(item.id, 'revision_requested')}
                >
                  Request Revision
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void handleDecision(item.id, 'rejected')}
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   ADMINISTRATOR DASHBOARD
   ============================================================================ */
export function AdminDashboard({ activeTab }: { activeTab: string }) {
  const { data, apiFetch, refresh } = usePlatform();
  const users = data?.usersDirectory ?? [];
  const courses = data?.courses ?? [];
  const mentors = data?.mentors ?? [];
  const reviews = data?.reviews ?? [];
  const directory = data?.directory ?? [];
  const events = data?.events ?? [];
  const reports = data?.reports ?? [];
  const settings = data?.settings;

  const [dirName, setDirName] = useState('');
  const [dirCity, setDirCity] = useState('');
  const [dirCountry, setDirCountry] = useState('');
  const [supportEmail, setSupportEmail] = useState(settings?.supportEmail || '');
  const [aiDisclaimer, setAiDisclaimer] = useState(settings?.aiDisclaimer || '');
  const [notice, setNotice] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, role: UserRole) => {
    await apiFetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
    await refresh();
    setNotice('User role updated.');
  };

  const handleAddDirectory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirName.trim() || !dirCity.trim() || !dirCountry.trim()) return;
    await apiFetch('/api/directory', {
      method: 'POST',
      body: JSON.stringify({
        name: `${dirName.trim()} (Demonstration Entry)`,
        city: dirCity,
        country: dirCountry,
        resourceType: 'Community Centre',
        languages: ['English'],
      }),
    });
    setDirName('');
    setDirCity('');
    setDirCountry('');
    await refresh();
    setNotice('Community listing added to directory.');
  };

  const handleToggleReport = async (id: string) => {
    await apiFetch(`/api/admin/reports/${id}`, { method: 'PATCH' });
    await refresh();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/api/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify({ supportEmail, aiDisclaimer }),
    });
    await refresh();
    setNotice('Platform settings saved.');
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.14em] text-[#164B3B] mb-1">
          PLATFORM ADMINISTRATION
        </p>
        <h1 className="font-display text-3xl font-bold text-[#202B27]">
          Platform Overview &amp; Governance
        </h1>
      </div>

      {notice && (
        <div className="rounded-xl bg-[#E8F0E8] border border-[#164B3B]/20 px-4 py-3 text-sm text-[#10382F]">
          {notice}
        </div>
      )}

      {/* Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Users', val: users.length },
          { label: 'Mentors', val: mentors.length },
          { label: 'Courses', val: courses.length },
          { label: 'Reviews Queue', val: reviews.length },
          { label: 'Listings', val: directory.length },
          { label: 'Events', val: events.length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-4"
          >
            <p className="text-xs text-[#6D7972]">{stat.label}</p>
            <p className="text-2xl font-bold text-[#164B3B] tabular-nums mt-1">
              {stat.val}
            </p>
          </div>
        ))}
      </div>

      {(activeTab === 'overview' || activeTab === 'users') && (
        <section className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-4 overflow-x-auto">
          <h2 className="font-display text-lg font-bold text-[#202B27]">
            Users &amp; Roles
          </h2>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#202B27]/10 text-xs text-[#6D7972]">
                <th className="py-2.5 pr-4">Name</th>
                <th className="py-2.5 pr-4">Email</th>
                <th className="py-2.5 pr-4">Location</th>
                <th className="py-2.5">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202B27]/8">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-3 pr-4 font-medium text-[#202B27]">{u.name}</td>
                  <td className="py-3 pr-4 text-[#6D7972]">{u.email}</td>
                  <td className="py-3 pr-4 text-[#6D7972]">
                    {u.city}, {u.country}
                  </td>
                  <td className="py-3">
                    <select
                      aria-label={`Change role for ${u.name}`}
                      value={u.role}
                      onChange={(e) =>
                        void handleRoleChange(u.id, e.target.value as UserRole)
                      }
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-[#202B27]/15 bg-[#FAF9F4]"
                    >
                      <option value="learner">learner</option>
                      <option value="mentor">mentor</option>
                      <option value="teacher">teacher</option>
                      <option value="scholar">scholar</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Community Listings */}
        <section className="lg:col-span-6 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-[#202B27]">
            Community Listings ({directory.length})
          </h2>
          <form onSubmit={handleAddDirectory} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={dirName}
              onChange={(e) => setDirName(e.target.value)}
              placeholder="Hub name"
              className="px-3 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
            />
            <input
              type="text"
              value={dirCity}
              onChange={(e) => setDirCity(e.target.value)}
              placeholder="City"
              className="px-3 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
            />
            <input
              type="text"
              value={dirCountry}
              onChange={(e) => setDirCountry(e.target.value)}
              placeholder="Country"
              className="px-3 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
            />
            <Button type="submit" size="sm" className="sm:col-span-3 w-fit">
              Add Demonstration Listing
            </Button>
          </form>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {directory.map((d) => (
              <div
                key={d.id}
                className="p-3 rounded-xl bg-[#FAF9F4] border border-[#202B27]/8 flex items-center justify-between gap-2 text-xs"
              >
                <div>
                  <p className="font-semibold text-[#202B27]">{d.name}</p>
                  <p className="text-[#6D7972]">
                    {d.city}, {d.country} · Checked {d.lastChecked}
                  </p>
                </div>
                <span className="text-[#164B3B] font-medium">{d.verifiedStatus}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Reports & Settings */}
        <section className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-3">
            <h2 className="font-display text-lg font-bold text-[#202B27]">
              Reports &amp; Verification Queue
            </h2>
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-3.5 rounded-xl bg-[#FAF9F4] border border-[#202B27]/10 flex items-start justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-semibold text-[#202B27]">{rep.targetTitle}</p>
                  <p className="text-xs text-[#6D7972] mt-0.5">{rep.reason}</p>
                </div>
                <Button
                  size="sm"
                  variant={rep.status === 'resolved' ? 'secondary' : 'primary'}
                  onClick={() => void handleToggleReport(rep.id)}
                >
                  {rep.status === 'resolved' ? 'Resolved' : 'Resolve'}
                </Button>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSaveSettings}
            className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-3"
          >
            <h2 className="font-display text-lg font-bold text-[#202B27]">
              Platform Settings
            </h2>
            <div>
              <label className="block text-xs font-medium text-[#202B27] mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#202B27] mb-1">
                AI Assistant Educational Disclaimer
              </label>
              <textarea
                rows={2}
                value={aiDisclaimer}
                onChange={(e) => setAiDisclaimer(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4]"
              />
            </div>
            <Button type="submit" size="sm">
              Save Settings
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}

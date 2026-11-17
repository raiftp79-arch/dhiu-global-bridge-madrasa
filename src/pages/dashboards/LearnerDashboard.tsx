import React, { useState } from 'react';
import {
  ArrowRight,
  Bell,
  Bookmark,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Circle,
  HeartHandshake,
  MessageSquare,
  Plus,
  Send,
  Trash2,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { Button, EmptyState, ProgressBar } from '../../components/ui/Primitives';

export function LearnerDashboard({ activeTab }: { activeTab: string }) {
  const {
    data,
    navigate,
    apiFetch,
    refresh,
    savedResourceIds,
    toggleSaveResource,
    t,
    lang,
  } = usePlatform();

  const user = data?.user;
  const courses = data?.courses ?? [];
  const enrollments = data?.enrollments ?? [];
  const events = data?.events ?? [];
  const goals = data?.goals ?? [];
  const notifications = data?.notifications ?? [];
  const activities = data?.activities ?? [];
  const mentorRequests = data?.mentorRequests ?? [];
  const mentorSessions = data?.mentorSessions ?? [];
  const resources = data?.resources ?? [];

  const [newGoal, setNewGoal] = useState('');
  const [quickQuestion, setQuickQuestion] = useState('');
  const [quickAnswer, setQuickAnswer] = useState<string | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  if (!user) return null;

  const enrolledPairs = enrollments
    .map((e) => ({
      enrollment: e,
      course: courses.find((c) => c.id === e.courseId),
    }))
    .filter((p) => Boolean(p.course));

  const primaryCourse = enrolledPairs[0];
  const savedResources = resources.filter((r) => savedResourceIds.includes(r.id));
  const upcomingClasses = events.filter((e) =>
    e.registeredUserIds.includes(user.id)
  );
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const totalCompletedLessons = enrollments.reduce(
    (sum, e) => sum + e.completedLessonIds.length,
    0
  );

  const pathwayMilestones = [
    { label: 'Explore Core Beliefs', done: totalCompletedLessons >= 1 },
    { label: 'Understand the Shahadah', done: totalCompletedLessons >= 2 },
    { label: 'Begin Daily Prayer (Salah)', done: enrollments.some((e) => e.courseId === 'understanding-salah') },
    { label: "Start Reading the Qur'an", done: enrollments.some((e) => e.courseId === 'quran-first-steps') },
    { label: 'Connect with a Mentor', done: mentorRequests.length > 0 },
  ];

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    await apiFetch('/api/learner/goals', {
      method: 'POST',
      body: JSON.stringify({ title: newGoal }),
    });
    setNewGoal('');
    await refresh();
  };

  const handleToggleGoal = async (id: string) => {
    await apiFetch(`/api/learner/goals/${id}`, { method: 'PATCH' });
    await refresh();
  };

  const handleDeleteGoal = async (id: string) => {
    await apiFetch(`/api/learner/goals/${id}`, { method: 'DELETE' });
    await refresh();
  };

  const handleReadAllNotifs = async () => {
    await apiFetch('/api/learner/notifications/read-all', { method: 'POST' });
    await refresh();
  };

  const handleQuickAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuestion.trim() || aiBusy) return;
    setAiBusy(true);
    setAiError(null);
    try {
      const res = await apiFetch<{ answer: string }>('/api/assistant/ask', {
        method: 'POST',
        body: JSON.stringify({ question: quickQuestion, language: lang }),
      });
      setQuickAnswer(res.answer);
      setQuickQuestion('');
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Unable to ask assistant.');
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-[#164B3B] mb-1">
            LEARNER WORKSPACE
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#202B27]">
            {t.dashboard.welcomePrefix}, {user.name}
          </h1>
        </div>
        {primaryCourse?.course ? (
          <Button onClick={() => navigate(`/learn/${primaryCourse.course!.id}`)}>
            <span>Continue Next Lesson</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={() => navigate('/learn')}>
            <span>Start Your First Course</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Bento Grid */}
      {(activeTab === 'overview' || activeTab === 'courses') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Continue Learning (Primary Anchor) */}
          <section className="lg:col-span-7 rounded-2xl bg-[#164B3B] text-[#FAF9F4] p-7 flex flex-col justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#C5A46D]">
                CONTINUE LEARNING
              </p>
              {primaryCourse?.course ? (
                <>
                  <h2 className="font-display text-2xl font-bold text-[#FFFFFF]">
                    {primaryCourse.course.title}
                  </h2>
                  <p className="text-sm text-[#E8F0E8]/85 leading-relaxed">
                    {primaryCourse.course.description}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-bold text-[#FFFFFF]">
                    Begin with Foundations of Islamic Belief
                  </h2>
                  <p className="text-sm text-[#E8F0E8]/85 leading-relaxed">
                    Five gentle lessons introducing Tawhid, the Shahadah, and the rhythm of Islamic life.
                  </p>
                </>
              )}
            </div>

            {primaryCourse?.course ? (
              <div className="pt-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-[#E8F0E8]/90 tabular-nums">
                  <span>Progress</span>
                  <span>
                    {primaryCourse.enrollment.completedLessonIds.length} of{' '}
                    {primaryCourse.course.lessons.length} lessons completed
                  </span>
                </div>
                <div className="w-full h-2 bg-[#10382F] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C5A46D] rounded-full transition-all"
                    style={{
                      width: `${Math.round(
                        (primaryCourse.enrollment.completedLessonIds.length /
                          Math.max(1, primaryCourse.course.lessons.length)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
                <div className="pt-1 flex flex-wrap gap-3">
                  <Button
                    variant="gold"
                    onClick={() => navigate(`/learn/${primaryCourse.course!.id}`)}
                  >
                    <span>Resume Course</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-[#FAF9F4] hover:bg-[#10382F]"
                    onClick={() => navigate('/learn')}
                  >
                    Browse All Courses
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-6">
                <Button
                  variant="gold"
                  onClick={() => navigate('/learn/foundations-of-islam')}
                >
                  Open Foundations Course
                </Button>
              </div>
            )}
          </section>

          {/* My Learning Pathway */}
          <section className="lg:col-span-5 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#202B27]">
                My Learning Pathway
              </h2>
              <span className="text-xs font-medium text-[#164B3B] tabular-nums">
                {pathwayMilestones.filter((m) => m.done).length} / {pathwayMilestones.length}
              </span>
            </div>
            <div className="space-y-3">
              {pathwayMilestones.map((m) => (
                <div key={m.label} className="flex items-center gap-3 text-sm">
                  {m.done ? (
                    <CheckCircle2 className="w-4 h-4 text-[#164B3B] shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#6D7972] shrink-0" />
                  )}
                  <span className={m.done ? 'text-[#202B27] font-medium' : 'text-[#6D7972]'}>
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
            {enrolledPairs.length > 1 && (
              <div className="pt-4 border-t border-[#202B27]/10 space-y-2.5">
                <p className="text-xs font-semibold text-[#6D7972]">Other Active Courses</p>
                {enrolledPairs.slice(1).map(({ course, enrollment }) => {
                  if (!course) return null;
                  const pct = Math.round(
                    (enrollment.completedLessonIds.length /
                      Math.max(1, course.lessons.length)) *
                      100
                  );
                  return (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => navigate(`/learn/${course.id}`)}
                      className="w-full text-left space-y-1.5 cursor-pointer hover:opacity-80"
                    >
                      <p className="text-xs font-semibold text-[#202B27]">{course.title}</p>
                      <ProgressBar value={pct} />
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Upcoming Classes */}
          <section className="lg:col-span-4 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-[#202B27] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#164B3B]" />
                <span>Upcoming Classes</span>
              </h2>
              <button
                type="button"
                onClick={() => navigate('/community')}
                className="text-xs font-medium text-[#164B3B] hover:underline cursor-pointer"
              >
                All Events
              </button>
            </div>
            {upcomingClasses.length === 0 ? (
              <EmptyState
                title="No classes reserved"
                description="Join a beginner welcome circle or live Q&A session."
                actionLabel="Browse Events"
                onAction={() => navigate('/community')}
              />
            ) : (
              <div className="space-y-3">
                {upcomingClasses.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3.5 rounded-xl bg-[#FAF9F4] border border-[#202B27]/8 space-y-1"
                  >
                    <p className="text-sm font-semibold text-[#202B27]">{evt.title}</p>
                    <p className="text-xs text-[#6D7972] tabular-nums">
                      {evt.dateISO} · {evt.timeDisplay}
                    </p>
                    <p className="text-xs text-[#164B3B]">{evt.hostName}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Mentor Support */}
          <section className="lg:col-span-4 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-[#202B27] flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#164B3B]" />
                <span>Mentor Support</span>
              </h2>
              <button
                type="button"
                onClick={() => navigate('/mentorship')}
                className="text-xs font-medium text-[#164B3B] hover:underline cursor-pointer"
              >
                Find Mentor
              </button>
            </div>

            {mentorSessions.length > 0 ? (
              <div className="space-y-3">
                {mentorSessions.slice(0, 2).map((sess) => (
                  <div
                    key={sess.id}
                    className="p-3.5 rounded-xl bg-[#FAF9F4] border border-[#202B27]/8 space-y-1"
                  >
                    <p className="text-xs font-medium text-[#C5A46D] capitalize">
                      {sess.status} · {sess.format}
                    </p>
                    <p className="text-sm font-semibold text-[#202B27]">{sess.title}</p>
                    <p className="text-xs text-[#6D7972] tabular-nums">
                      {sess.scheduledAt.slice(0, 10)}
                    </p>
                  </div>
                ))}
              </div>
            ) : mentorRequests.length > 0 ? (
              <div className="p-3.5 rounded-xl bg-[#FAF9F4] border border-[#202B27]/8 space-y-1">
                <p className="text-xs font-medium text-[#164B3B] capitalize">
                  Request {mentorRequests[0].status}
                </p>
                <p className="text-sm font-semibold text-[#202B27]">
                  {mentorRequests[0].mentorName}
                </p>
                <p className="text-xs text-[#6D7972]">{mentorRequests[0].topic}</p>
              </div>
            ) : (
              <EmptyState
                title="No mentor paired yet"
                description="Request a peer mentor for gentle guidance at any time."
                actionLabel="Request Guidance"
                onAction={() => navigate('/mentorship')}
              />
            )}
          </section>

          {/* Saved Resources */}
          <section className="lg:col-span-4 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-[#202B27] flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#164B3B]" />
                <span>Saved Resources</span>
              </h2>
              <button
                type="button"
                onClick={() => navigate('/resources')}
                className="text-xs font-medium text-[#164B3B] hover:underline cursor-pointer"
              >
                Browse
              </button>
            </div>
            {savedResources.length === 0 ? (
              <p className="text-xs text-[#6D7972]">
                Bookmark guides in the Resources library to keep them here.
              </p>
            ) : (
              <div className="space-y-2.5">
                {savedResources.map((res) => (
                  <div
                    key={res.id}
                    className="p-3 rounded-xl bg-[#FAF9F4] border border-[#202B27]/8 flex items-start justify-between gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => navigate('/resources')}
                      className="text-left cursor-pointer"
                    >
                      <p className="text-xs text-[#6D7972]">{res.topic}</p>
                      <p className="text-sm font-medium text-[#202B27] hover:text-[#164B3B]">
                        {res.title}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSaveResource(res.id)}
                      aria-label="Unsave resource"
                      className="text-xs text-[#6D7972] hover:text-[#202B27] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* AI Learning Assistant Quick Card */}
          <section className="lg:col-span-6 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-base font-bold text-[#202B27] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#164B3B]" />
                <span>AI Learning Assistant</span>
              </h2>
              <button
                type="button"
                onClick={() => navigate('/assistant')}
                className="text-xs font-medium text-[#164B3B] hover:underline cursor-pointer"
              >
                Full Study Chat →
              </button>
            </div>
            <p className="text-xs text-[#6D7972]">
              Educational study companion (not a religious authority). Ask a quick question:
            </p>
            <form onSubmit={handleQuickAsk} className="flex gap-2">
              <input
                type="text"
                value={quickQuestion}
                onChange={(e) => setQuickQuestion(e.target.value)}
                placeholder="e.g., What does Alhamdulillah mean?"
                className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4] focus:outline-none focus:border-[#164B3B]"
              />
              <Button type="submit" size="sm" disabled={aiBusy || !quickQuestion.trim()}>
                <Send className="w-3.5 h-3.5" />
                <span>{aiBusy ? '...' : 'Ask'}</span>
              </Button>
            </form>
            {aiError && <p className="text-xs text-red-700">{aiError}</p>}
            {quickAnswer && (
              <div className="rounded-xl bg-[#FAF9F4] border border-[#202B27]/10 p-4 text-xs sm:text-sm text-[#202B27] leading-relaxed whitespace-pre-wrap">
                {quickAnswer}
              </div>
            )}
          </section>

          {/* Personal Learning Goals */}
          <section className="lg:col-span-6 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-4">
            <h2 className="font-display text-base font-bold text-[#202B27]">
              Personal Learning Goals
            </h2>
            <form onSubmit={handleAddGoal} className="flex gap-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Add a personal study goal..."
                className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-[#202B27]/15 bg-[#FAF9F4] focus:outline-none focus:border-[#164B3B]"
              />
              <Button type="submit" size="sm" variant="secondary" disabled={!newGoal.trim()}>
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </Button>
            </form>
            <div className="space-y-2">
              {goals.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#FAF9F4] border border-[#202B27]/8"
                >
                  <button
                    type="button"
                    onClick={() => void handleToggleGoal(g.id)}
                    className="flex items-center gap-2.5 text-left cursor-pointer flex-1"
                  >
                    {g.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#164B3B] shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#6D7972] shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        g.completed ? 'line-through text-[#6D7972]' : 'text-[#202B27]'
                      }`}
                    >
                      {g.title}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeleteGoal(g.id)}
                    aria-label="Delete goal"
                    className="p-1.5 text-[#6D7972] hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity & Notifications */}
          <section className="lg:col-span-6 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-4">
            <h2 className="font-display text-base font-bold text-[#202B27] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#164B3B]" />
              <span>Recent Activity</span>
            </h2>
            {activities.length === 0 ? (
              <p className="text-xs text-[#6D7972]">Your completed lessons and sessions will appear here.</p>
            ) : (
              <div className="divide-y divide-[#202B27]/8">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="py-2.5 flex items-baseline justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#202B27]">{act.action}</p>
                      <p className="text-xs text-[#6D7972]">{act.detail}</p>
                    </div>
                    <span className="text-xs text-[#6D7972] tabular-nums shrink-0">
                      {act.createdAt.slice(0, 10)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="lg:col-span-6 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-[#202B27] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#164B3B]" />
                <span>Notifications ({unreadNotifs} unread)</span>
              </h2>
              {unreadNotifs > 0 && (
                <button
                  type="button"
                  onClick={() => void handleReadAllNotifs()}
                  className="text-xs font-medium text-[#164B3B] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="text-xs text-[#6D7972]">You are all caught up.</p>
            ) : (
              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-xl border ${
                      n.read
                        ? 'bg-[#FAF9F4] border-[#202B27]/8'
                        : 'bg-[#E8F0E8]/55 border-[#164B3B]/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#202B27]">{n.title}</p>
                      <span className="text-[11px] text-[#6D7972] tabular-nums">
                        {n.createdAt.slice(0, 10)}
                      </span>
                    </div>
                    <p className="text-xs text-[#6D7972] mt-1">{n.body}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

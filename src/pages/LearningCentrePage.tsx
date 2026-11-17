import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Search,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import {
  Button,
  CourseCard,
  EmptyState,
  ProgressBar,
  SafeImage,
  SkeletonCard,
} from '../components/ui/Primitives';

export function LearningCentrePage() {
  const { data, loading, navigate } = usePlatform();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [language, setLanguage] = useState<string>('All');

  const courses = data?.courses ?? [];
  const enrollments = data?.enrollments ?? [];

  const categories = ['All', 'Foundations', 'Worship', "Qur'an", 'Tarbiyah'];
  const languages = ['All', 'English', 'Deutsch', 'Français'];

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesCat = category === 'All' || c.category === category;
      const matchesLang = language === 'All' || c.language === language;
      const q = search.trim().toLowerCase();
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);
      return matchesCat && matchesLang && matchesQuery;
    });
  }, [courses, category, language, search]);

  const activeEnrollments = enrollments
    .map((e) => ({
      enrollment: e,
      course: courses.find((c) => c.id === e.courseId),
    }))
    .filter((item) => Boolean(item.course));

  return (
    <div className="bg-[#FAF9F4] py-12 lg:py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#164B3B]">
            LEARNING CENTRE
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#202B27] text-balance">
            Structured courses built for clarity.
          </h1>
          <p className="text-base text-[#6D7972] leading-relaxed">
            Progress through self-paced modules in Islamic foundations, daily prayer, Qur&apos;an reflection, and character.
          </p>
        </div>

        {/* Continue Learning Strip */}
        {activeEnrollments.length > 0 && (
          <section className="rounded-2xl bg-[#FFFFFF] border border-[#202B27]/10 p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="font-display text-lg font-bold text-[#202B27]">
                Continue Learning
              </h2>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-xs font-medium text-[#164B3B] hover:underline cursor-pointer"
              >
                Open Learner Dashboard →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeEnrollments.map(({ enrollment, course }) => {
                if (!course) return null;
                const pct =
                  course.lessons.length > 0
                    ? Math.round(
                        (enrollment.completedLessonIds.length / course.lessons.length) *
                          100
                      )
                    : 0;
                return (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/learn/${course.id}`)}
                    className="rounded-xl bg-[#FAF9F4] border border-[#202B27]/10 p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-[#164B3B]/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1 space-y-2">
                      <p className="text-sm font-semibold text-[#202B27] truncate">
                        {course.title}
                      </p>
                      <ProgressBar
                        value={pct}
                        label={`${enrollment.completedLessonIds.length} / ${course.lessons.length} lessons`}
                      />
                    </div>
                    <Button size="sm" variant="secondary">
                      Resume
                    </Button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FFFFFF] border border-[#202B27]/10 rounded-xl w-fit">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  category === cat
                    ? 'bg-[#164B3B] text-[#FFFFFF]'
                    : 'text-[#6D7972] hover:text-[#202B27]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              aria-label="Filter by language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3.5 py-2.5 text-sm rounded-xl border border-[#202B27]/12 bg-[#FFFFFF] text-[#202B27] focus:outline-none focus:border-[#164B3B]"
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l === 'All' ? 'All Languages' : l}
                </option>
              ))}
            </select>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-[#6D7972] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                aria-label="Search courses"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#202B27]/12 bg-[#FFFFFF] text-[#202B27] placeholder:text-[#6D7972] focus:outline-none focus:border-[#164B3B]"
              />
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No matching courses"
            description="Try clearing your search term or selecting another language filter."
            actionLabel="Reset filters"
            onAction={() => {
              setCategory('All');
              setLanguage('All');
              setSearch('');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => {
              const enr = enrollments.find((e) => e.courseId === course.id);
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  enrolled={Boolean(enr)}
                  completedCount={enr?.completedLessonIds.length}
                  onOpen={() => navigate(`/learn/${course.id}`)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function CourseDetailPage({ courseId }: { courseId: string }) {
  const { data, navigate, apiFetch, refresh } = usePlatform();
  const course = data?.courses.find((c) => c.id === courseId);
  const user = data?.user ?? null;
  const enrollment = data?.enrollments.find((e) => e.courseId === courseId);

  const [activeLessonId, setActiveLessonId] = useState<string>(
    () => enrollment?.lastLessonId || course?.lessons[0]?.id || ''
  );
  const [reflection, setReflection] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <EmptyState
          title="Course not found"
          description="The requested course may have moved or is unavailable."
          actionLabel="Back to Learning Centre"
          onAction={() => navigate('/learn')}
        />
      </div>
    );
  }

  const activeLesson =
    course.lessons.find((l) => l.id === activeLessonId) || course.lessons[0];
  const completedIds = enrollment?.completedLessonIds ?? [];
  const progressPct =
    course.lessons.length > 0
      ? Math.round((completedIds.length / course.lessons.length) * 100)
      : 0;

  const relatedResources = (data?.resources ?? []).filter((r) =>
    course.relatedResourceIds.includes(r.id)
  );

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setBusy(true);
    setFeedbackMsg(null);
    try {
      await apiFetch(`/api/courses/${course.id}/enroll`, { method: 'POST' });
      await refresh();
      setFeedbackMsg('You are now enrolled in this course.');
    } catch (err) {
      setFeedbackMsg(err instanceof Error ? err.message : 'Unable to enrol.');
    } finally {
      setBusy(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!activeLesson) return;
    setBusy(true);
    setFeedbackMsg(null);
    try {
      await apiFetch(
        `/api/courses/${course.id}/lessons/${activeLesson.id}/complete`,
        { method: 'POST' }
      );
      await refresh();
      setFeedbackMsg('Lesson marked complete.');
    } catch (err) {
      setFeedbackMsg(err instanceof Error ? err.message : 'Could not save progress.');
    } finally {
      setBusy(false);
    }
  };

  const handleSubmitReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!reflection.trim() || !activeLesson) return;
    setBusy(true);
    setFeedbackMsg(null);
    try {
      await apiFetch(`/api/courses/${course.id}/assignments`, {
        method: 'POST',
        body: JSON.stringify({
          lessonId: activeLesson.id,
          responseText: reflection,
        }),
      });
      setReflection('');
      await refresh();
      setFeedbackMsg('Your reflection has been submitted for teacher review.');
    } catch (err) {
      setFeedbackMsg(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setBusy(false);
    }
  };

  const isLessonDone = activeLesson ? completedIds.includes(activeLesson.id) : false;

  return (
    <div className="bg-[#FAF9F4] py-10 lg:py-14">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#6D7972] hover:text-[#164B3B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learning Centre</span>
        </button>

        {/* Course Header */}
        <div className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-medium text-[#6D7972] tabular-nums">
              {course.category} · {course.level} · {course.language} · Instructor:{' '}
              {course.instructorName}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#202B27] text-balance">
              {course.title}
            </h1>
            <p className="text-sm sm:text-base text-[#6D7972] leading-relaxed">
              {course.description}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              {enrollment ? (
                <div className="w-full max-w-xs">
                  <ProgressBar
                    value={progressPct}
                    label={`${completedIds.length} of ${course.lessons.length} lessons completed`}
                  />
                </div>
              ) : (
                <Button onClick={handleEnroll} disabled={busy}>
                  {user ? 'Enrol in Course' : 'Sign In to Enrol'}
                </Button>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#E8F0E8]">
              <SafeImage
                src={course.thumbnail}
                alt={course.title}
                fallbackTitle={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {feedbackMsg && (
          <div className="rounded-xl bg-[#E8F0E8] border border-[#164B3B]/20 px-4 py-3 text-sm text-[#10382F]">
            {feedbackMsg}
          </div>
        )}

        {/* Lesson Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Syllabus Sidebar */}
          <aside className="lg:col-span-4 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-5 space-y-3">
            <h2 className="text-sm font-semibold text-[#202B27] pb-3 border-b border-[#202B27]/10">
              Course Syllabus ({course.lessons.length} lessons)
            </h2>
            <div className="space-y-1.5">
              {course.lessons.map((lesson, idx) => {
                const selected = lesson.id === activeLesson?.id;
                const done = completedIds.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setActiveLessonId(lesson.id)}
                    className={`w-full text-left p-3.5 rounded-xl transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                      selected
                        ? 'bg-[#164B3B] text-[#FFFFFF]'
                        : 'hover:bg-[#FAF9F4] text-[#202B27]'
                    }`}
                  >
                    <div className="min-w-0">
                      <p
                        className={`text-[11px] font-mono tabular-nums mb-0.5 ${
                          selected ? 'text-[#C5A46D]' : 'text-[#6D7972]'
                        }`}
                      >
                        Lesson {String(idx + 1).padStart(2, '0')} · {lesson.durationMinutes} min
                      </p>
                      <p className="text-sm font-medium leading-snug">{lesson.title}</p>
                    </div>
                    {done && (
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-1 ${
                          selected ? 'text-[#C5A46D]' : 'text-[#164B3B]'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Active Reading Pane */}
          {activeLesson && (
            <div className="lg:col-span-8 space-y-6">
              <article className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 sm:p-10 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#202B27]/10">
                  <div className="flex items-center gap-2 text-xs text-[#6D7972] tabular-nums">
                    <Clock className="w-3.5 h-3.5 text-[#164B3B]" />
                    <span>{activeLesson.durationMinutes} min reading</span>
                  </div>
                  <Button
                    size="sm"
                    variant={isLessonDone ? 'secondary' : 'primary'}
                    onClick={handleCompleteLesson}
                    disabled={busy}
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      {isLessonDone ? 'Completed' : 'Mark Lesson Complete'}
                    </span>
                  </Button>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#202B27]">
                  {activeLesson.title}
                </h2>
                <p className="text-base text-[#164B3B] font-medium leading-relaxed">
                  {activeLesson.summary}
                </p>

                <div className="space-y-4 text-[15.5px] text-[#202B27]/90 leading-[1.75]">
                  {activeLesson.content.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {activeLesson.keyTerm && (
                  <div className="rounded-xl bg-[#E8F0E8]/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-[#164B3B] mb-1">
                        Key Term: {activeLesson.keyTerm.term}
                      </p>
                      <p className="text-sm text-[#202B27]">
                        {activeLesson.keyTerm.meaning}
                      </p>
                    </div>
                    {activeLesson.keyTerm.arabic && (
                      <p className="text-2xl font-bold text-[#10382F] shrink-0" dir="rtl">
                        {activeLesson.keyTerm.arabic}
                      </p>
                    )}
                  </div>
                )}

                {/* Reflection Submission */}
                <form
                  onSubmit={handleSubmitReflection}
                  className="pt-6 border-t border-[#202B27]/10 space-y-3"
                >
                  <label className="block text-sm font-semibold text-[#202B27]">
                    Guided Reflection
                  </label>
                  <p className="text-xs text-[#6D7972]">
                    {activeLesson.reflectionPrompt}
                  </p>
                  <textarea
                    rows={3}
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder={
                      user
                        ? 'Write your reflection for your instructor...'
                        : 'Sign in to submit a reflection...'
                    }
                    className="w-full rounded-xl border border-[#202B27]/15 bg-[#FAF9F4] p-3.5 text-sm text-[#202B27] focus:outline-none focus:border-[#164B3B]"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" disabled={busy || !reflection.trim()}>
                      Submit Reflection
                    </Button>
                  </div>
                </form>
              </article>

              {relatedResources.length > 0 && (
                <div className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-[#202B27]">
                    Related Learning Resources
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedResources.map((res) => (
                      <button
                        key={res.id}
                        type="button"
                        onClick={() => navigate('/resources')}
                        className="text-left p-4 rounded-xl bg-[#FAF9F4] border border-[#202B27]/10 hover:border-[#164B3B]/40 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2 text-xs text-[#6D7972] mb-1">
                          <BookOpen className="w-3.5 h-3.5 text-[#164B3B]" />
                          <span>
                            {res.topic} · {res.readTime}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-[#202B27]">{res.title}</p>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#164B3B] mt-2">
                          Open in Resources <ArrowRight className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import crypto from 'node:crypto';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { loadDb, sanitizeUser, saveDb, type StoredUser } from './store.ts';
import type {
  Course,
  DirectoryListing,
  PlatformEvent,
  UserRole,
} from '../src/types.ts';

function getSessionUser(req: express.Request): StoredUser | null {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : (req.headers['x-session-token'] as string | undefined);
  if (!token) return null;
  const db = loadDb();
  const userId = db.sessions[token];
  if (!userId) return null;
  return db.users.find((u) => u.id === userId) ?? null;
}

function makeId(prefix: string): string {
  return `${prefix}-${crypto.randomBytes(4).toString('hex')}`;
}

export function createApiApp(): express.Express {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  // Bootstrap platform data tailored to current session
  app.get('/api/bootstrap', (req, res) => {
    const db = loadDb();
    const currentUser = getSessionUser(req);
    const userId = currentUser?.id;

    const enrollments = userId
      ? db.enrollments.filter((e) => e.userId === userId)
      : [];
    const goals = userId ? db.goals.filter((g) => g.userId === userId) : [];
    const notifications = userId
      ? db.notifications.filter((n) => n.userId === userId)
      : [];
    const activities = userId
      ? db.activities.filter((a) => a.userId === userId)
      : [];

    const visibleRequests = currentUser
      ? currentUser.role === 'admin' || currentUser.role === 'mentor'
        ? db.mentorRequests
        : db.mentorRequests.filter((r) => r.learnerId === currentUser.id)
      : [];

    const visibleSessions = currentUser
      ? currentUser.role === 'admin' || currentUser.role === 'mentor'
        ? db.mentorSessions
        : db.mentorSessions.filter((s) => s.learnerId === currentUser.id)
      : [];

    const visibleSubmissions = currentUser
      ? currentUser.role === 'teacher' || currentUser.role === 'admin'
        ? db.submissions
        : db.submissions.filter((s) => s.userId === currentUser.id)
      : [];

    res.json({
      user: currentUser ? sanitizeUser(currentUser) : null,
      courses:
        currentUser && (currentUser.role === 'teacher' || currentUser.role === 'admin')
          ? db.courses
          : db.courses.filter((c) => c.published),
      enrollments,
      submissions: visibleSubmissions,
      mentors: db.mentors,
      mentorRequests: visibleRequests,
      mentorSessions: visibleSessions,
      reviews:
        currentUser &&
        (currentUser.role === 'scholar' ||
          currentUser.role === 'teacher' ||
          currentUser.role === 'admin')
          ? db.reviews
          : db.reviews.filter((r) => r.status === 'approved'),
      resources: db.resources,
      directory: db.directory,
      events: db.events,
      goals,
      notifications,
      activities,
      reports:
        currentUser && currentUser.role === 'admin' ? db.reports : [],
      settings: db.settings,
      usersDirectory:
        currentUser && currentUser.role === 'admin'
          ? db.users.map(sanitizeUser)
          : undefined,
    });
  });

  // Authentication endpoints
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const db = loadDb();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = crypto.randomBytes(24).toString('hex');
    db.sessions[token] = user.id;
    saveDb(db);
    return res.json({ token, user: sanitizeUser(user) });
  });

  app.post('/api/auth/demo', (req, res) => {
    const { role } = req.body as { role?: UserRole };
    const db = loadDb();
    const user = db.users.find((u) => u.role === role && u.isDemo);
    if (!user) {
      return res.status(404).json({ error: 'Demonstration account not found.' });
    }
    const token = crypto.randomBytes(24).toString('hex');
    db.sessions[token] = user.id;
    saveDb(db);
    return res.json({ token, user: sanitizeUser(user) });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, language, city, country } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      language?: 'en' | 'ar' | 'fr' | 'de';
      city?: string;
      country?: string;
    };
    const db = loadDb();
    if (!db.settings.enableNewRegistrations) {
      return res.status(403).json({ error: 'New learner registrations are currently paused.' });
    }
    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
      return res.status(400).json({
        error: 'Please enter your name, a valid email address, and a password of at least 6 characters.',
      });
    }
    if (db.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    const newUser: StoredUser = {
      id: makeId('learner'),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: password,
      role: 'learner',
      language: language || 'en',
      city: city?.trim() || 'Online',
      country: country?.trim() || 'International',
      bio: 'New learner beginning a structured journey of Islamic knowledge.',
      isDemo: false,
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    db.notifications.unshift({
      id: makeId('notif'),
      userId: newUser.id,
      title: 'Welcome to NoorPath',
      body: 'Start with Foundations of Islamic Belief or request a mentor whenever you would like personal guidance.',
      read: false,
      createdAt: new Date().toISOString(),
    });
    const token = crypto.randomBytes(24).toString('hex');
    db.sessions[token] = newUser.id;
    saveDb(db);
    return res.status(201).json({ token, user: sanitizeUser(newUser) });
  });

  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    if (token) {
      const db = loadDb();
      delete db.sessions[token];
      saveDb(db);
    }
    res.json({ ok: true });
  });

  // Courses, enrollment & progress
  app.post('/api/courses/:courseId/enroll', (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Please sign in to enrol in a course.' });
    const db = loadDb();
    const course = db.courses.find((c) => c.id === req.params.courseId);
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    const existing = db.enrollments.find(
      (e) => e.userId === user.id && e.courseId === course.id
    );
    if (existing) {
      return res.json({ enrollment: existing });
    }
    const enrollment = {
      id: makeId('enr'),
      userId: user.id,
      courseId: course.id,
      completedLessonIds: [],
      lastLessonId: course.lessons[0]?.id,
      enrolledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.enrollments.push(enrollment);
    db.activities.unshift({
      id: makeId('act'),
      userId: user.id,
      action: 'Enrolled in course',
      detail: course.title,
      createdAt: new Date().toISOString(),
    });
    saveDb(db);
    return res.status(201).json({ enrollment });
  });

  app.post('/api/courses/:courseId/lessons/:lessonId/complete', (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Please sign in to save lesson progress.' });
    const db = loadDb();
    const course = db.courses.find((c) => c.id === req.params.courseId);
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    const lesson = course.lessons.find((l) => l.id === req.params.lessonId);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found.' });

    let enrollment = db.enrollments.find(
      (e) => e.userId === user.id && e.courseId === course.id
    );
    if (!enrollment) {
      enrollment = {
        id: makeId('enr'),
        userId: user.id,
        courseId: course.id,
        completedLessonIds: [],
        lastLessonId: lesson.id,
        enrolledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.enrollments.push(enrollment);
    }
    if (!enrollment.completedLessonIds.includes(lesson.id)) {
      enrollment.completedLessonIds.push(lesson.id);
      db.activities.unshift({
        id: makeId('act'),
        userId: user.id,
        action: 'Completed lesson',
        detail: lesson.title,
        createdAt: new Date().toISOString(),
      });
    }
    enrollment.lastLessonId = lesson.id;
    enrollment.updatedAt = new Date().toISOString();
    saveDb(db);
    return res.json({ enrollment });
  });

  app.post('/api/courses/:courseId/assignments', (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Please sign in to submit a reflection.' });
    const { lessonId, responseText } = req.body as {
      lessonId?: string;
      responseText?: string;
    };
    if (!lessonId || !responseText?.trim()) {
      return res.status(400).json({ error: 'Reflection text is required.' });
    }
    const db = loadDb();
    const submission = {
      id: makeId('sub'),
      courseId: req.params.courseId,
      lessonId,
      userId: user.id,
      userName: user.name,
      responseText: responseText.trim(),
      status: 'submitted' as const,
      submittedAt: new Date().toISOString(),
    };
    db.submissions.unshift(submission);
    db.activities.unshift({
      id: makeId('act'),
      userId: user.id,
      action: 'Submitted reflection',
      detail: `${req.params.courseId} (${lessonId})`,
      createdAt: new Date().toISOString(),
    });
    saveDb(db);
    return res.status(201).json({ submission });
  });

  // Teacher: create course, add lesson, give feedback
  app.post('/api/courses', (req, res) => {
    const user = getSessionUser(req);
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Only teachers or administrators can create courses.' });
    }
    const { title, description, category, level, language } = req.body as Partial<Course>;
    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ error: 'Course title and description are required.' });
    }
    const db = loadDb();
    const newCourse: Course = {
      id: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + crypto.randomBytes(2).toString('hex'),
      title: title.trim(),
      description: description.trim(),
      category: category || 'Foundations',
      level: level || 'Beginner',
      language: language || 'English',
      thumbnail: '/src/assets/images/course_foundations_islam_1794896867599.jpg',
      instructorId: user.id,
      instructorName: user.name,
      relatedResourceIds: ['res-terminology'],
      published: true,
      lessons: [
        {
          id: makeId('les'),
          title: 'Module 1: Orientation & Overview',
          durationMinutes: 15,
          summary: 'Introductory reading and guided reflection for students.',
          content: [description.trim()],
          reflectionPrompt: 'What do you hope to learn first in this course?',
        },
      ],
    };
    db.courses.unshift(newCourse);
    saveDb(db);
    return res.status(201).json({ course: newCourse });
  });

  app.post('/api/courses/:courseId/lessons', (req, res) => {
    const user = getSessionUser(req);
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Only teachers or administrators can add lessons.' });
    }
    const db = loadDb();
    const course = db.courses.find((c) => c.id === req.params.courseId);
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    const { title, durationMinutes, summary, contentText, reflectionPrompt } = req.body as {
      title?: string;
      durationMinutes?: number;
      summary?: string;
      contentText?: string;
      reflectionPrompt?: string;
    };
    if (!title?.trim() || !summary?.trim()) {
      return res.status(400).json({ error: 'Lesson title and summary are required.' });
    }
    const newLesson = {
      id: makeId('les'),
      title: title.trim(),
      durationMinutes: Number(durationMinutes) || 15,
      summary: summary.trim(),
      content: (contentText || summary).split('\n').map((s) => s.trim()).filter(Boolean),
      reflectionPrompt: reflectionPrompt?.trim() || 'Share one key takeaway from this lesson.',
    };
    course.lessons.push(newLesson);
    saveDb(db);
    return res.status(201).json({ lesson: newLesson, course });
  });

  app.patch('/api/submissions/:id', (req, res) => {
    const user = getSessionUser(req);
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Teacher authorization required.' });
    }
    const { teacherFeedback } = req.body as { teacherFeedback?: string };
    const db = loadDb();
    const sub = db.submissions.find((s) => s.id === req.params.id);
    if (!sub) return res.status(404).json({ error: 'Submission not found.' });
    sub.teacherFeedback = teacherFeedback?.trim() || 'Reviewed with appreciation.';
    sub.status = 'reviewed';
    db.notifications.unshift({
      id: makeId('notif'),
      userId: sub.userId,
      title: 'Teacher feedback posted',
      body: `${user.name} reviewed your reflection on ${sub.courseId}.`,
      read: false,
      createdAt: new Date().toISOString(),
    });
    saveDb(db);
    return res.json({ submission: sub });
  });

  // Mentorship requests & sessions
  app.post('/api/mentors/requests', (req, res) => {
    const user = getSessionUser(req);
    const { mentorId, learnerName, learnerEmail, preferredLanguage, topic, message } =
      req.body as {
        mentorId?: string;
        learnerName?: string;
        learnerEmail?: string;
        preferredLanguage?: string;
        topic?: string;
        message?: string;
      };
    if (!mentorId || !topic?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Please choose a mentor, topic, and short message.' });
    }
    const finalName = user?.name || learnerName?.trim();
    const finalEmail = user?.email || learnerEmail?.trim();
    if (!finalName || !finalEmail) {
      return res.status(400).json({ error: 'Your name and email address are required.' });
    }
    const db = loadDb();
    const mentor = db.mentors.find((m) => m.id === mentorId);
    if (!mentor) return res.status(404).json({ error: 'Selected mentor not found.' });

    const newReq = {
      id: makeId('req'),
      learnerId: user?.id || 'guest-' + crypto.randomBytes(3).toString('hex'),
      learnerName: finalName,
      learnerEmail: finalEmail,
      mentorId: mentor.id,
      mentorName: mentor.name,
      preferredLanguage: preferredLanguage || 'English',
      topic: topic.trim(),
      message: message.trim(),
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };
    db.mentorRequests.unshift(newReq);
    if (user) {
      db.activities.unshift({
        id: makeId('act'),
        userId: user.id,
        action: 'Requested mentor guidance',
        detail: `${mentor.name} · ${topic.trim()}`,
        createdAt: new Date().toISOString(),
      });
    }
    saveDb(db);
    return res.status(201).json({ request: newReq });
  });

  app.patch('/api/mentors/requests/:id', (req, res) => {
    const user = getSessionUser(req);
    if (!user || (user.role !== 'mentor' && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Mentor or admin authorization required.' });
    }
    const { status, referralNote } = req.body as {
      status?: 'accepted' | 'referred' | 'declined';
      referralNote?: string;
    };
    const db = loadDb();
    const requestItem = db.mentorRequests.find((r) => r.id === req.params.id);
    if (!requestItem) return res.status(404).json({ error: 'Mentor request not found.' });
    if (status) requestItem.status = status;
    if (referralNote !== undefined) requestItem.referralNote = referralNote.trim();
    db.notifications.unshift({
      id: makeId('notif'),
      userId: requestItem.learnerId,
      title: `Mentorship request ${requestItem.status}`,
      body: `${requestItem.mentorName} updated your request regarding "${requestItem.topic}".`,
      read: false,
      createdAt: new Date().toISOString(),
    });
    saveDb(db);
    return res.json({ request: requestItem });
  });

  app.patch('/api/mentors/availability', (req, res) => {
    const user = getSessionUser(req);
    if (!user || (user.role !== 'mentor' && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Mentor or admin authorization required.' });
    }
    const { mentorId, availabilityStatus, weeklyHours } = req.body as {
      mentorId?: string;
      availabilityStatus?: 'Available' | 'Limited' | 'Paused';
      weeklyHours?: string;
    };
    const db = loadDb();
    const mentor =
      db.mentors.find((m) => m.id === mentorId) ||
      db.mentors.find((m) => m.userId === user.id);
    if (!mentor) return res.status(404).json({ error: 'Mentor profile not found.' });
    if (availabilityStatus) mentor.availabilityStatus = availabilityStatus;
    if (weeklyHours) mentor.weeklyHours = weeklyHours.trim();
    saveDb(db);
    return res.json({ mentor });
  });

  app.post('/api/mentors/sessions', (req, res) => {
    const user = getSessionUser(req);
    if (!user || (user.role !== 'mentor' && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Mentor authorization required.' });
    }
    const { learnerId, learnerName, title, scheduledAt, format, notes } = req.body as {
      learnerId?: string;
      learnerName?: string;
      title?: string;
      scheduledAt?: string;
      format?: 'Video Call' | 'Audio Guidance' | 'Written Check-in';
      notes?: string;
    };
    if (!title?.trim() || !learnerName?.trim()) {
      return res.status(400).json({ error: 'Session title and learner name are required.' });
    }
    const db = loadDb();
    const mentor = db.mentors.find((m) => m.userId === user.id) || db.mentors[0];
    const newSession = {
      id: makeId('sess'),
      mentorId: mentor.id,
      learnerId: learnerId || 'learner-1',
      learnerName: learnerName.trim(),
      title: title.trim(),
      scheduledAt: scheduledAt || new Date(Date.now() + 86400000 * 3).toISOString(),
      format: format || 'Video Call',
      status: 'scheduled' as const,
      notes: notes?.trim(),
    };
    db.mentorSessions.unshift(newSession);
    saveDb(db);
    return res.status(201).json({ session: newSession });
  });

  app.patch('/api/mentors/sessions/:id', (req, res) => {
    const user = getSessionUser(req);
    if (!user || (user.role !== 'mentor' && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Mentor authorization required.' });
    }
    const { status } = req.body as { status?: 'scheduled' | 'completed' | 'cancelled' };
    const db = loadDb();
    const session = db.mentorSessions.find((s) => s.id === req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found.' });
    if (status) session.status = status;
    saveDb(db);
    return res.json({ session });
  });

  // Scholarly Review Queue
  app.patch('/api/reviews/:id', (req, res) => {
    const user = getSessionUser(req);
    if (!user || (user.role !== 'scholar' && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Scholarly reviewer authorization required.' });
    }
    const { status, reviewerComment } = req.body as {
      status?: 'approved' | 'revision_requested' | 'rejected';
      reviewerComment?: string;
    };
    const db = loadDb();
    const review = db.reviews.find((r) => r.id === req.params.id);
    if (!review) return res.status(404).json({ error: 'Review item not found.' });
    if (status) review.status = status;
    if (reviewerComment !== undefined) review.reviewerComment = reviewerComment.trim();
    review.reviewedAt = new Date().toISOString();
    saveDb(db);
    return res.json({ review });
  });

  // Events & Class Scheduling
  app.post('/api/events/:id/register', (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Please sign in to register for a session.' });
    const db = loadDb();
    const evt = db.events.find((e) => e.id === req.params.id);
    if (!evt) return res.status(404).json({ error: 'Event not found.' });
    const already = evt.registeredUserIds.includes(user.id);
    if (already) {
      evt.registeredUserIds = evt.registeredUserIds.filter((id) => id !== user.id);
    } else {
      if (evt.registeredUserIds.length >= evt.capacity) {
        return res.status(409).json({ error: 'This session has reached capacity.' });
      }
      evt.registeredUserIds.push(user.id);
      db.activities.unshift({
        id: makeId('act'),
        userId: user.id,
        action: 'Registered for class',
        detail: evt.title,
        createdAt: new Date().toISOString(),
      });
    }
    saveDb(db);
    return res.json({ event: evt, registered: !already });
  });

  app.post('/api/events', (req, res) => {
    const user = getSessionUser(req);
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Teacher or admin authorization required.' });
    }
    const { title, category, dateISO, timeDisplay, language, format, cityCountry, capacity, description } =
      req.body as Partial<PlatformEvent>;
    if (!title?.trim() || !dateISO) {
      return res.status(400).json({ error: 'Title and date are required.' });
    }
    const db = loadDb();
    const newEvt: PlatformEvent = {
      id: makeId('evt'),
      title: title.trim(),
      category: category || 'Live Class',
      hostName: user.name,
      dateISO,
      timeDisplay: timeDisplay?.trim() || '18:00 CET · 60 min',
      language: language || 'English',
      format: format || 'Online',
      cityCountry: cityCountry?.trim() || 'Global Online',
      capacity: Number(capacity) || 45,
      registeredUserIds: [],
      description: description?.trim() || 'Interactive session for learners.',
    };
    db.events.unshift(newEvt);
    saveDb(db);
    return res.status(201).json({ event: newEvt });
  });

  // Learner Goals & Notifications
  app.post('/api/learner/goals', (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Sign in required.' });
    const { title } = req.body as { title?: string };
    if (!title?.trim()) return res.status(400).json({ error: 'Goal title is required.' });
    const db = loadDb();
    const goal = {
      id: makeId('goal'),
      userId: user.id,
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    db.goals.unshift(goal);
    saveDb(db);
    return res.status(201).json({ goal });
  });

  app.patch('/api/learner/goals/:id', (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Sign in required.' });
    const db = loadDb();
    const goal = db.goals.find((g) => g.id === req.params.id && g.userId === user.id);
    if (!goal) return res.status(404).json({ error: 'Goal not found.' });
    goal.completed = !goal.completed;
    saveDb(db);
    return res.json({ goal });
  });

  app.delete('/api/learner/goals/:id', (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Sign in required.' });
    const db = loadDb();
    db.goals = db.goals.filter((g) => !(g.id === req.params.id && g.userId === user.id));
    saveDb(db);
    return res.json({ ok: true });
  });

  app.post('/api/learner/notifications/read-all', (req, res) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Sign in required.' });
    const db = loadDb();
    db.notifications.forEach((n) => {
      if (n.userId === user.id) n.read = true;
    });
    saveDb(db);
    return res.json({ ok: true });
  });

  // Admin: Community Directory, Users Roles, Reports, Settings
  app.post('/api/directory', (req, res) => {
    const user = getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Administrator authorization required.' });
    }
    const { name, city, country, languages, resourceType, description } =
      req.body as Partial<DirectoryListing>;
    if (!name?.trim() || !city?.trim() || !country?.trim()) {
      return res.status(400).json({ error: 'Organization name, city, and country are required.' });
    }
    const db = loadDb();
    const listing: DirectoryListing = {
      id: makeId('dir'),
      name: name.trim(),
      city: city.trim(),
      country: country.trim(),
      languages: Array.isArray(languages) && languages.length ? languages : ['English'],
      resourceType: resourceType || 'Community Centre',
      verifiedStatus: 'Verified Demo',
      lastChecked: new Date().toISOString().slice(0, 10),
      description: description?.trim() || 'Community learning hub.',
      isDemo: true,
    };
    db.directory.unshift(listing);
    saveDb(db);
    return res.status(201).json({ listing });
  });

  app.patch('/api/admin/users/:id/role', (req, res) => {
    const user = getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Administrator authorization required.' });
    }
    const { role } = req.body as { role?: UserRole };
    if (!role) return res.status(400).json({ error: 'Role is required.' });
    const db = loadDb();
    const target = db.users.find((u) => u.id === req.params.id);
    if (!target) return res.status(404).json({ error: 'User not found.' });
    target.role = role;
    saveDb(db);
    return res.json({ user: sanitizeUser(target) });
  });

  app.patch('/api/admin/reports/:id', (req, res) => {
    const user = getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Administrator authorization required.' });
    }
    const db = loadDb();
    const report = db.reports.find((r) => r.id === req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found.' });
    report.status = report.status === 'open' ? 'resolved' : 'open';
    saveDb(db);
    return res.json({ report });
  });

  app.patch('/api/admin/settings', (req, res) => {
    const user = getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Administrator authorization required.' });
    }
    const db = loadDb();
    db.settings = { ...db.settings, ...req.body };
    saveDb(db);
    return res.json({ settings: db.settings });
  });

  // Real Server-Side Gemini AI Learning Assistant
  app.post('/api/assistant/ask', async (req, res) => {
    const { question, language, history } = req.body as {
      question?: string;
      language?: 'en' | 'ar' | 'fr' | 'de';
      history?: Array<{ role: 'user' | 'assistant'; text: string }>;
    };

    if (!question?.trim()) {
      return res.status(400).json({ error: 'Please enter a question to ask the learning assistant.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in Settings > Secrets. Please configure GEMINI_API_KEY to use the live AI Learning Assistant.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const langInstruction =
      language === 'ar'
        ? 'Respond warmly and clearly in Modern Standard Arabic.'
        : language === 'fr'
          ? 'Respond warmly and clearly in natural French.'
          : language === 'de'
            ? 'Respond warmly and clearly in natural German.'
            : 'Respond warmly and clearly in plain, welcoming English.';

    const contextTranscript = (history || [])
      .slice(-6)
      .map((m) => `${m.role === 'user' ? 'Learner' : 'Assistant'}: ${m.text}`)
      .join('\n');

    const prompt = contextTranscript
      ? `Previous educational conversation:\n${contextTranscript}\n\nNew learner question: ${question.trim()}`
      : question.trim();

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction: `You are the NoorPath AI Educational Learning Assistant for people exploring Islam and new Muslims.
${langInstruction}
Guidelines:
- Keep your tone calm, warm, respectful, structured, and accessible to beginners.
- Explain Islamic terms briefly in plain language when you introduce them.
- Clearly frame your answers as educational guidance, NOT a formal religious ruling (fatwa) or scholarly authority.
- When a question asks for a personal legal ruling, sensitive family counseling, or crisis support, warmly advise consulting a qualified scholar or human mentor on NoorPath.
- Keep responses concise (2–4 short paragraphs or clear bullet points).`,
        },
      });

      const answer = response.text?.trim();
      if (!answer) {
        return res.status(502).json({ error: 'No response text returned from the learning assistant.' });
      }
      return res.json({ answer });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to reach Gemini API.';
      console.error('Gemini assistant error:', message);
      return res.status(502).json({
        error: `Learning assistant error: ${message}`,
      });
    }
  });

  return app;
}

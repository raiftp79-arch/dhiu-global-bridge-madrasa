export type UserRole = 'learner' | 'mentor' | 'teacher' | 'scholar' | 'admin';

export type SupportedLang = 'en' | 'ar' | 'fr' | 'de';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  language: SupportedLang;
  city: string;
  country: string;
  bio: string;
  isDemo: boolean;
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  summary: string;
  content: string[];
  reflectionPrompt: string;
  keyTerm?: {
    term: string;
    arabic?: string;
    meaning: string;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'Foundations' | 'Worship' | "Qur'an" | 'Tarbiyah' | 'Community';
  level: 'Beginner' | 'Intermediate';
  language: 'English' | 'العربية' | 'Français' | 'Deutsch';
  thumbnail: string;
  instructorId: string;
  instructorName: string;
  lessons: Lesson[];
  relatedResourceIds: string[];
  published: boolean;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  lastLessonId?: string;
  enrolledAt: string;
  updatedAt: string;
}

export interface AssignmentSubmission {
  id: string;
  courseId: string;
  lessonId: string;
  userId: string;
  userName: string;
  responseText: string;
  teacherFeedback?: string;
  status: 'submitted' | 'reviewed';
  submittedAt: string;
}

export interface MentorProfile {
  id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  languages: string[];
  specialties: string[];
  bio: string;
  availabilityStatus: 'Available' | 'Limited' | 'Paused';
  weeklyHours: string;
  isDemo: boolean;
}

export interface MentorRequest {
  id: string;
  learnerId: string;
  learnerName: string;
  learnerEmail: string;
  mentorId: string;
  mentorName: string;
  preferredLanguage: string;
  topic: string;
  message: string;
  status: 'pending' | 'accepted' | 'referred' | 'declined';
  referralNote?: string;
  createdAt: string;
}

export interface MentorSession {
  id: string;
  mentorId: string;
  learnerId: string;
  learnerName: string;
  title: string;
  scheduledAt: string;
  format: 'Video Call' | 'Audio Guidance' | 'Written Check-in';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface ScholarReviewItem {
  id: string;
  title: string;
  contentType: 'Course Lesson' | 'Resource Guide' | 'Glossary Entry';
  authorName: string;
  language: string;
  excerpt: string;
  references: string[];
  status: 'awaiting_review' | 'approved' | 'revision_requested' | 'rejected';
  reviewerComment?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface ResourceArticle {
  id: string;
  title: string;
  topic: 'Prayer' | "Qur'an" | 'Ramadan' | 'Terminology' | 'Character' | 'Community';
  language: string;
  readTime: string;
  summary: string;
  body: string[];
  arabicTerm?: string;
  isDemo: boolean;
}

export interface DirectoryListing {
  id: string;
  name: string;
  city: string;
  country: string;
  languages: string[];
  resourceType: 'New Muslim Support' | 'Community Centre' | 'Study Circle' | 'Cultural Hub';
  verifiedStatus: 'Verified Demo' | 'Pending Verification';
  lastChecked: string;
  contactEmail?: string;
  websiteNote?: string;
  description: string;
  coordinates?: { lat: number; lng: number };
  isDemo: boolean;
}

export interface PlatformEvent {
  id: string;
  title: string;
  category: 'Live Class' | 'New Muslim Circle' | 'Q&A Session' | 'Workshop';
  hostName: string;
  dateISO: string;
  timeDisplay: string;
  language: string;
  format: 'Online' | 'Hybrid' | 'Local';
  cityCountry: string;
  capacity: number;
  registeredUserIds: string[];
  description: string;
}

export interface LearnerGoal {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  detail: string;
  createdAt: string;
}

export interface ModerationReport {
  id: string;
  targetType: 'Listing' | 'Course' | 'Community Note';
  targetTitle: string;
  reason: string;
  reportedBy: string;
  status: 'open' | 'resolved';
  createdAt: string;
}

export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  mentorshipBoundaryNotice: string;
  aiDisclaimer: string;
  enableNewRegistrations: boolean;
  requireScholarReviewBeforePublish: boolean;
}

export interface PlatformBootstrap {
  user: UserAccount | null;
  courses: Course[];
  enrollments: Enrollment[];
  submissions: AssignmentSubmission[];
  mentors: MentorProfile[];
  mentorRequests: MentorRequest[];
  mentorSessions: MentorSession[];
  reviews: ScholarReviewItem[];
  resources: ResourceArticle[];
  directory: DirectoryListing[];
  events: PlatformEvent[];
  goals: LearnerGoal[];
  notifications: NotificationItem[];
  activities: ActivityLog[];
  reports: ModerationReport[];
  settings: PlatformSettings;
  usersDirectory?: UserAccount[];
}

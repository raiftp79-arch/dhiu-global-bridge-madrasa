import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type {
  ActivityLog,
  AssignmentSubmission,
  Course,
  DirectoryListing,
  Enrollment,
  LearnerGoal,
  MentorProfile,
  MentorRequest,
  MentorSession,
  ModerationReport,
  NotificationItem,
  PlatformEvent,
  PlatformSettings,
  ResourceArticle,
  ScholarReviewItem,
  UserAccount,
} from '../src/types.ts';

export interface StoredUser extends UserAccount {
  passwordHash: string;
}

export interface DatabaseState {
  users: StoredUser[];
  sessions: Record<string, string>; // token -> userId
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
}

const BUNDLED_DATA_FILE = path.resolve(process.cwd(), '.data', 'platform-store.json');
const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'noorpath-data')
  : path.resolve(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'platform-store.json');

const HERO_IMG_FOUNDATIONS = '/src/assets/images/course_foundations_islam_1794896867599.jpg';
const HERO_IMG_QURAN = '/src/assets/images/course_quran_reflection_1794896866139.jpg';
const HERO_IMG_SALAH = '/src/assets/images/course_salah_prayer_1794896865883.jpg';
const HERO_IMG_COURTYARD = '/src/assets/images/hero_islamic_courtyard_1794896866932.jpg';

function createInitialState(): DatabaseState {
  return {
    users: [
      {
        id: 'learner-1',
        name: 'Amina Lindqvist',
        email: 'amina@demo.noorpath.org',
        passwordHash: 'noorpath2026',
        role: 'learner',
        language: 'en',
        city: 'Stockholm',
        country: 'Sweden',
        bio: 'New learner exploring foundational Islamic beliefs, prayer, and Arabic vocabulary at a gentle pace.',
        isDemo: true,
        createdAt: '2026-09-12T10:00:00Z',
      },
      {
        id: 'mentor-1',
        name: 'Tariq Al-Mansoor',
        email: 'tariq@demo.noorpath.org',
        passwordHash: 'noorpath2026',
        role: 'mentor',
        language: 'en',
        city: 'Berlin',
        country: 'Germany',
        bio: 'Community educator supporting new Muslims across Northern and Central Europe since 2019.',
        isDemo: true,
        createdAt: '2026-08-01T09:00:00Z',
      },
      {
        id: 'teacher-1',
        name: 'Dr. Yusuf Haddad',
        email: 'yusuf@demo.noorpath.org',
        passwordHash: 'noorpath2026',
        role: 'teacher',
        language: 'en',
        city: 'London',
        country: 'United Kingdom',
        bio: 'Curriculum designer and instructor focused on accessible Islamic theology and beginner Qur’an literacy.',
        isDemo: true,
        createdAt: '2026-07-15T09:00:00Z',
      },
      {
        id: 'scholar-1',
        name: 'Shaykha Maryam Qureshi',
        email: 'maryam@demo.noorpath.org',
        passwordHash: 'noorpath2026',
        role: 'scholar',
        language: 'en',
        city: 'Birmingham',
        country: 'United Kingdom',
        bio: 'Scholarly review board member verifying textual accuracy, scriptural citations, and beginner clarity.',
        isDemo: true,
        createdAt: '2026-07-10T09:00:00Z',
      },
      {
        id: 'admin-1',
        name: 'Nadia Benali',
        email: 'nadia@demo.noorpath.org',
        passwordHash: 'noorpath2026',
        role: 'admin',
        language: 'fr',
        city: 'Lyon',
        country: 'France',
        bio: 'Platform coordinator overseeing community verification, multilingual content, and safeguarding.',
        isDemo: true,
        createdAt: '2026-07-01T09:00:00Z',
      },
    ],
    sessions: {},
    courses: [
      {
        id: 'foundations-of-islam',
        title: 'Foundations of Islamic Belief',
        description:
          'An unhurried introduction to God, revelation, prophethood, and the core meaning of entering Islam.',
        category: 'Foundations',
        level: 'Beginner',
        language: 'English',
        thumbnail: HERO_IMG_FOUNDATIONS,
        instructorId: 'teacher-1',
        instructorName: 'Dr. Yusuf Haddad',
        relatedResourceIds: ['res-shahadah', 'res-terminology'],
        published: true,
        lessons: [
          {
            id: 'found-1',
            title: 'Discovering Islam: Meaning & Purpose',
            durationMinutes: 14,
            summary: 'What the word Islam means linguistically and spiritually, and how faith connects to inner peace.',
            content: [
              'The Arabic word Islam shares its root with salam (peace) and istislam (wholehearted trust and surrender to the Creator). Rather than a cultural label, Islam presents itself as a universal relationship between the human heart and the One God.',
              'For anyone beginning to explore, there is no expectation to master everything overnight. Islamic learning unfolds gradually—starting with clarity of heart, sincere curiosity, and practical steps that fit naturally into daily life.',
              'Throughout the Qur’an, reflection upon the natural world, human conscience, and mercy is treated as the starting point of understanding.',
            ],
            reflectionPrompt: 'What question or theme drew you to explore Islamic teachings at this moment in your life?',
            keyTerm: {
              term: 'Islam',
              arabic: 'الإسلام',
              meaning: 'Peaceful, conscious devotion and trust in the One Creator.',
            },
          },
          {
            id: 'found-2',
            title: 'Understanding the Shahadah',
            durationMinutes: 18,
            summary: 'The testimony of faith explained line by line, without pressure or unfamiliar jargon.',
            content: [
              'The Shahadah is the foundational declaration of Islamic faith: "Ash-hadu an la ilaha illa Allah, wa ash-hadu anna Muhammadan rasul Allah" — I bear witness that there is nothing worthy of worship except God, and I bear witness that Muhammad is the Messenger of God.',
              'The first half affirms Tawhid: God is utterly unique, compassionate, near to every caller, and free from any partner or limitation. The second half affirms that Muhammad (peace be upon him) faithfully conveyed God’s guidance and modeled how to live with integrity and mercy.',
              'When someone chooses to take the Shahadah, it marks a new beginning rooted in sincerity, not perfection.',
            ],
            reflectionPrompt: 'In your own words, how would you summarize the two halves of the Shahadah?',
            keyTerm: {
              term: 'Tawhid',
              arabic: 'التوحيد',
              meaning: 'Affirming the absolute oneness and uniqueness of God.',
            },
          },
          {
            id: 'found-3',
            title: 'The Six Articles of Faith',
            durationMinutes: 20,
            summary: 'Belief in God, angels, revealed books, messengers, the Hereafter, and divine wisdom.',
            content: [
              'Islamic belief rests on six interconnected pillars of conviction (Iman): belief in God, His angels, His revealed scriptures, His prophets and messengers, the Day of Accountability, and Qadar (God’s overarching wisdom and measure).',
              'Muslims honor earlier prophets including Adam, Noah, Abraham, Moses, and Jesus (peace be upon them all) as part of one continuous call to worship God alone and uphold justice.',
              'Understanding these articles helps newcomers see how Islamic theology bridges reverence, moral responsibility, and hope.',
            ],
            reflectionPrompt: 'Which of the six articles of faith feels most intuitive to you, and which would you like to read more about?',
            keyTerm: {
              term: 'Iman',
              arabic: 'الإيمان',
              meaning: 'Deep conviction and trust in the heart that expresses itself in goodness.',
            },
          },
          {
            id: 'found-4',
            title: 'The Five Pillars in Everyday Perspective',
            durationMinutes: 16,
            summary: 'How testimony, prayer, charity, fasting, and pilgrimage shape a balanced life.',
            content: [
              'While Iman describes inward conviction, the Five Pillars describe the outward rhythms that sustain a Muslim’s life: the Shahadah, the five daily prayers (Salah), annual purifying charity (Zakah), fasting during Ramadan (Sawm), and pilgrimage (Hajj) once in a lifetime if able.',
              'Notice how each pillar balances personal devotion with social care—prayer anchors the day, while Zakah and fasting cultivate empathy for those in need.',
            ],
            reflectionPrompt: 'How do you imagine daily or seasonal spiritual rhythms supporting your current routine?',
            keyTerm: {
              term: 'Ibadah',
              arabic: 'العبادة',
              meaning: 'Worship and loving devotion, encompassing both formal prayer and everyday kindness.',
            },
          },
          {
            id: 'found-5',
            title: 'Walking at Your Own Pace',
            durationMinutes: 12,
            summary: 'Building sustainable habits and avoiding overwhelm as a new Muslim or seeker.',
            content: [
              'The Prophet Muhammad (peace be upon him) taught that the most beloved deeds to God are those performed consistently, even if small.',
              'Take time to build one habit at a time—whether learning the opening chapter of the Qur’an, establishing one or two daily prayers while you memorize the movements, or meeting a trusted mentor once every two weeks.',
            ],
            reflectionPrompt: 'What is one small, realistic learning step you would like to focus on this week?',
          },
        ],
      },
      {
        id: 'understanding-salah',
        title: 'Beginning Your Daily Prayer (Salah)',
        description:
          'A calm, step-by-step guide to purification (Wudu), prayer times, postures, and cultivating focus.',
        category: 'Worship',
        level: 'Beginner',
        language: 'English',
        thumbnail: HERO_IMG_SALAH,
        instructorId: 'teacher-1',
        instructorName: 'Dr. Yusuf Haddad',
        relatedResourceIds: ['res-prayer-guide'],
        published: true,
        lessons: [
          {
            id: 'salah-1',
            title: 'Preparing for Prayer: Intention & Wudu',
            durationMinutes: 15,
            summary: 'How ablution refreshes both body and attention before standing in prayer.',
            content: [
              'Before praying, Muslims perform Wudu—a calm, mindful washing of hands, mouth, nose, face, arms, head, and feet with clean water.',
              'Wudu serves as a quiet threshold between busy daily tasks and standing before God. It begins simply with a quiet intention (niyyah) in the heart and saying Bismillah (In the name of God).',
            ],
            reflectionPrompt: 'What helps you transition mentally from work or study into a quiet moment of reflection?',
            keyTerm: {
              term: 'Wudu',
              arabic: 'الوضوء',
              meaning: 'Mindful ritual washing with water prior to prayer.',
            },
          },
          {
            id: 'salah-2',
            title: 'The Rhythm of the Five Daily Prayers',
            durationMinutes: 14,
            summary: 'Fajr, Dhuhr, Asr, Maghrib, and Isha — anchored to natural daylight.',
            content: [
              'The five daily prayers follow the movement of the sun: dawn (Fajr), midday (Dhuhr), afternoon (Asr), sunset (Maghrib), and night (Isha).',
              'Rather than interrupting life, these brief 5-minute pauses restore perspective throughout the day.',
            ],
            reflectionPrompt: 'Which of the five prayer windows fits most naturally into your current schedule as a starting point?',
          },
          {
            id: 'salah-3',
            title: 'Standing, Bowing, and Prostrating',
            durationMinutes: 22,
            summary: 'Understanding the physical movements and short Arabic phrases of a unit (Rak’ah) of prayer.',
            content: [
              'Each unit of prayer (Rak’ah) combines standing with recitation of Al-Fatihah, bowing (Ruku’) with humility, standing upright again, and two prostrations (Sujud).',
              'Beginners may keep a small printed card beside their prayer mat while memorizing the short Arabic phrases, knowing that sincerity is always recognized.',
            ],
            reflectionPrompt: 'Note any Arabic phrase from the prayer that you would like to practice pronouncing.',
            keyTerm: {
              term: 'Sujud',
              arabic: 'السجود',
              meaning: 'Prostration with the forehead on the ground, symbolizing closeness and humility before God.',
            },
          },
          {
            id: 'salah-4',
            title: 'Presence of Heart (Khushu’)',
            durationMinutes: 12,
            summary: 'Practical ways to stay gentle with yourself when your mind wanders during prayer.',
            content: [
              'Focus in prayer grows with practice. Learning the English meaning of the brief phrases you recite transforms repetition into a living conversation.',
            ],
            reflectionPrompt: 'Which translated phrase from Al-Fatihah resonates most strongly with you?',
          },
        ],
      },
      {
        id: 'quran-first-steps',
        title: "Approaching the Qur'an with Clarity",
        description:
          'Learn how the Qur’an is structured, explore Surah Al-Fatihah, and develop a reflective reading habit.',
        category: "Qur'an",
        level: 'Beginner',
        language: 'English',
        thumbnail: HERO_IMG_QURAN,
        instructorId: 'teacher-1',
        instructorName: 'Dr. Yusuf Haddad',
        relatedResourceIds: ['res-quran-reading'],
        published: true,
        lessons: [
          {
            id: 'quran-1',
            title: 'How the Qur’an Is Structured',
            durationMinutes: 15,
            summary: 'Surahs, Ayat, Makki and Madani chapters, and choosing a clear translation.',
            content: [
              'The Qur’an consists of 114 chapters called Surahs, composed of verses called Ayat (literally "signs"). Unlike a chronological biography, chapters are arranged broadly by length and thematic resonance.',
              'Start with a clear, modern translation alongside audio recitation so you experience both meaning and cadence.',
            ],
            reflectionPrompt: 'Have you read any chapters or translations of the Qur’an yet? What stood out to you?',
            keyTerm: {
              term: 'Ayah',
              arabic: 'آية',
              meaning: 'A verse of the Qur’an — literally meaning a "sign" pointing toward wisdom.',
            },
          },
          {
            id: 'quran-2',
            title: 'Surah Al-Fatihah: The Opening Prayer',
            durationMinutes: 18,
            summary: 'Exploring the seven verses recited in every daily prayer.',
            content: [
              'Al-Fatihah ("The Opening") begins by praising God as Lord of all worlds, Most Compassionate, Most Merciful, and asks for guidance along the straight path.',
              'Its balanced structure moves from gratitude and awe to a personal request for steadiness every single day.',
            ],
            reflectionPrompt: 'What does "the straight path" mean to you in daily ethical life?',
          },
          {
            id: 'quran-3',
            title: 'Themes of Mercy, Justice, and Reflection',
            durationMinutes: 16,
            summary: 'Reading with context rather than isolated verses.',
            content: [
              'Every chapter except one opens with Bismillah al-Rahman al-Rahim — invoking God’s expansive compassion and continuous mercy.',
              'Reading verses within their historical and textual context prevents misunderstanding and reveals the Qur’an’s moral coherence.',
            ],
            reflectionPrompt: 'Write down one verse you recently read that invited deeper thought.',
          },
          {
            id: 'quran-4',
            title: 'Establishing a Gentle Daily Reading Rhythm',
            durationMinutes: 12,
            summary: 'Ten minutes of thoughtful reading paired with journaling.',
            content: [
              'Ten unhurried minutes reading five to ten verses with reflection is far more rewarding than rushing through pages.',
            ],
            reflectionPrompt: 'What time of day works best for ten quiet minutes of reading?',
          },
        ],
      },
      {
        id: 'everyday-muslim-life',
        title: 'Everyday Muslim Life & Character',
        description:
          'Guidance on ethics (Adab), hospitality, family dialogue, and navigating work or study as a new Muslim.',
        category: 'Tarbiyah',
        level: 'Beginner',
        language: 'English',
        thumbnail: HERO_IMG_COURTYARD,
        instructorId: 'teacher-1',
        instructorName: 'Dr. Yusuf Haddad',
        relatedResourceIds: ['res-character', 'res-community'],
        published: true,
        lessons: [
          {
            id: 'life-1',
            title: 'Adab: Courtesy, Warmth, and Integrity',
            durationMinutes: 14,
            summary: 'How inner faith translates into speech, truthfulness, and care for neighbors.',
            content: [
              'In Islamic tradition, good character (husn al-khuluq) is inseparable from worship. Kindness to parents, honesty in work, and gentle speech are active expressions of faith.',
            ],
            reflectionPrompt: 'Which aspect of personal character feels most central to your values right now?',
            keyTerm: {
              term: 'Adab',
              arabic: 'أدب',
              meaning: 'Refined courtesy, respect, and thoughtful conduct toward God and people.',
            },
          },
          {
            id: 'life-2',
            title: 'Sharing Your Journey with Family & Friends',
            durationMinutes: 16,
            summary: 'Practical advice for calm, loving conversations with non-Muslim loved ones.',
            content: [
              'Becoming Muslim never means abandoning kindness toward your family. Clear reassurance, patience, and visible warmth often speak louder than lengthy debates.',
            ],
            reflectionPrompt: 'How might you describe your learning journey calmly to a close friend or family member?',
          },
          {
            id: 'life-3',
            title: 'Halal Essentials in Daily Routine',
            durationMinutes: 15,
            summary: 'A balanced, stress-free overview of food, wellness, and social gatherings.',
            content: [
              'Islamic dietary guidance focuses on wholesome nourishment (tayyib) and avoiding pork and intoxicants—while keeping social meals joyful and welcoming.',
            ],
            reflectionPrompt: 'Are there any practical everyday questions about food or social settings you want to explore?',
          },
          {
            id: 'life-4',
            title: 'Finding Healthy Community',
            durationMinutes: 12,
            summary: 'Connecting with trustworthy local circles and mentors.',
            content: [
              'Look for communities characterized by warmth, humility, transparency, and respect for newcomers.',
            ],
            reflectionPrompt: 'What qualities matter most to you in a learning community?',
          },
        ],
      },
      {
        id: 'grundlagen-des-islams',
        title: 'Grundlagen des Islams (Einführung)',
        description:
          'Ein ruhiger Einstieg in den Glauben, das tägliche Gebet und den Zugang zum Koran auf Deutsch.',
        category: 'Foundations',
        level: 'Beginner',
        language: 'Deutsch',
        thumbnail: HERO_IMG_FOUNDATIONS,
        instructorId: 'teacher-1',
        instructorName: 'Dr. Yusuf Haddad',
        relatedResourceIds: ['res-terminology'],
        published: true,
        lessons: [
          {
            id: 'de-1',
            title: 'Was bedeutet Islam?',
            durationMinutes: 15,
            summary: 'Bedeutung des Wortes Islam, innerer Frieden und Vertrauen in Gott.',
            content: [
              'Das Wort Islam stammt von derselben Sprachwurzel wie Salam (Frieden) und bedeutet die bewusste Hingabe an den einen Gott.',
              'Niemand muss alles sofort beherrschen – Lernen geschieht Schritt für Schritt in Ruhe und Klarheit.',
            ],
            reflectionPrompt: 'Welche Frage hat Ihr Interesse am Islam besonders geweckt?',
          },
          {
            id: 'de-2',
            title: 'Die Schahada verstehen',
            durationMinutes: 16,
            summary: 'Das Glaubensbekenntnis in seiner klaren Bedeutung.',
            content: [
              'Die Schahada bezeugt die Einzigkeit Gottes (Tauhid) und die Sendung des Propheten Muhammad (Friede sei mit ihm).',
            ],
            reflectionPrompt: 'Was bedeutet für Sie Vertrauen im Alltag?',
          },
          {
            id: 'de-3',
            title: 'Erste Schritte im täglichen Gebet',
            durationMinutes: 18,
            summary: 'Die fünf Gebetszeiten und der ruhige Ablauf des Gebets.',
            content: [
              'Das Gebet (Salah) strukturiert den Tag mit fünf kurzen Momenten der Besinnung und Dankbarkeit.',
            ],
            reflectionPrompt: 'Welche Tageszeit eignet sich für Sie am besten für einen ruhigen Lernmoment?',
          },
        ],
      },
      {
        id: 'fondements-de-lislam',
        title: "Les Fondements de l'Islam",
        description:
          'Une introduction claire et sereine à la foi, à la prière quotidienne et à la lecture du Coran.',
        category: 'Foundations',
        level: 'Beginner',
        language: 'Français',
        thumbnail: HERO_IMG_QURAN,
        instructorId: 'teacher-1',
        instructorName: 'Dr. Yusuf Haddad',
        relatedResourceIds: ['res-terminology'],
        published: true,
        lessons: [
          {
            id: 'fr-1',
            title: "Comprendre le sens de l'Islam",
            durationMinutes: 14,
            summary: 'Paix intérieure, unicité de Dieu et démarche sincère de connaissance.',
            content: [
              "Le mot Islam partage sa racine avec Salam (la paix). L'apprentissage se fait à votre rythme, dans la sérénité et la clarté.",
            ],
            reflectionPrompt: "Qu'est-ce qui vous motive le plus dans votre parcours de découverte ?",
          },
          {
            id: 'fr-2',
            title: 'La Shahada et les piliers de la foi',
            durationMinutes: 17,
            summary: 'Le témoignage de foi et la confiance en Dieu.',
            content: [
              "La Shahada exprime l'unicité de Dieu et la reconnaissance du message prophétique.",
            ],
            reflectionPrompt: 'Notez une question que vous aimeriez approfondir avec un mentor.',
          },
          {
            id: 'fr-3',
            title: 'Découvrir la prière (Salah)',
            durationMinutes: 19,
            summary: 'Les ablutions et les cinq moments de recueillement quotidien.',
            content: [
              'La prière offre cinq pauses quotidiennes pour apaiser le cœur et recentrer son intention.',
            ],
            reflectionPrompt: 'Quel moment de la journée vous semble le plus propice au calme ?',
          },
        ],
      },
    ],
    enrollments: [
      {
        id: 'enr-1',
        userId: 'learner-1',
        courseId: 'foundations-of-islam',
        completedLessonIds: ['found-1', 'found-2'],
        lastLessonId: 'found-3',
        enrolledAt: '2026-10-02T09:30:00Z',
        updatedAt: '2026-11-12T18:10:00Z',
      },
      {
        id: 'enr-2',
        userId: 'learner-1',
        courseId: 'understanding-salah',
        completedLessonIds: ['salah-1'],
        lastLessonId: 'salah-2',
        enrolledAt: '2026-10-20T14:00:00Z',
        updatedAt: '2026-11-14T08:45:00Z',
      },
    ],
    submissions: [
      {
        id: 'sub-1',
        courseId: 'foundations-of-islam',
        lessonId: 'found-1',
        userId: 'learner-1',
        userName: 'Amina Lindqvist',
        responseText:
          'I appreciated learning that Islam connects directly with peace and gradual growth rather than rushing.',
        teacherFeedback:
          'Warm reflection, Amina. Keep taking your time with each lesson and note any terms you want to discuss in our Q&A.',
        status: 'reviewed',
        submittedAt: '2026-11-01T15:20:00Z',
      },
      {
        id: 'sub-2',
        courseId: 'understanding-salah',
        lessonId: 'salah-1',
        userId: 'learner-1',
        userName: 'Amina Lindqvist',
        responseText:
          'Performing Wudu slowly helped me pause after work before practicing the opening recitation.',
        status: 'submitted',
        submittedAt: '2026-11-14T09:10:00Z',
      },
    ],
    mentors: [
      {
        id: 'm-1',
        userId: 'mentor-1',
        name: 'Tariq Al-Mansoor',
        city: 'Berlin',
        country: 'Germany',
        languages: ['English', 'Deutsch', 'العربية'],
        specialties: ['New Muslim Foundations', 'Daily Prayer Habits', 'Family Dialogue'],
        bio: 'Community mentor with 7 years of experience welcoming seekers and new Muslims across Northern and Central Europe.',
        availabilityStatus: 'Available',
        weeklyHours: 'Tue & Thu · 18:00–20:30 CET',
        isDemo: true,
      },
      {
        id: 'm-2',
        userId: 'mentor-2',
        name: 'Salma El-Khoury',
        city: 'Lyon',
        country: 'France',
        languages: ['Français', 'English', 'العربية'],
        specialties: ['Women New Muslim Circles', "Qur'an Reading Support", 'Everyday Ethics'],
        bio: 'Bilingual educator offering gentle one-to-one orientation for French and English speaking learners.',
        availabilityStatus: 'Available',
        weeklyHours: 'Wed & Sat · 16:00–19:00 CET',
        isDemo: true,
      },
      {
        id: 'm-3',
        userId: 'mentor-3',
        name: 'Ibrahim Lindholm',
        city: 'Stockholm',
        country: 'Sweden',
        languages: ['English', 'Svenska'],
        specialties: ['Nordic Community Connections', 'Ramadan Preparation', 'Workplace Practice'],
        bio: 'Embraced Islam 12 years ago and mentors newcomers navigating practical Nordic daily life.',
        availabilityStatus: 'Limited',
        weeklyHours: 'Sun · 14:00–17:00 CET',
        isDemo: true,
      },
    ],
    mentorRequests: [
      {
        id: 'req-1',
        learnerId: 'learner-1',
        learnerName: 'Amina Lindqvist',
        learnerEmail: 'amina@demo.noorpath.org',
        mentorId: 'm-1',
        mentorName: 'Tariq Al-Mansoor',
        preferredLanguage: 'English',
        topic: 'Beginning Daily Prayer & Routine',
        message: 'I would appreciate guidance on memorizing the short movements of Fajr and Maghrib without feeling rushed.',
        status: 'accepted',
        createdAt: '2026-11-05T11:00:00Z',
      },
      {
        id: 'req-2',
        learnerId: 'learner-demo-2',
        learnerName: 'Lukas Weber',
        learnerEmail: 'lukas.demo@example.org',
        mentorId: 'm-1',
        mentorName: 'Tariq Al-Mansoor',
        preferredLanguage: 'Deutsch',
        topic: 'Family Conversations & Foundations',
        message: 'Ich möchte bald mit meinen Eltern ruhig über meinen Lernweg sprechen und suche Tipps.',
        status: 'pending',
        createdAt: '2026-11-15T16:40:00Z',
      },
    ],
    mentorSessions: [
      {
        id: 'sess-1',
        mentorId: 'm-1',
        learnerId: 'learner-1',
        learnerName: 'Amina Lindqvist',
        title: 'Gentle Check-in: Salah & Al-Fatihah',
        scheduledAt: '2026-11-21T18:30:00Z',
        format: 'Video Call',
        status: 'scheduled',
        notes: 'Review Al-Fatihah pronunciation and answer questions about prayer timings during Nordic winter.',
      },
      {
        id: 'sess-2',
        mentorId: 'm-1',
        learnerId: 'learner-1',
        learnerName: 'Amina Lindqvist',
        title: 'Initial Orientation Conversation',
        scheduledAt: '2026-11-08T18:00:00Z',
        format: 'Video Call',
        status: 'completed',
        notes: 'Discussed course pace and shared beginner terminology guide.',
      },
    ],
    reviews: [
      {
        id: 'rev-1',
        title: 'Lesson 3: Understanding Qadar with Balance',
        contentType: 'Course Lesson',
        authorName: 'Dr. Yusuf Haddad',
        language: 'English',
        excerpt:
          'Explains divine wisdom (Qadar) alongside human moral choice using accessible language for first-time learners.',
        references: ["Qur'an 54:49", "Qur'an 18:29", 'Sahih Muslim, Book of Faith (Hadith 8)'],
        status: 'awaiting_review',
        submittedAt: '2026-11-13T10:15:00Z',
      },
      {
        id: 'rev-2',
        title: 'Guide: Practical Fasting Accommodations for Work & Study',
        contentType: 'Resource Guide',
        authorName: 'Tariq Al-Mansoor',
        language: 'Deutsch / English',
        excerpt:
          'Summarizes hydration tips, travel concessions, and calm communication with university or workplace coordinators.',
        references: ["Qur'an 2:185", 'Sahih al-Bukhari, Book of Fasting'],
        status: 'awaiting_review',
        submittedAt: '2026-11-14T14:30:00Z',
      },
      {
        id: 'rev-3',
        title: 'Glossary Entry: Rahmah (Mercy) & Adab (Courtesy)',
        contentType: 'Glossary Entry',
        authorName: 'Salma El-Khoury',
        language: 'Français',
        excerpt:
          'Defines Rahmah and Adab with linguistic roots and gentle everyday examples for French-speaking beginners.',
        references: ["Qur'an 7:156", 'Al-Adab al-Mufrad (Introduction)'],
        status: 'approved',
        reviewerComment: 'Clear linguistic framing and well-verified references. Approved for publication.',
        submittedAt: '2026-11-04T09:00:00Z',
        reviewedAt: '2026-11-07T16:20:00Z',
      },
    ],
    resources: [
      {
        id: 'res-prayer-guide',
        title: 'Step-by-Step Guide to Daily Prayer (Salah)',
        topic: 'Prayer',
        language: 'English',
        readTime: '7 min read',
        arabicTerm: 'الصلاة',
        summary: 'A printable overview of Wudu, prayer times, postures, and English meanings of the short recitations.',
        body: [
          'Salah is performed five times daily facing the direction of the Kaaba (Qiblah). Each prayer takes roughly five minutes and centers the mind in gratitude and remembrance.',
          'When starting out, focus first on learning the movements and Surah Al-Fatihah. Keep a reference sheet nearby without worry—consistency matters far more than speed.',
        ],
        isDemo: true,
      },
      {
        id: 'res-quran-reading',
        title: "Beginner's Companion to Reading the Qur'an",
        topic: "Qur'an",
        language: 'English',
        readTime: '6 min read',
        arabicTerm: 'القرآن',
        summary: 'How to choose an English, French, or German translation and pair reading with calm audio.',
        body: [
          'Begin with Surah Al-Fatihah and the shorter chapters at the end of the Qur’an (Juz Amma), which focus on awe, compassion, accountability, and hope.',
        ],
        isDemo: true,
      },
      {
        id: 'res-ramadan',
        title: 'Preparing for Your First Ramadan',
        topic: 'Ramadan',
        language: 'English',
        readTime: '8 min read',
        arabicTerm: 'رمضان',
        summary: 'Suhoor, Iftar, mindful fasting, health exemptions, and community evenings explained warmly.',
        body: [
          'Ramadan is the ninth lunar month, commemorating the revelation of the Qur’an. Fasting from dawn to sunset builds empathy, self-restraint, and gratitude.',
          'Those who are ill, traveling, pregnant, or nursing have clear Quranic exemptions—Islam prioritizes wellbeing alongside devotion.',
        ],
        isDemo: true,
      },
      {
        id: 'res-terminology',
        title: 'Essential Islamic Terminology Without Jargon',
        topic: 'Terminology',
        language: 'English / Multilingual',
        readTime: '5 min read',
        arabicTerm: 'مصطلحات',
        summary: 'Plain-language definitions of Bismillah, Insha’Allah, Alhamdulillah, Wudu, Sunnah, and Ummah.',
        body: [
          'Assalamu alaikum: "Peace be upon you" — the everyday Muslim greeting.',
          'Alhamdulillah: "All praise and gratitude belong to God."',
          'Insha’Allah: "If God wills" — spoken with hope when planning ahead.',
        ],
        isDemo: true,
      },
      {
        id: 'res-character',
        title: 'Cultivating Patience, Honesty & Gentleness',
        topic: 'Character',
        language: 'English',
        readTime: '6 min read',
        arabicTerm: 'الأخلاق',
        summary: 'Prophetic guidance on integrity at work, care for neighbors, and calm family dialogue.',
        body: [
          'Good character weighs heaviest on the spiritual scale. Small acts—smiling, listening attentively, keeping promises—are cherished forms of devotion.',
        ],
        isDemo: true,
      },
      {
        id: 'res-shahadah',
        title: 'Understanding the Shahadah & Your Next Steps',
        topic: 'Community',
        language: 'English',
        readTime: '5 min read',
        arabicTerm: 'الشهادة',
        summary: 'What embracing Islam involves, why witnesses are optional, and what to learn in month one.',
        body: [
          'Faith begins privately between a person and God. Pronouncing the Shahadah with sincere belief makes one a Muslim immediately, and community support is always there when you are ready.',
        ],
        isDemo: true,
      },
    ],
    directory: [
      {
        id: 'dir-1',
        name: 'Al-Noor Nordic Learning Circle (Demonstration Entry)',
        city: 'Stockholm',
        country: 'Sweden',
        languages: ['English', 'Svenska', 'العربية'],
        resourceType: 'New Muslim Support',
        verifiedStatus: 'Verified Demo',
        lastChecked: '2026-10-28',
        contactEmail: 'stockholm-demo@noorpath.example',
        websiteNote: 'Demonstration listing — sample European community hub',
        description: 'Weekly beginner study circles, translated introductory books, and welcoming coffee hours for new Muslims.',
        coordinates: { lat: 59.3293, lng: 18.0686 },
        isDemo: true,
      },
      {
        id: 'dir-2',
        name: 'Mitte Dialogue & Study Centre (Demonstration Entry)',
        city: 'Berlin',
        country: 'Germany',
        languages: ['Deutsch', 'English', 'العربية'],
        resourceType: 'Community Centre',
        verifiedStatus: 'Verified Demo',
        lastChecked: '2026-11-03',
        contactEmail: 'berlin-demo@noorpath.example',
        websiteNote: 'Demonstration listing — sample European community hub',
        description: 'Bilingual German-English orientation sessions, open library hours, and mentorship introductions.',
        coordinates: { lat: 52.52, lng: 13.405 },
        isDemo: true,
      },
      {
        id: 'dir-3',
        name: 'Maison de la Sagesse Lyon (Demonstration Entry)',
        city: 'Lyon',
        country: 'France',
        languages: ['Français', 'العربية'],
        resourceType: 'Cultural Hub',
        verifiedStatus: 'Verified Demo',
        lastChecked: '2026-10-19',
        contactEmail: 'lyon-demo@noorpath.example',
        websiteNote: 'Demonstration listing — sample European community hub',
        description: 'French-language beginner workshops, Qur’anic reflection afternoons, and community hospitality.',
        coordinates: { lat: 45.764, lng: 4.8357 },
        isDemo: true,
      },
      {
        id: 'dir-4',
        name: 'Thames Valley New Muslim Fellowship (Demonstration Entry)',
        city: 'London',
        country: 'United Kingdom',
        languages: ['English'],
        resourceType: 'New Muslim Support',
        verifiedStatus: 'Verified Demo',
        lastChecked: '2026-11-08',
        contactEmail: 'london-demo@noorpath.example',
        websiteNote: 'Demonstration listing — sample European community hub',
        description: 'Structured 8-week foundations classes, prayer workshops, and peer support gatherings.',
        coordinates: { lat: 51.5072, lng: -0.1276 },
        isDemo: true,
      },
      {
        id: 'dir-5',
        name: 'Donau Learning Oasis (Demonstration Entry)',
        city: 'Vienna',
        country: 'Austria',
        languages: ['Deutsch', 'English'],
        resourceType: 'Study Circle',
        verifiedStatus: 'Verified Demo',
        lastChecked: '2026-10-12',
        contactEmail: 'vienna-demo@noorpath.example',
        websiteNote: 'Demonstration listing — sample European community hub',
        description: 'Small-group German study circles covering foundational theology and everyday practice.',
        coordinates: { lat: 48.2082, lng: 16.3738 },
        isDemo: true,
      },
      {
        id: 'dir-6',
        name: 'Amstel Open Mosque & Library (Demonstration Entry)',
        city: 'Amsterdam',
        country: 'Netherlands',
        languages: ['English', 'Nederlands', 'العربية'],
        resourceType: 'Community Centre',
        verifiedStatus: 'Pending Verification',
        lastChecked: '2026-09-29',
        contactEmail: 'amsterdam-demo@noorpath.example',
        websiteNote: 'Demonstration listing — verification pending',
        description: 'Open-door mosque tours, bilingual welcome guides, and community dinners.',
        coordinates: { lat: 52.3676, lng: 4.9041 },
        isDemo: true,
      },
    ],
    events: [
      {
        id: 'evt-1',
        title: 'Foundations Q&A: Understanding Tawhid & Prayer',
        category: 'Live Class',
        hostName: 'Dr. Yusuf Haddad',
        dateISO: '2026-11-24',
        timeDisplay: '18:30 CET · 60 min',
        language: 'English',
        format: 'Online',
        cityCountry: 'Global Online',
        capacity: 60,
        registeredUserIds: ['learner-1'],
        description: 'An open, judgment-free live session answering foundational questions about prayer and belief.',
      },
      {
        id: 'evt-2',
        title: 'New Muslim Welcome Circle (Europe)',
        category: 'New Muslim Circle',
        hostName: 'Tariq Al-Mansoor',
        dateISO: '2026-11-27',
        timeDisplay: '19:00 CET · 75 min',
        language: 'English / Deutsch',
        format: 'Hybrid',
        cityCountry: 'Berlin & Online',
        capacity: 30,
        registeredUserIds: [],
        description: 'Connect with fellow learners and mentors in a relaxed tea-and-conversation format.',
      },
      {
        id: 'evt-3',
        title: "Atelier : Lire Al-Fatihah avec sérénité",
        category: 'Workshop',
        hostName: 'Salma El-Khoury',
        dateISO: '2026-11-30',
        timeDisplay: '17:30 CET · 50 min',
        language: 'Français',
        format: 'Online',
        cityCountry: 'Lyon & Online',
        capacity: 40,
        registeredUserIds: [],
        description: 'Prononciation douce et sens spirituel de la première sourate du Coran.',
      },
      {
        id: 'evt-4',
        title: 'Navigating Family Conversations with Warmth',
        category: 'Q&A Session',
        hostName: 'Ibrahim Lindholm',
        dateISO: '2026-12-03',
        timeDisplay: '18:00 CET · 60 min',
        language: 'English',
        format: 'Online',
        cityCountry: 'Stockholm & Online',
        capacity: 50,
        registeredUserIds: [],
        description: 'Practical insights on sharing your faith journey thoughtfully with family and friends.',
      },
    ],
    goals: [
      {
        id: 'goal-1',
        userId: 'learner-1',
        title: 'Complete Lesson 3 of Foundations of Islamic Belief',
        completed: false,
        createdAt: '2026-11-10T09:00:00Z',
      },
      {
        id: 'goal-2',
        userId: 'learner-1',
        title: 'Practice Wudu and memorize the meaning of Al-Fatihah',
        completed: true,
        createdAt: '2026-11-04T11:30:00Z',
      },
      {
        id: 'goal-3',
        userId: 'learner-1',
        title: 'Prepare two questions for Tariq before Saturday check-in',
        completed: false,
        createdAt: '2026-11-14T15:00:00Z',
      },
    ],
    notifications: [
      {
        id: 'notif-1',
        userId: 'learner-1',
        title: 'Mentor check-in confirmed',
        body: 'Tariq Al-Mansoor confirmed your upcoming video guidance session on Nov 21 at 18:30 CET.',
        read: false,
        createdAt: '2026-11-15T12:00:00Z',
      },
      {
        id: 'notif-2',
        userId: 'learner-1',
        title: 'Teacher feedback received',
        body: 'Dr. Yusuf Haddad responded to your reflection on Discovering Islam.',
        read: false,
        createdAt: '2026-11-12T17:15:00Z',
      },
    ],
    activities: [
      {
        id: 'act-1',
        userId: 'learner-1',
        action: 'Completed lesson',
        detail: 'Preparing for Prayer: Intention & Wudu',
        createdAt: '2026-11-14T08:45:00Z',
      },
      {
        id: 'act-2',
        userId: 'learner-1',
        action: 'Submitted reflection',
        detail: 'Understanding the Shahadah',
        createdAt: '2026-11-12T18:10:00Z',
      },
      {
        id: 'act-3',
        userId: 'learner-1',
        action: 'Registered for class',
        detail: 'Foundations Q&A: Understanding Tawhid & Prayer',
        createdAt: '2026-11-09T14:20:00Z',
      },
    ],
    reports: [
      {
        id: 'rep-1',
        targetType: 'Listing',
        targetTitle: 'Amstel Open Mosque & Library (Demonstration Entry)',
        reason: 'Routine 90-day verification check for contact email and opening hours.',
        reportedBy: 'Nadia Benali',
        status: 'open',
        createdAt: '2026-11-10T09:00:00Z',
      },
    ],
    settings: {
      platformName: "NoorPath — Global Da'wah & New Muslim Support",
      supportEmail: 'guidance@demo.noorpath.org',
      mentorshipBoundaryNotice:
        'Mentors provide warm peer orientation, study encouragement, and community connection. Mentors do not issue formal religious rulings (fatwas), legal advice, or clinical counseling.',
      aiDisclaimer:
        'NoorPath Learning Assistant is an educational AI study companion designed to explain foundational concepts clearly. It is not a mufti or religious authority. For personal religious rulings, please consult a qualified scholar or mentor.',
      enableNewRegistrations: true,
      requireScholarReviewBeforePublish: true,
    },
  };
}

let cachedState: DatabaseState | null = null;

export function loadDb(): DatabaseState {
  if (cachedState) {
    return cachedState;
  }
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      cachedState = JSON.parse(raw) as DatabaseState;
      return cachedState;
    }
    if (DATA_FILE !== BUNDLED_DATA_FILE && fs.existsSync(BUNDLED_DATA_FILE)) {
      const raw = fs.readFileSync(BUNDLED_DATA_FILE, 'utf-8');
      cachedState = JSON.parse(raw) as DatabaseState;
      saveDb(cachedState);
      return cachedState;
    }
  } catch (err) {
    console.warn('Could not read persisted store, initializing fresh state:', err);
  }
  cachedState = createInitialState();
  saveDb(cachedState);
  return cachedState;
}

export function saveDb(state: DatabaseState): void {
  cachedState = state;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database state:', err);
  }
}

export function sanitizeUser(user: StoredUser): UserAccount {
  const { passwordHash: _removed, ...safe } = user;
  return safe;
}

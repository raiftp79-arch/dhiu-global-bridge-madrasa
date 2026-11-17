import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Globe,
  HeartHandshake,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sprout,
  Users,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import type { SupportedLang } from '../types';
import { Button, SafeImage } from '../components/ui/Primitives';

const PATHWAY_STEPS = [
  {
    num: '01',
    title: 'Discover Islam',
    summary: 'Explore core questions about meaning, God, and revelation in plain language.',
    route: '/explore',
    action: 'Read introduction',
  },
  {
    num: '02',
    title: 'Understand the Shahadah',
    summary: 'Learn the meaning behind the testimony of faith without pressure or rush.',
    route: '/learn/foundations-of-islam',
    action: 'Open Foundations module',
  },
  {
    num: '03',
    title: 'Learn foundational beliefs',
    summary: 'Study the Six Articles of Faith and how Muslims honor all prophets.',
    route: '/learn/foundations-of-islam',
    action: 'Explore beliefs',
  },
  {
    num: '04',
    title: 'Begin learning Salah',
    summary: 'Step-by-step guidance on Wudu, prayer times, postures, and focus.',
    route: '/learn/understanding-salah',
    action: 'Open Salah course',
  },
  {
    num: '05',
    title: "Explore the Qur'an",
    summary: 'Understand how chapters are structured and begin with Surah Al-Fatihah.',
    route: '/learn/quran-first-steps',
    action: "Start Qur'an course",
  },
  {
    num: '06',
    title: 'Understand everyday Muslim life',
    summary: 'Character, hospitality, family dialogue, and practical daily rhythms.',
    route: '/resources',
    action: 'Browse daily guides',
  },
  {
    num: '07',
    title: 'Connect with community',
    summary: 'Meet a verified mentor or discover welcoming local study circles.',
    route: '/community',
    action: 'View community directory',
  },
];

const AI_PREVIEWS = [
  {
    question: 'What does the word "Islam" mean, and why is peace central to it?',
    answer:
      'The Arabic word Islam comes from the root s-l-m, shared with Salam (peace) and wholehearted trust in God. In practice, it describes aligning one’s heart and daily actions with mercy, honesty, and gratitude toward the One Creator.',
  },
  {
    question: 'Do I need to memorize Arabic before I start learning to pray?',
    answer:
      'No. Beginners start gradually—learning the basic movements and Surah Al-Fatihah step by step. Many new Muslims keep a short printed card beside their prayer mat while learning at a comfortable pace.',
  },
  {
    question: 'How is the Qur’an organized for someone reading it for the first time?',
    answer:
      'The Qur’an has 114 chapters (Surahs) arranged broadly by length rather than chronological order. Many first-time readers begin with Surah Al-Fatihah and the shorter chapters near the end, paired with a clear translation.',
  },
];

export function HomePage() {
  const { t, navigate, setLang, lang, data } = usePlatform();
  const [activeStep, setActiveStep] = useState(0);
  const [activePreview, setActivePreview] = useState(0);

  const directoryPreview = (data?.directory ?? []).slice(0, 6);
  const resourceTopics = [
    {
      topic: 'Prayer',
      title: 'Daily Prayer (Salah)',
      desc: 'Wudu, prayer timings, postures, and English meanings.',
    },
    {
      topic: "Qur'an",
      title: "Qur'an Reflection",
      desc: 'How to read with context, translation, and quiet focus.',
    },
    {
      topic: 'Ramadan',
      title: 'Ramadan & Fasting',
      desc: 'Suhoor, Iftar, mindful fasting, and health exemptions.',
    },
    {
      topic: 'Terminology',
      title: 'Islamic Terminology',
      desc: 'Bismillah, Insha’Allah, Sunnah, and everyday expressions.',
    },
    {
      topic: 'Character',
      title: 'Character & Adab',
      desc: 'Integrity, kindness to parents, and neighborly warmth.',
    },
    {
      topic: 'Community',
      title: 'Community & Family',
      desc: 'Navigating conversations with loved ones and finding circles.',
    },
  ];

  const currentStep = PATHWAY_STEPS[activeStep];

  return (
    <div className="bg-[#FAF9F4]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-24">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Copy */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-6"
            >
              <p className="text-xs font-semibold tracking-[0.16em] text-[#164B3B]">
                {t.hero.eyebrow}
              </p>

              <h1 className="font-display text-[clamp(2.25rem,4.3vw,3.85rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#202B27] text-balance">
                {t.hero.heading}
              </h1>

              <p className="text-base sm:text-lg text-[#6D7972] leading-relaxed max-w-xl">
                {t.hero.subtext}
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Button size="lg" onClick={() => navigate('/learn')}>
                  <span>{t.hero.primaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/explore')}
                >
                  <span>{t.hero.secondaryCta}</span>
                </Button>
              </div>
            </motion.div>

            {/* Right Visual Composition */}
            <motion.div
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 relative"
            >
              <div className="relative rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-[#E8F0E8] via-[#E8F0E8]/70 to-[#A8BDA9]/30">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_24px_48px_-24px_rgba(16,56,47,0.28)]">
                  <SafeImage
                    src="/src/assets/images/hero_islamic_courtyard_1794896866932.jpg"
                    alt="Sunlit Islamic architectural courtyard with olive tree and quiet reading alcove"
                    fallbackTitle="Peaceful Sanctuary of Learning"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Subtle Floating Guidance Cards */}
                <div className="mt-4 sm:mt-0 sm:absolute sm:bottom-10 sm:left-10 bg-[#FFFFFF]/95 backdrop-blur-sm border border-[#202B27]/10 rounded-xl px-4 py-3 shadow-sm">
                  <p className="text-xs font-semibold text-[#164B3B]">
                    {t.hero.floatPace}
                  </p>
                  <p className="text-[11px] text-[#6D7972] mt-0.5">
                    Self-guided courses · English, العربية, Français, Deutsch
                  </p>
                </div>

                <div className="mt-2.5 sm:mt-0 sm:absolute sm:top-10 sm:right-10 bg-[#10382F]/95 text-[#FAF9F4] rounded-xl px-4 py-3 shadow-sm">
                  <p className="text-xs font-medium text-[#C5A46D]">
                    {t.hero.floatGuidance}
                  </p>
                  <p className="text-[11px] text-[#E8F0E8]/90 mt-0.5">
                    Human mentors &amp; educational AI companion
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* A. WELCOME SECTION */}
      <section className="py-16 lg:py-20 border-t border-[#202B27]/8 bg-[#FFFFFF]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#C5A46D] mb-3">
                WELCOME
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#202B27] text-balance">
                {t.sections.welcomeTitle}
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-5">
              <p className="text-base sm:text-lg text-[#6D7972] leading-relaxed">
                {t.sections.welcomeBody}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#202B27]/10">
                <div>
                  <h3 className="text-sm font-semibold text-[#202B27] mb-1">
                    Clear, plain language
                  </h3>
                  <p className="text-sm text-[#6D7972] leading-relaxed">
                    Every concept and Arabic term is explained gently without assuming prior background.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#202B27] mb-1">
                    Respectful &amp; scholarly
                  </h3>
                  <p className="text-sm text-[#6D7972] leading-relaxed">
                    Materials undergo transparent scholarly review with clear distinctions between study guidance and formal rulings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B. THREE CORE PILLARS */}
      <section className="py-16 lg:py-24 bg-[#FAF9F4]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#164B3B] mb-2.5">
              {t.sections.pillarsEyebrow}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#202B27] text-balance">
              {t.sections.pillarsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TA'LIM */}
            <article className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-8 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:border-[#164B3B]/35">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#E8F0E8] text-[#164B3B] flex items-center justify-center mb-6">
                  <BookOpen className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold tracking-[0.14em] text-[#C5A46D] mb-1.5">
                  TA&apos;LIM — LEARN
                </p>
                <h3 className="font-display text-xl font-bold text-[#202B27] mb-3">
                  Foundational Islamic Knowledge
                </h3>
                <p className="text-sm text-[#6D7972] leading-relaxed mb-6">
                  Structured beginner courses on Islamic beliefs, Qur&apos;an reflection, daily worship, and essential terminology at your own pace.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/learn')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#164B3B] hover:text-[#10382F] cursor-pointer"
              >
                <span>Browse courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </article>

            {/* TARBIYAH */}
            <article className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-8 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:border-[#164B3B]/35">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#E8F0E8] text-[#164B3B] flex items-center justify-center mb-6">
                  <Sprout className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold tracking-[0.14em] text-[#C5A46D] mb-1.5">
                  TARBIYAH — GROW
                </p>
                <h3 className="font-display text-xl font-bold text-[#202B27] mb-3">
                  Character, Confidence &amp; Reflection
                </h3>
                <p className="text-sm text-[#6D7972] leading-relaxed mb-6">
                  Thoughtful personal development grounded in prophetic manners (Adab), gentle habit building, and guided journaling.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/new-muslims')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#164B3B] hover:text-[#10382F] cursor-pointer"
              >
                <span>New Muslim roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </article>

            {/* DA'WAH */}
            <article className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-8 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:border-[#164B3B]/35">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#E8F0E8] text-[#164B3B] flex items-center justify-center mb-6">
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold tracking-[0.14em] text-[#C5A46D] mb-1.5">
                  DA&apos;WAH — CONNECT
                </p>
                <h3 className="font-display text-xl font-bold text-[#202B27] mb-3">
                  Community, Mentorship &amp; Belonging
                </h3>
                <p className="text-sm text-[#6D7972] leading-relaxed mb-6">
                  Positive human relationships, attentive mentors, live welcome circles, and verified local community connections.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/community')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#164B3B] hover:text-[#10382F] cursor-pointer"
              >
                <span>Explore community</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </article>
          </div>
        </div>
      </section>

      {/* C. LEARNING PATHWAY */}
      <section className="py-16 lg:py-24 bg-[#FFFFFF] border-y border-[#202B27]/8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#164B3B] mb-2.5">
                {t.sections.pathwayEyebrow}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#202B27] text-balance">
                {t.sections.pathwayTitle}
              </h2>
            </div>
            <p className="text-sm text-[#6D7972] max-w-sm">
              Select any stage below to preview what you will explore next.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PATHWAY_STEPS.map((step, index) => {
                const selected = index === activeStep;
                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className={`text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer ${
                      selected
                        ? 'bg-[#164B3B] text-[#FFFFFF] border-[#164B3B]'
                        : 'bg-[#FAF9F4] text-[#202B27] border-[#202B27]/10 hover:border-[#164B3B]/35'
                    }`}
                  >
                    <p
                      className={`text-xs font-mono tabular-nums mb-1 ${
                        selected ? 'text-[#C5A46D]' : 'text-[#6D7972]'
                      }`}
                    >
                      Stage {step.num}
                    </p>
                    <p className="text-sm font-semibold">{step.title}</p>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-[#E8F0E8]/55 border border-[#164B3B]/15 p-8 flex flex-col justify-between min-h-[260px]">
              <div>
                <p className="text-xs font-mono tabular-nums text-[#164B3B] mb-2">
                  Stage {currentStep.num} of 07
                </p>
                <h3 className="font-display text-2xl font-bold text-[#10382F] mb-3">
                  {currentStep.title}
                </h3>
                <p className="text-sm sm:text-base text-[#202B27]/85 leading-relaxed mb-6">
                  {currentStep.summary}
                </p>
              </div>
              <Button onClick={() => navigate(currentStep.route)}>
                <span>{currentStep.action}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* D. HUMAN MENTORSHIP */}
      <section className="py-16 lg:py-24 bg-[#FAF9F4]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#202B27]/10">
                <SafeImage
                  src="/src/assets/images/mentorship_guidance_warm_1794896864770.jpg"
                  alt="Mentor and learner having a warm conversation in a sunlit library over tea and notebooks"
                  fallbackTitle="Human Mentorship & Guidance"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#164B3B]">
                HUMAN MENTORSHIP
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#202B27] text-balance">
                {t.sections.mentorshipHeadline}
              </h2>
              <p className="text-base text-[#6D7972] leading-relaxed">
                Our vetted community mentors offer one-to-one orientation, study encouragement, and practical guidance in your preferred language. You can request a check-in at any point in your learning journey.
              </p>

              <div className="rounded-xl bg-[#FFFFFF] border border-[#202B27]/10 p-5 space-y-2">
                <p className="text-xs font-semibold text-[#164B3B] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Clear Program Boundaries</span>
                </p>
                <p className="text-xs sm:text-sm text-[#6D7972] leading-relaxed">
                  Mentors provide peer companionship, practical study orientation, and community referrals. They do not issue formal religious rulings (fatwas), legal advice, or clinical counseling.
                </p>
              </div>

              <div className="pt-2">
                <Button size="lg" onClick={() => navigate('/mentorship')}>
                  <HeartHandshake className="w-4 h-4" />
                  <span>{t.sections.mentorshipCta}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* E. AI LEARNING ASSISTANT PREVIEW */}
      <section className="py-16 lg:py-24 bg-[#10382F] text-[#FAF9F4]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-5">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#C5A46D]">
                EDUCATIONAL STUDY COMPANION
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#FFFFFF] text-balance">
                {t.sections.aiHeadline}
              </h2>
              <p className="text-sm sm:text-base text-[#E8F0E8]/85 leading-relaxed">
                Explore introductory questions anytime in English, Arabic, French, or German with clear, beginner-friendly explanations.
              </p>
              <p className="text-xs font-medium text-[#C5A46D] border border-[#C5A46D]/35 rounded-xl px-4 py-3 bg-[#164B3B]/45">
                {t.sections.aiNotice}
              </p>
              <div className="pt-2">
                <Button
                  variant="gold"
                  size="lg"
                  onClick={() => navigate('/assistant')}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.sections.aiCta}</span>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl bg-[#FAF9F4] text-[#202B27] p-6 sm:p-8 space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#6D7972]">
                  Sample Educational Questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {AI_PREVIEWS.map((item, idx) => (
                    <button
                      key={item.question}
                      type="button"
                      onClick={() => setActivePreview(idx)}
                      className={`text-left text-xs font-medium px-3.5 py-2 rounded-xl border transition-colors cursor-pointer ${
                        activePreview === idx
                          ? 'bg-[#164B3B] text-[#FFFFFF] border-[#164B3B]'
                          : 'bg-[#FFFFFF] text-[#202B27] border-[#202B27]/12 hover:border-[#164B3B]/40'
                      }`}
                    >
                      {item.question}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-[#FFFFFF] border border-[#202B27]/10 p-5 space-y-3">
                <p className="text-xs font-semibold text-[#164B3B]">
                  Educational Preview
                </p>
                <p className="text-sm sm:text-base text-[#202B27] leading-relaxed">
                  {AI_PREVIEWS[activePreview].answer}
                </p>
                <div className="pt-3 border-t border-[#202B27]/8 flex items-center justify-between gap-4 text-xs text-[#6D7972]">
                  <span>Educational overview · Verify personal rulings with a qualified scholar</span>
                  <button
                    type="button"
                    onClick={() => navigate('/assistant')}
                    className="font-medium text-[#164B3B] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Ask your own question →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* F. EVERYDAY MUSLIM LIFE */}
      <section className="py-16 lg:py-24 bg-[#FAF9F4]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-[#164B3B] mb-2">
                PRACTICAL GUIDES
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#202B27]">
                {t.sections.everydayTitle}
              </h2>
            </div>
            <Button variant="outline" onClick={() => navigate('/resources')}>
              <span>All Resources</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resourceTopics.map((item) => (
              <button
                key={item.topic}
                type="button"
                onClick={() => navigate('/resources')}
                className="group text-left rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#164B3B]/35 cursor-pointer"
              >
                <p className="text-xs font-medium text-[#C5A46D] mb-2">{item.topic}</p>
                <h3 className="text-lg font-semibold text-[#202B27] mb-2 group-hover:text-[#164B3B] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-[#6D7972] leading-relaxed">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* G. COMMUNITY CONNECTIONS */}
      <section className="py-16 lg:py-24 bg-[#FFFFFF] border-y border-[#202B27]/8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#164B3B] mb-2">
                EUROPEAN COMMUNITY DIRECTORY
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#202B27]">
                {t.sections.communityTitle}
              </h2>
              <p className="text-sm text-[#6D7972] mt-2">
                Discover demonstration community hubs across European cities with language support and verification dates.
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/community')}>
              <Compass className="w-4 h-4" />
              <span>Open Directory</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {directoryPreview.map((listing) => (
              <article
                key={listing.id}
                onClick={() => navigate('/community')}
                className="rounded-2xl border border-[#202B27]/10 bg-[#FAF9F4] p-6 cursor-pointer transition-all duration-200 hover:border-[#164B3B]/35"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-[#6D7972] mb-2">
                  <span className="flex items-center gap-1.5 font-medium text-[#164B3B]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>
                      {listing.city}, {listing.country}
                    </span>
                  </span>
                  <span className="tabular-nums">{listing.verifiedStatus}</span>
                </div>
                <h3 className="text-base font-semibold text-[#202B27] mb-1.5">
                  {listing.name}
                </h3>
                <p className="text-xs text-[#6D7972] mb-3">
                  {listing.resourceType} · {listing.languages.join(', ')}
                </p>
                <p className="text-xs text-[#6D7972] tabular-nums">
                  Last checked {listing.lastChecked}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* H. MULTILINGUAL LEARNING */}
      <section className="py-16 lg:py-20 bg-[#FAF9F4]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-10">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#164B3B] mb-2">
              INTERNATIONAL ACCESSIBILITY
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#202B27]">
              {t.sections.languagesTitle}
            </h2>
            <p className="text-sm text-[#6D7972] mt-2">
              Select a language to switch the platform interface immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(
              [
                {
                  code: 'en' as SupportedLang,
                  name: 'English',
                  sub: 'Full foundations curriculum & mentorship',
                },
                {
                  code: 'ar' as SupportedLang,
                  name: 'العربية',
                  sub: 'واجهة عربية متكاملة ودعم للغة الأم',
                },
                {
                  code: 'fr' as SupportedLang,
                  name: 'Français',
                  sub: 'Cours introductifs et cercles francophones',
                },
                {
                  code: 'de' as SupportedLang,
                  name: 'Deutsch',
                  sub: 'Einstiegskurse und Begleitung auf Deutsch',
                },
              ] as const
            ).map((item) => {
              const active = lang === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLang(item.code)}
                  className={`text-left rounded-2xl p-6 border transition-all duration-150 cursor-pointer ${
                    active
                      ? 'bg-[#164B3B] text-[#FFFFFF] border-[#164B3B]'
                      : 'bg-[#FFFFFF] text-[#202B27] border-[#202B27]/10 hover:border-[#164B3B]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Globe
                      className={`w-5 h-5 ${active ? 'text-[#C5A46D]' : 'text-[#164B3B]'}`}
                    />
                    <span className="text-xs uppercase font-mono">
                      {item.code}
                    </span>
                  </div>
                  <p className="text-lg font-bold mb-1">{item.name}</p>
                  <p
                    className={`text-xs leading-relaxed ${
                      active ? 'text-[#E8F0E8]/90' : 'text-[#6D7972]'
                    }`}
                  >
                    {item.sub}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* I. FINAL CTA */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#164B3B] to-[#10382F] text-[#FAF9F4] px-8 py-14 sm:px-14 sm:py-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#C5A46D]">
                BEGIN AT YOUR OWN PACE
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#FFFFFF] text-balance">
                {t.sections.finalHeadline}
              </h2>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Button
                variant="gold"
                size="lg"
                onClick={() => navigate('/learn')}
              >
                <span>{t.sections.finalCta}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

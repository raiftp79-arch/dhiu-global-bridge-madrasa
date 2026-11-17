import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Circle, Compass, HeartHandshake, MessageSquare } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { Button, SafeImage } from '../components/ui/Primitives';

const BELIEF_PILLARS = [
  {
    title: 'Oneness of God (Tawhid)',
    summary:
      'Islam centers on a direct, personal relationship with the One Creator—Compassionate, All-Knowing, and close to every sincere heart.',
    detail:
      'There are no intermediaries needed when speaking to God in prayer or quiet supplication. Tawhid frees the heart from anxiety and anchors human dignity.',
  },
  {
    title: 'Prophets & Revelation',
    summary:
      'God sent messengers across history—including Noah, Abraham, Moses, Jesus, and Muhammad (peace be upon them all).',
    detail:
      'Muslims revere all earlier prophets and view the Qur’an as the preserved final revelation confirming their core call to worship God alone and treat creation with justice.',
  },
  {
    title: 'Purpose & Moral Responsibility',
    summary:
      'Human life is purposeful: cultivating gratitude, honesty, mercy to family and neighbors, and care for those in need.',
    detail:
      'Every small act of kindness done with sincere intention counts as worship—not only formal moments on a prayer mat.',
  },
  {
    title: 'Accountability & Hope',
    summary:
      'Belief in the Hereafter reminds believers that justice is ultimately complete and sincere repentance is always welcomed.',
    detail:
      'God’s mercy encompasses all things; turning back with sincerity opens a fresh page at any stage of life.',
  },
];

const FIRST_MONTH_STEPS = [
  {
    id: 'step-1',
    week: 'Week 1',
    title: 'Learn the meaning of the Shahadah at your own pace',
    note: 'Reflect on Tawhid and review Lesson 2 in Foundations of Islamic Belief.',
  },
  {
    id: 'step-2',
    week: 'Week 1',
    title: 'Practice Wudu (ablution) calmly',
    note: 'Follow the step-by-step washing routine without worrying about speed.',
  },
  {
    id: 'step-3',
    week: 'Week 2',
    title: 'Begin with one or two daily prayers while learning the movements',
    note: 'Keep a short printed guide beside your prayer mat while memorizing Al-Fatihah.',
  },
  {
    id: 'step-4',
    week: 'Week 3',
    title: 'Read 5–10 verses of the Qur’an with translation',
    note: 'Start with Surah Al-Fatihah and the short chapters near the end of the Qur’an.',
  },
  {
    id: 'step-5',
    week: 'Week 4',
    title: 'Connect with a mentor or welcome circle',
    note: 'Share questions with someone experienced in walking alongside new Muslims.',
  },
];

export function ExploreIslamPage() {
  const { navigate } = usePlatform();
  const [selectedBelief, setSelectedBelief] = useState(0);

  return (
    <div className="bg-[#FAF9F4] py-12 lg:py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#164B3B]">
              EXPLORE ISLAM
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#202B27] text-balance">
              Clear foundations, free of pressure.
            </h1>
            <p className="text-base sm:text-lg text-[#6D7972] leading-relaxed">
              Islam is a path of conscious peace with God, compassion toward people, and steady personal growth. Explore the essential beliefs below at your own rhythm.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={() => navigate('/learn/foundations-of-islam')}>
                <span>Start Foundations Course</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={() => navigate('/assistant')}>
                <MessageSquare className="w-4 h-4" />
                <span>Ask the Learning Assistant</span>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#202B27]/10">
              <SafeImage
                src="/src/assets/images/course_quran_reflection_1794896866139.jpg"
                alt="Open Arabic manuscript beside sunlit limestone window"
                fallbackTitle="Explore Islam"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <section className="rounded-3xl bg-[#FFFFFF] border border-[#202B27]/10 p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#C5A46D]">
                CORE CONVICTIONS
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#202B27]">
                What Muslims Believe
              </h2>
              <div className="space-y-2 pt-3">
                {BELIEF_PILLARS.map((item, idx) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setSelectedBelief(idx)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border transition-colors cursor-pointer ${
                      selectedBelief === idx
                        ? 'bg-[#164B3B] text-[#FFFFFF] border-[#164B3B]'
                        : 'bg-[#FAF9F4] text-[#202B27] border-[#202B27]/10 hover:border-[#164B3B]/35'
                    }`}
                  >
                    <p className="text-sm font-semibold">{item.title}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl bg-[#E8F0E8]/55 p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-semibold text-[#164B3B]">
                  Topic Overview
                </p>
                <h3 className="font-display text-2xl font-bold text-[#10382F]">
                  {BELIEF_PILLARS[selectedBelief].title}
                </h3>
                <p className="text-base text-[#202B27] leading-relaxed">
                  {BELIEF_PILLARS[selectedBelief].summary}
                </p>
                <p className="text-sm text-[#6D7972] leading-relaxed pt-3 border-t border-[#164B3B]/15">
                  {BELIEF_PILLARS[selectedBelief].detail}
                </p>
              </div>
              <div className="pt-6 flex flex-wrap gap-3">
                <Button size="sm" onClick={() => navigate('/learn')}>
                  Explore full curriculum
                </Button>
                <Button size="sm" variant="outline" onClick={() => navigate('/mentorship')}>
                  Discuss with a mentor
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function NewMuslimsPage() {
  const { navigate } = usePlatform();
  const [checked, setChecked] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('noorpath_new_muslim_checklist');
      return raw ? (JSON.parse(raw) as string[]) : ['step-1'];
    } catch {
      return ['step-1'];
    }
  });

  const toggleStep = (id: string) => {
    setChecked((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('noorpath_new_muslim_checklist', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="bg-[#FAF9F4] py-12 lg:py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#164B3B]">
            NEW MUSLIMS WELCOME HUB
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#202B27] text-balance">
            Your first steps, without overwhelm.
          </h1>
          <p className="text-base sm:text-lg text-[#6D7972] leading-relaxed">
            Embracing Islam is a beginning, not an exam. Focus on sincerity, gentle habits, and steady support rather than trying to memorize everything in a single week.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#202B27]/10">
              <div>
                <h2 className="font-display text-xl font-bold text-[#202B27]">
                  First 30 Days Gentle Roadmap
                </h2>
                <p className="text-xs text-[#6D7972] mt-1">
                  Check off milestones as you explore them at your own pace
                </p>
              </div>
              <span className="text-xs font-medium text-[#164B3B] tabular-nums">
                {checked.length} of {FIRST_MONTH_STEPS.length} completed
              </span>
            </div>

            <div className="space-y-3">
              {FIRST_MONTH_STEPS.map((item) => {
                const done = checked.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleStep(item.id)}
                    className={`w-full text-left p-4 rounded-xl border flex items-start gap-3.5 transition-colors cursor-pointer ${
                      done
                        ? 'bg-[#E8F0E8]/55 border-[#164B3B]/25'
                        : 'bg-[#FAF9F4] border-[#202B27]/10 hover:border-[#164B3B]/30'
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-5 h-5 text-[#164B3B] shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#6D7972] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs font-medium text-[#C5A46D]">{item.week}</p>
                      <p
                        className={`text-sm font-semibold mt-0.5 ${
                          done ? 'text-[#10382F]' : 'text-[#202B27]'
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="text-xs text-[#6D7972] mt-1 leading-relaxed">{item.note}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl bg-[#164B3B] text-[#FAF9F4] p-7 space-y-4">
              <HeartHandshake className="w-6 h-6 text-[#C5A46D]" />
              <h3 className="font-display text-xl font-bold">
                Pair with a Human Mentor
              </h3>
              <p className="text-sm text-[#E8F0E8]/85 leading-relaxed">
                Have practical questions about prayer, Ramadan, or talking with family? Request a confidential one-to-one check-in.
              </p>
              <Button variant="gold" onClick={() => navigate('/mentorship')}>
                Find a Mentor
              </Button>
            </div>

            <div className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-7 space-y-4">
              <Compass className="w-6 h-6 text-[#164B3B]" />
              <h3 className="font-display text-xl font-bold text-[#202B27]">
                Recommended First Courses
              </h3>
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/learn/foundations-of-islam')}
                  className="w-full text-left p-3.5 rounded-xl bg-[#FAF9F4] border border-[#202B27]/10 hover:border-[#164B3B]/40 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-[#202B27]">
                    Foundations of Islamic Belief
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#164B3B]" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/learn/understanding-salah')}
                  className="w-full text-left p-3.5 rounded-xl bg-[#FAF9F4] border border-[#202B27]/10 hover:border-[#164B3B]/40 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-[#202B27]">
                    Beginning Your Daily Prayer (Salah)
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#164B3B]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

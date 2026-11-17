import type { SupportedLang } from '../types';

export interface TranslationBundle {
  dir: 'ltr' | 'rtl';
  langName: string;
  nativeLabel: string;
  nav: {
    home: string;
    explore: string;
    learn: string;
    newMuslims: string;
    mentorship: string;
    resources: string;
    community: string;
    signIn: string;
    getStarted: string;
    dashboard: string;
    signOut: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    subtext: string;
    primaryCta: string;
    secondaryCta: string;
    floatPace: string;
    floatGuidance: string;
  };
  sections: {
    welcomeTitle: string;
    welcomeBody: string;
    pillarsEyebrow: string;
    pillarsTitle: string;
    pathwayEyebrow: string;
    pathwayTitle: string;
    mentorshipHeadline: string;
    mentorshipCta: string;
    aiHeadline: string;
    aiNotice: string;
    aiCta: string;
    everydayTitle: string;
    communityTitle: string;
    languagesTitle: string;
    finalHeadline: string;
    finalCta: string;
  };
  dashboard: {
    welcomePrefix: string;
  };
}

export const TRANSLATIONS: Record<SupportedLang, TranslationBundle> = {
  en: {
    dir: 'ltr',
    langName: 'English',
    nativeLabel: 'English',
    nav: {
      home: 'Home',
      explore: 'Explore Islam',
      learn: 'Learn',
      newMuslims: 'New Muslims',
      mentorship: 'Mentorship',
      resources: 'Resources',
      community: 'Community',
      signIn: 'Sign In',
      getStarted: 'Get Started',
      dashboard: 'Dashboard',
      signOut: 'Sign Out',
    },
    hero: {
      eyebrow: 'KNOWLEDGE · GUIDANCE · BELONGING',
      heading: 'Your Journey to Understanding Islam Starts Here.',
      subtext:
        'Learn the foundations of Islam, find trusted guidance, and discover a welcoming community — wherever life takes you.',
      primaryCta: 'Start Learning',
      secondaryCta: 'Explore Islam',
      floatPace: 'Learn at your own pace',
      floatGuidance: 'Guidance when you need it',
    },
    sections: {
      welcomeTitle: 'A welcoming place to begin.',
      welcomeBody:
        'Whether you are asking your first questions about faith or taking your first practical steps as a new Muslim, NoorPath offers clear courses, patient human mentorship, and verified local community connections.',
      pillarsEyebrow: 'Three Core Pillars',
      pillarsTitle: 'Structured around knowledge, character, and belonging.',
      pathwayEyebrow: 'Learning Pathway',
      pathwayTitle: 'A gentle step-by-step path for beginners.',
      mentorshipHeadline: "You don't have to figure everything out alone.",
      mentorshipCta: 'Find a Mentor',
      aiHeadline: 'Questions are part of learning.',
      aiNotice: 'AI Educational Assistant — Not a Religious Authority',
      aiCta: 'Explore the Learning Assistant',
      everydayTitle: 'Everyday Muslim Life',
      communityTitle: 'Community Connections',
      languagesTitle: 'Multilingual Learning',
      finalHeadline: 'Take your next step with knowledge and confidence.',
      finalCta: 'Begin Your Learning Journey',
    },
    dashboard: {
      welcomePrefix: 'Assalamu alaikum',
    },
  },
  ar: {
    dir: 'rtl',
    langName: 'Arabic',
    nativeLabel: 'العربية',
    nav: {
      home: 'الرئيسية',
      explore: 'استكشف الإسلام',
      learn: 'التعلّم',
      newMuslims: 'المسلمون الجدد',
      mentorship: 'الإرشاد',
      resources: 'المصادر',
      community: 'المجتمع',
      signIn: 'تسجيل الدخول',
      getStarted: 'ابدأ الآن',
      dashboard: 'لوحة التحكم',
      signOut: 'تسجيل الخروج',
    },
    hero: {
      eyebrow: 'المعرفة · الهداية · الانتماء',
      heading: 'رحلتك لفهم الإسلام تبدأ من هنا.',
      subtext:
        'تعلّم أسس الإسلام، واحصل على إرشاد موثوق، واكتشف مجتمعاً مرحّباً بك أينما كنت.',
      primaryCta: 'ابدأ التعلّم',
      secondaryCta: 'استكشف الإسلام',
      floatPace: 'تعلّم بالوتيرة التي تناسبك',
      floatGuidance: 'إرشاد متى احتجت إليه',
    },
    sections: {
      welcomeTitle: 'مكان مرحّب لتبدأ منه.',
      welcomeBody:
        'سواء كنت تطرح أسئلتك الأولى حول الإيمان أو تخطو خطواتك العملية الأولى كمسلم جديد، يوفّر لك مسار النور دروساً واضحة وإرشاداً إنسانياً صبوراً وروابط مجتمعية موثوقة.',
      pillarsEyebrow: 'الركائز الثلاث',
      pillarsTitle: 'منهجية تجمع بين العلم والتربية والاتصال المجتمعي.',
      pathwayEyebrow: 'مسار التعلّم',
      pathwayTitle: 'خطوات متدرجة وهادئة للمبتدئين.',
      mentorshipHeadline: 'لست مضطراً لاكتشاف كل شيء بمفردك.',
      mentorshipCta: 'ابحث عن مرشد',
      aiHeadline: 'الأسئلة جزء أصيل من التعلّم.',
      aiNotice: 'مساعد تعليمي بالذكاء الاصطناعي — وليس مرجعية فقهية',
      aiCta: 'استكشف المساعد التعليمي',
      everydayTitle: 'الحياة اليومية للمسلم',
      communityTitle: 'الروابط المجتمعية',
      languagesTitle: 'تعلّم متعدد اللغات',
      finalHeadline: 'اخطُ خطوتك القادمة بمعرفة وثقة.',
      finalCta: 'ابدأ رحلة التعلّم',
    },
    dashboard: {
      welcomePrefix: 'السلام عليكم',
    },
  },
  fr: {
    dir: 'ltr',
    langName: 'French',
    nativeLabel: 'Français',
    nav: {
      home: 'Accueil',
      explore: "Découvrir l'Islam",
      learn: 'Apprendre',
      newMuslims: 'Nouveaux Musulmans',
      mentorship: 'Mentorat',
      resources: 'Ressources',
      community: 'Communauté',
      signIn: 'Connexion',
      getStarted: 'Commencer',
      dashboard: 'Tableau de bord',
      signOut: 'Déconnexion',
    },
    hero: {
      eyebrow: 'SAVOIR · ACCOMPAGNEMENT · APPARTENANCE',
      heading: "Votre parcours pour comprendre l'Islam commence ici.",
      subtext:
        "Apprenez les fondements de l'Islam, bénéficiez d'un accompagnement fiable et découvrez une communauté accueillante — où que vous soyez.",
      primaryCta: "Commencer l'apprentissage",
      secondaryCta: "Découvrir l'Islam",
      floatPace: 'Apprenez à votre rythme',
      floatGuidance: 'Un accompagnement quand vous en avez besoin',
    },
    sections: {
      welcomeTitle: 'Un lieu accueillant pour commencer.',
      welcomeBody:
        "Que vous posiez vos premières questions ou que vous fassiez vos premiers pas en tant que nouveau musulman, NoorPath propose des cours clairs, un mentorat humain bienveillant et des repères communautaires vérifiés.",
      pillarsEyebrow: 'Trois Piliers Fondamentaux',
      pillarsTitle: 'Une pédagogie fondée sur le savoir, la croissance et le lien.',
      pathwayEyebrow: "Parcours d'apprentissage",
      pathwayTitle: 'Un cheminement progressif pour les débutants.',
      mentorshipHeadline: "Vous n'avez pas à tout comprendre seul.",
      mentorshipCta: 'Trouver un mentor',
      aiHeadline: 'Les questions font partie du chemin.',
      aiNotice: "Assistant éducatif IA — Pas une autorité religieuse",
      aiCta: "Découvrir l'assistant éducatif",
      everydayTitle: 'La vie quotidienne du musulman',
      communityTitle: 'Liens communautaires',
      languagesTitle: 'Apprentissage multilingue',
      finalHeadline: 'Franchissez votre prochaine étape avec clarté et sérénité.',
      finalCta: 'Commencer votre parcours',
    },
    dashboard: {
      welcomePrefix: 'Assalamu alaikum',
    },
  },
  de: {
    dir: 'ltr',
    langName: 'German',
    nativeLabel: 'Deutsch',
    nav: {
      home: 'Startseite',
      explore: 'Islam entdecken',
      learn: 'Lernen',
      newMuslims: 'Neue Muslime',
      mentorship: 'Mentoring',
      resources: 'Ressourcen',
      community: 'Gemeinschaft',
      signIn: 'Anmelden',
      getStarted: 'Loslegen',
      dashboard: 'Dashboard',
      signOut: 'Abmelden',
    },
    hero: {
      eyebrow: 'WISSEN · BEGLEITUNG · ZUGEHÖRIGKEIT',
      heading: 'Ihr Weg zum Verständnis des Islams beginnt hier.',
      subtext:
        'Lernen Sie die Grundlagen des Islams, finden Sie verlässliche Begleitung und entdecken Sie eine herzliche Gemeinschaft — wo immer Sie sind.',
      primaryCta: 'Lernen beginnen',
      secondaryCta: 'Islam entdecken',
      floatPace: 'In Ihrem eigenen Tempo lernen',
      floatGuidance: 'Begleitung, wenn Sie sie brauchen',
    },
    sections: {
      welcomeTitle: 'Ein einladender Ort für den Anfang.',
      welcomeBody:
        'Ob Sie erste Fragen zum Glauben stellen oder als neuer Muslim praktische Schritte gehen: NoorPath bietet strukturierte Kurse, geduldiges persönliches Mentoring und geprüfte lokale Anlaufstellen.',
      pillarsEyebrow: 'Drei Kernpfeiler',
      pillarsTitle: 'Aufgebaut auf Wissen, Charakterentwicklung und Gemeinschaft.',
      pathwayEyebrow: 'Lernpfad',
      pathwayTitle: 'Ein ruhiger Schritt-für-Schritt-Weg für Einsteiger.',
      mentorshipHeadline: 'Sie müssen nicht alles allein herausfinden.',
      mentorshipCta: 'Mentor finden',
      aiHeadline: 'Fragen gehören zum Lernen dazu.',
      aiNotice: 'KI-Lernassistent — Keine religiöse Autorität',
      aiCta: 'Lernassistenten erkunden',
      everydayTitle: 'Muslimischer Alltag',
      communityTitle: 'Gemeinschaft & Kontakte',
      languagesTitle: 'Mehrsprachiges Lernen',
      finalHeadline: 'Gehen Sie Ihren nächsten Schritt mit Wissen und Zuversicht.',
      finalCta: 'Ihre Lernreise beginnen',
    },
    dashboard: {
      welcomePrefix: 'Assalamu alaikum',
    },
  },
};

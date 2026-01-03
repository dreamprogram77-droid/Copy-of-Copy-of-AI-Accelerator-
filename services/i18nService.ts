
export type Language = 'ar' | 'en' | 'fr' | 'zh';

export const translations = {
  ar: {
    dir: 'rtl',
    font: 'IBM Plex Sans Arabic',
    brand: 'بيزنس ديفلوبرز',
    subtitle: 'مسرعة أعمال افتراضية مدعومة بالذكاء الاصطناعي',
    nav: {
      incubation: 'الاحتضان',
      memberships: 'الباقات',
      roadmap: 'الخارطة',
      tools: 'الأدوات',
      mentorship: 'الإرشاد',
      login: 'دخول',
      startFree: 'ابدأ مجاناً'
    },
    hero: {
      title: 'ابنِ مشروعك',
      titleAccent: 'بمعايير عالمية.',
      desc: 'أول مسرعة أعمال افتراضية في الشرق الأوسط تدمج ذكاء Gemini 3 Pro في كل خطوة.',
      cta: 'ابدأ رحلة الاحتضان'
    },
    dashboard: {
      home: 'الرئيسية',
      bootcamp: 'المنهج التدريبي',
      tasks: 'المهام',
      lab: 'مختبر الفرص',
      services: 'الخدمات',
      profile: 'الملف الشخصي',
      logout: 'خروج'
    }
  },
  en: {
    dir: 'ltr',
    font: 'sans-serif',
    brand: 'BizDev AI',
    subtitle: 'AI-Powered Virtual Accelerator',
    nav: {
      incubation: 'Incubation',
      memberships: 'Memberships',
      roadmap: 'Roadmap',
      tools: 'Tools',
      mentorship: 'Mentorship',
      login: 'Login',
      startFree: 'Get Started'
    },
    hero: {
      title: 'Build Your Startup',
      titleAccent: 'to Global Standards.',
      desc: 'The first virtual accelerator in the Middle East integrating Gemini 3 Pro at every step.',
      cta: 'Start Incubation Journey'
    },
    dashboard: {
      home: 'Home',
      bootcamp: 'Bootcamp',
      tasks: 'Tasks',
      lab: 'Opportunity Lab',
      services: 'Services',
      profile: 'Profile',
      logout: 'Logout'
    }
  },
  fr: {
    dir: 'ltr',
    font: 'sans-serif',
    brand: 'BizDev AI',
    subtitle: 'Accélérateur Virtuel Propulsé par l\'IA',
    nav: {
      incubation: 'Incubation',
      memberships: 'Abonnements',
      roadmap: 'Feuille de Route',
      tools: 'Outils',
      mentorship: 'Mentorat',
      login: 'Connexion',
      startFree: 'Commencer'
    },
    hero: {
      title: 'Créez Votre Startup',
      titleAccent: 'aux Normes Mondiales.',
      desc: 'Le premier accélérateur virtuel au Moyen-Orient intégrant Gemini 3 Pro à chaque étape.',
      cta: 'Démarrer l\'Incubation'
    },
    dashboard: {
      home: 'Accueil',
      bootcamp: 'Formation',
      tasks: 'Tâches',
      lab: 'Lab d\'Opportunités',
      services: 'Services',
      profile: 'Profil',
      logout: 'Déconnexion'
    }
  },
  zh: {
    dir: 'ltr',
    font: 'sans-serif',
    brand: 'BizDev AI',
    subtitle: '人工智能驱动的虚拟加速器',
    nav: {
      incubation: '孵化项目',
      memberships: '会员资格',
      roadmap: '路线图',
      tools: '工具',
      mentorship: '导师指导',
      login: '登录',
      startFree: '免费开始'
    },
    hero: {
      title: '构建您的创业公司',
      titleAccent: '达到国际标准。',
      desc: '中东地区首个在每一步都整合 Gemini 3 Pro 的虚拟加速器。',
      cta: '开始孵化旅程'
    },
    dashboard: {
      home: '首页',
      bootcamp: '训练营',
      tasks: '任务',
      lab: '机会实验室',
      services: '执行服务',
      profile: '个人资料',
      logout: '登出'
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];


export type Language = 'ar' | 'en' | 'fr' | 'zh';

export const translations = {
  ar: {
    dir: 'rtl',
    font: 'IBM Plex Sans Arabic',
    brand: 'بيزنس ديفلوبرز',
    subtitle: 'مسرعة أعمال افتراضية مدعومة بالذكاء الاصطناعي',
    common: {
      back: 'عودة',
      loading: 'جاري التحميل...',
      save: 'حفظ التعديلات',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      next: 'المتابعة',
      start: 'ابدأ الآن',
      logout: 'تسجيل الخروج'
    },
    nav: {
      incubation: 'الاحتضان',
      memberships: 'الباقات',
      roadmap: 'الخارطة',
      tools: 'الأدوات',
      mentorship: 'الإرشاد',
      login: 'دخول',
      startFree: 'ابدأ مجاناً',
      partner: 'شريك',
      aiMentor: 'الموجه الذكي',
      impact: 'الأثر',
      about: 'عن البرنامج'
    },
    roles: {
      startup: 'شركة محتضنة',
      partner: 'شريك (Co-Founder)',
      mentor: 'مرشد خبير',
      admin: 'الإدارة',
      desc_startup: 'رحلة تحويل الفكرة إلى منتج',
      desc_partner: 'استثمر خبرتك مقابل حصص',
      desc_mentor: 'ساهم في بناء الجيل القادم',
      desc_admin: 'التحكم المركزي'
    },
    auth: {
      login_title: 'دخول المنصة',
      login_sub: 'اختر هويتك للوصول لمساحة العمل الخاصة بك',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      cta: 'دخول',
      error_admin: 'عذراً، هذا الحساب لا يملك صلاحيات إدارية.',
      error_not_found: 'البريد الإلكتروني غير مسجل في النظام.'
    },
    hero: {
      title: 'ابنِ مشروعك',
      titleAccent: 'بمعايير عالمية.',
      desc: 'المنصة الرسمية المعتمدة لتحويل الأفكار الريادية إلى كيانات قابلة للاستثمار عبر محرك Gemini الذكي.',
      cta: 'ابدأ رحلة البناء'
    },
    dashboard: {
      home: 'الرئيسية',
      bootcamp: 'المنهج',
      tasks: 'المهمات',
      lab: 'المختبر',
      services: 'الخدمات',
      profile: 'الملف',
      logout: 'خروج',
      welcome: 'أهلاً بك،'
    }
  },
  en: {
    dir: 'ltr',
    font: 'sans-serif',
    brand: 'Business Developers',
    subtitle: 'AI-Powered Virtual Accelerator',
    common: {
      back: 'Back',
      loading: 'Loading...',
      save: 'Save Changes',
      cancel: 'Cancel',
      confirm: 'Confirm',
      next: 'Next',
      start: 'Start Now',
      logout: 'Logout'
    },
    nav: {
      incubation: 'Incubation',
      memberships: 'Plans',
      roadmap: 'Roadmap',
      tools: 'Tools',
      mentorship: 'Mentors',
      login: 'Login',
      startFree: 'Start Free',
      partner: 'Partner',
      aiMentor: 'AI Mentor',
      impact: 'Impact',
      about: 'About'
    },
    roles: {
      startup: 'Startup',
      partner: 'Co-Founder',
      mentor: 'Expert Mentor',
      admin: 'Admin',
      desc_startup: 'From idea to product',
      desc_partner: 'Equity for expertise',
      desc_mentor: 'Guide the next gen',
      desc_admin: 'Central hub'
    },
    auth: {
      login_title: 'Platform Login',
      login_sub: 'Select your role to enter workspace',
      email: 'Email',
      password: 'Password',
      cta: 'Sign In',
      error_admin: 'Access denied. Admin only.',
      error_not_found: 'Email not found in our system.'
    },
    hero: {
      title: 'Build Your Startup',
      titleAccent: 'Global Standards.',
      desc: 'The official platform to transform entrepreneurial ideas into investable entities using Gemini AI.',
      cta: 'Start Building'
    },
    dashboard: {
      home: 'Home',
      bootcamp: 'Bootcamp',
      tasks: 'Tasks',
      lab: 'Lab',
      services: 'Services',
      profile: 'Profile',
      logout: 'Logout',
      welcome: 'Welcome,'
    }
  },
  fr: {
    dir: 'ltr',
    font: 'sans-serif',
    brand: 'Business Developers',
    subtitle: 'Accélérateur Virtuel Propulsé par l\'IA',
    common: {
      back: 'Retour',
      loading: 'Chargement...',
      save: 'Enregistrer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      next: 'Suivant',
      start: 'Démarrer',
      logout: 'Déconnexion'
    },
    nav: {
      incubation: 'Incubation',
      memberships: 'Forfaits',
      roadmap: 'Feuille de route',
      tools: 'Outils',
      mentorship: 'Mentorat',
      login: 'Connexion',
      startFree: 'Essai Gratuit',
      partner: 'Partenaire',
      aiMentor: 'Mentor IA',
      impact: 'Impact',
      about: 'À propos'
    },
    roles: {
      startup: 'Startup',
      partner: 'Co-fondateur',
      mentor: 'Mentor Expert',
      admin: 'Admin',
      desc_startup: 'De l\'idée au produit',
      desc_partner: 'Expertise contre capital',
      desc_mentor: 'Guider la génération future',
      desc_admin: 'Hub central'
    },
    auth: {
      login_title: 'Connexion Plateforme',
      login_sub: 'Choisissez votre rôle',
      email: 'E-mail',
      password: 'Mot de passe',
      cta: 'Se connecter',
      error_admin: 'Accès refusé. Administrateurs uniquement.',
      error_not_found: 'E-mail non trouvé.'
    },
    hero: {
      title: 'Créez votre Startup',
      titleAccent: 'Standards Mondiaux.',
      desc: 'La plateforme officielle pour transformer des idées en entités investissables via Gemini IA.',
      cta: 'Commencer à bâtir'
    },
    dashboard: {
      home: 'Accueil',
      bootcamp: 'Formation',
      tasks: 'Missions',
      lab: 'Laboratoire',
      services: 'Services',
      profile: 'Profil',
      logout: 'Déconnexion',
      welcome: 'Bienvenue,'
    }
  },
  zh: {
    dir: 'ltr',
    font: 'sans-serif',
    brand: '业务开发商',
    subtitle: '人工智能驱动的虚拟加速器',
    common: {
      back: '返回',
      loading: '加载中...',
      save: '保存更改',
      cancel: '取消',
      confirm: '确认',
      next: '下一步',
      start: '立即开始',
      logout: '登出'
    },
    nav: {
      incubation: '孵化',
      memberships: '方案',
      roadmap: '路线图',
      tools: '工具',
      mentorship: '导师',
      login: '登录',
      startFree: '免费开始',
      partner: '合伙人',
      aiMentor: 'AI导师',
      impact: '影响力',
      about: '关于'
    },
    roles: {
      startup: '初创公司',
      partner: '联合创始人',
      mentor: '专家导师',
      admin: '管理',
      desc_startup: '从想法到产品',
      desc_partner: '专业知识换取股权',
      desc_mentor: '引领下一代',
      desc_admin: '中央枢纽'
    },
    auth: {
      login_title: '平台登录',
      login_sub: '选择您的角色进入工作区',
      email: '电子邮件',
      password: '密码',
      cta: '登入',
      error_admin: '拒绝访问。仅限管理员。',
      error_not_found: '系统中未找到该电子邮件。'
    },
    hero: {
      title: '打造您的初创公司',
      titleAccent: '国际标准。',
      desc: '使用 Gemini AI 将创业想法转化为可投资实体的官方平台。',
      cta: '开始建设'
    },
    dashboard: {
      home: '首页',
      bootcamp: '训练营',
      tasks: '任务',
      lab: '实验室',
      services: '服务',
      profile: '个人资料',
      logout: '退出',
      welcome: '欢迎，'
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang] || translations.ar;

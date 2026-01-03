
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
      start: 'ابدأ الآن'
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
      aiMentor: 'الموجه الذكي'
    },
    roles: {
      startup: 'شركة محتضنة',
      partner: 'شريك (Partner)',
      mentor: 'مرشد (Mentor)',
      admin: 'الإدارة',
      desc_startup: 'متابعة نضج مشروعك',
      desc_partner: 'فرص الشراكة النشطة',
      desc_mentor: 'إدارة جلسات الإرشاد',
      desc_admin: 'التحكم المركزي'
    },
    auth: {
      login_title: 'تسجيل الدخول',
      login_sub: 'اختر الدور الخاص بك للدخول للمنصة',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      cta: 'دخول للمنصة',
      error_admin: 'هذا الحساب لا يملك صلاحيات الإدارة.',
      error_not_found: 'عذراً، لم نجد حساباً مسجلاً بهذا البريد الإلكتروني.'
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
      logout: 'خروج',
      welcome: 'أهلاً بك،'
    }
  },
  en: {
    dir: 'ltr',
    font: 'sans-serif',
    brand: 'BizDev AI',
    subtitle: 'AI-Powered Virtual Accelerator',
    common: {
      back: 'Back',
      loading: 'Loading...',
      save: 'Save Changes',
      cancel: 'Cancel',
      confirm: 'Confirm',
      next: 'Next',
      start: 'Start Now'
    },
    nav: {
      incubation: 'Incubation',
      memberships: 'Memberships',
      roadmap: 'Roadmap',
      tools: 'Tools',
      mentorship: 'Mentorship',
      login: 'Login',
      startFree: 'Get Started',
      partner: 'Partner',
      aiMentor: 'AI Mentor'
    },
    roles: {
      startup: 'Incubated Co.',
      partner: 'Partner',
      mentor: 'Mentor',
      admin: 'Admin',
      desc_startup: 'Track your startup growth',
      desc_partner: 'Active equity opportunities',
      desc_mentor: 'Manage sessions',
      desc_admin: 'Central control'
    },
    auth: {
      login_title: 'Login',
      login_sub: 'Choose your identity to enter the platform',
      email: 'Email Address',
      password: 'Password',
      cta: 'Sign In',
      error_admin: 'This account does not have admin privileges.',
      error_not_found: 'Sorry, we couldn\'t find an account with this email.'
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
      logout: 'Logout',
      welcome: 'Welcome,'
    }
  },
  fr: {
    dir: 'ltr',
    font: 'sans-serif',
    brand: 'BizDev AI',
    subtitle: 'Accélérateur Virtuel Propulsé par l\'IA',
    common: {
      back: 'Retour',
      loading: 'Chargement...',
      save: 'Enregistrer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      next: 'Suivant',
      start: 'Démarrer'
    },
    nav: {
      incubation: 'Incubation',
      memberships: 'Abonnements',
      roadmap: 'Feuille de Route',
      tools: 'Outils',
      mentorship: 'Mentorat',
      login: 'Connexion',
      startFree: 'Commencer',
      partner: 'Partenaire',
      aiMentor: 'Mentor IA'
    },
    roles: {
      startup: 'Entreprise Incubée',
      partner: 'Partenaire',
      mentor: 'Mentor',
      admin: 'Admin',
      desc_startup: 'Suivez votre croissance',
      desc_partner: 'Opportunités actives',
      desc_mentor: 'Gérer les sessions',
      desc_admin: 'Contrôle central'
    },
    auth: {
      login_title: 'Connexion',
      login_sub: 'Choisissez votre identité pour entrer',
      email: 'E-mail',
      password: 'Mot de passe',
      cta: 'Se Connecter',
      error_admin: 'Ce compte n\'a pas de privilèges administratifs.',
      error_not_found: 'Désolé, aucun compte trouvé avec cet e-mail.'
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
      logout: 'Déconnexion',
      welcome: 'Bienvenue,'
    }
  },
  zh: {
    dir: 'ltr',
    font: 'sans-serif',
    brand: 'BizDev AI',
    subtitle: '人工智能驱动的虚拟加速器',
    common: {
      back: '返回',
      loading: '加载中...',
      save: '保存更改',
      cancel: '取消',
      confirm: '确认',
      next: '下一步',
      start: '立即开始'
    },
    nav: {
      incubation: '孵化项目',
      memberships: '会员资格',
      roadmap: '路线图',
      tools: '工具',
      mentorship: '导师指导',
      login: '登录',
      startFree: '免费开始',
      partner: '伙伴',
      aiMentor: 'AI 导师'
    },
    roles: {
      startup: '孵化企业',
      partner: '合作伙伴',
      mentor: '导师',
      admin: '管理员',
      desc_startup: '跟踪创业增长',
      desc_partner: '活跃股权机会',
      desc_mentor: '管理指导会议',
      desc_admin: '中央控制'
    },
    auth: {
      login_title: '登录',
      login_sub: '选择您的身份进入平台',
      email: '电子邮件',
      password: '密码',
      cta: '登入',
      error_admin: '此账户没有管理员权限。',
      error_not_found: '抱歉，找不到此电子邮件关联的账户。'
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
      logout: '登出',
      welcome: '欢迎回来，'
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];

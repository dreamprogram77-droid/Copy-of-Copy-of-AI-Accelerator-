
export enum FiltrationStage {
  LANDING = 'LANDING',
  PATH_FINDER = 'PATH_FINDER',
  WELCOME = 'WELCOME',
  LOGIN = 'LOGIN',
  NOMINATION_TEST = 'NOMINATION_TEST',
  PROJECT_EVALUATION = 'PROJECT_EVALUATION', 
  ASSESSMENT_RESULT = 'ASSESSMENT_RESULT',
  APPLICATION_STATUS = 'APPLICATION_STATUS',
  FINAL_REPORT = 'FINAL_REPORT',
  DEVELOPMENT_PLAN = 'DEVELOPMENT_PLAN',
  DASHBOARD = 'DASHBOARD',
  LEVEL_VIEW = 'LEVEL_VIEW',
  CERTIFICATE = 'CERTIFICATE',
  PROJECT_BUILDER = 'PROJECT_BUILDER',
  ROADMAP = 'ROADMAP',
  TOOLS = 'TOOLS',
  STAFF_PORTAL = 'STAFF_PORTAL',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  MENTORSHIP = 'MENTORSHIP',
  INCUBATION_PROGRAM = 'INCUBATION_PROGRAM',
  MEMBERSHIPS = 'MEMBERSHIPS'
}

export interface ProgramRating {
  stars: number;
  feedback: string;
  favoriteFeature: string;
  submittedAt: string;
}

export interface OpportunityAnalysis {
  newMarkets: {
    region: string;
    reasoning: string;
    entryBarrier: 'Low' | 'Medium' | 'High';
    potentialROI: string;
  }[];
  untappedSegments: {
    segmentName: string;
    needs: string;
    strategy: string;
  }[];
  blueOceanIdea: string;
  quickWinAction: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Design' | 'Tech' | 'Finance' | 'Legal' | 'Marketing';
  packages: ServicePackage[];
}

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: 'svc_design',
    title: 'تصميم UI/UX وهوية بارية',
    description: 'تحويل فكرتك إلى واجهات مستخدم جذابة وتجربة سهلة مع بناء هوية براند متكاملة.',
    icon: '🎨',
    category: 'Design',
    packages: [
      { id: 'p1', name: 'باقة الأساسيات', price: 'مرن', features: ['تصميم الشعار', 'لوحة الألوان', 'الخطوط الرسمية'] },
      { id: 'p2', name: 'باقة التطبيق الكاملة', price: 'حسب الحجم', features: ['تصميم ١٠ شاشات', 'User Flow', 'Prototype تفاعلي'] }
    ]
  },
  {
    id: 'svc_landing',
    title: 'بناء Landing Page + Tracking',
    description: 'صفحة هبوط احترافية عالية التحويل مع ربط أدوات التحليل والتتبع (Google Analytics, Pixel).',
    icon: '🌐',
    category: 'Tech',
    packages: [
      { id: 'p3', name: 'صفحة إطلاق سريعة', price: 'اقتصادي', features: ['تصميم متجاوب', 'نموذج تسجيل', 'ربط الدومين'] },
      { id: 'p4', name: 'باقة النمو المتقدمة', price: 'احترافي', features: ['A/B Testing', 'Heatmaps', 'أتمتة البريد'] }
    ]
  },
  {
    id: 'svc_pitch',
    title: 'إعداد Pitch Deck للمستثمرين',
    description: 'صياغة وتصميم عرض تقديمي يقنع المستثمرين بجاذبية مشروعك وجدواه المالية.',
    icon: '🚀',
    category: 'Finance',
    packages: [
      { id: 'p5', name: 'مراجعة وتنسيق', price: 'سريع', features: ['تحسين المحتوى الحالي', 'تنسيق بصري بريميوم'] },
      { id: 'p6', name: 'بناء العرض من الصفر', price: 'متكامل', features: ['صياغة القصة', 'تحليل الأرقام', 'تصميم سيناريو الإلقاء'] }
    ]
  },
  {
    id: 'svc_finance',
    title: 'نموذج مالي وتسعير',
    description: 'بناء ملف Excel احترافي يتضمن التوقعات المالية، نقطة التعادل، وهيكل التسعير.',
    icon: '📊',
    category: 'Finance',
    packages: [
      { id: 'p7', name: 'باقة التوقعات', price: 'محدد', features: ['توقعات ٣ سنوات', 'تحليل التدفق النقدي'] }
    ]
  },
  {
    id: 'svc_legal',
    title: 'مستندات قانونية أساسية',
    description: 'تجهيز سياسات الخصوصية، شروط الاستخدام، وعقود التأسيس الأولية.',
    icon: '⚖️',
    category: 'Legal',
    packages: [
      { id: 'p8', name: 'باقة الامتثال', price: 'قانوني', features: ['سياسة الخصوصية', 'شروط الخدمة', 'إخلاء المسؤولية'] }
    ]
  }
];

export interface ServiceRequest {
  id: string;
  uid: string;
  serviceId: string;
  packageId: string;
  status: 'PENDING' | 'DISCUSSING' | 'IN_PROGRESS' | 'COMPLETED';
  requestedAt: string;
  details?: string;
}

export interface TaskRecord {
  id: string;
  levelId: number;
  title: string;
  description: string;
  deliverableType: string;
  status: 'LOCKED' | 'ASSIGNED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  submission?: {
    content?: string;
    fileData?: string; // Base64 of PDF
    fileName?: string;
    submittedAt: string;
    feedback?: string;
  };
}

export const TASKS_CONFIG: TaskRecord[] = [
  { id: 'task_1', levelId: 1, title: 'تقرير التحقق الميداني', deliverableType: 'PDF Document', description: 'قم بإجراء مقابلات مع 10 عملاء محتملين ورفع النتائج في ملف PDF موحد.', status: 'LOCKED' },
  { id: 'task_2', levelId: 2, title: 'مخطط نموذج العمل النهائي', deliverableType: 'PDF (Business Model Canvas)', description: 'ارفع مخطط نموذج العمل الكامل لمشروعك بصيغة PDF مع توضيح تدفقات الإيرادات.', status: 'LOCKED' },
  { id: 'task_3', levelId: 3, title: 'مصفوفة تحليل المنافسين', deliverableType: 'PDF Table', description: 'ارفع جدول مقارنة مع 3 منافسين مباشرين يوضح ميزتك التنافسية.', status: 'LOCKED' },
  { id: 'task_4', levelId: 4, title: 'خارطة طريق الـ MVP', deliverableType: 'PDF Roadmap', description: 'ارفع قائمة المزايا والجدول الزمني لتطوير المنتج الأولي بصيغة PDF.', status: 'LOCKED' },
  { id: 'task_5', levelId: 5, title: 'نموذج التوقعات المالية', deliverableType: 'PDF/Excel Export', description: 'ارفع ملف التوقعات المالية للسنوات الثلاث الأولى متضمناً نقطة التعادل.', status: 'LOCKED' },
  { id: 'task_6', levelId: 6, title: 'ملف العرض الاستثماري النهائي', deliverableType: 'PDF Pitch Deck', description: 'ارفع النسخة النهائية من العرض الجاهز للإرسال للمستثمرين بصيغة PDF.', status: 'LOCKED' },
];

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  levelId: number;
  description: string;
}

export const DIGITAL_SHIELDS: Badge[] = [
  { id: 'shield_1', name: 'درع المستكشف الذكي', icon: '🛡️', color: 'from-blue-400 to-cyan-500', levelId: 1, description: 'يُمنح لإتمام التحقق من صحة الفكرة.' },
  { id: 'shield_2', name: 'درع الاستراتيجي', icon: '🛡️', color: 'from-indigo-500 to-purple-600', levelId: 2, description: 'يُمنح لتصميم نموذج عمل مستدام.' },
  { id: 'shield_3', name: 'درع المحلل الرقمي', icon: '🛡️', color: 'from-emerald-400 to-teal-600', levelId: 3, description: 'يُمنح لفهم عمق السوق والمنافسين.' },
  { id: 'shield_4', name: 'درع المهندس المبدع', icon: '🛡️', color: 'from-amber-400 to-orange-600', levelId: 4, description: 'يُمنح لبناء أول نسخة وظيفية للمنتج.' },
  { id: 'shield_5', name: 'درع الممول الذكي', icon: '🛡️', color: 'from-rose-500 to-pink-600', levelId: 5, description: 'يُمنح لإتقان التخطيط المالي والتمويلي.' },
  { id: 'shield_6', name: 'درع القائد العالمي', icon: '🛡️', color: 'from-slate-700 to-slate-900', levelId: 6, description: 'يُمنح لجاهزية العرض الاستثماري النهائي.' },
];

export interface UserProfile {
  firstName: string;
  lastName: string;
  startupName: string;
  startupDescription: string;
  industry: string;
  phone: string;
  email: string;
  logo?: string;
  age?: number;
  birthDate?: string;
  foundationYear?: number;
  foundersCount?: number;
  technologies?: string;
  name?: string; 
  hasCompletedAssessment?: boolean;
  agreedToTerms?: boolean;
  agreedToContract?: boolean;
  signedContractName?: string;
  contractSignedAt?: string;
}

export interface LevelData {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
  icon: string;
  customColor?: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface RadarMetrics {
  readiness: number;
  analysis: number;
  tech: number;
  personality: number;
  strategy: number;
  ethics: number;
}

export interface ProjectEvaluationResult {
  clarity: number;
  value: number;
  innovation: number;
  market: number;
  readiness: number;
  totalScore: number;
  aiOpinion: string;
  strengths: string[]; 
  weaknesses: string[]; 
  classification: 'Green' | 'Yellow' | 'Red';
}

export interface FinalResult {
  score: number;
  leadershipStyle: string;
  metrics: RadarMetrics;
  projectEval?: ProjectEvaluationResult;
  isQualified: boolean;
  badges: { id: string, name: string, icon: string, color: string }[];
  recommendation: string;
}

export type ProjectStageType = 'Idea' | 'Prototype' | 'Product';
export type TechLevelType = 'Low' | 'Medium' | 'High';

export interface ApplicantProfile {
  codeName: string;
  projectStage: ProjectStageType;
  sector: string;
  goal: string;
  techLevel: TechLevelType;
}

export const LEVELS_CONFIG: LevelData[] = [
  { id: 1, title: 'التحقق من الفكرة', description: 'تأكد من أن فكرتك تحل مشكلة حقيقية وتستحق الاستثمار والجهد.', isCompleted: false, isLocked: false, icon: '💡' },
  { id: 2, title: 'نموذج العمل التجاري', description: 'ابنِ خطة عمل واضحة تحدد مصادر الدخل، العملاء، وقنوات التوزيع.', isCompleted: false, isLocked: false, icon: '📊' },
  { id: 3, title: 'تحليل السوق والمنافسين', description: 'افهم حجم السوق ومن هم منافسوك وكيف ستتفوق عليهم بميزتك التنافسية.', isCompleted: false, isLocked: false, icon: '🔎' },
  { id: 4, title: 'المنتج الأولي (MVP)', description: 'حدد الميزات الأساسية لمنتجك لإطلاقه بأقل التكاليف والحصول على تعليقات العملاء.', isCompleted: false, isLocked: false, icon: '🛠️' },
  { id: 5, title: 'الخطة المالية والتمويل', description: 'توقع التكاليف، الإيرادات، التدفقات النقدية، واحتياجات التمويل المستقبلي.', isCompleted: false, isLocked: false, icon: '💰' },
  { id: 6, title: 'عرض الاستثمار النهائي', description: 'جهز عرضاً تقديمياً احترافياً (Pitch Deck) لجذب المستثمرين.', isCompleted: false, isLocked: false, icon: '🚀' },
];

export interface NominationData {
  companyName: string;
  founderName: string;
  location: string;
  pitchDeckUrl?: string;
  hasCommercialRegister: 'YES' | 'NO' | 'IN_PROGRESS';
  hasTechnicalPartner: boolean;
  problemStatement: string;
  targetCustomerType: string[];
  marketSize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'UNKNOWN';
  whyNow: string;
  productStage: 'IDEA' | 'PROTOTYPE' | 'MVP' | 'TRACTION';
  topFeatures?: string;
  executionPlan: 'NONE' | 'GENERAL' | 'WEEKLY';
  userCount: '0' | '1-10' | '11-50' | '50+';
  revenueModel: 'NOT_SET' | 'SUBSCRIPTION' | 'COMMISSION' | 'ANNUAL' | 'PAY_PER_USE';
  customerAcquisitionPath?: string;
  incubationReason?: string;
  weeklyHours: 'LESS_5' | '5-10' | '10-20' | '20+';
  agreesToWeeklySession: boolean;
  agreesToKPIs: boolean;
  isCommitted10Hours?: boolean;
  potentialObstacles?: string;
  currentResources?: string[];
  tractionEvidence?: string[];
  demoUrl?: string;
}

export interface NominationAIResponse {
  aiScore: number;
  redFlags: string[];
  aiAnalysis: string;
  categorySuggestion: "DIRECT_ADMISSION" | "INTERVIEW" | "PRE_INCUBATION" | "REJECTION";
}

export interface NominationResult {
  totalScore: number;
  category: 'DIRECT_ADMISSION' | 'INTERVIEW' | 'PRE_INCUBATION' | 'REJECTION';
  redFlags: string[];
  aiAnalysis: string;
}

export const SECTORS = [
  { value: 'Tech', label: 'تقني' },
  { value: 'SaaS', label: 'برمجيات كخدمة' },
  { value: 'Fintech', label: 'تقنية مالية' },
  { value: 'E-commerce', label: 'تجارة إلكترونية' },
  { value: 'HealthTech', label: 'تقنية صحية' },
  { value: 'EduTech', label: 'تقنية تعليمية' },
  { value: 'AgriTech', label: 'تقنية زراعية' },
  { value: 'Industrial', label: 'صناعي' },
  { value: 'Other', label: 'آخر' },
];

export interface PersonalityQuestion {
  id: number;
  situation: string;
  options: { text: string; style: string }[];
}

export interface AnalyticalQuestion {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export type AgentCategory = 'Vision' | 'Market' | 'User' | 'Opportunity';

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
}

export const AVAILABLE_AGENTS: AIAgent[] = [
  { id: 'a1', name: 'محلل الرؤية الاستراتيجية', description: 'يحلل وضوح الهدف وقابلية التوسع.', category: 'Vision' },
  { id: 'a2', name: 'خبير تحليل السوق', description: 'يدرس المنافسين وحجم السوق المستهدف.', category: 'Market' },
  { id: 'a3', name: 'مصمم شخصيات المستخدمين', description: 'يصمم ملفات تعريف دقيقة للفئات المستهدفة.', category: 'User' },
  { id: 'a4', name: 'محلل الفرص الاستثمارية', description: 'يقيم جاذبية المشروع للمستثمرين.', category: 'Opportunity' },
  { id: 'a5', name: 'مستكشف أسواق التوسع', description: 'يحدد الأسواق الجغرافية والشرائح غير المخدومة.', category: 'Opportunity' },
];

export interface ProjectBuildData {
  projectName: string;
  description: string;
  quality: 'Quick' | 'Balanced' | 'Enhanced' | 'Professional' | 'Max';
  selectedAgents: string[];
  results?: {
    vision?: string;
    marketAnalysis?: string;
    userPersonas?: string;
    hypotheses?: string[];
    pitchDeck?: { title: string; content: string }[];
  };
}

export interface FailureSimulation {
  brutalTruth: string;
  probability: number;
  financialLoss: string;
  operationalImpact: string;
  missingQuestions: string[];
  recoveryPlan: string[];
}

export interface GovStats {
  riskyMarkets: { name: string; failRate: number }[];
  readySectors: { name: string; score: number }[];
  commonFailReasons: { reason: string; percentage: number }[];
  regulatoryGaps: string[];
}

export interface UserRecord {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  birthDate: string;
  createdAt: string;
  lastLogin: string;
  settings: { theme: string; notifications: boolean };
}

export interface StartupRecord {
  projectId: string;
  ownerId: string;
  name: string;
  description: string;
  industry: string;
  foundationYear: number;
  foundersCount: number;
  technologies: string;
  stage: ProjectStageType;
  metrics: RadarMetrics;
  aiClassification: 'Green' | 'Yellow' | 'Red';
  aiOpinion: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ProgressRecord {
  id: string;
  uid: string;
  levelId: number;
  status: 'LOCKED' | 'AVAILABLE' | 'COMPLETED';
  score: number;
  completedAt?: string;
}

export interface ActivityLogRecord {
  logId: string;
  uid: string;
  actionType: 'LOGIN' | 'TEST_SUBMIT' | 'LOGOUT' | 'PROFILE_UPDATE';
  metadata: string;
  timestamp: string;
}

export interface MentorProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  specialty: string;
  bio: string;
  experience: number;
  avatar: string;
  rating: number;
  tags: string[];
}

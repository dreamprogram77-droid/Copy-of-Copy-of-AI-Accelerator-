
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
  MEMBERS_PORTAL = 'MEMBERS_PORTAL',
  MEMBERSHIPS = 'MEMBERSHIPS'
}

export type ProjectTrack = 'Idea' | 'MVP' | 'Growth' | 'Investment Ready';

export interface AIReviewResult {
  readinessScore: number;
  criticalFeedback: string;
  isReadyForHumanMentor: boolean;
  suggestedNextSteps: string[];
}

export interface TaskRecord {
  id: string;
  levelId: number;
  title: string;
  description: string;
  deliverableType: string;
  status: 'LOCKED' | 'ASSIGNED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  aiReview?: AIReviewResult;
  uid?: string;
  submission?: {
    content?: string;
    fileData?: string;
    fileName?: string;
    submittedAt: string;
    feedback?: string;
  };
}

export interface RadarMetrics {
  readiness: number;
  analysis: number;
  tech: number;
  personality: number;
  strategy: number;
  ethics: number;
}

export interface Partner {
  name: string;
  role: string;
}

export interface StartupRecord {
  projectId: string;
  ownerId: string;
  name: string;
  description: string;
  industry: string;
  stage: 'Idea' | 'Prototype' | 'Product';
  currentTrack: ProjectTrack;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'STALLED';
  metrics: RadarMetrics;
  aiClassification: 'Green' | 'Yellow' | 'Red';
  aiOpinion: string;
  lastActivity: string;
  isInvestmentReady: boolean;
  foundationYear?: number;
  foundersCount?: number;
  technologies?: string;
  startupBio?: string;
  website?: string;
  linkedin?: string;
  partners?: Partner[];
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  startupName: string;
  startupDescription: string;
  industry: string;
  phone: string;
  email: string;
  logo?: string;
  name?: string; 
  hasCompletedAssessment?: boolean;
  age?: number;
  birthDate?: string;
  founderBio?: string;
  foundationYear?: number;
  foundersCount?: number;
  technologies?: string;
  agreedToTerms?: boolean;
  agreedToContract?: boolean;
  signedContractName?: string;
  contractSignedAt?: string;
  startupBio?: string;
  website?: string;
  linkedin?: string;
  partners?: Partner[];
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
  founderBio: string;
}

export interface ProgressRecord {
  id: string;
  uid: string;
  levelId: number;
  status: 'AVAILABLE' | 'COMPLETED' | 'LOCKED';
  score: number;
  completedAt?: string;
}

export interface ActivityLogRecord {
  logId: string;
  uid: string;
  actionType: string;
  metadata: string;
  timestamp: string;
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

export type ProjectStageType = 'Idea' | 'Prototype' | 'Product';
export type TechLevelType = 'Low' | 'Medium' | 'High';

export interface ApplicantProfile {
  codeName: string;
  projectStage: ProjectStageType;
  sector: string;
  goal: string;
  techLevel: TechLevelType;
}

export interface NominationData {
  companyName?: string;
  founderName?: string;
  location?: string;
  pitchDeckUrl?: string;
  hasCommercialRegister?: 'YES' | 'NO' | 'IN_PROGRESS';
  hasTechnicalPartner?: boolean;
  isCommitted10Hours?: boolean;
  problemStatement?: string;
  targetCustomerType?: string[];
  currentResources?: string[];
  tractionEvidence?: string[];
  marketSize?: 'SMALL' | 'MEDIUM' | 'LARGE' | 'UNKNOWN';
  whyNow?: string;
  productStage?: 'IDEA' | 'PROTOTYPE' | 'MVP' | 'TRACTION';
  topFeatures?: string;
  executionPlan?: 'NONE' | 'GENERAL' | 'WEEKLY';
  userCount?: string;
  revenueModel?: string;
  customerAcquisitionPath?: string;
  incubationReason?: string;
  weeklyHours?: 'LESS_5' | '5-10' | '10-20' | '20+';
  agreesToWeeklySession?: boolean;
  agreesToKPIs?: boolean;
  demoUrl?: string;
}

export interface NominationAIResponse {
  aiScore: number;
  redFlags: string[];
  aiAnalysis: string;
  categorySuggestion: string;
}

export interface NominationResult {
  totalScore: number;
  category: "DIRECT_ADMISSION" | "INTERVIEW" | "PRE_INCUBATION" | "REJECTION";
  redFlags: string[];
  aiAnalysis: string;
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
  badges: any[];
  recommendation: string;
}

export interface OpportunityAnalysis {
  newMarkets: { region: string; reasoning: string; entryBarrier: string; potentialROI: string; }[];
  untappedSegments: { segmentName: string; needs: string; strategy: string; }[];
  blueOceanIdea: string;
  quickWinAction: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface AnalyticalQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface PersonalityQuestion {
  id: number;
  situation: string;
  options: { text: string; style: string; }[];
}

export interface MentorProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  specialty: 'Tech' | 'Finance' | 'Growth' | 'Legal' | 'Strategy';
  bio: string;
  experience: number;
  avatar: string;
  rating: number;
  tags: string[];
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
  packages: ServicePackage[];
}

export interface ServiceRequest {
  id: string;
  uid: string;
  serviceId: string;
  packageId: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED';
  requestedAt: string;
  details: string;
}

export interface ProgramRating {
  stars: number;
  feedback: string;
  favoriteFeature: string;
  submittedAt: string;
}

export type AgentCategory = 'Vision' | 'Market' | 'User' | 'Opportunity';

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
}

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

export const LEVELS_CONFIG: LevelData[] = [
  { id: 1, title: 'التحقق من الفكرة', description: 'تأكد من أن فكرتك تحل مشكلة حقيقية وتستحق الاستثمار والجهد.', isCompleted: false, isLocked: false, icon: '💡' },
  { id: 2, title: 'نموذج العمل التجاري', description: 'ابنِ خطة عمل واضحة تحدد مصادر الدخل، العملاء، وقنوات التوزيع.', isCompleted: false, isLocked: false, icon: '📊' },
  { id: 3, title: 'تحليل السوق والمنافسين', description: 'افهم حجم السوق ومن هم منافسوك وكيف ستتفوق عليهم بميزتك التنافسية.', isCompleted: false, isLocked: false, icon: '🔎' },
  { id: 4, title: 'المنتج الأولي (MVP)', description: 'حدد الميزات الأساسية لمنتجك لإطلاقه بأقل التكاليف والحصول على تعليقات العملاء.', isCompleted: false, isLocked: false, icon: '🛠️' },
  { id: 5, title: 'الخطة المالية والتمويل', description: 'توقع التكاليف، الإيرادات، التدفقات النقدية، واحتياجات التمويل المستقبلي.', isCompleted: false, isLocked: false, icon: '💰' },
  { id: 6, title: 'عرض الاستثمار النهائي', description: 'جهز عرضاً تقديمياً احترافياً (Pitch Deck) لجذب المستثمرين.', isCompleted: false, isLocked: false, icon: '🚀' },
];

export const TASKS_CONFIG: TaskRecord[] = [
  { id: 'task_1', levelId: 1, title: 'تقرير التحقق الميداني', deliverableType: 'PDF Document', description: 'قم بإجراء مقابلات مع 10 عملاء محتملين ورفع النتائج في ملف PDF موحد.', status: 'LOCKED' },
  { id: 'task_2', levelId: 2, title: 'مخطط نموذج العمل النهائي', deliverableType: 'PDF (Business Model Canvas)', description: 'ارفع مخطط نموذج العمل الكامل لمشروعك بصيغة PDF مع توضيح تدفقات الإيرادات.', status: 'LOCKED' },
  { id: 'task_3', levelId: 3, title: 'مصفوفة تحليل المنافسين', deliverableType: 'PDF Table', description: 'ارفع جدول مقارنة مع 3 منافسين مباشرين يوضح ميزتك التنافسية.', status: 'LOCKED' },
  { id: 'task_4', levelId: 4, title: 'خارطة طريق الـ MVP', deliverableType: 'PDF Roadmap', description: 'ارفع قائمة المزايا والجدول الزمني لتطوير المنتج الأولي بصيغة PDF.', status: 'LOCKED' },
  { id: 'task_5', levelId: 5, title: 'نموذج التوقعات المالية', deliverableType: 'PDF/Excel Export', description: 'ارفع ملف التوقعات المالية للسنوات الثلاث الأولى متضمناً نقطة التعادل.', status: 'LOCKED' },
  { id: 'task_6', levelId: 6, title: 'ملف العرض الاستثماري النهائي', deliverableType: 'PDF Pitch Deck', description: 'ارفع النسخة النهائية من العرض الجاهز للإرسال للمستثمرين بصيغة PDF.', status: 'LOCKED' },
];

export const SECTORS = [
  { value: 'Tech', label: 'التقنية' },
  { value: 'Fintech', label: 'التقنية المالية' },
  { value: 'EdTech', label: 'التقنية التعليمية' },
  { value: 'HealthTech', label: 'التقنية الصحية' },
  { value: 'E-commerce', label: 'التجارة الإلكترونية' },
  { value: 'Industrial', label: 'صناعي' },
  { value: 'Food', label: 'أغذية ومشروبات' },
  { value: 'AgriTech', label: 'التقنية الزراعية' },
];

export const DIGITAL_SHIELDS = [
  { id: 'shield_1', name: 'درع التحقق', icon: '🛡️', color: 'from-blue-500 to-indigo-500' },
  { id: 'shield_2', name: 'درع الاستراتيجية', icon: '📊', color: 'from-emerald-500 to-teal-500' },
  { id: 'shield_3', name: 'درع السوق', icon: '🔎', color: 'from-amber-500 to-orange-500' },
  { id: 'shield_4', name: 'درع الابتكار', icon: '🛠️', color: 'from-rose-500 to-pink-500' },
  { id: 'shield_5', name: 'درع المالية', icon: '💰', color: 'from-indigo-500 to-purple-500' },
  { id: 'shield_6', name: 'درع الاستثمار', icon: '🚀', color: 'from-slate-700 to-slate-900' },
];

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: '1',
    title: 'تطوير الهوية البصرية',
    description: 'تصميم شعار وهوية متكاملة تعكس روح مشروعك الناشئ.',
    icon: '🎨',
    packages: [
      { id: 'p1', name: 'الباقة الأساسية', price: '١٥٠٠ ريال', features: ['شعار', 'بطاقة عمل'] },
      { id: 'p2', name: 'باقة التميز', price: '٣٥٠٠ ريال', features: ['دليل هوية', 'قوالب تواصل'] }
    ]
  },
  {
    id: '2',
    title: 'برمجة المنتج الأولي (MVP)',
    description: 'بناء النسخة الأولى من تطبيقك أو موقعك بأحدث التقنيات.',
    icon: '💻',
    packages: [
      { id: 'p3', name: 'باقة الويب', price: '١٥٠٠٠ ريال', features: ['تطوير React', 'لوحة تحكم'] },
      { id: 'p4', name: 'باقة التطبيقات', price: '٢٥٠٠٠ ريال', features: ['iOS & Android', 'Backend'] }
    ]
  },
  {
    id: '3',
    title: 'دراسات الجدوى والمالية',
    description: 'إعداد ملفات مالية احترافية لجذب المستثمرين.',
    icon: '📈',
    packages: [
      { id: 'p5', name: 'نموذج مالي', price: '٣٠٠٠ ريال', features: ['توقعات ٣ سنوات', 'نقطة التعادل'] },
      { id: 'p6', name: 'دراسة كاملة', price: '٧٥٠٠ ريال', features: ['تحليل سوق', 'خطة توسع'] }
    ]
  }
];

export const AVAILABLE_AGENTS: AIAgent[] = [
  { id: 'v1', name: 'Vision Strategist', description: 'يحدد الرؤية والقيم الجوهرية للمشروع.', category: 'Vision' },
  { id: 'm1', name: 'Market Analyst', description: 'يحلل حجم السوق والمنافسين.', category: 'Market' },
  { id: 'u1', name: 'User Persona Architect', description: 'يصمم ملفات تعريف المستخدمين المستهدفين.', category: 'User' },
  { id: 'o1', name: 'Opportunity Finder', description: 'يكتشف الثغرات والفرص غير المخدومة.', category: 'Opportunity' },
];

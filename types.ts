
export type UserRole = 'STARTUP' | 'PARTNER' | 'MENTOR' | 'ADMIN';

export interface UserRecord {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  earnedBadges?: string[];
  founderBio?: string;
}

export interface Badge {
  id: string;
  name: string;
  levelId: number;
  icon: string;
  description: string;
  color: string;
}

export const ACADEMY_BADGES: Badge[] = [
  { id: 'b1', levelId: 1, name: 'رائد أعمال طموح', icon: '🌟', description: 'اجتياز مرحلة التحقق الاستراتيجي من الفكرة.', color: 'from-blue-400 to-blue-600' },
  { id: 'b2', levelId: 2, name: 'مخطط استراتيجي', icon: '📋', description: 'إتقان صياغة نماذج العمل التجارية المبتكرة.', color: 'from-emerald-400 to-emerald-600' },
  { id: 'b3', levelId: 3, name: 'مهندس منتجات', icon: '⚙️', description: 'بناء النسخة الأولية القابلة للاختبار (MVP).', color: 'from-amber-400 to-amber-600' },
  { id: 'b4', levelId: 4, name: 'محلل نمو', icon: '📊', description: 'فهم مؤشرات السوق وخطط الاستحواذ والنمو.', color: 'from-rose-400 to-rose-600' },
  { id: 'b5', levelId: 5, name: 'خبير مالي', icon: '💎', description: 'بناء النماذج المالية وتوقعات التدفقات النقدية.', color: 'from-indigo-400 to-indigo-600' },
  { id: 'b6', levelId: 6, name: 'رائد أعمال متمرس', icon: '👑', description: 'الجاهزية التامة لعرض المشروع على المستثمرين.', color: 'from-slate-700 to-slate-900' }
];

export const DIGITAL_SHIELDS = ACADEMY_BADGES;

export interface Partner {
  name: string;
  role: string;
}

export interface UserProfile {
  uid?: string;
  role?: UserRole;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  phone: string;
  city?: string;
  isRemote?: boolean;
  agreedToTerms: boolean;
  agreedToContract: boolean;
  contractSignedAt?: string;
  
  startupName?: string;
  startupType?: 'Startup' | 'Existing' | 'Tech';
  startupDescription?: string;
  startupBio?: string;
  industry?: string;
  stage?: 'Idea' | 'MVP' | 'Growth' | 'InvestReady';
  logo?: string;
  partners?: Partner[];
  founderBio?: string;
  website?: string;
  linkedin?: string;
  earnedBadges?: string[]; // IDs of earned badges

  // Registration specifics
  existingRoles?: string[];
  missingRoles?: string[];
  supportNeeded?: string[];
  mentorExpertise?: string[];
  mentorSectors?: string[];
  skills?: string[];
}

export type ApplicationStatus = 'PENDING_SCREENING' | 'NEEDS_COMPLETION' | 'REVIEW_REQUIRED' | 'APPROVED' | 'REJECTED';

export interface StartupRecord {
  projectId: string;
  ownerId: string;
  ownerName: string;
  name: string;
  description: string;
  industry: string;
  status: 'PENDING' | 'APPROVED' | 'STALLED';
  applicationStatus: ApplicationStatus;
  fitScore?: number;
  aiFeedback?: string;
  metrics: { readiness: number; tech: number; market: number };
  aiOpinion: string;
  lastActivity: string;
  partners: Partner[];
  startupBio?: string;
  website?: string;
  linkedin?: string;
  aiClassification?: 'Green' | 'Yellow' | 'Red';
}

export interface LevelData {
  id: number;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  isLocked: boolean;
  isCompleted: boolean;
  customColor?: string;
}

export interface TaskRecord {
  id: string;
  levelId: number;
  uid: string;
  title: string;
  description: string;
  status: 'LOCKED' | 'ASSIGNED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  submission?: {
    fileData: string;
    fileName: string;
    submittedAt: string;
  };
  aiReview?: {
    score: number;
    feedback: string;
    isReadyForHuman: boolean;
    suggestedNextSteps?: string[];
    criticalFeedback?: string;
    readinessScore?: number;
  };
}

export const INITIAL_ROADMAP: LevelData[] = [
  { id: 1, title: 'التحقق الاستراتيجي', description: 'التثبت من وجود مشكلة حقيقية في السوق والتحقق من الفرضيات.', icon: '🎯', imageUrl: 'https://images.unsplash.com/photo-1454165833767-13143891bb39?auto=format&fit=crop&q=80&w=600', isLocked: false, isCompleted: false },
  { id: 2, title: 'هيكلة نموذج العمل', description: 'تصميم محرك الإيرادات والقيمة المضافة للمشروع.', icon: '📊', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600', isLocked: true, isCompleted: false },
  { id: 3, title: 'هندسة المنتج (MVP)', description: 'تحديد المزايا الجوهرية وبناء النسخة الأولى القابلة للاختبار.', icon: '🛠️', imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600', isLocked: true, isCompleted: false },
  { id: 4, title: 'تحليل الجدوى والنمو', description: 'دراسة حجم السوق، المنافسين، وخطط الاستحواذ.', icon: '📈', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600', isLocked: true, isCompleted: false },
  { id: 5, title: 'النمذجة المالية', description: 'التوقعات المالية، التقييم، والاحتياج التمويلي.', icon: '💰', imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600', isLocked: true, isCompleted: false },
  { id: 6, title: 'جاهزية الاستثمار', description: 'إعداد العرض التقديمي النهائي ومحاكاة لجان التحكيم.', icon: '🚀', imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=600', isLocked: true, isCompleted: false }
];

export enum FiltrationStage { 
  LANDING = 'LANDING', 
  WELCOME = 'WELCOME', 
  DASHBOARD = 'DASHBOARD',
  INCUBATION_APPLY = 'INCUBATION_APPLY',
  SCREENING_WAIT = 'SCREENING_WAIT',
  AI_MENTOR_CONCEPT = 'AI_MENTOR_CONCEPT',
  ROADMAP = 'ROADMAP',
  TOOLS = 'TOOLS',
  LOGIN = 'LOGIN',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  MENTORSHIP = 'MENTORSHIP',
  INCUBATION_PROGRAM = 'INCUBATION_PROGRAM',
  MEMBERSHIPS = 'MEMBERSHIPS',
  PARTNER_CONCEPT = 'PARTNER_CONCEPT',
  FOREIGN_INVESTMENT = 'FOREIGN_INVESTMENT'
}

export const SECTORS = [
  { value: 'Technology', label: 'التقنية' },
  { value: 'Fintech', label: 'التقنية المالية' },
  { value: 'Edtech', label: 'تقنيات التعليم' },
  { value: 'Healthtech', label: 'التقنية الصحية' },
  { value: 'Retail', label: 'التجزئة' },
  { value: 'Industrial', label: 'صناعي' },
  { value: 'Food', label: 'أغذية' }
];

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
  details: string;
  status: 'PENDING' | 'COMPLETED';
}

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: 'design',
    title: 'تصميم الهوية والبصمة',
    description: 'بناء هوية بصرية متكاملة تعكس روح مشروعك.',
    icon: '🎨',
    packages: [
      { id: 'p1', name: 'الباقة الأساسية', price: '١٥٠٠ ر.س', features: ['شعار', 'بطاقة عمل'] },
      { id: 'p2', name: 'الباقة المتكاملة', price: '٤٥٠٠ ر.س', features: ['دليل هوية', 'قوالب تواصل'] }
    ]
  }
];

export interface OpportunityAnalysis {
  newMarkets: { region: string; reasoning: string; potentialROI: string }[];
  blueOceanIdea: string;
}

export interface ProgramRating {
  stars: number;
  feedback: string;
  favoriteFeature: string;
  submittedAt: string;
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

export interface PersonalityQuestion {
  id: number;
  situation: string;
  options: { text: string; style: string }[];
}

export interface AnalyticalQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
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
  classification: 'Green' | 'Yellow' | 'Red';
  strengths: string[];
  weaknesses: string[];
  aiOpinion: string;
}

export interface FinalResult {
  score: number;
  isQualified: boolean;
  metrics: RadarMetrics;
  leadershipStyle: string;
  projectEval?: ProjectEvaluationResult;
  badges: Badge[];
}

export type AgentCategory = 'Vision' | 'Market' | 'User' | 'Opportunity';

export interface AIAgent {
  id: string;
  name: string;
  category: AgentCategory;
  description: string;
}

export const AVAILABLE_AGENTS: AIAgent[] = [
  { id: 'a1', name: 'محلل الرؤية', category: 'Vision', description: 'صياغة رؤية بعيدة المدى.' },
  { id: 'a2', name: 'محلل السوق', category: 'Market', description: 'دراسة حجم السوق والمنافسين.' },
  { id: 'a3', name: 'محلل المستخدم', category: 'User', description: 'تحديد ملفات العملاء.' },
  { id: 'a4', name: 'مكتشف الفرص', category: 'Opportunity', description: 'اكتشاف ثغرات السوق.' }
];

export interface ProjectBuildData {
  projectName: string;
  description: string;
  quality: 'Quick' | 'Balanced' | 'Enhanced' | 'Professional' | 'Max';
  selectedAgents: string[];
  results?: {
    vision?: string;
    marketAnalysis?: string;
    userPersonas?: string[];
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

export interface ActivityLogRecord {
  id: string;
  uid: string;
  event: string;
  type: string;
  date: string;
  score?: string;
  color: string;
}

export type ProjectTrack = 'Idea' | 'MVP' | 'Growth' | 'Investment Ready';

export const TASKS_CONFIG = [
  { id: 't1', title: 'خطة العمل' },
  { id: 't2', title: 'دراسة الجدوى' }
];

export interface NominationData {
  companyName: string;
  founderName: string;
  location: string;
  pitchDeckUrl: string;
  hasCommercialRegister: 'YES' | 'NO' | 'IN_PROGRESS';
  hasTechnicalPartner: boolean;
  problemStatement: string;
  targetCustomerType: string[];
  marketSize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'UNKNOWN';
  whyNow: string;
  productStage: 'IDEA' | 'PROTOTYPE' | 'MVP' | 'TRACTION';
  topFeatures: string;
  executionPlan: 'NONE' | 'GENERAL' | 'WEEKLY';
  userCount: '0 (بداية)' | '1-10' | '11-50' | '50+ مستخدم';
  tractionEvidence: string[];
  revenueModel: 'NOT_SET' | 'SUBSCRIPTION' | 'COMMISSION' | 'ANNUAL' | 'PAY_PER_USE';
  customerAcquisitionPath: string;
  incubationReason: string;
  weeklyHours: 'LESS_5' | '5-10' | '10-20' | '20+';
  agreesToWeeklySession: boolean;
  agreesToKPIs: boolean;
  isCommitted10Hours: boolean;
  currentResources: string[];
  demoUrl?: string;
}

export interface NominationResult {
  totalScore: number;
  category: 'DIRECT_ADMISSION' | 'INTERVIEW' | 'PRE_INCUBATION' | 'REJECTION';
  redFlags: string[];
  aiAnalysis: string;
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

export interface PartnerProfile {
  uid: string;
  name: string;
  email: string;
  primaryRole: 'CTO' | 'COO' | 'CMO' | 'CPO' | 'Finance';
  experienceYears: number;
  bio: string;
  linkedin: string;
  skills: string[];
  availabilityHours: number;
  commitmentType: 'Full-time' | 'Part-time' | 'Flexible';
  city: string;
  isRemote: boolean;
  workStyle: 'Fast' | 'Structured' | 'Balanced';
  goals: 'Short-term' | 'Long-term' | 'Exit';
  isVerified: boolean;
  profileCompletion: number;
}

export interface MatchResult {
  id: string;
  partnerUid: string;
  name: string;
  role: string;
  avatar?: string;
  totalScore: number;
  reasoning: string[];
  risk: string;
  scores: {
    roleFit: number;
    experienceFit: number;
    industryFit: number;
    styleFit: number;
  };
}

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea';
  placeholder: string;
  instruction: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  icon: string;
  role: UserRole[];
  isMandatory: boolean;
  fields: TemplateField[];
}

export interface TemplateSubmission {
  templateId: string;
  data: Record<string, string>;
  status: 'DRAFT' | 'APPROVED' | 'REVISION_REQUIRED';
  aiScore: number;
  aiFeedback: string;
  updatedAt: string;
}

export const TEMPLATES_LIBRARY: Template[] = [
  {
    id: 'deck_outline',
    title: 'مخطط العرض التقديمي',
    description: 'صياغة هيكل Pitch Deck مقنع.',
    icon: '📽️',
    role: ['STARTUP'],
    isMandatory: true,
    fields: [
      { id: 'problem', label: 'المشكلة', type: 'textarea', placeholder: '...', instruction: 'صف المشكلة بوضوح.' }
    ]
  }
];

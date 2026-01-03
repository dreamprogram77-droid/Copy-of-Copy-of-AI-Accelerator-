
export type UserRole = 'STARTUP' | 'PARTNER' | 'MENTOR' | 'ADMIN';

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
    readinessScore?: number;
    criticalFeedback?: string;
    suggestedNextSteps?: string[];
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
  AI_MENTOR_CONCEPT = 'AI_MENTOR_CONCEPT',
  ROADMAP = 'ROADMAP',
  TOOLS = 'TOOLS',
  LOGIN = 'LOGIN',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  MENTORSHIP = 'MENTORSHIP',
  INCUBATION_PROGRAM = 'INCUBATION_PROGRAM',
  MEMBERSHIPS = 'MEMBERSHIPS',
  PARTNER_CONCEPT = 'PARTNER_CONCEPT',
  FOREIGN_INVESTMENT = 'FOREIGN_INVESTMENT',
  PATH_FINDER = 'PATH_FINDER',
  STAFF_PORTAL = 'STAFF_PORTAL',
  // Fix: Added missing stage for incubation application view to resolve App.tsx errors
  INCUBATION_APPLY = 'INCUBATION_APPLY'
}

// Added missing models for services and components
export interface UserRecord {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone: string;
  earnedBadges?: string[];
  founderBio?: string;
}

export type ProjectTrack = 'Idea' | 'Prototype' | 'Product' | 'MVP' | 'Growth' | 'Investment Ready';

export interface StartupRecord {
  projectId: string;
  ownerId: string;
  ownerName: string;
  name: string;
  description: string;
  industry: string;
  status: 'PENDING' | 'APPROVED' | 'STALLED';
  metrics: { readiness: number; tech: number; market: number };
  aiOpinion: string;
  lastActivity: string;
  partners: Partner[];
  currentTrack?: ProjectTrack;
  startupBio?: string;
  website?: string;
  linkedin?: string;
  aiClassification?: 'Green' | 'Yellow' | 'Red';
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
  commitmentType: 'Part-time' | 'Full-time';
  city: string;
  isRemote: boolean;
  workStyle: 'Fast' | 'Structured';
  goals: 'Long-term' | 'Exit' | 'Growth';
  isVerified: boolean;
  profileCompletion: number;
}

export interface MatchResult {
  id: string;
  name: string;
  role: string;
  avatar: string;
  partnerUid: string;
  scores: {
    roleFit: number;
    experienceFit: number;
    industryFit: number;
    styleFit: number;
  };
  totalScore: number;
  reason: string;
  reasoning: string[];
  risk: string;
}

export const DIGITAL_SHIELDS = [
  { id: 's1', name: 'التحقق الاستراتيجي', icon: '🎯', color: 'from-blue-400 to-blue-600' },
  { id: 's2', name: 'هيكلة الأعمال', icon: '📊', color: 'from-emerald-400 to-emerald-600' },
  { id: 's3', name: 'هندسة المنتج', icon: '🛠️', color: 'from-amber-400 to-amber-600' },
];

export const SECTORS = [
  { value: 'Technology', label: 'التقنية والبرمجيات' },
  { value: 'Fintech', label: 'التقنية المالية' },
  { value: 'Food', label: 'الأغذية والمشروبات' },
  { value: 'Industrial', label: 'القطاع الصناعي' },
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

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: 's1',
    title: 'تصميم الهوية البصرية',
    description: 'بناء هوية تجارية متكاملة تعكس روح مشروعك الناشئ.',
    icon: '🎨',
    packages: [
      { id: 'p1', name: 'الأساسية', price: '١٥٠٠ ريال', features: ['شعار', 'ألوان', 'خطوط'] },
      { id: 'p2', name: 'المتكاملة', price: '٣٠٠٠ ريال', features: ['شعار', 'قرطاسية', 'دليل الهوية'] }
    ]
  }
];

export interface ServiceRequest {
  id: string;
  uid: string;
  serviceId: string;
  packageId: string;
  details: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
  createdAt: string;
}

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

export interface ApplicantProfile {
  codeName: string;
  projectStage: ProjectTrack;
  sector: string;
  goal: string;
  techLevel: 'Low' | 'Medium' | 'High';
}

export type ProjectStageType = 'Idea' | 'Prototype' | 'Product';
export type TechLevelType = 'Low' | 'Medium' | 'High';

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

export interface FinalResult {
  score: number;
  isQualified: boolean;
  metrics: RadarMetrics;
  leadershipStyle: string;
  projectEval?: ProjectEvaluationResult;
  badges: Badge[];
}

export interface ProjectEvaluationResult {
  totalScore: number;
  classification: 'Green' | 'Yellow' | 'Red';
  clarity: number;
  value: number;
  innovation: number;
  market: number;
  readiness: number;
  strengths: string[];
  weaknesses: string[];
  aiOpinion: string;
}

export type AgentCategory = 'Vision' | 'Market' | 'User' | 'Opportunity';

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
}

export const AVAILABLE_AGENTS: AIAgent[] = [
  { id: 'v1', name: 'خبير الرؤية', description: 'صياغة رؤية بعيدة المدى.', category: 'Vision' },
  { id: 'm1', name: 'محلل السوق', description: 'دراسة التوجهات والمنافسين.', category: 'Market' },
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

export interface ActivityLogRecord {
  id: string;
  uid: string;
  event: string;
  type: string;
  date: string;
  score?: string;
  color: string;
}

export const TASKS_CONFIG = [
  { title: 'تحليل المشكلة', id: 't1' },
  { title: 'نموذج العمل', id: 't2' },
];

export interface NominationData {
  companyName: string;
  founderName: string;
  location: string;
  pitchDeckUrl?: string;
  hasCommercialRegister: 'YES' | 'NO' | 'IN_PROGRESS';
  hasTechnicalPartner: boolean;
  isCommitted10Hours: boolean;
  problemStatement: string;
  targetCustomerType: string[];
  marketSize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'UNKNOWN';
  whyNow: string;
  productStage: 'IDEA' | 'PROTOTYPE' | 'MVP' | 'TRACTION';
  topFeatures: string;
  executionPlan: 'NONE' | 'GENERAL' | 'WEEKLY';
  userCount: '0' | '1-10' | '11-50' | '50+';
  revenueModel: 'NOT_SET' | 'SUBSCRIPTION' | 'COMMISSION' | 'ANNUAL' | 'PAY_PER_USE';
  customerAcquisitionPath: string;
  incubationReason: string;
  weeklyHours: 'LESS_5' | '5-10' | '10-20' | '20+';
  agreesToWeeklySession: boolean;
  agreesToKPIs: boolean;
  demoUrl?: string;
}

export interface NominationResult {
  aiScore: number;
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
  isMandatory: boolean;
  role: UserRole[];
  fields: TemplateField[];
}

export interface TemplateSubmission {
  templateId: string;
  data: Record<string, string>;
  aiScore: number;
  aiFeedback: string;
  status: 'DRAFT' | 'APPROVED' | 'REVISION_REQUIRED';
  updatedAt: string;
}

export const TEMPLATES_LIBRARY: Template[] = [
  {
    id: 'bmc',
    title: 'مخطط نموذج العمل',
    description: 'هيكلة القيمة والإيرادات.',
    icon: '📊',
    isMandatory: true,
    role: ['STARTUP'],
    fields: [
      { id: 'vp', label: 'القيمة المقترحة', type: 'textarea', placeholder: '...', instruction: 'ما الذي يميزك؟' }
    ]
  }
];

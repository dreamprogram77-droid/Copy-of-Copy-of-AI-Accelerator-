
export type UserRole = 'STARTUP' | 'PARTNER' | 'MENTOR' | 'ADMIN';

export interface Partner {
  name: string;
  role: string;
}

export interface UserProfile {
  uid?: string;
  role?: UserRole;
  firstName: string;
  lastName: string;
  name?: string; // Full name helper
  email: string;
  phone: string;
  city?: string;
  isRemote?: boolean;
  agreedToTerms: boolean;
  agreedToContract: boolean;
  contractSignedAt?: string;
  
  // Startup Specific
  startupName?: string;
  startupType?: 'Startup' | 'Existing' | 'Tech';
  startupDescription?: string;
  startupBio?: string;
  industry?: string;
  stage?: 'Idea' | 'MVP' | 'Growth' | 'InvestReady';
  problem?: string;
  solution?: string;
  targetAudience?: string;
  hasMVP?: boolean;
  mvpLink?: string;
  founderCount?: number;
  founderBio?: string;
  hasPartners?: boolean;
  existingRoles?: string[];
  missingRoles?: string[];
  supportNeeded?: string[];
  goal?: string;
  commitmentDuration?: '3m' | '6m' | 'more';
  website?: string;
  logo?: string;
  partners?: Partner[];

  // Partner Specific
  primaryRole?: 'Tech' | 'Sales' | 'Product' | 'Ops' | 'Finance' | 'CTO' | 'COO' | 'CMO' | 'CPO';
  experienceYears?: number;
  sectors?: string[];
  skills?: string[];
  workedInStartup?: boolean;
  availability?: 'Part-time' | 'Full-time';
  weeklyHours?: number;
  partnershipType?: 'Equity' | 'Trial' | 'Project';
  preferredStages?: string[];
  github?: string;
  portfolio?: string;
  linkedin?: string;
  achievement?: string;

  // Mentor Specific
  currentJob?: string;
  mentorExpertise?: string[];
  mentorSectors?: string[];
  previousMentorExp?: boolean;
  sessionCount?: number;
  mentorshipTypes?: string[];
  monthlySessions?: number;
  mentorshipMode?: 'Remote' | 'On-site';
  longTermMentorship?: boolean;
  personalWebsite?: string;
}

export type TemplateStage = 'IDEA' | 'MVP' | 'GROWTH' | 'INVESTMENT';
export interface TemplateField { id: string; label: string; type: 'text' | 'textarea' | 'select' | 'list'; placeholder?: string; options?: string[]; instruction: string; }
export interface Template { id: string; title: string; stage: TemplateStage; icon: string; role: UserRole[]; isMandatory: boolean; fields: TemplateField[]; description: string; }
export interface TemplateSubmission { templateId: string; uid: string; data: Record<string, any>; status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REVISION_REQUIRED'; aiScore?: number; aiFeedback?: string; updatedAt: string; }

export const TEMPLATES_LIBRARY: Template[] = [
  {
    id: 'tp_problem_fit',
    title: 'ملاءمة المشكلة والحل',
    stage: 'IDEA',
    icon: '🎯',
    role: ['STARTUP'],
    isMandatory: true,
    description: 'توثيق الفهم العميق لمشكلة العميل وكيفية معالجتها.',
    fields: [
      { id: 'problem', label: 'المشكلة الجوهرية', type: 'textarea', instruction: 'صف الألم الذي يشعر به العميل في سطرين.', placeholder: 'يعاني أصحاب المتاجر من...' },
      { id: 'alternatives', label: 'البدائل الحالية', type: 'textarea', instruction: 'كيف يحل العميل مشكلته الآن؟', placeholder: 'استخدام جداول إكسل يدوية...' },
      { id: 'solution', label: 'الحل المقترح', type: 'textarea', instruction: 'كيف يغير منتجك حياة العميل؟', placeholder: 'منصة آلية تربط بين...' }
    ]
  }
];

export interface TaskRecord { id: string; levelId: number; uid: string; title: string; description: string; status: 'LOCKED' | 'ASSIGNED' | 'SUBMITTED' | 'APPROVED'; submission?: { fileData: string; fileName: string; submittedAt: string; }; aiReview?: any; }
export enum FiltrationStage { 
  LANDING = 'LANDING', 
  AI_MENTOR_CONCEPT = 'AI_MENTOR_CONCEPT', 
  PARTNER_CONCEPT = 'PARTNER_CONCEPT', 
  WELCOME = 'WELCOME', 
  PATH_FINDER = 'PATH_FINDER', 
  ROADMAP = 'ROADMAP', 
  TOOLS = 'TOOLS', 
  ACHIEVEMENTS = 'ACHIEVEMENTS', 
  MENTORSHIP = 'MENTORSHIP', 
  INCUBATION_PROGRAM = 'INCUBATION_PROGRAM', 
  MEMBERSHIPS = 'MEMBERSHIPS', 
  LOGIN = 'LOGIN', 
  DASHBOARD = 'DASHBOARD', 
  STAFF_PORTAL = 'STAFF_PORTAL',
  FOREIGN_INVESTMENT = 'FOREIGN_INVESTMENT' 
}

export interface ApplicantProfile {
  codeName: string;
  projectStage: ProjectStageType;
  sector: string;
  goal: string;
  techLevel: TechLevelType;
}

export type ProjectStageType = 'Idea' | 'Prototype' | 'Product';
export type TechLevelType = 'Low' | 'Medium' | 'High';

export const SECTORS = [
  { value: 'Tech', label: 'التقنية' },
  { value: 'SaaS', label: 'البرمجيات كخدمة' },
  { value: 'Fintech', label: 'التقنية المالية' },
  { value: 'E-commerce', label: 'التجارة الإلكترونية' },
  { value: 'Health', label: 'التقنية الصحية' },
  { value: 'Industrial', label: 'صناعي' },
  { value: 'Food', label: 'أغذية ومشروبات' }
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
  userCount: '0' | '1-10' | '11-50' | '50+';
  revenueModel: 'NOT_SET' | 'SUBSCRIPTION' | 'COMMISSION' | 'ANNUAL' | 'PAY_PER_USE';
  customerAcquisitionPath: string;
  incubationReason: string;
  weeklyHours: 'LESS_5' | '5-10' | '10-20' | '20+';
  agreesToWeeklySession: boolean;
  agreesToKPIs: boolean;
  isCommitted10Hours?: boolean;
  demoUrl?: string;
}

export interface NominationResult {
  totalScore: number;
  category: 'DIRECT_ADMISSION' | 'INTERVIEW' | 'PRE_INCUBATION' | 'REJECTION';
  redFlags: string[];
  aiAnalysis: string;
}

export interface UserRecord {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone: string;
  founderBio?: string;
}

export interface StartupRecord {
  projectId: string;
  ownerId: string;
  ownerName: string;
  name: string;
  description: string;
  industry: string;
  currentTrack?: ProjectTrack;
  status: 'PENDING' | 'APPROVED' | 'STALLED';
  metrics: { readiness: number; tech: number; market: number };
  aiOpinion: string;
  lastActivity: string;
  partners: Partner[];
  startupBio?: string;
  website?: string;
  linkedin?: string;
  aiClassification?: 'Green' | 'Yellow' | 'Red';
}

export type ProjectTrack = 'Idea' | 'MVP' | 'Growth' | 'Investment Ready';

export interface PartnerProfile {
  uid: string;
  name: string;
  email: string;
  primaryRole: string;
  experienceYears: number;
  bio: string;
  linkedin: string;
  skills: string[];
  availabilityHours: number;
  commitmentType: 'Part-time' | 'Full-time';
  city: string;
  isRemote: boolean;
  workStyle: WorkStyle;
  goals: PartnershipGoal;
  isVerified: boolean;
  profileCompletion: number;
}

export type WorkStyle = 'Fast' | 'Balanced' | 'Structured';
export type PartnershipGoal = 'Short-term' | 'Long-term' | 'Project-based';

export interface AnalyticalQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
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

export interface AIReviewResult {
  readinessScore: number;
  criticalFeedback: string;
  suggestedNextSteps: string[];
  isReadyForHumanMentor: boolean;
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

export interface Question {
  text: string;
  options: string[];
  correctIndex: number;
}

export interface LevelData {
  id: number;
  title: string;
  description: string;
  icon: string;
  isLocked: boolean;
  isCompleted: boolean;
  customColor?: string;
}

export const DIGITAL_SHIELDS = [
  { id: 'shield_idea', name: 'درع الفكرة', icon: '💡', color: 'from-blue-500 to-cyan-500' },
  { id: 'shield_mvp', name: 'درع النموذج', icon: '🛠️', color: 'from-emerald-500 to-teal-500' },
  { id: 'shield_market', name: 'درع السوق', icon: '📊', color: 'from-amber-500 to-orange-500' }
];

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  packages: ServicePackage[];
}

export interface ServicePackage {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: 's_dev',
    title: 'تطوير MVP تقني',
    description: 'بناء النسخة الأولى من منتجك.',
    icon: '💻',
    packages: [
      { id: 'p_basic', name: 'أساسية', price: '5000$', features: ['Landing Page', 'Auth'] },
      { id: 'p_pro', name: 'احترافية', price: '12000$', features: ['Mobile App', 'Backend'] }
    ]
  }
];

export interface ServiceRequest {
  id: string;
  uid: string;
  serviceId: string;
  packageId: string;
  details: string;
  status: 'PENDING' | 'COMPLETED';
  requestedAt: string;
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

export interface PersonalityQuestion {
  id: number;
  situation: string;
  options: { text: string; style: string }[];
}

export interface FinalResult {
  score: number;
  isQualified: boolean;
  metrics: RadarMetrics;
  leadershipStyle: string;
  projectEval?: ProjectEvaluationResult;
  badges: { id: string; name: string; icon: string }[];
}

export interface RadarMetrics {
  readiness: number;
  analysis: number;
  tech: number;
  personality: number;
  strategy: number;
  ethics: number;
}

export type AgentCategory = 'Vision' | 'Market' | 'User' | 'Opportunity';

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
}

export const AVAILABLE_AGENTS: AIAgent[] = [
  { id: 'a_vision', name: 'وكيل الرؤية', description: 'صياغة الرؤية البعيدة.', category: 'Vision' },
  { id: 'a_market', name: 'وكيل السوق', description: 'تحليل المنافسين.', category: 'Market' }
];

export interface ProjectBuildData {
  projectName: string;
  description: string;
  quality: 'Quick' | 'Balanced' | 'Enhanced' | 'Professional' | 'Max';
  selectedAgents: string[];
  results?: {
    vision: string;
    marketAnalysis: string;
    userPersonas: string;
    hypotheses: string[];
    pitchDeck?: { title: string; content: string }[];
  };
}

export const TASKS_CONFIG: Partial<TaskRecord>[] = [
  { id: 't1', levelId: 1, title: 'تحليل المشكلة', description: 'قدم تحليلاً معمقاً للمشكلة.' }
];

export interface PartnerMatchRequest {
  projectId: string;
  criteria: any;
}

export interface MatchScore {
  partnerUid: string;
  score: number;
  reasoning: string[];
  risk: string;
}

export interface ActivityLogRecord {
  id: string;
  uid: string;
  event: string;
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

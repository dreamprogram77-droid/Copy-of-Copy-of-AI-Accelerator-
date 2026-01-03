
export enum FiltrationStage {
  LANDING = 'LANDING',
  PATH_FINDER = 'PATH_FINDER',
  WELCOME = 'WELCOME',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  STAFF_PORTAL = 'STAFF_PORTAL',
  PARTNER_MATCHING = 'PARTNER_MATCHING',
  ROADMAP = 'ROADMAP',
  TOOLS = 'TOOLS',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  MENTORSHIP = 'MENTORSHIP',
  INCUBATION_PROGRAM = 'INCUBATION_PROGRAM',
  MEMBERSHIPS = 'MEMBERSHIPS',
  PARTNER_CONCEPT = 'PARTNER_CONCEPT',
  AI_MENTOR_CONCEPT = 'AI_MENTOR_CONCEPT'
}

export type UserRole = 'ADMIN' | 'STARTUP' | 'MENTOR' | 'PARTNER';

export type WorkStyle = 'Organized' | 'Fast' | 'Research-based' | 'Field-oriented';
export type PartnershipGoal = 'Long-term' | 'Project-based' | 'Trial';

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
  topFeatures: string;
  executionPlan: 'NONE' | 'GENERAL' | 'WEEKLY';
  userCount: '0 (بداية)' | '1-10' | '11-50' | '50+ مستخدم' | string;
  tractionEvidence: string[];
  revenueModel: 'NOT_SET' | 'SUBSCRIPTION' | 'COMMISSION' | 'ANNUAL' | 'PAY_PER_USE';
  customerAcquisitionPath: string;
  incubationReason: string;
  weeklyHours: 'LESS_5' | '5-10' | '10-20' | '20+';
  agreesToWeeklySession: boolean;
  agreesToKPIs: boolean;
  isCommitted10Hours?: boolean;
  currentResources?: string[];
  demoUrl?: string;
  executionPlanValue?: string;
}

export interface NominationAIResponse {
  aiScore: number;
  redFlags: string[];
  aiAnalysis: string;
  categorySuggestion: string;
}

export interface NominationResult {
  totalScore: number;
  category: 'REJECTION' | 'DIRECT_ADMISSION' | 'INTERVIEW' | 'PRE_INCUBATION';
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

export interface OpportunityAnalysis {
  newMarkets: {
    region: string;
    reasoning: string;
    entryBarrier: string;
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

export interface LevelData {
  id: number;
  title: string;
  description: string;
  icon: string;
  isCompleted: boolean;
  isLocked: boolean;
  customColor?: string;
}

export interface Question {
  text: string;
  options: string[];
  correctIndex: number;
}

export interface AnalyticalQuestion extends Question {
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
  badges: { id: string; name: string; icon: string }[];
}

export interface PersonalityQuestion {
  id: number;
  situation: string;
  options: { text: string; style: string }[];
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
  icon: string;
  description: string;
  packages: ServicePackage[];
}

export interface ServiceRequest {
  id: string;
  uid: string;
  serviceId: string;
  packageId: string;
  details: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED';
  requestedAt: string;
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

export const AVAILABLE_AGENTS: AIAgent[] = [
  { id: 'a1', name: 'محلل الرؤية الاستراتيجية', description: 'يحلل الرؤية طويلة المدى للمشروع ومواءمتها مع أهداف السوق.', category: 'Vision' },
  { id: 'a2', name: 'مهندس القيمة المضافة', description: 'يصيغ عرض القيمة بشكل يبرز التميز التنافسي.', category: 'Vision' },
  { id: 'a3', name: 'محلل فجوات السوق', description: 'يكتشف الثغرات في السوق الحالي والمنافسين.', category: 'Market' },
  { id: 'a4', name: 'خبير حجم السوق (TAM/SAM)', description: 'يحسب حجم السوق المتاح والمستهدف بدقة.', category: 'Market' },
  { id: 'a5', name: 'مصمم شخصية العميل', description: 'يبني ملفات تعريفية دقيقة للعملاء المستهدفين.', category: 'User' },
  { id: 'a6', name: 'محلل رحلة المستخدم', description: 'يرسم خريطة تفاعل المستخدم مع المنتج من البداية.', category: 'User' },
  { id: 'a7', name: 'مكتشف المحيط الأزرق', description: 'يبحث عن مناطق خالية من المنافسة لنمو المشروع.', category: 'Opportunity' },
  { id: 'a8', name: 'محلل الاتجاهات العالمية', description: 'يربط المشروع بالتوجهات العالمية الصاعدة.', category: 'Opportunity' },
  { id: 'a9', name: 'مهندس استراتيجيات التوسع', description: 'يصمم خطط الانتقال من المحلية إلى العالمية.', category: 'Opportunity' },
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
  type: string;
  content: string;
  timestamp: string;
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
  linkedin?: string;
}

export interface PartnerProfile {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  primaryRole: 'CTO' | 'CEO' | 'CMO' | 'COO' | 'CPO' | 'Finance';
  skills: string[];
  industries: string[];
  experienceYears: number;
  availabilityHours: number;
  commitmentType: 'Full-time' | 'Part-time' | 'Weekends';
  city: string;
  isRemote: boolean;
  workStyle: WorkStyle;
  goals: PartnershipGoal;
  bio: string;
  linkedin: string;
  proofOfWorkLink?: string;
  isVerified: boolean;
  profileCompletion: number;
}

export interface MatchScore {
  total: number;
  roleIntegration: number; // 30
  stageAlignment: number;  // 20
  industryFit: number;     // 15
  locationFit: number;     // 10
  styleFit: number;        // 10
  goalFit: number;         // 10
  seriousness: number;     // 5
  aiReasoning: string[];
  risks: string;
}

export interface PartnerMatchRequest {
  id: string;
  startupId: string;
  seekerUid: string;
  requiredRole: string;
  status: 'OPEN' | 'MATCHED' | 'TRIAL' | 'CLOSED';
  invites: {
    partnerUid: string;
    score: MatchScore;
    status: 'SUGGESTED' | 'INVITED' | 'ACCEPTED' | 'REJECTED';
    trialStartedAt?: string;
  }[];
}

// Re-exporting existing core types
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
    fileData?: string;
    fileName?: string;
    submittedAt: string;
    feedback?: string;
  };
}

export interface Partner {
  name: string;
  role: string;
}

export interface StartupRecord {
  projectId: string;
  ownerId: string;
  ownerName: string;
  name: string;
  description: string;
  industry: string;
  currentTrack: ProjectTrack;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'STALLED';
  metrics: {
    readiness: number;
    tech: number;
    market: number;
  };
  aiOpinion: string;
  lastActivity: string;
  mentorId?: string;
  partners?: Partner[];
  startupBio?: string;
  website?: string;
  linkedin?: string;
  aiClassification?: 'Green' | 'Yellow' | 'Red';
  needsRole?: string;
  workStyle?: WorkStyle;
}

export interface UserRecord {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  startupId?: string;
  phone: string;
  founderBio?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  startupName: string;
  startupDescription: string;
  industry: string;
  phone: string;
  email: string;
  name?: string;
  logo?: string;
  hasCompletedAssessment?: boolean;
  founderBio?: string;
  age?: number;
  birthDate?: string;
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

export const TRACK_CONFIG: Record<ProjectTrack, { id: number; label: string; minScore: number }> = {
  'Idea': { id: 1, label: 'مرحلة الفكرة', minScore: 0 },
  'MVP': { id: 2, label: 'المنتج الأولي', minScore: 70 },
  'Growth': { id: 3, label: 'مرحلة النمو', minScore: 85 },
  'Investment Ready': { id: 4, label: 'جاهز للاستثمار', minScore: 95 }
};

export const SECTORS = [
  { value: 'Tech', label: 'التقنية' },
  { value: 'Fintech', label: 'التقنية المالية' },
  { value: 'EdTech', label: 'التقنية التعليمية' },
  { value: 'HealthTech', label: 'التقنية الصحية' },
  { value: 'E-commerce', label: 'التجارة الإلكترونية' }
];

export const TASKS_CONFIG: TaskRecord[] = [
  { id: 't1', levelId: 1, title: 'تحليل المشكلة', description: 'صف المشكلة بعمق.', deliverableType: 'PDF', status: 'LOCKED' }
];

export const DIGITAL_SHIELDS = [
  { id: 's1', name: 'درع الجدية', icon: '🛡️', color: 'from-blue-500 to-indigo-500' }
];

export const SERVICES_CATALOG: ServiceItem[] = [
  { 
    id: '1', 
    title: 'تصميم UI/UX', 
    icon: '🎨', 
    description: 'تصميم واجهات احترافية.', 
    packages: [{ id: 'p1', name: 'باقة 1', price: '1000', features: ['Feature A'] }] 
  }
];

export const LEVELS_CONFIG: LevelData[] = [
  { id: 1, title: 'التحقق', description: 'التحقق من الفكرة.', icon: '💡', isCompleted: false, isLocked: false }
];

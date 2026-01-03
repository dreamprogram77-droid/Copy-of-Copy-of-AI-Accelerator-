
import { UserRecord, StartupRecord, UserProfile, TaskRecord, TASKS_CONFIG, PartnerProfile, PartnerMatchRequest, MatchScore, ServiceRequest } from '../types';

const DB_KEYS = {
  USERS: 'db_users',
  STARTUPS: 'db_startups',
  PARTNERS: 'db_partners',
  MATCH_REQUESTS: 'db_match_requests',
  TASKS: 'db_tasks',
  SESSION: 'db_current_session',
  SERVICE_REQUESTS: 'db_service_requests'
};

export const storageService = {
  registerUser: (profile: UserProfile): { user: UserRecord; startup: StartupRecord } => {
    const uid = `u_${Date.now()}`;
    const newUser: UserRecord = {
      uid,
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      role: 'STARTUP',
      phone: profile.phone || '',
      founderBio: profile.founderBio
    };

    const newStartup: StartupRecord = {
      projectId: `p_${Date.now()}`,
      ownerId: uid,
      ownerName: `${profile.firstName} ${profile.lastName}`,
      name: profile.startupName || '',
      description: profile.startupDescription || '',
      industry: profile.industry || '',
      currentTrack: 'Idea',
      status: 'PENDING',
      metrics: { readiness: 45, tech: 30, market: 40 },
      aiOpinion: 'تحت المراجعة الاستراتيجية',
      lastActivity: new Date().toISOString(),
      partners: []
    };

    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    const startups = JSON.parse(localStorage.getItem(DB_KEYS.STARTUPS) || '[]');
    
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify([...users, newUser]));
    localStorage.setItem(DB_KEYS.STARTUPS, JSON.stringify([...startups, newStartup]));
    localStorage.setItem(DB_KEYS.SESSION, JSON.stringify({ uid, projectId: newStartup.projectId }));

    const tasks = TASKS_CONFIG.map(t => ({ ...t, uid, status: t.levelId === 1 ? 'ASSIGNED' : 'LOCKED' as any }));
    const allTasks = JSON.parse(localStorage.getItem(DB_KEYS.TASKS) || '[]');
    localStorage.setItem(DB_KEYS.TASKS, JSON.stringify([...allTasks, ...tasks]));

    return { user: newUser, startup: newStartup };
  },

  registerAsPartner: (data: PartnerProfile) => {
    const partners = JSON.parse(localStorage.getItem(DB_KEYS.PARTNERS) || '[]');
    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    
    const newUser: UserRecord = {
      uid: data.uid,
      firstName: data.name.split(' ')[0],
      lastName: data.name.split(' ').slice(1).join(' '),
      email: data.email,
      role: 'PARTNER',
      phone: '',
    };

    localStorage.setItem(DB_KEYS.USERS, JSON.stringify([...users, newUser]));
    localStorage.setItem(DB_KEYS.PARTNERS, JSON.stringify([...partners, data]));
    localStorage.setItem(DB_KEYS.SESSION, JSON.stringify({ uid: data.uid }));
  },

  updateUser: (uid: string, data: Partial<UserRecord>) => {
    const users: UserRecord[] = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    const updated = users.map(u => u.uid === uid ? { ...u, ...data } : u);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(updated));
  },

  updateStartup: (projectId: string, data: Partial<StartupRecord>) => {
    const startups: StartupRecord[] = JSON.parse(localStorage.getItem(DB_KEYS.STARTUPS) || '[]');
    const updated = startups.map(s => s.projectId === projectId ? { ...s, ...data } : s);
    localStorage.setItem(DB_KEYS.STARTUPS, JSON.stringify(updated));
  },

  getAllPartners: (): PartnerProfile[] => {
    const partners = JSON.parse(localStorage.getItem(DB_KEYS.PARTNERS) || '[]');
    return partners;
  },

  getPartnerProfile: (uid: string): PartnerProfile | null => {
    const partners = JSON.parse(localStorage.getItem(DB_KEYS.PARTNERS) || '[]');
    return partners.find((p: any) => p.uid === uid) || null;
  },

  loginUser: (email: string): { user: UserRecord; startup?: StartupRecord } | null => {
    const users: UserRecord[] = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;

    const startups: StartupRecord[] = JSON.parse(localStorage.getItem(DB_KEYS.STARTUPS) || '[]');
    const startup = startups.find(s => s.ownerId === user.uid);
    localStorage.setItem(DB_KEYS.SESSION, JSON.stringify({ uid: user.uid, projectId: startup?.projectId }));
    
    return { user, startup };
  },

  getCurrentSession: () => {
    const session = localStorage.getItem(DB_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  },

  getUserTasks: (uid: string): TaskRecord[] => {
    const tasks = JSON.parse(localStorage.getItem(DB_KEYS.TASKS) || '[]');
    return tasks.filter((t: any) => t.uid === uid);
  },

  getAllStartups: (): StartupRecord[] => JSON.parse(localStorage.getItem(DB_KEYS.STARTUPS) || '[]'),
  getAllUsers: (): UserRecord[] => JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]'),
  
  getUserServiceRequests: (uid: string): ServiceRequest[] => {
    const requests = JSON.parse(localStorage.getItem(DB_KEYS.SERVICE_REQUESTS) || '[]');
    return requests.filter((r: any) => r.uid === uid);
  },

  submitTask: (uid: string, taskId: string, submission: { fileData: string, fileName: string }) => {
    const allTasks: TaskRecord[] = JSON.parse(localStorage.getItem(DB_KEYS.TASKS) || '[]');
    const updatedTasks = allTasks.map(t => 
      (t.uid === uid && t.id === taskId) 
        ? { ...t, status: 'SUBMITTED' as const, submission: { ...submission, submittedAt: new Date().toISOString() } } 
        : t
    );
    localStorage.setItem(DB_KEYS.TASKS, JSON.stringify(updatedTasks));
  },

  requestService: (uid: string, serviceId: string, packageId: string, details: string) => {
    const requests = JSON.parse(localStorage.getItem(DB_KEYS.SERVICE_REQUESTS) || '[]');
    const newRequest: ServiceRequest = {
      id: `sr_${Date.now()}`,
      uid,
      serviceId,
      packageId,
      details,
      status: 'PENDING',
      requestedAt: new Date().toISOString()
    };
    localStorage.setItem(DB_KEYS.SERVICE_REQUESTS, JSON.stringify([...requests, newRequest]));
  },

  seedDemoAccount: (): string => {
    const demoEmail = 'admin@bizdev.ai';
    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    if (users.find((u: any) => u.email === demoEmail)) return demoEmail;
    
    const admin: UserRecord = {
      uid: 'u_admin',
      firstName: 'مدير',
      lastName: 'الحاضنة',
      email: demoEmail,
      role: 'ADMIN',
      phone: '0500000000'
    };
    
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify([...users, admin]));
    return demoEmail;
  }
};

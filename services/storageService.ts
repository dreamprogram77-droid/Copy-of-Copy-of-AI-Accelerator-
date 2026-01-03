
import { UserRecord, StartupRecord, UserProfile, TaskRecord, INITIAL_ROADMAP, LevelData, ApplicationStatus, ServiceRequest, ProgramRating, PartnerProfile } from '../types';

const DB_KEYS = {
  USERS: 'db_users',
  STARTUPS: 'db_startups',
  TASKS: 'db_tasks',
  ROADMAP: 'db_roadmap',
  SESSION: 'db_current_session',
  SERVICES: 'db_services',
  RATINGS: 'db_ratings',
  PARTNERS: 'db_partners'
};

const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (e instanceof DOMException && (e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError')) {
      console.warn(`Storage quota exceeded. Clean binary data first.`);
      return false;
    }
    throw e;
  }
};

export const storageService = {
  /* Registers a new user and initializes their roadmap and startup record */
  registerUser: (profile: UserProfile): { user: UserRecord; startup?: StartupRecord } => {
    const uid = profile.uid || `u_${Date.now()}`;
    const role = profile.role || 'STARTUP';

    const newUser: UserRecord = {
      uid,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      role: role,
      phone: profile.phone
    };

    let newStartup: StartupRecord | undefined;
    if (role === 'STARTUP') {
      newStartup = {
        projectId: `p_${Date.now()}`,
        ownerId: uid,
        ownerName: `${profile.firstName} ${profile.lastName}`,
        name: profile.startupName || '',
        description: profile.startupDescription || '',
        industry: profile.industry || '',
        status: 'PENDING',
        applicationStatus: 'PENDING_SCREENING',
        metrics: { readiness: 10, tech: 0, market: 0 },
        aiOpinion: 'قيد التقييم الأولي',
        lastActivity: new Date().toISOString(),
        partners: []
      };
      const startups = JSON.parse(localStorage.getItem(DB_KEYS.STARTUPS) || '[]');
      safeSetItem(DB_KEYS.STARTUPS, JSON.stringify([...startups, newStartup]));
      
      safeSetItem(`${DB_KEYS.ROADMAP}_${uid}`, JSON.stringify(INITIAL_ROADMAP));
      const initialTasks: TaskRecord[] = INITIAL_ROADMAP.map(l => ({
        id: `t_${l.id}_${uid}`,
        levelId: l.id,
        uid,
        title: `مخرج: ${l.title}`,
        description: `يرجى رفع ملف PDF يحتوي على مخرجات المرحلة: ${l.title}`,
        status: l.id === 1 ? 'ASSIGNED' : 'LOCKED'
      }));
      const allTasks = JSON.parse(localStorage.getItem(DB_KEYS.TASKS) || '[]');
      safeSetItem(DB_KEYS.TASKS, JSON.stringify([...allTasks, ...initialTasks]));
    }

    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    safeSetItem(DB_KEYS.USERS, JSON.stringify([...users, { ...newUser, earnedBadges: [] }]));
    safeSetItem(DB_KEYS.SESSION, JSON.stringify({ uid, projectId: newStartup?.projectId }));

    return { user: newUser, startup: newStartup };
  },

  /* Updates the status and fit score of a startup application */
  updateStartupApplication: (projectId: string, status: ApplicationStatus, fitScore: number, feedback: string) => {
    const startups = storageService.getAllStartups();
    const updated = startups.map(s => s.projectId === projectId ? { 
      ...s, 
      applicationStatus: status, 
      fitScore, 
      aiFeedback: feedback,
      status: status === 'APPROVED' ? 'APPROVED' as const : s.status
    } : s);
    safeSetItem(DB_KEYS.STARTUPS, JSON.stringify(updated));
  },

  /* Returns the roadmap for a specific user */
  getCurrentRoadmap: (uid: string): LevelData[] => {
    const data = localStorage.getItem(`${DB_KEYS.ROADMAP}_${uid}`);
    return data ? JSON.parse(data) : INITIAL_ROADMAP;
  },

  /* Returns all tasks assigned to a specific user */
  getUserTasks: (uid: string): TaskRecord[] => {
    const tasks = JSON.parse(localStorage.getItem(DB_KEYS.TASKS) || '[]');
    return tasks.filter((t: any) => t.uid === uid);
  },

  /* Records a task submission and AI review results */
  submitTask: (uid: string, taskId: string, submission: { fileData: string; fileName: string }, aiReview?: any) => {
    const allTasks: TaskRecord[] = JSON.parse(localStorage.getItem(DB_KEYS.TASKS) || '[]');
    const updatedTasks = allTasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'SUBMITTED' as const,
          submission: { ...submission, submittedAt: new Date().toISOString() },
          aiReview
        };
      }
      return t;
    });
    safeSetItem(DB_KEYS.TASKS, JSON.stringify(updatedTasks));
  },

  /* Marks a task as approved and unlocks the next level/task */
  approveTask: (uid: string, taskId: string) => {
    const allTasks: TaskRecord[] = JSON.parse(localStorage.getItem(DB_KEYS.TASKS) || '[]');
    const currentTask = allTasks.find(t => t.id === taskId);
    if (!currentTask) return;

    const updatedTasks = allTasks.map(t => {
      if (t.id === taskId) return { ...t, status: 'APPROVED' as const };
      if (t.uid === uid && t.levelId === currentTask.levelId + 1) return { ...t, status: 'ASSIGNED' as const };
      return t;
    });
    safeSetItem(DB_KEYS.TASKS, JSON.stringify(updatedTasks));
  },

  /* Validates login credentials and starts a session */
  loginUser: (email: string) => {
    const users = storageService.getAllUsers();
    const user = users.find(u => u.email === email);
    if (!user) return null;
    const startups = storageService.getAllStartups();
    const startup = startups.find(s => s.ownerId === user.uid);
    safeSetItem(DB_KEYS.SESSION, JSON.stringify({ uid: user.uid, projectId: startup?.projectId }));
    return { user, startup };
  },

  /* Returns the currently active session */
  getCurrentSession: () => {
    const session = localStorage.getItem(DB_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  },

  /* Bulk data retrieval methods */
  getAllUsers: (): UserRecord[] => JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]'),
  getAllStartups: (): StartupRecord[] => JSON.parse(localStorage.getItem(DB_KEYS.STARTUPS) || '[]'),
  
  /* Seeds initial demo accounts if the database is empty */
  seedDemoAccounts: () => {
    if (localStorage.getItem(DB_KEYS.USERS)) return;
    storageService.registerUser({
       firstName: 'فيصل', lastName: 'المؤسس', email: 'startup@demo.com', phone: '0500000000',
       agreedToTerms: true, agreedToContract: true, startupName: 'تيك-لوجيك (Demo)', 
       industry: 'Technology', startupDescription: 'منصة ذكية لإدارة اللوجستيات',
    });
  },

  /* Returns service requests for a specific user */
  getUserServiceRequests: (uid: string): ServiceRequest[] => {
    const data = localStorage.getItem(DB_KEYS.SERVICES);
    const all = data ? JSON.parse(data) : [];
    return all.filter((r: any) => r.uid === uid);
  },

  /* Updates core user record */
  updateUser: (uid: string, updates: Partial<UserRecord>) => {
    const all = storageService.getAllUsers();
    const updated = all.map(u => u.uid === uid ? { ...u, ...updates } : u);
    safeSetItem(DB_KEYS.USERS, JSON.stringify(updated));
  },

  /* Updates core startup record */
  updateStartup: (projectId: string, updates: Partial<StartupRecord>) => {
    const all = storageService.getAllStartups();
    const updated = all.map(s => s.projectId === projectId ? { ...s, ...updates } : s);
    safeSetItem(DB_KEYS.STARTUPS, JSON.stringify(updated));
  },

  /* Submits a new service execution request */
  requestService: (uid: string, serviceId: string, packageId: string, details: string) => {
    const data = localStorage.getItem(DB_KEYS.SERVICES);
    const all = data ? JSON.parse(data) : [];
    const newReq: ServiceRequest = {
      id: `sr_${Date.now()}`,
      uid,
      serviceId,
      packageId,
      details,
      status: 'PENDING'
    };
    safeSetItem(DB_KEYS.SERVICES, JSON.stringify([...all, newReq]));
  },

  /* Returns program evaluation rating for a user */
  getProgramRating: (uid: string): ProgramRating | null => {
    const data = localStorage.getItem(`${DB_KEYS.RATINGS}_${uid}`);
    return data ? JSON.parse(data) : null;
  },

  /* Saves program evaluation rating for a user */
  saveProgramRating: (uid: string, rating: ProgramRating) => {
    safeSetItem(`${DB_KEYS.RATINGS}_${uid}`, JSON.stringify(rating));
  },

  /* Returns all registered partner profiles */
  getAllPartners: (): PartnerProfile[] => {
    const data = localStorage.getItem(DB_KEYS.PARTNERS);
    return data ? JSON.parse(data) : [];
  },

  /* Registers or updates a partner profile */
  registerAsPartner: (profile: PartnerProfile) => {
    const all = storageService.getAllPartners();
    const exists = all.find(p => p.uid === profile.uid);
    if (exists) {
      const updated = all.map(p => p.uid === profile.uid ? profile : p);
      safeSetItem(DB_KEYS.PARTNERS, JSON.stringify(updated));
    } else {
      safeSetItem(DB_KEYS.PARTNERS, JSON.stringify([...all, profile]));
    }
  }
};


import { UserRecord, StartupRecord, UserProfile, TaskRecord, TASKS_CONFIG, PartnerProfile, PartnerMatchRequest, MatchScore, ServiceRequest, UserRole } from '../types';

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
  registerUser: (profile: UserProfile): { user: UserRecord; startup?: StartupRecord } => {
    const uid = profile.uid || `u_${Date.now()}`;
    const role = profile.role || 'STARTUP';

    const newUser: UserRecord = {
      uid,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      role: role,
      phone: profile.phone,
      founderBio: profile.founderBio
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
        currentTrack: 'Idea',
        status: 'PENDING',
        metrics: { readiness: 45, tech: 30, market: 40 },
        aiOpinion: 'تحت المراجعة الاستراتيجية',
        lastActivity: new Date().toISOString(),
        partners: []
      };
      const startups = JSON.parse(localStorage.getItem(DB_KEYS.STARTUPS) || '[]');
      localStorage.setItem(DB_KEYS.STARTUPS, JSON.stringify([...startups, newStartup]));
    }

    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify([...users, newUser]));
    
    localStorage.setItem(`profile_${uid}`, JSON.stringify(profile));
    localStorage.setItem(DB_KEYS.SESSION, JSON.stringify({ uid, projectId: newStartup?.projectId }));

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

  getAllPartners: (): PartnerProfile[] => JSON.parse(localStorage.getItem(DB_KEYS.PARTNERS) || '[]'),
  
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

  seedDemoAccounts: () => {
    const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
    const startups = JSON.parse(localStorage.getItem(DB_KEYS.STARTUPS) || '[]');
    const partners = JSON.parse(localStorage.getItem(DB_KEYS.PARTNERS) || '[]');

    const demoUsers: {email: string, role: UserRole, f: string, l: string, uid: string}[] = [
      { email: 'admin@demo.com', role: 'ADMIN', f: 'مدير', l: 'النظام', uid: 'u_demo_admin' },
      { email: 'startup@demo.com', role: 'STARTUP', f: 'فيصل', l: 'المؤسس', uid: 'u_demo_startup' },
      { email: 'partner@demo.com', role: 'PARTNER', f: 'سارة', l: 'التقنية', uid: 'u_demo_partner' },
      { email: 'mentor@demo.com', role: 'MENTOR', f: 'د. خالد', l: 'العمري', uid: 'u_demo_mentor' },
    ];

    demoUsers.forEach(d => {
      if (!users.find((u: any) => u.email === d.email)) {
        const newUser: UserRecord = { uid: d.uid, firstName: d.f, lastName: d.l, email: d.email, role: d.role, phone: '0500000000' };
        users.push(newUser);

        if (d.role === 'STARTUP') {
          const newStartup: StartupRecord = {
            projectId: 'p_demo', ownerId: d.uid, ownerName: `${d.f} ${d.l}`,
            name: 'تيك-لوجيك (Demo)', description: 'منصة ذكية لإدارة الخدمات اللوجستية.',
            industry: 'Technology', currentTrack: 'MVP', status: 'APPROVED',
            metrics: { readiness: 65, tech: 80, market: 55 },
            aiOpinion: 'مشروع واعد مع عمق تقني واضح.', lastActivity: new Date().toISOString(),
            partners: []
          };
          startups.push(newStartup);
        }

        if (d.role === 'PARTNER') {
          const newPartner: PartnerProfile = {
            uid: d.uid, name: `${d.f} ${d.l}`, email: d.email, primaryRole: 'CTO',
            experienceYears: 12, bio: 'خبير في بناء الأنظمة الموزعة والذكاء الاصطناعي.',
            linkedin: 'https://linkedin.com/demo', skills: ['React', 'Node.js', 'Python'],
            availabilityHours: 25, commitmentType: 'Part-time', city: 'دبي', isRemote: true,
            workStyle: 'Fast', goals: 'Long-term', isVerified: true, profileCompletion: 100
          };
          partners.push(newPartner);
        }
      }
    });

    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(DB_KEYS.STARTUPS, JSON.stringify(startups));
    localStorage.setItem(DB_KEYS.PARTNERS, JSON.stringify(partners));
  }
};


import React, { useState, useEffect, useCallback } from 'react';
import { FiltrationStage, UserProfile, UserRole } from './types';
import { storageService } from './services/storageService';
import { Language, getTranslation } from './services/i18nService';
import { Registration } from './components/Registration';
import { Login } from './components/Login';
import { LandingPage } from './components/LandingPage';
import { RoadmapPage } from './components/RoadmapPage';
import { PathFinder } from './components/PathFinder';
import { DashboardHub } from './components/DashboardHub';
import { ToolsPage } from './components/ToolsPage';
import { LegalPortal, LegalType } from './components/LegalPortal';
import { AchievementsPage } from './components/AchievementsPage';
import { MentorshipPage } from './components/MentorshipPage';
import { IncubationProgram } from './components/IncubationProgram';
import { MembershipsPage } from './components/MembershipsPage';
import { PartnerConceptPage } from './components/PartnerConceptPage';
import { AIMentorConceptPage } from './components/AIMentorConceptPage';

function App() {
  const [stage, setStage] = useState<FiltrationStage>(FiltrationStage.LANDING);
  const [currentUser, setCurrentUser] = useState<(UserProfile & { uid: string; role: UserRole; startupId?: string }) | null>(null);
  const [registrationRole, setRegistrationRole] = useState<UserRole>('STARTUP');
  const [activeLegal, setActiveLegal] = useState<LegalType>(null);
  
  const [currentLang, setCurrentLang] = useState<Language>(() => 
    (localStorage.getItem('preferred_language') as Language) || 'ar'
  );

  const t = getTranslation(currentLang);

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = currentLang;
    document.body.style.fontFamily = t.font + ', sans-serif';
    localStorage.setItem('preferred_language', currentLang);
  }, [currentLang, t]);

  const hydrateSession = useCallback(() => {
    const session = storageService.getCurrentSession();
    if (session) {
      const usersList = storageService.getAllUsers();
      const userRec = usersList.find(u => u.uid === session.uid);
      const startups = storageService.getAllStartups();
      const startup = startups.find(s => s.ownerId === session.uid);

      if (userRec) {
        setCurrentUser({
          uid: userRec.uid,
          firstName: userRec.firstName,
          lastName: userRec.lastName,
          email: userRec.email,
          phone: userRec.phone,
          role: (userRec.role as UserRole) || 'STARTUP',
          startupId: startup?.projectId,
          startupName: startup?.name || '',
          name: `${userRec.firstName} ${userRec.lastName}`,
          startupDescription: startup?.description || '',
          industry: startup?.industry || '',
        });
        setStage(FiltrationStage.DASHBOARD);
      }
    }
  }, []);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    setStage(FiltrationStage.DASHBOARD);
  };

  const handleRegister = (profile: UserProfile) => {
    storageService.registerUser({ ...profile }); 
    hydrateSession();
    setStage(FiltrationStage.DASHBOARD);
  };

  const startRegistration = (role: UserRole) => {
    setRegistrationRole(role);
    setStage(FiltrationStage.WELCOME);
  };

  return (
    <div className={`antialiased ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`} dir={t.dir}>
      {stage === FiltrationStage.LANDING && (
        <LandingPage 
          onStart={() => startRegistration('STARTUP')} 
          onPathFinder={() => setStage(FiltrationStage.AI_MENTOR_CONCEPT)} 
          onSmartFeatures={() => {}} 
          onGovDashboard={() => {}} 
          onRoadmap={() => setStage(FiltrationStage.ROADMAP)} 
          onTools={() => setStage(FiltrationStage.TOOLS)} 
          onLegalClick={(type) => setActiveLegal(type)} 
          onLogin={() => setStage(FiltrationStage.LOGIN)}
          onAchievements={() => setStage(FiltrationStage.ACHIEVEMENTS)}
          onMentorship={() => setStage(FiltrationStage.MENTORSHIP)}
          onIncubation={() => setStage(FiltrationStage.INCUBATION_PROGRAM)}
          onMemberships={() => setStage(FiltrationStage.MEMBERSHIPS)}
          onPartnerConcept={() => setStage(FiltrationStage.PARTNER_CONCEPT)}
          onAIMentorConcept={() => setStage(FiltrationStage.AI_MENTOR_CONCEPT)}
          lang={currentLang}
          onLanguageChange={setCurrentLang}
        />
      )}

      {stage === FiltrationStage.PARTNER_CONCEPT && (
        <PartnerConceptPage 
          onRegister={() => startRegistration('PARTNER')} 
          onBack={() => setStage(FiltrationStage.LANDING)} 
        />
      )}

      {stage === FiltrationStage.AI_MENTOR_CONCEPT && (
        <AIMentorConceptPage 
          onStart={() => setStage(FiltrationStage.PATH_FINDER)} 
          onBack={() => setStage(FiltrationStage.LANDING)} 
        />
      )}

      {stage === FiltrationStage.LOGIN && (
        <Login 
          lang={currentLang} 
          onLoginSuccess={handleLoginSuccess} 
          onBack={() => setStage(FiltrationStage.LANDING)} 
        />
      )}
      
      {stage === FiltrationStage.WELCOME && (
        <Registration 
          lang={currentLang}
          role={registrationRole}
          onRegister={handleRegister} 
          onStaffLogin={() => setStage(FiltrationStage.STAFF_PORTAL)} 
        />
      )}

      {stage === FiltrationStage.PATH_FINDER && <PathFinder onApproved={() => startRegistration('STARTUP')} onBack={() => setStage(FiltrationStage.LANDING)} />}
      {stage === FiltrationStage.ROADMAP && <RoadmapPage onStart={() => startRegistration('STARTUP')} onBack={() => setStage(FiltrationStage.LANDING)} />}
      {stage === FiltrationStage.TOOLS && <ToolsPage onBack={() => setStage(FiltrationStage.LANDING)} />}
      {stage === FiltrationStage.ACHIEVEMENTS && <AchievementsPage onBack={() => setStage(FiltrationStage.LANDING)} />}
      {stage === FiltrationStage.MENTORSHIP && <MentorshipPage onBack={() => setStage(FiltrationStage.LANDING)} />}
      {stage === FiltrationStage.INCUBATION_PROGRAM && <IncubationProgram onBack={() => setStage(FiltrationStage.LANDING)} onApply={() => startRegistration('STARTUP')} />}
      {stage === FiltrationStage.MEMBERSHIPS && <MembershipsPage onBack={() => setStage(FiltrationStage.LANDING)} onSelect={() => startRegistration('STARTUP')} />}

      {stage === FiltrationStage.DASHBOARD && currentUser && (
        <DashboardHub 
          lang={currentLang}
          user={currentUser} 
          onLogout={() => { localStorage.removeItem('db_current_session'); setCurrentUser(null); setStage(FiltrationStage.LANDING); }} 
          onNavigateToStage={setStage} 
        />
      )}
      
      <LegalPortal type={activeLegal} onClose={() => setActiveLegal(null)} />
    </div>
  );
}

export default App;

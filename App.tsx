
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
import { CoFounderPortal } from './components/CoFounderPortal';
import { ForeignInvestmentPage } from './components/ForeignInvestmentPage';
import { IncubationApply } from './components/IncubationApply';
import { ScreeningPortal } from './components/ScreeningPortal';

function App() {
  const [stage, setStage] = useState<FiltrationStage>(FiltrationStage.LANDING);
  const [currentUser, setCurrentUser] = useState<(UserProfile & { uid: string; role: UserRole; startupId?: string }) | null>(null);
  const [registrationRole, setRegistrationRole] = useState<UserRole>('STARTUP');
  const [activeLegal, setActiveLegal] = useState<LegalType>(null);
  
  const [currentLang, setCurrentLang] = useState<Language>(() => 
    (localStorage.getItem('preferred_language') as Language) || 'ar'
  );

  const t = getTranslation(currentLang);

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
        
        // Logical Routing based on Application Status
        if (userRec.role === 'STARTUP' && startup) {
          if (startup.applicationStatus === 'PENDING_SCREENING' || startup.applicationStatus === 'REJECTED') {
            setStage(FiltrationStage.INCUBATION_APPLY);
          } else if (startup.applicationStatus === 'APPROVED') {
            setStage(FiltrationStage.DASHBOARD);
          } else {
            setStage(FiltrationStage.SCREENING_WAIT);
          }
        } else {
          setStage(FiltrationStage.DASHBOARD);
        }
      }
    }
  }, []);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    hydrateSession();
  };

  const handleRegister = (profile: UserProfile) => {
    storageService.registerUser({ ...profile }); 
    hydrateSession();
  };

  const handleTransformToPartner = () => {
    if (!currentUser) return;
    
    // 1. Update user role in storage
    storageService.updateUser(currentUser.uid, { role: 'PARTNER' });
    
    // 2. Clear startup application so they don't get redirected back here
    storageService.updateStartupApplication(currentUser.startupId!, 'NEEDS_COMPLETION', 0, 'User transformed to Partner track');
    
    // 3. Hydrate and Navigate to Partner Dashboard
    hydrateSession();
    setStage(FiltrationStage.DASHBOARD);
  };

  return (
    <div className={`antialiased ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`} dir={t.dir}>
      {stage === FiltrationStage.LANDING && (
        <LandingPage 
          onStart={() => { setRegistrationRole('STARTUP'); setStage(FiltrationStage.WELCOME); }} 
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
          onForeignInvestment={() => setStage(FiltrationStage.FOREIGN_INVESTMENT)}
          lang={currentLang}
          onLanguageChange={setCurrentLang}
        />
      )}

      {stage === FiltrationStage.INCUBATION_APPLY && currentUser && (
        <IncubationApply user={currentUser} onSubmitted={hydrateSession} />
      )}

      {stage === FiltrationStage.SCREENING_WAIT && currentUser && (
        <ScreeningPortal 
          startup={storageService.getAllStartups().find(s => s.projectId === currentUser.startupId)!} 
          onContinue={() => setStage(FiltrationStage.DASHBOARD)}
          onRetry={() => setStage(FiltrationStage.INCUBATION_APPLY)}
          onJoinAsPartner={handleTransformToPartner}
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
          onStaffLogin={() => {}} 
        />
      )}

      {stage === FiltrationStage.DASHBOARD && currentUser && (
        currentUser.role === 'PARTNER' ? (
          <CoFounderPortal user={currentUser} onBack={() => { localStorage.removeItem('db_current_session'); setCurrentUser(null); setStage(FiltrationStage.LANDING); }} />
        ) : (
          <DashboardHub 
            lang={currentLang}
            user={currentUser} 
            onLogout={() => { localStorage.removeItem('db_current_session'); setCurrentUser(null); setStage(FiltrationStage.LANDING); }} 
            onNavigateToStage={setStage} 
          />
        )
      )}
      
      <LegalPortal type={activeLegal} onClose={() => setActiveLegal(null)} />
    </div>
  );
}

export default App;

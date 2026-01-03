
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { playPositiveSound, playErrorSound } from '../services/audioService';
import { Language, getTranslation } from '../services/i18nService';

interface RegistrationProps {
  role?: UserRole;
  onRegister: (profile: UserProfile) => void;
  onStaffLogin?: () => void;
  lang: Language;
}

export const Registration: React.FC<RegistrationProps> = ({ role = 'STARTUP', onRegister, onStaffLogin, lang }) => {
  const t = getTranslation(lang);
  const [formData, setFormData] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    startupName: '',
    startupDescription: '',
    industry: 'Technology',
    phone: '',
    email: '',
    founderBio: '',
    linkedin: '',
    agreedToTerms: false,
    agreedToContract: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Required';
    if (!formData.email.trim()) newErrors.email = 'Required';
    
    if (role === 'STARTUP') {
      if (!formData.startupName.trim()) newErrors.startupName = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onRegister({ ...formData, contractSignedAt: new Date().toISOString() });
    } else {
      playErrorSound();
    }
  };

  const roleMeta = {
    STARTUP: { title: t.roles.startup, color: 'blue', icon: '🚀', sub: 'Founder' },
    PARTNER: { title: t.roles.partner, color: 'emerald', icon: '🤝', sub: 'Expert' },
    MENTOR: { title: t.roles.mentor, color: 'purple', icon: '🧠', sub: 'Guide' },
    ADMIN: { title: t.roles.admin, color: 'slate', icon: '👑', sub: 'Staff' }
  }[role] || { title: 'Registration', color: 'blue', icon: '🚀', sub: 'New User' };

  return (
    <div className={`min-h-screen flex bg-slate-950 font-sans text-white overflow-hidden`} dir={t.dir}>
      <div className="hidden lg:flex lg:w-[40%] relative bg-slate-900 flex-col justify-between p-16 border-l border-white/5">
        <div className="relative z-10 space-y-10">
           <div className={`w-16 h-16 bg-${roleMeta.color}-600 rounded-3xl flex items-center justify-center shadow-2xl`}>
              <span className="text-3xl">{roleMeta.icon}</span>
           </div>
           <div className="space-y-4">
              <h1 className="text-5xl font-black leading-tight tracking-tight">{roleMeta.title}</h1>
              <p className="text-xl text-slate-400 max-w-sm leading-relaxed">{t.hero.desc}</p>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-950 p-8 md:p-16">
        <div className="max-w-2xl w-full mx-auto animate-fade-in-up">
          <header className="mb-12">
            <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 bg-${roleMeta.color}-500/10 text-${roleMeta.color}-400 border border-${roleMeta.color}-500/20`}>
              {roleMeta.sub} {t.auth.login_title}
            </span>
            <h2 className="text-4xl font-black tracking-tight">{roleMeta.title}</h2>
          </header>

          <form onSubmit={handleSubmit} className="space-y-12">
            <section className="space-y-8">
               <h3 className="text-xl font-black flex items-center gap-4 text-blue-400">
                  <span className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center text-xs">1</span>
                  {lang === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">{lang === 'ar' ? 'الاسم' : 'Full Name'}</label>
                    <input className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 font-bold" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">{t.auth.email}</label>
                    <input type="email" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
               </div>
            </section>

            <button type="submit" className={`w-full py-6 bg-${roleMeta.color}-600 hover:bg-${roleMeta.color}-700 text-white rounded-[2rem] font-black text-xl shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-6 group`}>
              <span>{t.common.confirm}</span>
              <svg className={`w-7 h-7 ${t.dir === 'rtl' ? 'transform rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

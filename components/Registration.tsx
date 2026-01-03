
import React, { useState } from 'react';
import { UserProfile, ApplicantProfile, ProjectEvaluationResult, UserRole } from '../types';
import { evaluateProjectIdea } from '../services/geminiService';
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';

interface RegistrationProps {
  role?: UserRole;
  onRegister: (profile: UserProfile) => void;
  onStaffLogin?: () => void;
}

export const Registration: React.FC<RegistrationProps> = ({ role = 'STARTUP', onRegister, onStaffLogin }) => {
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'الاسم مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد مطلوب';
    
    if (role === 'STARTUP') {
      if (!formData.startupName.trim()) newErrors.startupName = 'اسم المشروع مطلوب';
      if (!formData.startupDescription.trim()) newErrors.startupDescription = 'وصف الفكرة مطلوب';
    } else if (role === 'PARTNER' || role === 'MENTOR') {
      if (!formData.linkedin?.trim()) newErrors.linkedin = 'رابط LinkedIn مطلوب';
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
    STARTUP: { title: 'تسجيل شركة محتضنة', color: 'blue', icon: '🚀', sub: 'رائد أعمال' },
    PARTNER: { title: 'انضم كشريك مؤسس', color: 'emerald', icon: '🤝', sub: 'خبير متاح' },
    MENTOR: { title: 'انضم لشبكة المرشدين', color: 'purple', icon: '🧠', sub: 'خبير موجه' },
    ADMIN: { title: 'تفعيل حساب الإدارة', color: 'slate', icon: '👑', sub: 'مشرف نظام' }
  }[role] || { title: 'التسجيل في المسرعة', color: 'blue', icon: '🚀', sub: 'مستخدم جديد' };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans text-white overflow-hidden" dir="rtl">
      <div className="hidden lg:flex lg:w-[40%] relative bg-slate-900 flex-col justify-between p-16 border-l border-white/5">
        <div className="relative z-10 space-y-10">
           <div className={`w-16 h-16 bg-${roleMeta.color}-600 rounded-3xl flex items-center justify-center shadow-2xl`}>
              <span className="text-3xl">{roleMeta.icon}</span>
           </div>
           <div className="space-y-4">
              <h1 className="text-5xl font-black leading-tight tracking-tight">{roleMeta.title}</h1>
              <p className="text-xl text-slate-400 max-w-sm leading-relaxed">كن جزءاً من أقوى مجتمع ريادي ذكي في المنطقة. ابدأ رحلتك الآن.</p>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-950 p-8 md:p-16">
        <div className="max-w-2xl w-full mx-auto animate-fade-in-up">
          <header className="mb-12">
            <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 bg-${roleMeta.color}-500/10 text-${roleMeta.color}-400 border border-${roleMeta.color}-500/20`}>
              {roleMeta.sub} Registration
            </span>
            <h2 className="text-4xl font-black tracking-tight">{roleMeta.title}</h2>
          </header>

          <form onSubmit={handleSubmit} className="space-y-12">
            <section className="space-y-8">
               <h3 className="text-xl font-black flex items-center gap-4 text-blue-400">
                  <span className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center text-xs">1</span>
                  المعلومات الشخصية
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">الاسم الكامل</label>
                    <input className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 font-bold" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">البريد الإلكتروني</label>
                    <input type="email" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">رقم الجوال</label>
                    <input className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 font-bold" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">رابط LinkedIn</label>
                    <input className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 font-bold" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} placeholder="https://..." />
                  </div>
               </div>
            </section>

            {role === 'STARTUP' ? (
              <section className="space-y-8">
                 <h3 className="text-xl font-black flex items-center gap-4 text-blue-400">
                    <span className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center text-xs">2</span>
                    تفاصيل المشروع
                 </h3>
                 <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">اسم المشروع</label>
                      <input className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 font-bold" value={formData.startupName} onChange={e => setFormData({...formData, startupName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">وصف الفكرة</label>
                       <textarea className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 font-medium resize-none" value={formData.startupDescription} onChange={e => setFormData({...formData, startupDescription: e.target.value})} />
                    </div>
                 </div>
              </section>
            ) : (
              <section className="space-y-8">
                 <h3 className="text-xl font-black flex items-center gap-4 text-emerald-400">
                    <span className="w-8 h-8 rounded-xl bg-emerald-600/20 flex items-center justify-center text-xs">2</span>
                    الخبرات والمهارات
                 </h3>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">نبذة مهنية (Bio)</label>
                       <textarea className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 font-medium resize-none" value={formData.founderBio} onChange={e => setFormData({...formData, founderBio: e.target.value})} placeholder="تحدث عن خبراتك..." />
                    </div>
                 </div>
              </section>
            )}

            <button type="submit" className={`w-full py-6 bg-${roleMeta.color}-600 hover:bg-${roleMeta.color}-700 text-white rounded-[2rem] font-black text-xl shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-6 group`}>
              <span>إكمال التسجيل والدخول</span>
              <svg className="w-7 h-7 transform rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

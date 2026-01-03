
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { playPositiveSound, playErrorSound, playCelebrationSound } from '../services/audioService';
import { Language, getTranslation } from '../services/i18nService';

interface RegistrationProps {
  role?: UserRole;
  onRegister: (profile: UserProfile) => void;
  onStaffLogin?: () => void;
  lang: Language;
}

export const Registration: React.FC<RegistrationProps> = ({ role = 'STARTUP', onRegister, onStaffLogin, lang }) => {
  const t = getTranslation(lang);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    firstName: '', lastName: '', email: '', phone: '', city: '', 
    agreedToTerms: false, agreedToContract: false,
    startupName: '', startupDescription: '', industry: 'Technology',
    existingRoles: [], missingRoles: [], supportNeeded: [], mentorExpertise: [], mentorSectors: [],
    skills: []
  });

  const handleNext = () => {
    playPositiveSound();
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.agreedToTerms) {
      playCelebrationSound();
      onRegister({ ...formData, role, contractSignedAt: new Date().toISOString() });
    } else {
      playErrorSound();
      alert(lang === 'ar' ? 'يجب الموافقة على الشروط' : 'You must agree to terms');
    }
  };

  const toggleList = (field: keyof UserProfile, value: string) => {
    const current = (formData[field] as string[]) || [];
    const updated = current.includes(value) 
      ? current.filter(v => v !== value) 
      : [...current, value];
    setFormData({ ...formData, [field]: updated });
  };

  const roleMeta = {
    STARTUP: { title: 'تسجيل شركة محتضنة', colorClass: 'bg-blue-600', textClass: 'text-blue-500', shadowClass: 'shadow-blue-500/20', icon: '🏢', steps: 6 },
    PARTNER: { title: 'تسجيل شريك (Co-Founder)', colorClass: 'bg-emerald-600', textClass: 'text-emerald-500', shadowClass: 'shadow-emerald-500/20', icon: '🤝', steps: 6 },
    MENTOR: { title: 'تسجيل مرشد خبير', colorClass: 'bg-purple-600', textClass: 'text-purple-500', shadowClass: 'shadow-purple-500/20', icon: '🧠', steps: 6 }
  }[role] || { title: 'Registration', colorClass: 'bg-blue-600', textClass: 'text-blue-500', shadowClass: 'shadow-blue-500/20', icon: '🚀', steps: 4 };

  const renderStep = () => {
    switch(role) {
      case 'STARTUP': return renderStartupSteps();
      case 'PARTNER': return renderPartnerSteps();
      case 'MENTOR': return renderMentorSteps();
      default: return null;
    }
  };

  // --- Common Styles ---
  const inputStyles = "w-full p-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-white focus:ring-4 focus:ring-white/5 transition-all text-white font-bold placeholder-white/20 text-lg";

  // --- STARTUP FLOW ---
  const renderStartupSteps = () => {
    if (step === 1) return (
      <div className="space-y-8 animate-fade-up">
        <div className="space-y-2">
           <h3 className={`text-2xl font-black ${roleMeta.textClass}`}>1️⃣ البيانات الأساسية</h3>
           <p className="text-white/40 text-sm">لنبدأ بتعريف مشروعك للعالم.</p>
        </div>
        <input className={inputStyles} placeholder="اسم الشركة / المشروع *" value={formData.startupName} onChange={e => setFormData({...formData, startupName: e.target.value})} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <select className={inputStyles} value={formData.startupType} onChange={e => setFormData({...formData, startupType: e.target.value as any})}>
            <option value="">نوع الكيان</option>
            <option value="Startup">شركة ناشئة</option>
            <option value="Existing">منشأة قائمة</option>
            <option value="Tech">شركة تقنية</option>
          </select>
          <input className={inputStyles} placeholder="القطاع / المجال *" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input className={inputStyles} placeholder="المدينة *" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
          <select className={inputStyles} value={formData.isRemote ? 'yes' : 'no'} onChange={e => setFormData({...formData, isRemote: e.target.value === 'yes'})}>
             <option value="no">العمل حضوري</option>
             <option value="yes">العمل عن بُعد</option>
          </select>
        </div>
      </div>
    );
    if (step === 2) return (
      <div className="space-y-8 animate-fade-up">
        <h3 className={`text-2xl font-black ${roleMeta.textClass}`}>2️⃣ بيانات التواصل</h3>
        <div className="grid grid-cols-2 gap-6">
          <input className={inputStyles} placeholder="الاسم الأول *" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <input className={inputStyles} placeholder="اللقب *" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
        </div>
        <input className={inputStyles} placeholder="المسمى الوظيفي *" value={formData.currentJob} onChange={e => setFormData({...formData, currentJob: e.target.value})} />
        <input className={inputStyles} type="email" placeholder="البريد الإلكتروني *" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        <input className={inputStyles} placeholder="رقم الجوال *" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
      </div>
    );
    if (step === 3) return (
      <div className="space-y-8 animate-fade-up">
        <h3 className={`text-2xl font-black ${roleMeta.textClass}`}>3️⃣ بيانات المشروع</h3>
        <textarea className={`${inputStyles} h-44 resize-none`} placeholder="وصف مختصر للفكرة (300-500 حرف) *" value={formData.startupDescription} onChange={e => setFormData({...formData, startupDescription: e.target.value})} />
        <input className={inputStyles} placeholder="المشكلة التي تحلها الشركة *" value={formData.problem} onChange={e => setFormData({...formData, problem: e.target.value})} />
        <input className={inputStyles} placeholder="الحل المقترح *" value={formData.solution} onChange={e => setFormData({...formData, solution: e.target.value})} />
        <div className="flex items-center justify-between p-8 bg-white/5 rounded-3xl border border-white/10">
           <span className="text-lg font-black text-white/80">هل يوجد نموذج أولي (MVP)؟</span>
           <button type="button" onClick={() => setFormData({...formData, hasMVP: !formData.hasMVP})} className={`px-12 py-3 rounded-2xl font-black text-sm transition-all ${formData.hasMVP ? roleMeta.colorClass : 'bg-slate-700'}`}>{formData.hasMVP ? 'نعم' : 'لا'}</button>
        </div>
        {formData.hasMVP && <input className={inputStyles} placeholder="رابط الـ MVP (اختياري)" value={formData.mvpLink} onChange={e => setFormData({...formData, mvpLink: e.target.value})} />}
      </div>
    );
    if (step === 4) return (
      <div className="space-y-8 animate-fade-up">
        <h3 className={`text-2xl font-black ${roleMeta.textClass}`}>4️⃣ فريق العمل</h3>
        <div className="space-y-4">
           <label className="text-white/40 font-black uppercase text-[10px] tracking-widest px-2">عدد المؤسسين الكلي</label>
           <input className={inputStyles} type="number" placeholder="عدد المؤسسين *" value={formData.founderCount} onChange={e => setFormData({...formData, founderCount: parseInt(e.target.value)})} />
        </div>
        <div className="space-y-6 p-8 bg-white/5 rounded-3xl border border-white/10">
          <p className="text-sm font-black text-white/80">الأدوار الموجودة حالياً في الفريق:</p>
          <div className="flex flex-wrap gap-3">
            {['تقني', 'تشغيلي', 'مبيعات', 'منتج'].map(r => (
              <button 
                key={r} 
                type="button" 
                onClick={() => toggleList('existingRoles', r)} 
                className={`px-8 py-3 rounded-2xl text-xs font-black transition-all border-2 ${formData.existingRoles?.includes(r) ? `${roleMeta.colorClass} border-white/20 shadow-lg` : 'bg-white/5 border-white/5 text-white/30 hover:border-white/20'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
    if (step === 5) return (
      <div className="space-y-8 animate-fade-up">
        <h3 className={`text-2xl font-black ${roleMeta.textClass}`}>5️⃣ الاحتياج من الحاضنة</h3>
        <div className="space-y-6">
           <p className="text-sm font-black text-white/80 px-2">نوع الدعم المطلوب بشكل أساسي:</p>
           <div className="grid grid-cols-2 gap-4">
              {['إرشاد', 'شراكات', 'أدوات', 'جاهزية استثمار'].map(s => (
                <button 
                  key={s} 
                  type="button" 
                  onClick={() => toggleList('supportNeeded', s)} 
                  className={`p-6 rounded-3xl text-sm font-black border-2 transition-all flex items-center justify-center gap-3 ${formData.supportNeeded?.includes(s) ? `${roleMeta.colorClass} border-white/20 shadow-lg` : 'bg-white/5 border-white/5 text-white/30'}`}
                >
                  <span className="text-xl">{s === 'إرشاد' ? '🧠' : s === 'شراكات' ? '🤝' : s === 'أدوات' ? '🛠️' : '💰'}</span>
                  {s}
                </button>
              ))}
           </div>
        </div>
        <textarea className={`${inputStyles} h-32 resize-none`} placeholder="ما هو هدفك الرئيسي من الانضمام للحاضنة؟ *" value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} />
      </div>
    );
    return renderAgreements();
  };

  // --- PARTNER FLOW ---
  const renderPartnerSteps = () => {
    if (step === 1) return (
      <div className="space-y-8 animate-fade-up">
        <h3 className={`text-2xl font-black ${roleMeta.textClass}`}>1️⃣ البيانات الأساسية</h3>
        <div className="grid grid-cols-2 gap-6">
          <input className={inputStyles} placeholder="الاسم الأول *" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <input className={inputStyles} placeholder="اللقب *" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
        </div>
        <input className={inputStyles} placeholder="المدينة *" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
        <select className={inputStyles} value={formData.primaryRole} onChange={e => setFormData({...formData, primaryRole: e.target.value as any})}>
           <option value="">الدور الأساسي</option>
           <option value="Tech">تقني (CTO / Developer)</option>
           <option value="Sales">مبيعات</option>
           <option value="Product">منتج</option>
           <option value="Ops">تشغيل</option>
           <option value="Finance">مالي</option>
        </select>
      </div>
    );
    if (step === 2) return (
      <div className="space-y-8 animate-fade-up">
        <h3 className={`text-2xl font-black ${roleMeta.textClass}`}>2️⃣ الخبرة والمهارات</h3>
        <input className={inputStyles} type="number" placeholder="سنوات الخبرة *" value={formData.experienceYears} onChange={e => setFormData({...formData, experienceYears: parseInt(e.target.value)})} />
        <textarea className={`${inputStyles} h-32`} placeholder="المهارات الأساسية (React, Python, Sales Strategy...)" value={formData.skills?.join(', ')} onChange={e => setFormData({...formData, skills: e.target.value.split(',').map(s => s.trim())})} />
        <div className="flex items-center justify-between p-8 bg-white/5 rounded-3xl border border-white/10">
           <span className="text-lg font-black text-white/80">هل سبق عملت في شركة ناشئة؟</span>
           <button type="button" onClick={() => setFormData({...formData, workedInStartup: !formData.workedInStartup})} className={`px-12 py-3 rounded-2xl font-black text-sm transition-all ${formData.workedInStartup ? roleMeta.colorClass : 'bg-slate-700'}`}>{formData.workedInStartup ? 'نعم' : 'لا'}</button>
        </div>
      </div>
    );
    if (step === 3) return (
      <div className="space-y-8 animate-fade-up">
        <h3 className={`text-2xl font-black ${roleMeta.textClass}`}>3️⃣ التفرغ والالتزام</h3>
        <select className={inputStyles} value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value as any})}>
           <option value="Part-time">تفرغ جزئي</option>
           <option value="Full-time">تفرغ كامل</option>
        </select>
        <input className={inputStyles} type="number" placeholder="عدد الساعات المتاحة أسبوعياً *" value={formData.weeklyHours} onChange={e => setFormData({...formData, weeklyHours: parseInt(e.target.value)})} />
        <select className={inputStyles} value={formData.partnershipType} onChange={e => setFormData({...formData, partnershipType: e.target.value as any})}>
           <option value="Equity">شراكة أسهم</option>
           <option value="Trial">تجربة شراكة (14 يوم)</option>
           <option value="Project">مشروع واحد</option>
        </select>
      </div>
    );
    if (step === 4) return (
      <div className="space-y-8 animate-fade-up">
        <h3 className={`text-2xl font-black ${roleMeta.textClass}`}>4️⃣ التفضيلات</h3>
        <p className="text-sm font-black text-white/80 px-2">المراحل التي تفضل العمل بها:</p>
        <div className="grid grid-cols-3 gap-4">
           {['Idea', 'MVP', 'Growth'].map(s => (
             <button key={s} type="button" onClick={() => toggleList('preferredStages', s)} className={`p-6 rounded-3xl text-xs font-black border-2 transition-all ${formData.preferredStages?.includes(s) ? `${roleMeta.colorClass} border-white/20 shadow-lg` : 'bg-white/5 border-white/5 text-white/30'}`}>{s}</button>
           ))}
        </div>
      </div>
    );
    if (step === 5) return (
      <div className="space-y-8 animate-fade-up">
        <h3 className={`text-2xl font-black ${roleMeta.textClass}`}>5️⃣ إثبات العمل</h3>
        <input className={inputStyles} placeholder="رابط LinkedIn *" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
        <input className={inputStyles} placeholder="رابط GitHub / Portfolio" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} />
        <textarea className={`${inputStyles} h-40 resize-none`} placeholder="نبذة عن أبرز إنجاز مهني تفخر به..." value={formData.achievement} onChange={e => setFormData({...formData, achievement: e.target.value})} />
      </div>
    );
    return renderAgreements();
  };

  // --- MENTOR FLOW ---
  const renderMentorSteps = () => {
    if (step === 1) return (
      <div className="space-y-8 animate-fade-up">
        <h3 className={`text-2xl font-black ${roleMeta.textClass}`}>1️⃣ البيانات الأساسية</h3>
        <div className="grid grid-cols-2 gap-6">
          <input className={inputStyles} placeholder="الاسم الأول *" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <input className={inputStyles} placeholder="اللقب *" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
        </div>
        <input className={inputStyles} placeholder="المدينة *" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
        <input className={inputStyles} type="email" placeholder="البريد الإلكتروني *" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        <input className={inputStyles} placeholder="رقم الجوال *" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
      </div>
    );
    if (step === 2) return (
      <div className="space-y-8 animate-fade-up">
        <h3 className={`text-2xl font-black ${roleMeta.textClass}`}>2️⃣ البيانات المهنية</h3>
        <input className={inputStyles} placeholder="المسمى الوظيفي الحالي *" value={formData.currentJob} onChange={e => setFormData({...formData, currentJob: e.target.value})} />
        <input className={inputStyles} type="number" placeholder="سنوات الخبرة الإجمالية *" value={formData.experienceYears} onChange={e => setFormData({...formData, experienceYears: parseInt(e.target.value)})} />
        <p className="text-sm font-black text-white/80 px-2">مجالات الخبرة الرئيسية:</p>
        <div className="flex flex-wrap gap-3">
           {['تقنية', 'استثمار', 'تشغيل', 'مبيعات', 'منتج', 'قانوني'].map(exp => (
             <button 
               key={exp} 
               type="button" 
               onClick={() => toggleList('mentorExpertise', exp)} 
               className={`px-8 py-3 rounded-2xl text-xs font-black border-2 transition-all ${formData.mentorExpertise?.includes(exp) ? `${roleMeta.colorClass} border-white/20 shadow-lg` : 'bg-white/5 border-white/5 text-white/30'}`}
             >
               {exp}
             </button>
           ))}
        </div>
      </div>
    );
    if (step === 3) return (
      <div className="space-y-8 animate-fade-up">
        <h3 className={`text-2xl font-black ${roleMeta.textClass}`}>3️⃣ تجربة الإرشاد</h3>
        <div className="flex items-center justify-between p-8 bg-white/5 rounded-3xl border border-white/10">
           <span className="text-lg font-black text-white/80">هل سبق عملت كمرشد؟</span>
           <button type="button" onClick={() => setFormData({...formData, previousMentorExp: !formData.previousMentorExp})} className={`px-12 py-3 rounded-2xl font-black text-sm transition-all ${formData.previousMentorExp ? roleMeta.colorClass : 'bg-slate-700'}`}>{formData.previousMentorExp ? 'نعم' : 'لا'}</button>
        </div>
        {formData.previousMentorExp && <input className={inputStyles} type="number" placeholder="عدد الجلسات التقريبي" value={formData.sessionCount} onChange={e => setFormData({...formData, sessionCount: parseInt(e.target.value)})} />}
      </div>
    );
    if (step === 4) return (
      <div className="space-y-8 animate-fade-up">
        <h3 className={`text-2xl font-black ${roleMeta.textClass}`}>4️⃣ التفرغ</h3>
        <input className={inputStyles} type="number" placeholder="عدد الجلسات المتاحة شهرياً *" value={formData.monthlySessions} onChange={e => setFormData({...formData, monthlySessions: parseInt(e.target.value)})} />
        <select className={inputStyles} value={formData.mentorshipMode} onChange={e => setFormData({...formData, mentorshipMode: e.target.value as any})}>
           <option value="Remote">عن بُعد</option>
           <option value="On-site">حضوري</option>
        </select>
      </div>
    );
    if (step === 5) return (
      <div className="space-y-8 animate-fade-up">
        <h3 className={`text-2xl font-black ${roleMeta.textClass}`}>5️⃣ روابط مهنية</h3>
        <input className={inputStyles} placeholder="LinkedIn URL *" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
        <input className={inputStyles} placeholder="الموقع الشخصي (اختياري)" value={formData.personalWebsite} onChange={e => setFormData({...formData, personalWebsite: e.target.value})} />
      </div>
    );
    return renderAgreements();
  };

  const renderAgreements = () => (
    <div className="space-y-12 animate-fade-up">
      <h3 className={`text-3xl font-black ${roleMeta.textClass}`}>6️⃣ الإقرارات النهائية</h3>
      <div className="space-y-6">
         <label className="flex items-center gap-6 p-8 bg-white/5 rounded-3xl border border-white/10 cursor-pointer group transition-all hover:bg-white/10">
            <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${formData.agreedToTerms ? `${roleMeta.colorClass} border-white/20 shadow-2xl` : 'border-white/10 group-hover:border-white/30'}`}>
               {formData.agreedToTerms && <span className="text-xl">✓</span>}
            </div>
            <input type="checkbox" className="hidden" checked={formData.agreedToTerms} onChange={e => setFormData({...formData, agreedToTerms: e.target.checked})} />
            <span className="text-lg font-black text-white/80">أوافق على الشروط والأحكام وسياسة الخصوصية للمنصة</span>
         </label>
         {role === 'PARTNER' && (
           <label className="flex items-center gap-6 p-8 bg-white/5 rounded-3xl border border-white/10 cursor-pointer group transition-all hover:bg-white/10">
              <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${formData.agreedToContract ? 'bg-emerald-600 border-white/20 shadow-2xl' : 'border-white/10 group-hover:border-white/30'}`}>
                 {formData.agreedToContract && <span className="text-xl">✓</span>}
              </div>
              <input type="checkbox" className="hidden" checked={formData.agreedToContract} onChange={e => setFormData({...formData, agreedToContract: e.target.checked})} />
              <span className="text-lg font-black text-white/80">أوافق على نظام تجربة الشراكة الذكي (14 يوماً)</span>
           </label>
         )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-950 text-white font-sans overflow-hidden" dir="rtl">
      {/* Dynamic Visual Sidebar */}
      <div className={`hidden lg:flex lg:w-[40%] bg-slate-900 border-l border-white/5 p-24 flex-col justify-between relative overflow-hidden`}>
         <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${roleMeta.colorClass} opacity-5 blur-[120px] animate-pulse`}></div>
         <div className="relative z-10 space-y-16">
            <div className={`w-28 h-28 ${roleMeta.colorClass} rounded-[2.5rem] flex items-center justify-center text-5xl shadow-3xl transform rotate-6 animate-fade-in`}>{roleMeta.icon}</div>
            <div className="space-y-6">
              <h1 className="text-6xl font-black leading-none tracking-tighter">{roleMeta.title}</h1>
              <p className="text-white/40 font-medium text-2xl leading-relaxed max-w-lg">انضم لأكبر منظومة ريادية ذكية في المنطقة وابدأ رحلة التحول اليوم.</p>
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 text
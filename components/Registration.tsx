
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
    // Basic validation for current step could be added here
    playPositiveSound();
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setStep(s => s - 1);
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
    STARTUP: { title: 'تسجيل شركة محتضنة', color: 'blue', icon: '🏢', steps: 6 },
    PARTNER: { title: 'تسجيل شريك (Co-Founder)', color: 'emerald', icon: '🤝', steps: 6 },
    MENTOR: { title: 'تسجيل مرشد خبير', color: 'purple', icon: '🧠', steps: 6 }
  }[role] || { title: 'Registration', color: 'blue', icon: '🚀', steps: 4 };

  const renderStep = () => {
    switch(role) {
      case 'STARTUP': return renderStartupSteps();
      case 'PARTNER': return renderPartnerSteps();
      case 'MENTOR': return renderMentorSteps();
      default: return null;
    }
  };

  // --- STARTUP FLOW ---
  const renderStartupSteps = () => {
    if (step === 1) return (
      <div className="space-y-6 animate-fade-up">
        <h3 className="text-xl font-black text-blue-500">1️⃣ البيانات الأساسية</h3>
        <input className="input-reg" placeholder="اسم الشركة / المشروع *" value={formData.startupName} onChange={e => setFormData({...formData, startupName: e.target.value})} />
        <select className="input-reg" value={formData.startupType} onChange={e => setFormData({...formData, startupType: e.target.value as any})}>
          <option value="">نوع الكيان</option>
          <option value="Startup">شركة ناشئة</option>
          <option value="Existing">منشأة قائمة</option>
          <option value="Tech">شركة تقنية</option>
        </select>
        <input className="input-reg" placeholder="القطاع / المجال *" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} />
        <div className="grid grid-cols-2 gap-4">
          <input className="input-reg" placeholder="المدينة *" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
          <select className="input-reg" value={formData.isRemote ? 'yes' : 'no'} onChange={e => setFormData({...formData, isRemote: e.target.value === 'yes'})}>
             <option value="no">العمل حضوري</option>
             <option value="yes">العمل عن بُعد</option>
          </select>
        </div>
      </div>
    );
    if (step === 2) return (
      <div className="space-y-6 animate-fade-up">
        <h3 className="text-xl font-black text-blue-500">2️⃣ بيانات التواصل</h3>
        <div className="grid grid-cols-2 gap-4">
          <input className="input-reg" placeholder="الاسم الأول *" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <input className="input-reg" placeholder="اللقب *" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
        </div>
        <input className="input-reg" placeholder="المسمى الوظيفي *" value={formData.currentJob} onChange={e => setFormData({...formData, currentJob: e.target.value})} />
        <input className="input-reg" type="email" placeholder="البريد الإلكتروني *" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        <input className="input-reg" placeholder="رقم الجوال *" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
      </div>
    );
    if (step === 3) return (
      <div className="space-y-6 animate-fade-up">
        <h3 className="text-xl font-black text-blue-500">3️⃣ بيانات المشروع</h3>
        <textarea className="input-reg h-32" placeholder="وصف مختصر للفكرة (300-500 حرف) *" value={formData.startupDescription} onChange={e => setFormData({...formData, startupDescription: e.target.value})} />
        <input className="input-reg" placeholder="المشكلة التي تحلها الشركة *" value={formData.problem} onChange={e => setFormData({...formData, problem: e.target.value})} />
        <input className="input-reg" placeholder="الحل المقترح *" value={formData.solution} onChange={e => setFormData({...formData, solution: e.target.value})} />
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
           <span className="text-sm font-bold">هل يوجد نموذج أولي (MVP)؟</span>
           <button type="button" onClick={() => setFormData({...formData, hasMVP: !formData.hasMVP})} className={`px-6 py-2 rounded-xl font-black text-xs ${formData.hasMVP ? 'bg-blue-600' : 'bg-slate-700'}`}>{formData.hasMVP ? 'نعم' : 'لا'}</button>
        </div>
        {formData.hasMVP && <input className="input-reg" placeholder="رابط الـ MVP (اختياري)" value={formData.mvpLink} onChange={e => setFormData({...formData, mvpLink: e.target.value})} />}
      </div>
    );
    if (step === 4) return (
      <div className="space-y-6 animate-fade-up">
        <h3 className="text-xl font-black text-blue-500">4️⃣ فريق العمل</h3>
        <input className="input-reg" type="number" placeholder="عدد المؤسسين *" value={formData.founderCount} onChange={e => setFormData({...formData, founderCount: parseInt(e.target.value)})} />
        <div className="space-y-3">
          <p className="text-xs font-black text-slate-500 uppercase">الأدوار الموجودة حالياً:</p>
          <div className="flex flex-wrap gap-2">
            {['تقني', 'تشغيلي', 'مبيعات', 'منتج'].map(r => (
              <button key={r} type="button" onClick={() => toggleList('existingRoles', r)} className={`px-4 py-2 rounded-xl text-xs font-bold border ${formData.existingRoles?.includes(r) ? 'bg-blue-600 border-blue-500' : 'bg-white/5 border-white/10'}`}>{r}</button>
            ))}
          </div>
        </div>
      </div>
    );
    if (step === 5) return (
      <div className="space-y-6 animate-fade-up">
        <h3 className="text-xl font-black text-blue-500">5️⃣ الاحتياج من الحاضنة</h3>
        <div className="space-y-3">
           <p className="text-xs font-black text-slate-500 uppercase">نوع الدعم المطلوب:</p>
           <div className="grid grid-cols-2 gap-2">
              {['إرشاد', 'شراكات', 'أدوات', 'جاهزية استثمار'].map(s => (
                <button key={s} type="button" onClick={() => toggleList('supportNeeded', s)} className={`p-4 rounded-2xl text-xs font-bold border ${formData.supportNeeded?.includes(s) ? 'bg-blue-600 border-blue-500' : 'bg-white/5 border-white/10'}`}>{s}</button>
              ))}
           </div>
        </div>
        <textarea className="input-reg h-24" placeholder="الهدف من الانضمام للحاضنة *" value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} />
      </div>
    );
    return renderAgreements();
  };

  // --- PARTNER FLOW ---
  const renderPartnerSteps = () => {
    if (step === 1) return (
      <div className="space-y-6 animate-fade-up">
        <h3 className="text-xl font-black text-emerald-500">1️⃣ البيانات الأساسية</h3>
        <div className="grid grid-cols-2 gap-4">
          <input className="input-reg" placeholder="الاسم الأول *" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <input className="input-reg" placeholder="اللقب *" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
        </div>
        <input className="input-reg" placeholder="المدينة *" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
        <select className="input-reg" value={formData.primaryRole} onChange={e => setFormData({...formData, primaryRole: e.target.value as any})}>
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
      <div className="space-y-6 animate-fade-up">
        <h3 className="text-xl font-black text-emerald-500">2️⃣ الخبرة والمهارات</h3>
        <input className="input-reg" type="number" placeholder="سنوات الخبرة *" value={formData.experienceYears} onChange={e => setFormData({...formData, experienceYears: parseInt(e.target.value)})} />
        <textarea className="input-reg h-24" placeholder="المهارات الأساسية (مثال: React, Python, Sales Strategy)" value={formData.skills?.join(', ')} onChange={e => setFormData({...formData, skills: e.target.value.split(',').map(s => s.trim())})} />
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
           <span className="text-sm font-bold">هل سبق عملت في شركة ناشئة؟</span>
           <button type="button" onClick={() => setFormData({...formData, workedInStartup: !formData.workedInStartup})} className={`px-6 py-2 rounded-xl font-black text-xs ${formData.workedInStartup ? 'bg-emerald-600' : 'bg-slate-700'}`}>{formData.workedInStartup ? 'نعم' : 'لا'}</button>
        </div>
      </div>
    );
    if (step === 3) return (
      <div className="space-y-6 animate-fade-up">
        <h3 className="text-xl font-black text-emerald-500">3️⃣ التفرغ والالتزام</h3>
        <select className="input-reg" value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value as any})}>
           <option value="Part-time">تفرغ جزئي</option>
           <option value="Full-time">تفرغ كامل</option>
        </select>
        <input className="input-reg" type="number" placeholder="عدد الساعات المتاحة أسبوعياً *" value={formData.weeklyHours} onChange={e => setFormData({...formData, weeklyHours: parseInt(e.target.value)})} />
        <select className="input-reg" value={formData.partnershipType} onChange={e => setFormData({...formData, partnershipType: e.target.value as any})}>
           <option value="Equity">شراكة أسهم</option>
           <option value="Trial">تجربة شراكة</option>
           <option value="Project">مشروع واحد</option>
        </select>
      </div>
    );
    if (step === 4) return (
      <div className="space-y-6 animate-fade-up">
        <h3 className="text-xl font-black text-emerald-500">4️⃣ التفضيلات</h3>
        <p className="text-xs font-black text-slate-500 uppercase">المراحل التي تفضل العمل بها:</p>
        <div className="grid grid-cols-3 gap-2">
           {['Idea', 'MVP', 'Growth'].map(s => (
             <button key={s} type="button" onClick={() => toggleList('preferredStages', s)} className={`p-4 rounded-2xl text-[10px] font-black border ${formData.preferredStages?.includes(s) ? 'bg-emerald-600 border-emerald-500' : 'bg-white/5 border-white/10'}`}>{s}</button>
           ))}
        </div>
      </div>
    );
    if (step === 5) return (
      <div className="space-y-6 animate-fade-up">
        <h3 className="text-xl font-black text-emerald-500">5️⃣ إثبات العمل</h3>
        <input className="input-reg" placeholder="رابط LinkedIn *" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
        <input className="input-reg" placeholder="رابط GitHub / Portfolio" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} />
        <textarea className="input-reg h-32" placeholder="نبذة عن أبرز إنجاز مهني..." value={formData.achievement} onChange={e => setFormData({...formData, achievement: e.target.value})} />
      </div>
    );
    return renderAgreements();
  };

  // --- MENTOR FLOW ---
  const renderMentorSteps = () => {
    if (step === 1) return (
      <div className="space-y-6 animate-fade-up">
        <h3 className="text-xl font-black text-purple-500">1️⃣ البيانات الأساسية</h3>
        <div className="grid grid-cols-2 gap-4">
          <input className="input-reg" placeholder="الاسم الأول *" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <input className="input-reg" placeholder="اللقب *" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
        </div>
        <input className="input-reg" placeholder="المدينة *" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
        <input className="input-reg" type="email" placeholder="البريد الإلكتروني *" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        <input className="input-reg" placeholder="رقم الجوال *" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
      </div>
    );
    if (step === 2) return (
      <div className="space-y-6 animate-fade-up">
        <h3 className="text-xl font-black text-purple-500">2️⃣ البيانات المهنية</h3>
        <input className="input-reg" placeholder="المسمى الوظيفي الحالي *" value={formData.currentJob} onChange={e => setFormData({...formData, currentJob: e.target.value})} />
        <input className="input-reg" type="number" placeholder="سنوات الخبرة الإجمالية *" value={formData.experienceYears} onChange={e => setFormData({...formData, experienceYears: parseInt(e.target.value)})} />
        <p className="text-xs font-black text-slate-500 uppercase">مجالات الخبرة:</p>
        <div className="flex flex-wrap gap-2">
           {['تقنية', 'استثمار', 'تشغيل', 'مبيعات', 'منتج', 'قانوني'].map(exp => (
             <button key={exp} type="button" onClick={() => toggleList('mentorExpertise', exp)} className={`px-4 py-2 rounded-xl text-xs font-bold border ${formData.mentorExpertise?.includes(exp) ? 'bg-purple-600 border-purple-500' : 'bg-white/5 border-white/10'}`}>{exp}</button>
           ))}
        </div>
      </div>
    );
    if (step === 3) return (
      <div className="space-y-6 animate-fade-up">
        <h3 className="text-xl font-black text-purple-500">3️⃣ تجربة الإرشاد</h3>
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
           <span className="text-sm font-bold">هل سبق عملت كمرشد؟</span>
           <button type="button" onClick={() => setFormData({...formData, previousMentorExp: !formData.previousMentorExp})} className={`px-6 py-2 rounded-xl font-black text-xs ${formData.previousMentorExp ? 'bg-purple-600' : 'bg-slate-700'}`}>{formData.previousMentorExp ? 'نعم' : 'لا'}</button>
        </div>
        {formData.previousMentorExp && <input className="input-reg" type="number" placeholder="عدد الجلسات التقريبي" value={formData.sessionCount} onChange={e => setFormData({...formData, sessionCount: parseInt(e.target.value)})} />}
      </div>
    );
    if (step === 4) return (
      <div className="space-y-6 animate-fade-up">
        <h3 className="text-xl font-black text-purple-500">4️⃣ التفرغ</h3>
        <input className="input-reg" type="number" placeholder="عدد الجلسات المتاحة شهرياً *" value={formData.monthlySessions} onChange={e => setFormData({...formData, monthlySessions: parseInt(e.target.value)})} />
        <select className="input-reg" value={formData.mentorshipMode} onChange={e => setFormData({...formData, mentorshipMode: e.target.value as any})}>
           <option value="Remote">عن بُعد</option>
           <option value="On-site">حضوري</option>
        </select>
      </div>
    );
    if (step === 5) return (
      <div className="space-y-6 animate-fade-up">
        <h3 className="text-xl font-black text-purple-500">5️⃣ روابط مهنية</h3>
        <input className="input-reg" placeholder="LinkedIn URL *" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
        <input className="input-reg" placeholder="الموقع الشخصي (اختياري)" value={formData.personalWebsite} onChange={e => setFormData({...formData, personalWebsite: e.target.value})} />
      </div>
    );
    return renderAgreements();
  };

  const renderAgreements = () => (
    <div className="space-y-8 animate-fade-up">
      <h3 className={`text-xl font-black text-${roleMeta.color}-500`}>6️⃣ الإقرارات النهائية</h3>
      <div className="space-y-4">
         <label className="flex items-center gap-4 cursor-pointer group">
            <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${formData.agreedToTerms ? `bg-${roleMeta.color}-600 border-${roleMeta.color}-500` : 'border-white/10 group-hover:border-white/20'}`}>
               {formData.agreedToTerms && '✓'}
            </div>
            <input type="checkbox" className="hidden" checked={formData.agreedToTerms} onChange={e => setFormData({...formData, agreedToTerms: e.target.checked})} />
            <span className="text-sm font-bold text-slate-300">أوافق على الشروط والأحكام وسياسة الخصوصية</span>
         </label>
         {role === 'PARTNER' && (
           <label className="flex items-center gap-4 cursor-pointer group">
              <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${formData.agreedToContract ? 'bg-emerald-600 border-emerald-500' : 'border-white/10 group-hover:border-white/20'}`}>
                 {formData.agreedToContract && '✓'}
              </div>
              <input type="checkbox" className="hidden" checked={formData.agreedToContract} onChange={e => setFormData({...formData, agreedToContract: e.target.checked})} />
              <span className="text-sm font-bold text-slate-300">أوافق على نظام تجربة الشراكة (14 يوم)</span>
           </label>
         )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-950 text-white font-sans overflow-hidden" dir="rtl">
      <style>{`
        .input-reg { width: 100%; padding: 1.25rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); rounded: 1.5rem; outline: none; transition: all 0.3s; font-weight: bold; border-radius: 1.2rem; }
        .input-reg:focus { border-color: #3b82f6; background: rgba(255,255,255,0.08); }
        .btn-step { padding: 1.25rem; border-radius: 1.5rem; font-black; transition: all 0.3s; flex: 1; }
      `}</style>

      {/* Left Decoration */}
      <div className={`hidden lg:flex lg:w-[35%] bg-slate-900 border-l border-white/5 p-20 flex-col justify-between relative overflow-hidden`}>
         <div className={`absolute top-0 right-0 w-64 h-64 bg-${roleMeta.color}-600 opacity-5 blur-[100px]`}></div>
         <div className="relative z-10 space-y-12">
            <div className={`w-20 h-20 bg-${roleMeta.color}-600 rounded-[2.2rem] flex items-center justify-center text-4xl shadow-2xl`}>{roleMeta.icon}</div>
            <h1 className="text-5xl font-black leading-tight">{roleMeta.title}</h1>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">انضم لأكبر منظومة ريادية ذكية في المنطقة وابدأ رحلة التحول اليوم.</p>
         </div>
         <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">Business Developers v3.0</p>
         </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 overflow-y-auto p-8 md:p-20">
        <div className="max-w-2xl mx-auto space-y-12">
          
          {/* Progress Indicator */}
          <div className="flex justify-between items-center mb-4">
             <div className="flex gap-2">
                {[...Array(roleMeta.steps)].map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step > i ? `bg-${roleMeta.color}-500 w-8` : 'bg-white/10 w-2'}`}></div>
                ))}
             </div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Step {step} / {roleMeta.steps}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {renderStep()}

            <div className="flex gap-4 pt-8">
              {step > 1 && (
                <button type="button" onClick={handleBack} className="px-10 py-5 bg-white/5 text-slate-400 rounded-2xl font-black hover:bg-white/10 transition-all">الخلف</button>
              )}
              {step < roleMeta.steps ? (
                <button type="button" onClick={handleNext} className={`flex-1 py-5 bg-${roleMeta.color}-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-${roleMeta.color}-900/20 hover:brightness-110 transition-all active:scale-95`}>المتابعة</button>
              ) : (
                <button type="submit" className={`flex-1 py-5 bg-${roleMeta.color}-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-${roleMeta.color}-900/20 hover:brightness-110 transition-all active:scale-95`}>تأكيد التسجيل النهائي 🚀</button>
              )}
            </div>
          </form>

          <p className="text-center text-[10px] font-black text-slate-700 uppercase tracking-widest">جميع البيانات مشفرة ومحمية وفق معايير الخصوصية الدولية</p>
        </div>
      </div>
    </div>
  );
};

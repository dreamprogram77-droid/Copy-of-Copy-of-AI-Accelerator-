
import React, { useState } from 'react';
import { UserProfile, ApplicantProfile, ProjectEvaluationResult } from '../types';
import { evaluateProjectIdea } from '../services/geminiService';
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';

interface RegistrationProps {
  onRegister: (profile: UserProfile) => void;
  onStaffLogin?: () => void;
}

export const Registration: React.FC<RegistrationProps> = ({ onRegister, onStaffLogin }) => {
  const [formData, setFormData] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    startupName: '',
    startupDescription: '',
    industry: 'Technology',
    phone: '',
    email: '',
    age: 0,
    birthDate: '',
    foundationYear: new Date().getFullYear(),
    foundersCount: 1,
    technologies: '',
    agreedToTerms: false,
    agreedToContract: false,
    signedContractName: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ProjectEvaluationResult | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(05|5)\d{8}$/;

    if (!formData.firstName.trim()) newErrors.firstName = 'الاسم الأول مطلوب';
    if (!formData.lastName.trim()) newErrors.lastName = 'اللقب (العائلة) مطلوب';
    if (!formData.startupName.trim()) newErrors.startupName = 'اسم المشروع مطلوب';
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'تنسيق البريد الإلكتروني غير صحيح';
    }
    
    const cleanPhone = formData.phone.replace(/\s/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'رقم الجوال مطلوب';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'رقم الجوال يجب أن يكون سعودياً صحيحاً (مثال: 05xxxxxxxx)';
    }

    if (!formData.startupDescription.trim()) {
      newErrors.startupDescription = 'وصف الفكرة مطلوب لتقييم المشروع';
    } else if (formData.startupDescription.length < 20) {
      newErrors.startupDescription = 'الوصف قصير جداً، يرجى تقديم تفاصيل أكثر (20 حرفاً على الأقل)';
    }
    
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'يجب الموافقة على الشروط والأحكام للمتابعة';
    }

    if (!formData.agreedToContract) {
      newErrors.agreedToContract = 'يجب الموافقة على بنود عقد الاحتضان للمتابعة';
    }

    const expectedName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    if (!formData.signedContractName.trim()) {
      newErrors.signedContractName = 'التوقيع الرقمي مطلوب';
    } else if (formData.signedContractName.trim() !== expectedName) {
      newErrors.signedContractName = `التوقيع يجب أن يطابق الاسم المدخل: (${expectedName})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAnalyzeIdea = async () => {
    if (!formData.startupDescription || formData.startupDescription.length < 20) {
      setErrors(prev => ({ 
        ...prev, 
        startupDescription: 'يرجى كتابة وصف مفصل للفكرة (20 حرفاً على الأقل) قبل التحليل' 
      }));
      playErrorSound();
      return;
    }
    
    setErrors(prev => {
      const { startupDescription, ...rest } = prev;
      return rest;
    });

    setIsAnalyzing(true);
    try {
      const tempProfile: ApplicantProfile = {
        codeName: `${formData.firstName} ${formData.lastName}`,
        projectStage: 'Idea',
        sector: formData.industry,
        goal: 'Initial Analysis',
        techLevel: 'Medium'
      };
      const result = await evaluateProjectIdea(formData.startupDescription, tempProfile);
      setAnalysisResult(result);
      playCelebrationSound();
    } catch (e) {
      playErrorSound();
      alert("عذراً، فشل التحليل. يرجى التأكد من اتصال الإنترنت.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onRegister({
        ...formData,
        contractSignedAt: new Date().toISOString()
      });
    } else {
      playErrorSound();
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorKey)[0];
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const today = new Date().toLocaleDateString('ar-SA');

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans text-white overflow-hidden" dir="rtl">
      <style>{`
        .contract-scroll::-webkit-scrollbar { width: 4px; }
        .contract-scroll::-webkit-scrollbar-thumb { background: #2563eb; border-radius: 10px; }
        .form-field { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .form-field:focus-within { transform: translateX(-4px); }
        .signature-font { font-family: 'Amiri', serif; }
      `}</style>

      {/* Side Content */}
      <div className="hidden lg:flex lg:w-[40%] relative bg-slate-900 flex-col justify-between p-16 border-l border-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <svg width="100%" height="100%"><pattern id="grid-reg" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5"/></pattern><rect width="100%" height="100%" fill="url(#grid-reg)" /></svg>
        </div>
        <div className="relative z-10 space-y-12">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10">
                 <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              </div>
              <span className="text-3xl font-black tracking-tighter uppercase">Startup Hub</span>
           </div>
           
           <div className="space-y-6">
              <h1 className="text-6xl font-black leading-[1.1] tracking-tight">نحو <br/><span className="text-blue-500">التزام ريادي</span> موثق.</h1>
              <p className="text-xl text-slate-400 max-w-md leading-relaxed font-medium">خطوتك الأولى تبدأ ببيانات دقيقة واتفاقية عادلة. نحن نستثمر في طموحك وجديتك.</p>
           </div>
        </div>

        <div className="relative z-10 pt-10 border-t border-white/5 flex gap-6">
           <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl flex-1">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">الأمان القانوني</p>
              <p className="text-xs text-slate-300 font-bold leading-relaxed">اتفاقيات احتضان مشفرة ومؤمنة بالكامل لحماية حقوق الملكية الفكرية.</p>
           </div>
        </div>
      </div>

      {/* Registration Form Area */}
      <div className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-16">
        <div className="max-w-3xl w-full mx-auto animate-fade-in-up">
          <header className="mb-16 space-y-3">
            <h2 className="text-5xl font-black tracking-tight">بوابة رواد الأعمال</h2>
            <p className="text-slate-500 text-lg font-medium">يرجى ملء النموذج لاعتماد مشروعك في برنامج الاحتضان الذكي.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-20 pb-32">
            
            {/* Section 1 */}
            <div className="space-y-10">
               <h3 className="text-2xl font-black text-blue-500 flex items-center gap-5">
                  <span className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center text-sm border border-blue-500/20">01</span>
                  المعلومات الشخصية والتقنية
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: 'الاسم الأول', key: 'firstName' },
                    { label: 'اللقب / العائلة', key: 'lastName' },
                    { label: 'اسم المشروع الناشئ', key: 'startupName', full: true },
                  ].map(field => (
                    <div key={field.key} className={`form-field space-y-3 ${field.full ? 'md:col-span-2' : ''}`}>
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">{field.label}</label>
                       <input 
                         className={`w-full p-5 bg-white/5 border rounded-2xl outline-none transition-all duration-300 font-bold ${errors[field.key] ? 'border-rose-500 bg-rose-500/5 animate-shake' : 'border-white/10 focus:border-blue-500 focus:bg-white/10'}`}
                         value={formData[field.key as keyof UserProfile] as string} 
                         onChange={e => setFormData({...formData, [field.key]: e.target.value})} 
                       />
                       {errors[field.key] && <p className="text-[10px] font-bold text-rose-500 px-2">{errors[field.key]}</p>}
                    </div>
                  ))}
                  
                  <div className="md:col-span-2 space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">وصف الفكرة والحل</label>
                     <textarea 
                       className={`w-full h-44 p-6 bg-white/5 border rounded-[2rem] outline-none transition-all resize-none font-medium leading-relaxed ${errors.startupDescription ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-blue-500 focus:bg-white/10'}`}
                       value={formData.startupDescription} 
                       onChange={e => setFormData({...formData, startupDescription: e.target.value})} 
                       placeholder="ما هي المشكلة وكيف ستقوم بحلها؟"
                     />
                     <div className="flex justify-between items-center px-2">
                        <button type="button" onClick={handleAnalyzeIdea} disabled={isAnalyzing} className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest flex items-center gap-2">
                           {isAnalyzing ? <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> : '✨'}
                           تفعيل الفحص الذكي للفكرة
                        </button>
                        <span className="text-[10px] text-slate-600 font-bold uppercase">{formData.startupDescription.length} حرف</span>
                     </div>
                     {errors.startupDescription && <p className="text-[10px] font-bold text-rose-500 px-2">{errors.startupDescription}</p>}
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">البريد الإلكتروني الرسمي</label>
                    <input type="email" className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">رقم الجوال (05xxxxxx)</label>
                    <input className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 font-bold" placeholder="0500000000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
               </div>
            </div>

            {/* Section 2: Contract */}
            <div className="space-y-10">
               <h3 className="text-2xl font-black text-blue-500 flex items-center gap-5">
                  <span className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center text-sm border border-blue-500/20">02</span>
                  عقد الاحتضان الرقمي
               </h3>
               
               <div className={`bg-white text-slate-900 rounded-[3rem] shadow-3xl overflow-hidden border-4 transition-all duration-500 ${errors.signedContractName ? 'border-rose-500' : 'border-slate-800'}`}>
                  <div className="bg-slate-900 p-8 flex justify-between items-center">
                     <span className="text-white font-black text-xs uppercase tracking-widest">Formal Incubation Protocol</span>
                     <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        {today}
                     </div>
                  </div>

                  <div className="p-10 md:p-14 h-[450px] overflow-y-auto contract-scroll text-base leading-relaxed text-slate-700 font-medium space-y-8">
                     <div className="text-center space-y-4">
                        <h4 className="text-4xl font-black text-slate-900 tracking-tight">عقد تقديم خدمات تسريع الأعمال</h4>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Virtual Incubation Master Agreement</p>
                     </div>

                     <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-4 text-sm font-bold">
                        <p>بين شركة مسرعة الأعمال الذكية (طرف أول) <br/> وبين رائد الأعمال: <span className="text-blue-600">{formData.firstName} {formData.lastName}</span> (طرف ثاني).</p>
                        <p>الشركة / المشروع: <span className="text-blue-600">{formData.startupName || '______'}</span></p>
                     </div>

                     <div className="space-y-6 text-sm md:text-base pr-4">
                        <p><strong>١. الغرض من الاتفاقية:</strong> يلتزم الطرف الأول بتوفير الإرشاد التقني والاستراتيجي والأدوات الذكية لتطوير مشروع الطرف الثاني خلال مدة الاحتضان.</p>
                        <p><strong>٢. مدة البرنامج:</strong> ثمانية أسابيع مكثفة تبدأ من تاريخ توقيع هذا العقد، يتخللها جلسات مراجعة أسبوعية.</p>
                        <p><strong>٣. السرية والملكية:</strong> يقر الطرف الأول بأن كافة تفاصيل المشروع المقدمة هي ملك حصري للطرف الثاني، ويلتزم بالحفاظ على سريتها التامة.</p>
                        <p><strong>٤. الالتزام:</strong> يلتزم الطرف الثاني بتخصيص ما لا يقل عن ١٠ ساعات عمل أسبوعياً لتنفيذ المخرجات المطلوبة في كل مستوى.</p>
                        <p><strong>٥. التخريج:</strong> يحصل الطرف الثاني على شهادة إتمام رسمية وفرصة للعرض على المستثمرين في حال تحقيق معايير النضج المطلوبة.</p>
                     </div>
                  </div>

                  <div className="p-10 md:p-14 bg-slate-50 border-t border-slate-100">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                           <label className="flex items-center gap-4 cursor-pointer group">
                              <input type="checkbox" className="w-6 h-6 accent-blue-600" checked={formData.agreedToTerms} onChange={e => setFormData({...formData, agreedToTerms: e.target.checked})} />
                              <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">أوافق على سياسات المنصة العامة.</span>
                           </label>
                           <label className="flex items-center gap-4 cursor-pointer group">
                              <input type="checkbox" className="w-6 h-6 accent-blue-600" checked={formData.agreedToContract} onChange={e => setFormData({...formData, agreedToContract: e.target.checked})} />
                              <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">أقبل بكافة بنود العقد المذكورة أعلاه.</span>
                           </label>
                        </div>

                        <div className="space-y-4">
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pr-1">التوقيع الرقمي (اكتب اسمك الكامل)</label>
                           <input 
                             className={`w-full p-6 bg-white border-2 rounded-2xl outline-none text-3xl signature-font italic text-blue-900 shadow-inner transition-all ${errors.signedContractName ? 'border-rose-500 bg-rose-50 animate-shake' : 'border-slate-200 focus:border-blue-500'}`}
                             placeholder="Full Name Signature"
                             value={formData.signedContractName}
                             onChange={e => setFormData({...formData, signedContractName: e.target.value})}
                           />
                           {formData.signedContractName && formData.signedContractName.trim() === `${formData.firstName.trim()} ${formData.lastName.trim()}` && formData.firstName !== '' ? (
                              <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest pr-2 animate-fade-in">
                                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                                 Verified Signature
                              </div>
                           ) : formData.signedContractName && (
                              <p className="text-[10px] font-black text-rose-500 pr-2">الاسم لا يطابق البيانات المسجلة</p>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-8 bg-blue-600 hover:bg-blue-700 text-white rounded-[2.5rem] font-black text-2xl shadow-premium shadow-blue-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-6 group"
            >
              <span>اعتماد الاتفاقية والدخول</span>
              <svg className="w-8 h-8 transform rotate-180 group-hover:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

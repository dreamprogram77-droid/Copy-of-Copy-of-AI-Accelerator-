
import React, { useState, useEffect } from 'react';
import { PartnerProfile, StartupRecord, UserRole, SECTORS, WorkStyle, PartnershipGoal } from '../types';
import { storageService } from '../services/storageService';
import { runPartnerMatchAI } from '../services/geminiService';
import { playPositiveSound, playCelebrationSound, playErrorSound } from '../services/audioService';

interface CoFounderPortalProps {
  userUid: string;
  userRole: UserRole;
  startup?: StartupRecord;
  onBack: () => void;
}

export const CoFounderPortal: React.FC<CoFounderPortalProps> = ({ userUid, userRole, startup, onBack }) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'register' | 'my-matches'>(userRole === 'PARTNER' ? 'my-matches' : 'browse');
  const [isMatching, setIsMatching] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [partners, setPartners] = useState<PartnerProfile[]>([]);
  
  // Registration State
  const [partnerForm, setPartnerForm] = useState<Partial<PartnerProfile>>({
    primaryRole: 'CTO',
    skills: [],
    experienceYears: 5,
    availabilityHours: 20,
    commitmentType: 'Part-time',
    city: 'الرياض',
    isRemote: true,
    workStyle: 'Fast',
    goals: 'Long-term',
    bio: '',
    linkedin: ''
  });

  useEffect(() => {
    const allPartners = storageService.getAllPartners();
    setPartners(allPartners);
  }, []);

  const handleRegisterPartner = (e: React.FormEvent) => {
    e.preventDefault();
    const newPartner: PartnerProfile = {
      ...(partnerForm as PartnerProfile),
      uid: userUid,
      email: storageService.getAllUsers().find(u => u.uid === userUid)?.email || '',
      isVerified: false,
      profileCompletion: 100
    };
    storageService.registerAsPartner(newPartner);
    playCelebrationSound();
    alert('تم تفعيل بروفايل الشريك بنجاح!');
    setActiveTab('my-matches');
  };

  const handleMatchRequest = async () => {
    if (!startup) return;
    setIsMatching(true);
    playPositiveSound();
    try {
      const results = await runPartnerMatchAI(startup, partners);
      setMatches(results);
      playCelebrationSound();
    } catch (e) {
      playErrorSound();
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans" dir="rtl">
      <style>{`
        .glass-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); }
        .match-glow { box-shadow: 0 0 30px rgba(37, 99, 235, 0.2); }
      `}</style>

      {/* Navigation Header */}
      <header className="px-8 py-6 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center">
         <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all">← العودة</button>
            <div>
               <h1 className="text-2xl font-black">Co-Founder Hub</h1>
               <p className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.2em]">نظام المطابقة الذكي للمؤسسين</p>
            </div>
         </div>
         <div className="flex bg-white/5 p-1 rounded-2xl">
            <button onClick={() => setActiveTab('browse')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'browse' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>تصفح الشركاء</button>
            <button onClick={() => setActiveTab('my-matches')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'my-matches' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>طلباتي</button>
            {userRole !== 'PARTNER' && (
              <button onClick={() => setActiveTab('register')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'register' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>سجل كشريك متاح</button>
            )}
         </div>
      </header>

      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12">

          {activeTab === 'browse' && (
            <div className="space-y-10 animate-fade-in">
               <div className="flex justify-between items-end">
                  <div className="space-y-2">
                     <h2 className="text-4xl font-black">جد شريكك الاستراتيجي</h2>
                     <p className="text-slate-500 text-xl font-medium">طابق فجوات مشروعك مع مهارات الشركاء المسجلين.</p>
                  </div>
                  {startup && (
                    <button 
                      onClick={handleMatchRequest}
                      disabled={isMatching}
                      className="px-10 py-5 bg-blue-600 rounded-[2rem] font-black text-lg shadow-2xl hover:bg-blue-700 transition-all flex items-center gap-4 active:scale-95 disabled:opacity-50"
                    >
                       {isMatching ? (
                         <>
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           <span>جاري تحليل التوافق...</span>
                         </>
                       ) : (
                         <>
                           <span>رشّح لي شركاء (Smart Match)</span>
                           <span className="text-2xl">✨</span>
                         </>
                       )}
                    </button>
                  )}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {matches.length > 0 ? matches.map((m, i) => {
                    const p = partners.find(part => part.uid === m.partnerUid);
                    if (!p) return null;
                    return (
                      <div key={i} className="glass-card p-10 rounded-[3.5rem] border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden flex flex-col justify-between">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-bl-full"></div>
                         <div>
                            <div className="flex justify-between items-start mb-8">
                               <div className="w-20 h-20 bg-blue-600/10 rounded-[2.2rem] flex items-center justify-center text-4xl shadow-inner border border-blue-500/20 group-hover:scale-110 transition-transform">
                                  👤
                               </div>
                               <div className="text-left">
                                  <p className="text-3xl font-black text-emerald-400 leading-none">{m.score}%</p>
                                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Match Score</p>
                               </div>
                            </div>
                            
                            <h3 className="text-2xl font-black mb-1">{p.name}</h3>
                            <p className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-6">{p.primaryRole} • {p.experienceYears} Years</p>

                            <div className="space-y-4 mb-10">
                               {m.reasoning.map((reason: string, idx: number) => (
                                 <div key={idx} className="flex gap-3 items-center text-xs font-medium text-slate-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    {reason}
                                 </div>
                               ))}
                               <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">المخاطرة المحتملة</p>
                                  <p className="text-[11px] text-slate-400 font-medium italic">"{m.risk}"</p>
                               </div>
                            </div>
                         </div>

                         <button className="w-full py-5 bg-white/5 hover:bg-blue-600 rounded-2xl font-black text-sm transition-all active:scale-95 border border-white/5">إرسال طلب شراكة (Trial)</button>
                      </div>
                    );
                  }) : (
                    <div className="col-span-full py-32 text-center bg-white/5 rounded-[4rem] border-2 border-dashed border-white/10 opacity-30">
                       <p className="text-6xl mb-6">🤝</p>
                       <h3 className="text-2xl font-black">بانتظار تفعيل نظام المطابقة</h3>
                       <p className="text-sm font-medium mt-2">اضغط على زر الترشيح بالأعلى لتقوم Gemini بتحليل قاعدة البيانات لك.</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'register' && (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
               <div className="bg-slate-900 rounded-[4rem] p-12 md:p-16 border border-white/5 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-bl-full"></div>
                  
                  <div className="relative z-10 space-y-12">
                     <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black">سجل كشريك مؤسس</h2>
                        <p className="text-slate-500 text-lg">أدخل مهاراتك ليراك المؤسسون والباحثون عن شركاء تقنيين أو إداريين.</p>
                     </div>

                     <form onSubmit={handleRegisterPartner} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">الاسم المهني</label>
                              <input className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 font-bold" placeholder="الاسم الكامل" onChange={e => setPartnerForm({...partnerForm, name: e.target.value})} required />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">الدور الأساسي</label>
                              <select className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl font-bold outline-none focus:border-blue-500" onChange={e => setPartnerForm({...partnerForm, primaryRole: e.target.value as any})}>
                                 <option value="CTO">CTO (تقني)</option>
                                 <option value="COO">COO (تشغيلي)</option>
                                 <option value="CMO">CMO (تسويقي)</option>
                                 <option value="CPO">CPO (منتج)</option>
                                 <option value="Finance">Finance (مالي)</option>
                              </select>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">الخبرة (بالسنوات)</label>
                              <input type="number" className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl font-bold outline-none" onChange={e => setPartnerForm({...partnerForm, experienceYears: parseInt(e.target.value)})} />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">الوقت المتاح أسبوعياً</label>
                              <input type="number" className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl font-bold outline-none" placeholder="ساعات العمل" onChange={e => setPartnerForm({...partnerForm, availabilityHours: parseInt(e.target.value)})} />
                           </div>
                           <div className="md:col-span-2 space-y-3">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">نبذة مهنية (أبرز نجاحاتك)</label>
                              <textarea className="w-full h-32 p-6 bg-white/5 border border-white/10 rounded-[2rem] outline-none focus:border-blue-500 font-medium resize-none" placeholder="تحدث عن إنجازاتك وقصص نجاحك السابقة..." onChange={e => setPartnerForm({...partnerForm, bio: e.target.value})} required />
                           </div>
                           <div className="md:col-span-2 space-y-3">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">رابط LinkedIn</label>
                              <input className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl font-bold outline-none" placeholder="https://linkedin.com/in/..." onChange={e => setPartnerForm({...partnerForm, linkedin: e.target.value})} required />
                           </div>
                        </div>
                        
                        <button type="submit" className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black text-xl shadow-2xl active:scale-95 transition-all">تفعيل حساب الشريك والظهور في القائمة</button>
                     </form>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'my-matches' && (
            <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
               <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black">سجل التفاعلات</h2>
                  <p className="text-slate-500">طلبات الشراكة المتبادلة وتتبع فترة التجربة (Trial).</p>
               </div>

               <div className="bg-slate-900/50 rounded-[4rem] border border-white/5 p-12 flex flex-col items-center justify-center space-y-8 text-center min-h-[400px]">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-4xl opacity-20">📬</div>
                  <div className="space-y-2">
                     <h3 className="text-xl font-bold text-slate-400">لا توجد طلبات شراكة نشطة حالياً</h3>
                     <p className="text-sm text-slate-600 max-w-xs">عندما يقوم مؤسس بمطابقة ملفه معك أو العكس، ستظهر التفاصيل وفترات التجربة هنا.</p>
                  </div>
                  <button onClick={() => setActiveTab('browse')} className="px-10 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-black border border-white/5 transition-all">تصفح الفرص المتاحة</button>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

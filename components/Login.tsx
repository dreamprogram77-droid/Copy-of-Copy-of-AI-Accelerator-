
import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { UserProfile, UserRole } from '../types';
import { playPositiveSound, playErrorSound } from '../services/audioService';

interface LoginProps {
  onLoginSuccess: (user: UserProfile & { role: UserRole; uid: string; startupId?: string }) => void;
  onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBack }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('STARTUP');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rolesMeta = [
    { id: 'STARTUP', label: 'شركة محتضنة', icon: '🚀', desc: 'متابعة نضج مشروعك', color: 'blue' },
    { id: 'PARTNER', label: 'شريك (Partner)', icon: '🤝', desc: 'فرص الشراكة النشطة', color: 'emerald' },
    { id: 'MENTOR', label: 'مرشد (Mentor)', icon: '🧠', desc: 'إدارة جلسات الإرشاد', color: 'purple' },
    { id: 'ADMIN', label: 'الإدارة', icon: '👑', desc: 'التحكم المركزي', color: 'slate' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const result = storageService.loginUser(email);
      
      if (result) {
        // Simple role check logic
        if (selectedRole === 'ADMIN' && result.user.role !== 'ADMIN') {
          setError('هذا الحساب لا يملك صلاحيات الإدارة.');
          playErrorSound();
          setIsLoading(false);
          return;
        }

        const profile: any = {
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          phone: result.user.phone,
          uid: result.user.uid,
          role: result.user.role || selectedRole,
          startupName: result.startup?.name || '',
          startupId: result.startup?.projectId,
          name: `${result.user.firstName} ${result.user.lastName}`,
        };
        
        playPositiveSound();
        onLoginSuccess(profile);
      } else {
        setError('عذراً، لم نجد حساباً مسجلاً بهذا البريد الإلكتروني.');
        playErrorSound();
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans overflow-hidden text-white" dir="rtl">
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 flex-col justify-center p-20 border-l border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent_50%)] opacity-50"></div>
        <div className="relative z-10 space-y-12">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl animate-float">
             <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div className="space-y-6">
            <h1 className="text-7xl font-black leading-tight tracking-tighter">بوابة <br/><span className="text-blue-500">الدخول الموحد.</span></h1>
            <p className="text-2xl text-slate-400 max-w-lg leading-relaxed font-medium">اختر هويتك في المسرعة للوصول إلى أدواتك المخصصة. نحن نبني المستقبل معاً.</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="max-w-xl w-full animate-fade-in-up space-y-10 py-10">
           <header className="space-y-4 text-center">
              <h2 className="text-4xl font-black text-white tracking-tight">تسجيل الدخول</h2>
              <p className="text-slate-500 font-medium text-lg">اختر الدور الخاص بك للدخول للمنصة</p>
           </header>

           {/* Role Selector Grid */}
           <div className="grid grid-cols-2 gap-4">
              {rolesMeta.map(role => (
                <button
                  key={role.id}
                  onClick={() => { setSelectedRole(role.id as UserRole); playPositiveSound(); }}
                  className={`p-6 rounded-[2.5rem] border text-right transition-all flex flex-col gap-3 group
                    ${selectedRole === role.id 
                      ? `bg-${role.color}-600/10 border-${role.color}-500 shadow-xl shadow-${role.color}-500/10` 
                      : 'bg-white/5 border-white/5 hover:border-white/20 opacity-60 hover:opacity-100'}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-3xl">{role.icon}</span>
                    <div className={`w-3 h-3 rounded-full ${selectedRole === role.id ? `bg-${role.color}-500 animate-pulse` : 'bg-slate-700'}`}></div>
                  </div>
                  <div>
                    <h4 className={`font-black text-sm ${selectedRole === role.id ? `text-${role.color}-400` : 'text-slate-300'}`}>{role.label}</h4>
                    <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">{role.desc}</p>
                  </div>
                </button>
              ))}
           </div>

           <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 p-10 rounded-[3rem] border border-white/5">
              <div className="space-y-3">
                 <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">البريد الإلكتروني</label>
                 <input 
                    type="email" 
                    required
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 transition-all text-white font-bold text-lg"
                    placeholder="name@startup.ai"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                 />
              </div>

              <div className="space-y-3">
                 <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest pr-2">كلمة المرور</label>
                 <input 
                    type="password" 
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 transition-all text-white font-bold text-lg"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                 />
              </div>

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 animate-shake">
                   <span className="text-rose-500">⚠️</span>
                   <p className="text-xs font-bold text-rose-400">{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black text-xl shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-4 group disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>دخول للمنصة</span>
                    <svg className="w-6 h-6 transform rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </>
                )}
              </button>

              <button type="button" onClick={onBack} className="w-full text-center text-[10px] font-black text-slate-600 hover:text-slate-400 uppercase tracking-[0.2em] mt-4">العودة للرئيسية</button>
           </form>
        </div>
      </div>
    </div>
  );
};

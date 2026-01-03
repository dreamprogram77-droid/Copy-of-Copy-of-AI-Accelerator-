
import React from 'react';
import { playPositiveSound } from '../services/audioService';

interface MembershipsPageProps {
  onBack: () => void;
  onSelect: (pkgName: string) => void;
}

interface Package {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  period: string;
  features: string[];
  color: string;
  gradient: string;
  btnText: string;
  icon: string;
}

const PACKAGES: Package[] = [
  {
    id: 'startup',
    title: 'باقة الانضمام الأساسي',
    subtitle: 'Startup Entry',
    price: '199',
    period: 'ريال / شهر',
    icon: '🟦',
    color: 'blue',
    gradient: 'from-blue-600 to-blue-400',
    btnText: 'انضم كشركاء ناشئين',
    features: [
      'الانضمام لمجتمع Business Developers',
      'الوصول لمحتوى معرفي عملي',
      'حضور الفعاليات العامة (أونلاين)',
      'فرص التواصل مع رواد أعمال',
      'أولوية التقديم لبرامج الاحتضان',
      'بدون التزام – مناسبة للتجربة'
    ]
  },
  {
    id: 'growth',
    title: 'باقة النمو',
    subtitle: 'Growth Membership',
    price: '399',
    period: 'ريال / شهر',
    icon: '🟩',
    color: 'emerald',
    gradient: 'from-emerald-600 to-teal-400',
    btnText: 'فعل عضوية النمو',
    features: [
      'جلسة إرشاد شهرية',
      'مراجعة ربع سنوية للأداء',
      'الوصول لقوالب ونماذج تنفيذ',
      'إدراج الشركة في مجتمع الشركات النشطة',
      'فرص شراكات ومشاريع مشتركة',
      'خصومات على خدمات التنفيذ والتطوير'
    ]
  },
  {
    id: 'investor',
    title: 'الوصول الاستثماري',
    subtitle: 'Investor Access',
    price: '2,500',
    period: 'ريال / سنة',
    icon: '🟧',
    color: 'orange',
    gradient: 'from-orange-500 to-amber-400',
    btnText: 'كن مستثمراً معتمداً',
    features: [
      'الوصول لفرص مختارة (Deal Flow)',
      'ملخصات جاهزية للشركات',
      'دعوات لأيام العرض (Demo Days)',
      'جلسات تعريف مع مؤسسين مختارين',
      'تقارير اتجاهات السوق',
      'لا عمولات خفية على الاستثمار'
    ]
  },
  {
    id: 'partner',
    title: 'باقة الشركات',
    subtitle: 'Business Partner',
    price: '6,000',
    period: 'ريال / سنة',
    icon: '🟥',
    color: 'rose',
    gradient: 'from-rose-600 to-pink-400',
    btnText: 'شراكة مؤسسية',
    features: [
      'عضوية مؤسسية (حتى 3 ممثلين)',
      'حضور فعاليات الأعمال',
      'ورش عمل تطبيقية',
      'فرص شراكات مع شركات ناشئة',
      'إدراج الشركة كشريك أعمال',
      'خصومات على برامج التطوير'
    ]
  },
  {
    id: 'mentor',
    title: 'عضوية المرشد',
    subtitle: 'Mentor Network',
    price: '500',
    period: 'ريال / سنة (رمزية)',
    icon: '🟪',
    color: 'purple',
    gradient: 'from-purple-600 to-indigo-500',
    btnText: 'سجل كمرشد خبير',
    features: [
      'الانضمام لشبكة المرشدين',
      'الظهور في دليل المرشدين',
      'فرص جلسات مدفوعة لاحقاً',
      'المشاركة في البرامج والفعاليات',
      'بناء سمعة مهنية داخل المجتمع',
      'الاختيار يتم بالموافقة'
    ]
  }
];

export const MembershipsPage: React.FC<MembershipsPageProps> = ({ onBack, onSelect }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100" dir="rtl">
      <style>{`
        .pricing-card { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); border-top: 8px solid transparent; }
        .pricing-card:hover { transform: translateY(-15px); box-shadow: 0 40px 80px -20px rgba(0,0,0,0.1); }
      `}</style>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all border border-slate-100 group">
              <svg className="w-6 h-6 transform rotate-180 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900">باقات Business Developers</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">مجتمع أعمال | تنفيذ | شراكات | فرص نمو</p>
            </div>
          </div>
          <div className="hidden lg:flex gap-4">
             <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl text-[10px] font-black text-blue-600 uppercase">Premium Memberships v2.0</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20 space-y-32">
        
        {/* Intro */}
        <section className="text-center space-y-6 max-w-4xl mx-auto animate-fade-in">
           <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight tracking-tight">
             استثمر في <span className="text-blue-600">وصولك.</span> <br/>
             ونحن نبني معك.
           </h2>
           <p className="text-xl text-slate-500 font-medium leading-relaxed">
             انضم إلى أقوى مجتمع ريادي ذكي. اختر الباقة التي تناسب مرحلتك الحالية واستفد من شبكة الخبراء، المستثمرين، وأدوات التنفيذ الحصرية.
           </p>
        </section>

        {/* Pricing Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {PACKAGES.map((pkg, idx) => (
             <div key={pkg.id} className={`pricing-card bg-white p-10 rounded-[3.5rem] border border-slate-100 flex flex-col justify-between group animate-fade-in-up`} style={{ animationDelay: `${idx * 0.1}s`, borderTopColor: pkg.color === 'blue' ? '#3b82f6' : pkg.color === 'emerald' ? '#10b981' : pkg.color === 'orange' ? '#f59e0b' : pkg.color === 'rose' ? '#e11d48' : '#8b5cf6' }}>
                <div>
                   <div className="flex justify-between items-start mb-8">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-slate-50 group-hover:scale-110 transition-transform">
                        {pkg.icon}
                      </div>
                      <div className="text-left">
                         <p className="text-3xl font-black text-slate-900">{pkg.price}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{pkg.period}</p>
                      </div>
                   </div>
                   
                   <div className="mb-10">
                      <h3 className="text-2xl font-black text-slate-900 mb-1">{pkg.title}</h3>
                      <p className="text-blue-600 text-xs font-bold uppercase tracking-widest">{pkg.subtitle}</p>
                   </div>

                   <div className="space-y-4 mb-12">
                      {pkg.features.map((f, i) => (
                        <div key={i} className="flex gap-3 items-start">
                           <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                              <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                           </div>
                           <span className="text-sm font-medium text-slate-600">{f}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <button 
                  onClick={() => { playPositiveSound(); onSelect(pkg.title); }}
                  className={`w-full py-5 rounded-[2rem] font-black text-sm text-white shadow-xl transition-all hover:scale-105 active:scale-95 bg-gradient-to-r ${pkg.gradient}`}
                >
                   {pkg.btnText}
                </button>
             </div>
           ))}
        </section>

        {/* Quick Comparison Table */}
        <section className="space-y-12 animate-fade-in">
           <div className="text-center space-y-2">
              <h3 className="text-3xl font-black">مقارنة سريعة</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Decision Matrix</p>
           </div>
           
           <div className="overflow-x-auto rounded-[3rem] border border-slate-100 shadow-2xl bg-white">
              <table className="w-full text-right">
                 <thead className="bg-slate-900 text-white">
                    <tr>
                       <th className="px-10 py-6 font-black text-sm uppercase tracking-widest">الفئة</th>
                       <th className="px-10 py-6 font-black text-sm uppercase tracking-widest">السعر</th>
                       <th className="px-10 py-6 font-black text-sm uppercase tracking-widest">الهدف</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[
                      { cat: 'رواد جدد', price: '199 شهري', goal: 'دخول وتجربة' },
                      { cat: 'خريجين', price: '399 شهري', goal: 'نمو واستمرار' },
                      { cat: 'مستثمرين', price: '2,500 سنوي', goal: 'فرص مصفّاة' },
                      { cat: 'شركات', price: '6,000 سنوي', goal: 'شراكات وابتكار' },
                      { cat: 'مرشدين', price: 'مجاني/رمزي', goal: 'شبكة وخبرة' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-10 py-6 font-black text-slate-900">{row.cat}</td>
                        <td className="px-10 py-6 font-bold text-blue-600">{row.price}</td>
                        <td className="px-10 py-6 font-medium text-slate-500">{row.goal}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </section>

        {/* Rationale Section */}
        <section className="bg-slate-900 rounded-[5rem] p-12 md:p-24 text-white relative overflow-hidden shadow-3xl">
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                 <h3 className="text-5xl md:text-7xl font-black leading-tight">لماذا هذه الأسعار؟</h3>
                 <p className="text-xl text-slate-400 font-medium leading-relaxed">
                   نحن نعتمد فلسفة "المجتمع أولاً". هدفنا هو تمكين أكبر عدد من المبدعين والشركات من الوصول إلى شبكتنا.
                 </p>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                       <p className="font-black text-blue-400 text-lg mb-2">شاملة</p>
                       <p className="text-xs text-slate-500">في متناول الأفراد والشركات الصغيرة.</p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                       <p className="font-black text-emerald-400 text-lg mb-2">توسعية</p>
                       <p className="text-xs text-slate-500">تفتح الباب لعدد كبير من العقول المبدعة.</p>
                    </div>
                 </div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl p-10 md:p-14 rounded-[4rem] border border-white/10 space-y-10">
                 <h4 className="text-2xl font-black">الدخل الحقيقي يأتي من القيمة:</h4>
                 <div className="space-y-6">
                    {[
                      { label: 'خدمات التنفيذ', val: 'بناء الـ MVP والهوية' },
                      { label: 'التسريع', val: 'التمويل مقابل حصص' },
                      { label: 'الشراكات', val: 'المشاريع المشتركة (JV)' }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                         <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                         <span className="text-sm font-bold text-white">{item.val}</span>
                      </div>
                    ))}
                 </div>
                 <div className="pt-6 flex gap-10">
                    <div className="text-center">
                       <p className="text-3xl font-black text-blue-400">العضوية</p>
                       <p className="text-[10px] font-bold text-slate-500 uppercase">وصول</p>
                    </div>
                    <div className="text-center">
                       <p className="text-3xl font-black text-emerald-400">التنفيذ</p>
                       <p className="text-[10px] font-bold text-slate-500 uppercase">دخل أكبر</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Closing */}
        <section className="text-center space-y-10 py-20">
           <div className="max-w-2xl mx-auto space-y-6">
              <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black mx-auto shadow-2xl">BD</div>
              <p className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                في Business Developers نؤمن أن الفرص لا تُحتكر، بل تُبنى داخل مجتمع واعٍ.
              </p>
              <p className="text-xl text-blue-600 font-bold italic">
                "يدفع العضو فقط عندما يحصل على قيمة حقيقية ملموسة."
              </p>
           </div>
           <button onClick={onBack} className="px-16 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-black transition-all transform hover:scale-105 active:scale-95">العودة للرئيسية</button>
        </section>

      </main>

      <footer className="py-12 border-t border-slate-100 text-center bg-white">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Business Developers Membership Protocol • 2024</p>
      </footer>
    </div>
  );
};

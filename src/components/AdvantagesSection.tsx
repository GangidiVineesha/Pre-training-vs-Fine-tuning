import React from 'react';
import { Award, Clock, Database, Share2, Globe, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

export const AdvantagesSection: React.FC = () => {
  const benefits = [
    {
      title: 'Better Performance',
      description: 'Improves accuracy, precision, and task-specific results significantly over zero-shot baselines.',
      icon: Award,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-700',
      metric: '+15.8% Accuracy Gain',
    },
    {
      title: 'Time & Cost Efficient',
      description: 'Uses pre-trained knowledge representations, eliminating the compute cost of training from scratch.',
      icon: Clock,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-100 text-blue-700',
      metric: 'Minutes vs Months',
    },
    {
      title: 'Handles Small Datasets',
      description: 'Works robustly even with limited task-specific labeled data (e.g. hundreds or few thousand samples).',
      icon: Database,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      iconBg: 'bg-cyan-100 text-cyan-700',
      metric: 'Prevents Overfitting',
    },
    {
      title: 'Transfer Learning Advantage',
      description: 'Leverages general syntax, grammar, and world facts while adapting attention to domain goals.',
      icon: Share2,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-700',
      metric: 'Universal Representations',
    },
    {
      title: 'Real-World Applicability',
      description: 'Directly deployable for domain-specific NLP (sentiment analysis, spam filtering, legal, biomedical triage).',
      icon: Globe,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      iconBg: 'bg-rose-100 text-rose-700',
      metric: 'Production Ready',
    },
  ];

  return (
    <section id="benefits" className="space-y-6">
      {/* 7. Advantages and Benefits Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 tracking-wider uppercase mb-1">
            <span>Section 07</span>
            <span>·</span>
            <span>Core Takeaways</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            7. Advantages and Benefits
          </h2>
          <p className="mt-1 text-xs md:text-sm text-slate-600">
            Why transfer learning with fine-tuning is the dominant paradigm for modern generative AI and applied NLP.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-9 h-9 rounded-lg ${b.iconBg} flex items-center justify-center mb-3 shadow-2xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {b.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] font-semibold text-slate-700">
                  {b.metric}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prominent Syllabus Conclusion Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-md flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
          <CheckCircle2 className="w-6 h-6 text-emerald-300" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-blue-200 font-semibold mb-0.5">
            Syllabus Takeaway & Conclusion
          </div>
          <p className="text-sm md:text-base font-semibold leading-relaxed text-white">
            Fine-tuning a pre-trained small model on a task-specific dataset significantly improves its performance, showcasing the effectiveness of transfer learning.
          </p>
        </div>
      </div>
    </section>
  );
};

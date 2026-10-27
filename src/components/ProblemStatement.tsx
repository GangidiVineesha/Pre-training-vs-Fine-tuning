import React, { useState } from 'react';
import { Target, HelpCircle, ArrowRight, CheckCircle2, AlertTriangle, Layers, Zap } from 'lucide-react';

export const ProblemStatement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gap' | 'solution'>('gap');

  return (
    <section id="problem" className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wider uppercase mb-1">
              <span>Section 01</span>
              <span>·</span>
              <span>Core Objective</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              1. Problem Statement
            </h2>
            <p className="mt-2 text-base text-slate-700 max-w-3xl leading-relaxed">
              A small pre-trained model may not perform well on a specific task. We want to compare the model's performance before and after fine-tuning it on a task-specific dataset to see how much adaptation improves its performance.
            </p>
          </div>
        </div>

        {/* Interactive toggle between the Fundamental Challenge and the Solution Hypothesis */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start shrink-0">
          <button
            onClick={() => setActiveTab('gap')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'gap'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            The Base Model Gap
          </button>
          <button
            onClick={() => setActiveTab('solution')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'solution'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Transfer Learning Solution
          </button>
        </div>
      </div>

      {/* Conceptual Breakdown Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-5 rounded-xl border transition-all ${
          activeTab === 'gap' ? 'border-amber-300 bg-amber-50/50 ring-1 ring-amber-300' : 'border-slate-200 bg-slate-50/60'
        }`}>
          <div className="flex items-center gap-2.5 text-amber-800 font-semibold text-sm mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Before Fine-Tuning: Raw Pre-Trained State</span>
          </div>
          <ul className="space-y-2.5 text-xs md:text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0 mt-0.5">·</span>
              <span><strong>General Corpora Only:</strong> Trained on web text or Wikipedia via Masked Language Modeling (MLM); lacks specialized task taxonomy.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0 mt-0.5">·</span>
              <span><strong>No Task Classification Head:</strong> The output layer is either random or an unaligned token generator without domain calibration.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0 mt-0.5">·</span>
              <span><strong>Baseline Performance:</strong> Generates diffuse class probabilities, yielding high loss (0.86) and modest accuracy (~72.8%).</span>
            </li>
          </ul>
        </div>

        <div className={`p-5 rounded-xl border transition-all ${
          activeTab === 'solution' ? 'border-blue-300 bg-blue-50/50 ring-1 ring-blue-300' : 'border-slate-200 bg-slate-50/60'
        }`}>
          <div className="flex items-center gap-2.5 text-blue-900 font-semibold text-sm mb-3">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>After Fine-Tuning: Task-Adapted State</span>
          </div>
          <ul className="space-y-2.5 text-xs md:text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold shrink-0 mt-0.5">·</span>
              <span><strong>Supervised Domain Alignment:</strong> Trained for 3–5 epochs on curated task dataset with Cross-Entropy loss.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold shrink-0 mt-0.5">·</span>
              <span><strong>Specialized Output Layer:</strong> Replaces MLM head with a tuned linear projection ($W \cdot h + b$) mapping to target classes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold shrink-0 mt-0.5">·</span>
              <span><strong>Measured Uplift:</strong> Attention weights focus on operative domain keywords, elevating accuracy to 88.6% and cutting loss to 0.42.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

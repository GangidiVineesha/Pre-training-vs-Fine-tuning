import React from 'react';
import { Play, BookOpen, Code2, ArrowUpRight, Sparkles, CheckCircle2, Cpu } from 'lucide-react';
import { ModelArchitectureOption, DatasetOption } from '../types/experiment';

interface HeroSectionProps {
  onRunExperiment: () => void;
  onOpenDiagram: () => void;
  onOpenCode: () => void;
  selectedModel: ModelArchitectureOption;
  selectedDataset: DatasetOption;
  isRunning: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRunExperiment,
  onOpenDiagram,
  onOpenCode,
  selectedModel,
  selectedDataset,
  isRunning,
}) => {
  return (
    <div id="overview" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-10 shadow-lg border border-slate-800">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl">
        {/* Syllabus Metadata Badges (clean unboxed text with dots) */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-blue-300 mb-3">
          <span className="text-white font-bold">Generative AI Project</span>
          <span aria-hidden="true">·</span>
          <span>Syllabus Concept: Pre-training & Transfer Learning</span>
          <span aria-hidden="true">·</span>
          <span>Task Adaptation Benchmarks</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Pre-training vs Fine-tuning Experiment
        </h1>

        {/* Syllabus Brief Subtitles */}
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
          <strong>Use case:</strong> Compare a small model before and after adaptation on a task-specific dataset.
        </p>

        <p className="mt-1 text-xs sm:text-sm text-blue-200/90 leading-relaxed">
          <strong>Expected output:</strong> Prediction or task-performance comparison showcasing the empirical uplift of transfer learning.
        </p>

        {/* Quick KPI Strip: 72.8% -> 88.6% */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="text-[11px] text-slate-400 font-medium block">Pre-Trained Base Acc</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-200 mt-1 block">72.8%</span>
            <span className="text-[10px] text-slate-400">Baseline accuracy</span>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-500/15 border border-blue-400/30 backdrop-blur-xs">
            <span className="text-[11px] text-blue-300 font-medium block">Fine-Tuned Acc</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-blue-400 mt-1 block">88.6%</span>
            <span className="text-[10px] text-emerald-400 font-semibold">+15.8% accuracy gain</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="text-[11px] text-slate-400 font-medium block">Loss Reduction</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1 block">-51.2%</span>
            <span className="text-[10px] text-slate-400">0.86 → 0.42 CE loss</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="text-[11px] text-slate-400 font-medium block">Current Setup</span>
            <span className="text-base font-bold font-mono text-white mt-1 block truncate">{selectedModel.name}</span>
            <span className="text-[10px] text-slate-400 truncate block">{selectedDataset.name}</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            onClick={onRunExperiment}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all shrink-0"
          >
            {isRunning ? (
              <>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>Simulating Training...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Interactive Pipeline</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenDiagram}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-medium text-xs sm:text-sm rounded-xl border border-white/10 transition-colors shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>View Syllabus Poster</span>
          </button>

          <button
            onClick={onOpenCode}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-medium text-xs sm:text-sm rounded-xl border border-white/10 transition-colors shrink-0"
          >
            <Code2 className="w-4 h-4" />
            <span>Export PyTorch Code</span>
          </button>
        </div>
      </div>
    </div>
  );
};

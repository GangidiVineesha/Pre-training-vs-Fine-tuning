import React from 'react';
import { Play, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onRunExperiment: () => void;
  onOpenDiagram: () => void;
  isRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onRunExperiment,
  onOpenDiagram,
  isRunning,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand title, one line */}
        <a href="#overview" className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            TL
          </span>
          <span>PreTrain vs FineTune Lab</span>
        </a>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#problem" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">Problem</a>
          <a href="#pipeline" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">Pipeline</a>
          <a href="#architecture" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">Architecture</a>
          <a href="#inputs" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">Inputs</a>
          <a href="#metrics" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">Evaluation</a>
          <a href="#playground" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">Predictions</a>
          <a href="#benefits" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">Benefits</a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenDiagram}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Inspect reference syllabus infographic"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Syllabus Poster</span>
          </button>
          <button
            onClick={onRunExperiment}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            {isRunning ? (
              <>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>Running Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Experiment</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

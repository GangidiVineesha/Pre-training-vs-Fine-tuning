import React from 'react';
import { X, ExternalLink, Download, CheckCircle2 } from 'lucide-react';

interface OriginalDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OriginalDiagramModal: React.FC<OriginalDiagramModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const imagePath = "/assets/aistudio/WhatsApp_Image_2026-10-25_at_9.24.59_PM_5fcb6e50.jpeg";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Syllabus Experiment Reference Infographic
            </h3>
            <p className="text-xs text-slate-500">
              Original experiment blueprint: Pre-training vs Fine-tuning Experiment
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Content */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col items-center bg-slate-900/5">
          <div className="relative max-w-4xl w-full rounded-xl overflow-hidden shadow-md border border-slate-200 bg-white">
            <img
              src={imagePath}
              alt="Pre-training vs Fine-tuning Experiment Syllabus Infographic"
              className="w-full h-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="mt-4 max-w-4xl w-full p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>All 7 sections from this infographic are mapped to real-time interactive modules in this application.</span>
            </div>
            <a
              href={imagePath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline shrink-0"
            >
              <span>Open Full Size</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

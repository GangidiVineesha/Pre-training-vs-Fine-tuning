import React from 'react';
import { Database, Cpu, Settings2, Sparkles, Layers, Sliders, ArrowRight } from 'lucide-react';
import { DatasetOption, ModelArchitectureOption, TrainingSettings } from '../types/experiment';
import { DATASETS, MODELS } from '../data/datasets';

interface CurrentInputControlsProps {
  selectedDataset: DatasetOption;
  onSelectDataset: (dataset: DatasetOption) => void;
  selectedModel: ModelArchitectureOption;
  onSelectModel: (model: ModelArchitectureOption) => void;
  trainingSettings: TrainingSettings;
  onUpdateSettings: (newSettings: Partial<TrainingSettings>) => void;
}

export const CurrentInputControls: React.FC<CurrentInputControlsProps> = ({
  selectedDataset,
  onSelectDataset,
  selectedModel,
  onSelectModel,
  trainingSettings,
  onUpdateSettings,
}) => {
  return (
    <section id="inputs" className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="pb-6 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wider uppercase mb-1">
          <span>Section 05</span>
          <span>·</span>
          <span>Configuration Deck</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          5. Current Input
        </h2>
        <p className="mt-1 text-xs md:text-sm text-slate-600">
          Configure the task dataset, pre-trained backbone architecture, and fine-tuning hyperparameters.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: Dataset */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <span>Task-Specific Dataset</span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Select the domain classification task. Transfer learning enables high performance even with small datasets.
            </p>

            <div className="space-y-2">
              {DATASETS.map((ds) => (
                <button
                  key={ds.id}
                  onClick={() => onSelectDataset(ds)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                    selectedDataset.id === ds.id
                      ? 'bg-white border-blue-500 ring-2 ring-blue-100 shadow-2xs font-semibold'
                      : 'bg-white/70 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{ds.name}</span>
                    <span className="text-[10px] text-slate-600 font-mono">{ds.domain}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 line-clamp-1">
                    {ds.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Dataset Split Bar */}
          <div className="mt-5 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
              <span className="font-medium">Data Partition Split</span>
              <span className="font-mono text-slate-500">{selectedDataset.sampleCount.toLocaleString()} total</span>
            </div>
            
            <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden flex">
              <div style={{ width: '70%' }} className="bg-blue-600 h-full" title="Train: 70%" />
              <div style={{ width: '15%' }} className="bg-amber-500 h-full" title="Validation: 15%" />
              <div style={{ width: '15%' }} className="bg-emerald-500 h-full" title="Test: 15%" />
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                <span>Train: {selectedDataset.trainCount} (70%)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                <span>Val: {selectedDataset.valCount}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>Test: {selectedDataset.testCount}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Panel 2: Model Architecture */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <span>Small Pre-trained Model</span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Distilled and compressed architectures with universal linguistic knowledge.
            </p>

            <div className="space-y-2">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onSelectModel(m)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                    selectedModel.id === m.id
                      ? 'bg-white border-purple-500 ring-2 ring-purple-100 shadow-2xs font-semibold'
                      : 'bg-white/70 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{m.name}</span>
                    <span className="text-[11px] text-purple-700 font-mono font-medium">{m.parameters}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    {m.layers} layers · {m.hiddenSize} hidden · {m.heads} heads
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span>Tokenizer:</span>
              <span className="font-mono text-slate-800">WordPiece (30,522 vocab)</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>Backbone Size:</span>
              <span className="font-mono text-slate-800">{selectedModel.paramCountNum}M parameters</span>
            </div>
          </div>
        </div>

        {/* Panel 3: Training Settings */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Settings2 className="w-4 h-4" />
              </div>
              <span>Training Hyperparameters</span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Specialized settings for transfer learning to prevent catastrophic forgetting.
            </p>

            {/* Hyperparameter 1: Learning Rate */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Learning Rate (η)</span>
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {trainingSettings.learningRate}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {['1e-4', '5e-5', '2e-5', '1e-5'].map((lr) => (
                    <button
                      key={lr}
                      onClick={() => onUpdateSettings({ learningRate: lr })}
                      className={`py-1 text-center font-mono text-[11px] rounded border transition-colors ${
                        trainingSettings.learningRate === lr
                          ? 'bg-blue-600 text-white border-blue-600 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {lr}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  {trainingSettings.learningRate === '2e-5' ? 'Standard transfer learning rate (preserves weights).' : 'Adjusts gradient descent step size.'}
                </p>
              </div>

              {/* Hyperparameter 2: Epochs */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Epochs</span>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {trainingSettings.epochs}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[2, 3, 4, 5].map((ep) => (
                    <button
                      key={ep}
                      onClick={() => onUpdateSettings({ epochs: ep })}
                      className={`py-1 text-center font-mono text-[11px] rounded border transition-colors ${
                        trainingSettings.epochs === ep
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {ep}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hyperparameter 3: Batch Size */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Batch Size</span>
                  <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {trainingSettings.batchSize}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[16, 32].map((bs) => (
                    <button
                      key={bs}
                      onClick={() => onUpdateSettings({ batchSize: bs })}
                      className={`py-1 text-center font-mono text-[11px] rounded border transition-colors ${
                        trainingSettings.batchSize === bs
                          ? 'bg-purple-600 text-white border-purple-600 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {bs}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200 text-xs text-slate-500">
            <span className="font-medium text-slate-700">Optimizer:</span> AdamW (weight_decay=0.01, warmup=0.1)
          </div>
        </div>
      </div>
    </section>
  );
};

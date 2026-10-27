import React, { useState } from 'react';
import { CheckCircle2, TrendingUp, TrendingDown, ArrowUpRight, BarChart3, LineChart, Table2, Layers } from 'lucide-react';
import { ModelArchitectureOption, DatasetOption, TrainingSettings } from '../types/experiment';
import { generateTrainingHistory } from '../data/datasets';

interface ExpectedOutputMetricsProps {
  selectedModel: ModelArchitectureOption;
  selectedDataset: DatasetOption;
  trainingSettings: TrainingSettings;
}

export const ExpectedOutputMetrics: React.FC<ExpectedOutputMetricsProps> = ({
  selectedModel,
  selectedDataset,
  trainingSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'table' | 'curves' | 'matrix'>('table');

  // Exact benchmark metrics from Section 6 in the syllabus graphic:
  // Accuracy: 72.8% vs 88.6%
  // Precision: 70.1% vs 86.3%
  // Recall: 69.4% vs 84.7%
  // F1-Score: 69.7% vs 85.4%
  // Loss: 0.86 vs 0.42
  // We scale slightly if user picks a different model, keeping the reference exact when DistilBERT is selected.
  const isDefaultModel = selectedModel.id === 'distilbert';
  const metrics = [
    {
      name: 'Accuracy',
      before: isDefaultModel ? 72.8 : selectedModel.baseAccuracy,
      after: isDefaultModel ? 88.6 : selectedModel.fineTunedAccuracy,
      unit: '%',
      delta: isDefaultModel ? '+15.8%' : `+${(selectedModel.fineTunedAccuracy - selectedModel.baseAccuracy).toFixed(1)}%`,
      isGoodPositive: true,
      description: 'Overall ratio of correctly classified test instances.',
    },
    {
      name: 'Precision',
      before: isDefaultModel ? 70.1 : +(selectedModel.baseAccuracy - 2.7).toFixed(1),
      after: isDefaultModel ? 86.3 : +(selectedModel.fineTunedAccuracy - 2.3).toFixed(1),
      unit: '%',
      delta: isDefaultModel ? '+16.2%' : `+${((selectedModel.fineTunedAccuracy - 2.3) - (selectedModel.baseAccuracy - 2.7)).toFixed(1)}%`,
      isGoodPositive: true,
      description: 'Exactness: when the model predicts a class, how often it is right.',
    },
    {
      name: 'Recall',
      before: isDefaultModel ? 69.4 : +(selectedModel.baseAccuracy - 3.4).toFixed(1),
      after: isDefaultModel ? 84.7 : +(selectedModel.fineTunedAccuracy - 3.9).toFixed(1),
      unit: '%',
      delta: isDefaultModel ? '+15.3%' : `+${((selectedModel.fineTunedAccuracy - 3.9) - (selectedModel.baseAccuracy - 3.4)).toFixed(1)}%`,
      isGoodPositive: true,
      description: 'Completeness: percentage of actual target instances detected.',
    },
    {
      name: 'F1-Score',
      before: isDefaultModel ? 69.7 : +(selectedModel.baseAccuracy - 3.1).toFixed(1),
      after: isDefaultModel ? 85.4 : +(selectedModel.fineTunedAccuracy - 3.2).toFixed(1),
      unit: '%',
      delta: isDefaultModel ? '+15.7%' : `+${((selectedModel.fineTunedAccuracy - 3.2) - (selectedModel.baseAccuracy - 3.1)).toFixed(1)}%`,
      isGoodPositive: true,
      description: 'Harmonic mean of precision and recall (robust against class imbalance).',
    },
    {
      name: 'Loss (Cross-Entropy)',
      before: 0.86,
      after: 0.42,
      unit: '',
      delta: '-51.2%',
      isGoodPositive: false,
      description: 'Prediction error penalty: measure of uncertainty and distance from truth.',
    },
  ];

  const history = generateTrainingHistory(
    trainingSettings.epochs,
    metrics[0].before,
    metrics[0].after
  );

  return (
    <section id="metrics" className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 tracking-wider uppercase mb-1">
            <span>Section 06</span>
            <span>·</span>
            <span>Empirical Findings</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>6. Expected Output: Prediction / Task Performance</span>
          </h2>
          <p className="mt-1 text-xs md:text-sm text-slate-600">
            Compare model performance metrics before and after fine-tuning on the <strong className="text-slate-800">{selectedDataset.name}</strong> test set.
          </p>
        </div>

        {/* View switcher tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'table' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table2 className="w-3.5 h-3.5" />
            <span>Metrics Table</span>
          </button>
          <button
            onClick={() => setActiveTab('curves')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'curves' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Epoch Curves</span>
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'matrix' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Confusion Shift</span>
          </button>
        </div>
      </div>

      {/* Main Tab 1: Direct Metrics Table from Box 6 */}
      {activeTab === 'table' && (
        <div className="mt-6">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3.5 px-4">Metric</th>
                  <th className="py-3.5 px-4 text-center bg-blue-50/50 text-blue-900 font-bold border-x border-slate-200">
                    Before Fine-tuning (Pre-trained)
                  </th>
                  <th className="py-3.5 px-4 text-center bg-purple-50/60 text-purple-900 font-bold">
                    After Fine-tuning (Task-specific)
                  </th>
                  <th className="py-3.5 px-4 text-right">Relative Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.map((m, idx) => (
                  <tr key={m.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30 hover:bg-slate-50/60'}>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div>{m.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{m.description}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-700 bg-blue-50/20 border-x border-slate-200">
                      {m.before}{m.unit}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums font-bold text-blue-700 bg-purple-50/30">
                      {m.after}{m.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>{m.delta}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Graphical Progress Visualizer Bars */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-700">Accuracy Benchmark Comparison</span>
                <span className="font-mono text-xs text-blue-700 font-bold">72.8% → 88.6%</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Pre-trained (Base)</span>
                    <span className="font-mono">72.8%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                    <div className="bg-slate-500 h-full rounded-full" style={{ width: '72.8%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-blue-800 font-medium mb-1">
                    <span>Fine-tuned (Task-specific)</span>
                    <span className="font-mono font-bold">88.6%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '88.6%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-700">Loss Reduction (Cross-Entropy Error)</span>
                <span className="font-mono text-xs text-emerald-700 font-bold">0.86 → 0.42 (-51.2%)</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Pre-trained Loss</span>
                    <span className="font-mono">0.86</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                    <div className="bg-rose-400 h-full rounded-full" style={{ width: '86%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-emerald-800 font-medium mb-1">
                    <span>Fine-tuned Loss</span>
                    <span className="font-mono font-bold">0.42</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: Epoch Curves SVG */}
      {activeTab === 'curves' && (
        <div className="mt-6 p-6 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Training Dynamics Across {trainingSettings.epochs} Epochs</h4>
              <p className="text-xs text-slate-500">Loss steadily decreases while validation accuracy ascends.</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-blue-700 font-medium">
                <span className="w-3 h-1 bg-blue-600 rounded inline-block" />
                <span>Validation Accuracy</span>
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 font-medium">
                <span className="w-3 h-1 bg-rose-500 rounded inline-block" />
                <span>Validation Loss</span>
              </span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full h-48 bg-white rounded-lg p-3 border border-slate-200">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
              {/* Horizontal grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />

              {/* Accuracy curve (blue) */}
              <path
                d={history
                  .map((rec, i) => {
                    const x = (i / (history.length - 1)) * 480 + 10;
                    // Map 70% to 90% into Y: 130 to 20
                    const y = 130 - ((rec.valAcc - 70) / 20) * 110;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Loss curve (rose) */}
              <path
                d={history
                  .map((rec, i) => {
                    const x = (i / (history.length - 1)) * 480 + 10;
                    // Map loss 0.9 to 0.3 into Y: 20 to 130
                    const y = 20 + ((0.9 - rec.valLoss) / 0.6) * 110;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#e11d48"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="4 4"
              />

              {/* Data points */}
              {history.map((rec, i) => {
                const x = (i / (history.length - 1)) * 480 + 10;
                const yAcc = 130 - ((rec.valAcc - 70) / 20) * 110;
                const yLoss = 20 + ((0.9 - rec.valLoss) / 0.6) * 110;

                return (
                  <g key={i}>
                    <circle cx={x} cy={yAcc} r="4" fill="#2563eb" />
                    <circle cx={x} cy={yLoss} r="4" fill="#e11d48" />
                    <text x={x} y={145} fontSize="9" fill="#94a3b8" textAnchor="middle">
                      Ep {rec.epoch}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {history.map((h) => (
              <div key={h.epoch} className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
                <div className="font-bold text-slate-800">Epoch {h.epoch}</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Acc: <strong className="text-blue-600">{h.valAcc}%</strong></div>
                <div className="text-slate-500 text-[11px]">Loss: <strong className="text-rose-600">{h.valLoss}</strong></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Tab 3: Confusion Shift Matrix */}
      {activeTab === 'matrix' && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">
              Before Fine-Tuning
            </span>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Confusion Matrix (Base Model)</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono max-w-xs mx-auto">
              <div className="p-3 bg-white rounded border border-slate-300">
                <div className="text-slate-400 text-[10px]">True Positives</div>
                <div className="text-lg font-bold text-slate-800 mt-1">260</div>
                <div className="text-[10px] text-slate-400">72.2%</div>
              </div>
              <div className="p-3 bg-rose-50 rounded border border-rose-200">
                <div className="text-rose-600 text-[10px]">False Positives</div>
                <div className="text-lg font-bold text-rose-700 mt-1">100</div>
                <div className="text-[10px] text-rose-500">27.8%</div>
              </div>
              <div className="p-3 bg-rose-50 rounded border border-rose-200">
                <div className="text-rose-600 text-[10px]">False Negatives</div>
                <div className="text-lg font-bold text-rose-700 mt-1">104</div>
                <div className="text-[10px] text-rose-500">28.9%</div>
              </div>
              <div className="p-3 bg-white rounded border border-slate-300">
                <div className="text-slate-400 text-[10px]">True Negatives</div>
                <div className="text-lg font-bold text-slate-800 mt-1">286</div>
                <div className="text-[10px] text-slate-400">73.3%</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">Notice high rate of false positives due to lack of domain boundary.</p>
          </div>

          <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-200 text-center">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wide block mb-1">
              After Fine-Tuning
            </span>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Confusion Matrix (Task Adapted)</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono max-w-xs mx-auto">
              <div className="p-3 bg-emerald-50 rounded border border-emerald-300 shadow-2xs">
                <div className="text-emerald-700 text-[10px] font-bold">True Positives</div>
                <div className="text-lg font-bold text-emerald-800 mt-1">319</div>
                <div className="text-[10px] text-emerald-600 font-semibold">+22.7% increase</div>
              </div>
              <div className="p-3 bg-white rounded border border-slate-200">
                <div className="text-slate-500 text-[10px]">False Positives</div>
                <div className="text-lg font-bold text-slate-700 mt-1">41</div>
                <div className="text-[10px] text-emerald-600">-59% reduction</div>
              </div>
              <div className="p-3 bg-white rounded border border-slate-200">
                <div className="text-slate-500 text-[10px]">False Negatives</div>
                <div className="text-lg font-bold text-slate-700 mt-1">45</div>
                <div className="text-[10px] text-emerald-600">-56% reduction</div>
              </div>
              <div className="p-3 bg-emerald-50 rounded border border-emerald-300 shadow-2xs">
                <div className="text-emerald-700 text-[10px] font-bold">True Negatives</div>
                <div className="text-lg font-bold text-emerald-800 mt-1">345</div>
                <div className="text-[10px] text-emerald-600 font-semibold">+20.6% increase</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-blue-800">Errors dramatically reduced; predictions converge sharply along diagonal.</p>
          </div>
        </div>
      )}

      {/* Result Callout Banner directly from Box 6 of the infographic */}
      <div className="mt-6 p-4 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="text-xs md:text-sm text-purple-950 font-medium">
          <strong className="font-bold text-purple-900">Result:</strong> Fine-tuned model shows significantly better performance on the task-specific dataset, cutting loss by over half and demonstrating the power of transfer learning.
        </div>
      </div>
    </section>
  );
};

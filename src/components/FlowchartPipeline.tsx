import React, { useState, useEffect } from 'react';
import {
  Download,
  BarChart2,
  Cpu,
  CheckCircle,
  GitCompare,
  Play,
  RotateCcw,
  Code2,
  Terminal,
  ArrowDown,
  ChevronRight
} from 'lucide-react';
import { ModelArchitectureOption, DatasetOption, TrainingSettings } from '../types/experiment';

interface FlowchartPipelineProps {
  currentStep: number;
  onSetStep: (step: number) => void;
  onRunFullPipeline: () => void;
  isRunning: boolean;
  selectedModel: ModelArchitectureOption;
  selectedDataset: DatasetOption;
  trainingSettings: TrainingSettings;
}

export const FlowchartPipeline: React.FC<FlowchartPipelineProps> = ({
  currentStep,
  onSetStep,
  onRunFullPipeline,
  isRunning,
  selectedModel,
  selectedDataset,
  trainingSettings,
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'explanation' | 'code' | 'tensors'>('explanation');

  const steps = [
    {
      id: 1,
      name: 'Load Pre-trained Small Model',
      short: '1. Load Model',
      icon: Download,
      color: 'bg-blue-50 border-blue-300 text-blue-800',
      activeColor: 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100',
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : 'idle',
      algorithmSummary: `Initialize a compact pre-trained backbone (${selectedModel.name}, ${selectedModel.parameters}) with foundational linguistic weights learned from large-scale general text (Wikipedia & BookCorpus).`,
      details: [
        'Downloads pre-trained weights and tokenizer configuration.',
        'Initializes token, positional, and segment embedding matrices.',
        'Architecture: Transformer encoder with ' + selectedModel.layers + ' layers and ' + selectedModel.hiddenSize + ' hidden dimension.',
      ],
      codeSnippet: `from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_name = "${selectedModel.name.toLowerCase()}-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
# Load general pre-trained weights without classification head
model = AutoModelForSequenceClassification.from_pretrained(
    model_name, 
    num_labels=${selectedDataset.classes.length}
)`,
      tensors: `Input Shape: [Batch Size=16, Sequence Length=128]
Embedding Matrix: [Vocab=30522, Hidden Dim=${selectedModel.hiddenSize}]
Attention Heads: ${selectedModel.heads} × [Head Dim=${selectedModel.hiddenSize / selectedModel.heads}]
Param Count: ${selectedModel.parameters}`,
    },
    {
      id: 2,
      name: 'Evaluate on Task (Before Fine-tuning)',
      short: '2. Eval Before',
      icon: BarChart2,
      color: 'bg-rose-50 border-rose-300 text-rose-800',
      activeColor: 'bg-rose-600 text-white border-rose-600 ring-4 ring-rose-100',
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'idle',
      algorithmSummary: `Pass the task-specific validation/test set (${selectedDataset.testCount} samples) through the raw model to establish an initial zero-shot / unadapted baseline.`,
      details: [
        'Forward pass without parameter updates (gradient tracking disabled with torch.no_grad()).',
        'Record baseline metrics: Accuracy: 72.8%, Loss: 0.86, F1-Score: 69.7%.',
        'Analyze error distribution: identifies high false positive and confused sentiment states.',
      ],
      codeSnippet: `import torch
from torch.utils.data import DataLoader

test_loader = DataLoader(test_dataset, batch_size=${trainingSettings.batchSize})
model.eval()

total_loss, correct, total = 0, 0, 0
with torch.no_grad():
    for batch in test_loader:
        outputs = model(**batch)
        loss = outputs.loss
        preds = torch.argmax(outputs.logits, dim=-1)
        correct += (preds == batch['labels']).sum().item()
# Baseline Accuracy: ~72.8%, Loss: ~0.86`,
      tensors: `Logits Output: [Batch=16, Classes=${selectedDataset.classes.length}]
Softmax Probability: Categorical distribution over ${selectedDataset.classes.length} classes
Baseline Cross-Entropy Loss: 0.86`,
    },
    {
      id: 3,
      name: 'Fine-tune on Task-specific Dataset',
      short: '3. Fine-tune',
      icon: Cpu,
      color: 'bg-amber-50 border-amber-300 text-amber-800',
      activeColor: 'bg-amber-600 text-white border-amber-600 ring-4 ring-amber-100',
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'active' : 'idle',
      algorithmSummary: `Train the model for a few epochs (${trainingSettings.epochs} epochs) with a smaller learning rate (${trainingSettings.learningRate}) using AdamW and cross-entropy loss.`,
      details: [
        'Learning rate 2e-5 prevents catastrophic forgetting of pre-trained syntactic priors.',
        'Backpropagates loss through transformer layers and newly attached classification head.',
        'Mini-batch SGD with weight decay (0.01) and linear warmup schedule.',
      ],
      codeSnippet: `from transformers import Trainer, TrainingArguments

training_args = TrainingArguments(
    output_dir="./results",
    learning_rate=${trainingSettings.learningRate}, # Key: small lr to preserve pre-trained priors
    per_device_train_batch_size=${trainingSettings.batchSize},
    num_train_epochs=${trainingSettings.epochs},
    weight_decay=${trainingSettings.weightDecay},
    evaluation_strategy="epoch",
    warmup_ratio=${trainingSettings.warmupRatio},
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
)
trainer.train()`,
      tensors: `Optimizer: AdamW (lr=${trainingSettings.learningRate}, betas=(0.9, 0.999))
Gradient Tensors: Computed for all active layers
Backprop Path: Loss -> Softmax -> Linear Head -> Transformer Encoder Layers -> Embeddings`,
    },
    {
      id: 4,
      name: 'Evaluate on Task (After Fine-tuning)',
      short: '4. Eval After',
      icon: CheckCircle,
      color: 'bg-emerald-50 border-emerald-300 text-emerald-800',
      activeColor: 'bg-emerald-600 text-white border-emerald-600 ring-4 ring-emerald-100',
      status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'active' : 'idle',
      algorithmSummary: `Evaluate the fine-tuned model on the exact same test dataset to measure empirical accuracy gain, loss drop, and calibrated confidence.`,
      details: [
        'Test on identical hold-out test set (' + selectedDataset.testCount + ' samples).',
        'Record post-adaptation metrics: Accuracy: 88.6%, Loss: 0.42, F1-Score: 85.4%.',
        'Substantial reduction in classification entropy and boundary overlap.',
      ],
      codeSnippet: `eval_results = trainer.evaluate(eval_dataset=test_dataset)
print(f"Post-finetuning Accuracy: {eval_results['eval_accuracy']:.2%}")
print(f"Post-finetuning Loss: {eval_results['eval_loss']:.3f}")
# Output: Accuracy: 88.6%, Loss: 0.42`,
      tensors: `Post-tuning Softmax Entropy: Sharply peaked around ground truth
True Positives: Elevated by +16.2%
Test Loss: Dropped from 0.86 -> 0.42`,
    },
    {
      id: 5,
      name: 'Compare Results & Analyze',
      short: '5. Compare & Analyze',
      icon: GitCompare,
      color: 'bg-purple-50 border-purple-300 text-purple-800',
      activeColor: 'bg-purple-600 text-white border-purple-600 ring-4 ring-purple-100',
      status: currentStep > 5 ? 'completed' : currentStep === 5 ? 'active' : 'idle',
      algorithmSummary: `Quantify the performance differential across Accuracy (+15.8%), Precision (+16.2%), Recall (+15.3%), and Loss (-51.2%). Validate transfer learning hypothesis.`,
      details: [
        'Construct comparative confusion matrices and precision-recall curves.',
        'Assess per-class performance to detect rare class sensitivity.',
        'Verify that fine-tuning achieves high accuracy without requiring millions of training samples.',
      ],
      codeSnippet: `delta_accuracy = tuned_acc - base_acc # +15.8%
delta_loss = tuned_loss - base_loss     # -0.44 (-51.2%)
print(f"Transfer Learning Improvement: +{delta_accuracy:.1f}% accuracy gain!")`,
      tensors: `Comparative Matrix:
Accuracy:  72.8% -> 88.6% (+15.8%)
Loss:      0.86  -> 0.42  (-51.2%)
F1-Score:  69.7% -> 85.4% (+15.7%)`,
    },
  ];

  const currentStepData = steps[Math.min(currentStep - 1, steps.length - 1)];

  return (
    <div id="pipeline" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: 2. Flowchart (Visual Flow Diagram from Box 2) */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs font-semibold text-blue-700 tracking-wider uppercase mb-1">
                Section 02
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                2. Flowchart
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onRunFullPipeline}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isRunning ? 'Running...' : 'Auto-Run'}</span>
              </button>
              <button
                onClick={() => onSetStep(1)}
                disabled={isRunning}
                className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                title="Reset pipeline to step 1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Click on any flowchart node to inspect its internal algorithm mechanics and code implementation.
          </p>

          {/* Interactive Flowchart Diagram */}
          <div className="mt-5 flex flex-col items-center">
            {/* Start Node */}
            <div className="w-36 py-1 px-3 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs text-center border border-slate-300 shadow-2xs">
              Start
            </div>
            <ArrowDown className="w-4 h-4 text-slate-400 my-1" />

            {/* Pipeline Stage Nodes */}
            <div className="w-full space-y-2">
              {steps.map((s, index) => {
                const isSelected = currentStep === s.id;
                const isPassed = currentStep > s.id;
                const StepIcon = s.icon;

                return (
                  <React.Fragment key={s.id}>
                    <button
                      onClick={() => onSetStep(s.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? s.activeColor + ' shadow-md scale-[1.02]'
                          : isPassed
                          ? 'bg-slate-50 border-slate-300 text-slate-800'
                          : s.color + ' hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-700 shadow-2xs'
                        }`}>
                          <StepIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className={`text-xs font-bold leading-snug ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {s.name}
                          </div>
                          <div className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                            Step {s.id} of 5
                          </div>
                        </div>
                      </div>

                      {isPassed && !isSelected && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isSelected && (
                        <ChevronRight className="w-4 h-4 text-white shrink-0 animate-pulse" />
                      )}
                    </button>

                    {index < steps.length - 1 && (
                      <div className="flex justify-center my-0.5">
                        <ArrowDown className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* End Node */}
            <ArrowDown className="w-4 h-4 text-slate-400 my-1" />
            <div className={`w-36 py-1 px-3 rounded-full font-semibold text-xs text-center border shadow-2xs transition-colors ${
              currentStep === 5 ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}>
              End
            </div>
          </div>
        </div>

        {/* Step Progression Controller */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Active: <strong className="text-slate-900 font-semibold">{currentStepData.name}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSetStep(Math.max(1, currentStep - 1))}
              disabled={currentStep <= 1 || isRunning}
              className="px-2.5 py-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 border border-slate-200 rounded-md transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => onSetStep(Math.min(5, currentStep + 1))}
              disabled={currentStep >= 5 || isRunning}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-medium disabled:opacity-30 rounded-md transition-colors"
            >
              Next Step
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: 4. Algorithm Explanation (Deep dive matching Box 4) */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs font-semibold text-purple-700 tracking-wider uppercase mb-1">
                Section 04
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                4. Algorithm Explanation
              </h3>
            </div>

            {/* Sub-tabs for deep educational exploration */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setActiveCodeTab('explanation')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  activeCodeTab === 'explanation' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Concept
              </button>
              <button
                onClick={() => setActiveCodeTab('code')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  activeCodeTab === 'code' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>PyTorch Code</span>
              </button>
              <button
                onClick={() => setActiveCodeTab('tensors')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  activeCodeTab === 'tensors' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Terminal className="w-3 h-3" />
                <span>Tensors</span>
              </button>
            </div>
          </div>

          {/* Active Step Header Banner */}
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-sm">
              {currentStepData.id}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Algorithm Stage {currentStepData.id} of 5
              </div>
              <div className="text-base font-bold text-slate-900">
                {currentStepData.name}
              </div>
              <p className="mt-1 text-xs md:text-sm text-slate-700 leading-relaxed">
                {currentStepData.algorithmSummary}
              </p>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="mt-5">
            {activeCodeTab === 'explanation' && (
              <div className="space-y-4">
                <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                  Detailed Operational Checklist
                </div>
                <div className="space-y-2.5">
                  {currentStepData.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/80 border border-slate-100 text-xs md:text-sm text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-xs font-semibold mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Theoretical syllabus note */}
                <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                  <strong>Transfer Learning Principle:</strong> Instead of training billions of parameters from scratch on small datasets, transfer learning carries forward general feature extractors from pre-training and gently directs the top layers towards task-specific discriminative boundaries.
                </div>
              </div>
            )}

            {activeCodeTab === 'code' && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>HuggingFace / PyTorch Implementation</span>
                  <span className="font-mono text-[11px]">Python 3.10+</span>
                </div>
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
                  <code>{currentStepData.codeSnippet}</code>
                </pre>
              </div>
            )}

            {activeCodeTab === 'tensors' && (
              <div>
                <div className="text-xs text-slate-500 mb-2">
                  Tensor Dimensions & Memory Allocation
                </div>
                <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
                  <code>{currentStepData.tensors}</code>
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Summary Footer List */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-5 gap-2 text-center">
          {steps.map((st) => (
            <button
              key={st.id}
              onClick={() => onSetStep(st.id)}
              className={`py-1.5 px-1 rounded-md text-[11px] font-medium transition-colors truncate ${
                currentStep === st.id
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {st.short}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ArrowRight, ArrowDown, Info, Sliders, RefreshCw, Layers, Check, Zap } from 'lucide-react';
import { ModelArchitectureOption, DatasetOption } from '../types/experiment';

interface ArchitectureDiagramProps {
  selectedModel: ModelArchitectureOption;
  selectedDataset: DatasetOption;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  selectedModel,
  selectedDataset,
}) => {
  const [selectedLayer, setSelectedLayer] = useState<
    'input' | 'embedding' | 'transformer' | 'output' | 'prediction'
  >('transformer');

  const layerDetails = {
    input: {
      title: 'Input Text & Tokenization',
      before: {
        headline: 'Raw Token Sequence',
        detail: 'Text is split into subwords with special tokens [CLS] and [SEP].',
        specs: 'Tokens: ["[CLS]", "the", "battery", "life", "is", "acceptable", "but", "..."]',
      },
      after: {
        headline: 'Identical Token Sequence',
        detail: 'The exact same tokenization vocabulary is preserved during fine-tuning.',
        specs: 'Vocab Size: 30,522 tokens (cased/uncased tokenizer unchanged)',
      },
      insight: 'Transfer learning requires keeping the tokenizer identical so token IDs match embedding lookup rows.',
    },
    embedding: {
      title: 'Embedding Layer (Tokens + Position)',
      before: {
        headline: 'Pre-trained Dimensional Projection',
        detail: 'Maps discrete token IDs into continuous vectors (d=768 or 312). Combines token vectors with sinusoidal/learned position encodings.',
        specs: `Matrix Shape: [Vocab=30522, Dim=${selectedModel.hiddenSize}]`,
      },
      after: {
        headline: 'Subtly Refined / Frozen Embeddings',
        detail: 'In fine-tuning, embeddings can either be kept frozen to avoid overfitting or tuned with a tiny learning rate.',
        specs: 'Learning Rate: 0.1x to 1.0x of backbone learning rate',
      },
      insight: 'Lower layers capture universal syntactic and morphological features that rarely need massive updates.',
    },
    transformer: {
      title: 'Transformer / Encoder Blocks',
      before: {
        headline: 'General Pre-trained Weights',
        detail: `${selectedModel.layers} stacked multi-head self-attention layers trained on broad corpora (Wikipedia/BookCorpus) via Masked Language Modeling. Weights capture general grammar, syntax, and factual associations.`,
        specs: `Weights: ${selectedModel.parameters} (Frozen baseline state)`,
      },
      after: {
        headline: 'Task-Adapted Updated Weights',
        detail: `The upper self-attention heads are gently updated via backpropagation (lr=2e-5). They specialize in domain-specific sentiment cues, negation logic, and technical complaint keywords.`,
        specs: `Updated via AdamW with Cross-Entropy Loss for 3–5 epochs`,
      },
      insight: 'Higher transformer layers undergo the most pronounced weight shifts, realigning abstract features for the downstream task.',
    },
    output: {
      title: 'Output Layer (Head Replacement)',
      before: {
        headline: 'Original Task Head (Masked LM / General)',
        detail: 'Trained to predict missing masked tokens across 30,522 vocabulary words. Has NO concept of the downstream classes (e.g. Positive / Negative or Spam / Ham).',
        specs: 'Projection: d=768 -> 30,522 tokens (Not calibrated for task classification)',
      },
      after: {
        headline: 'New Task-Specific Classification Head',
        detail: `The original MLM head is removed. A new linear classification layer (W · h_[CLS] + b) maps the pooled representation directly to the ${selectedDataset.classes.length} target classes with Softmax.`,
        specs: `Projection: d=${selectedModel.hiddenSize} -> ${selectedDataset.classes.length} classes [${selectedDataset.classes.join(', ')}]`,
      },
      insight: 'This head swap is the structural signature of transfer learning: general body + specialized classification head.',
    },
    prediction: {
      title: 'Final Prediction & Confidence',
      before: {
        headline: 'Uncertain / Generic Output',
        detail: 'Without supervised adaptation, output probabilities are diffuse across classes with low peak confidence (~54%) and high entropy.',
        specs: 'Baseline Accuracy: 72.8% · Loss: 0.86',
      },
      after: {
        headline: 'Calibrated Task Prediction',
        detail: 'Sharp probability mass on the correct ground-truth class with high calibrated confidence (~94%) and minimal cross-entropy loss.',
        specs: 'Fine-Tuned Accuracy: 88.6% · Loss: 0.42 (+15.8% accuracy jump)',
      },
      insight: 'Transfer learning delivers high confidence and precise domain boundaries with very few labeled training examples.',
    },
  };

  const active = layerDetails[selectedLayer];

  return (
    <section id="architecture" className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wider uppercase mb-1">
            <span>Section 03</span>
            <span>·</span>
            <span>Model Topology</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            3. Architecture Diagram
          </h2>
          <p className="mt-1 text-xs md:text-sm text-slate-600">
            Compare the structural transformation of <strong className="text-slate-800">{selectedModel.name}</strong> from raw pre-trained foundation to task-adapted fine-tuned model.
          </p>
        </div>

        {/* Interactive Layer Selection Quick Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs overflow-x-auto">
          {(['input', 'embedding', 'transformer', 'output', 'prediction'] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setSelectedLayer(layer)}
              className={`px-3 py-1.5 font-medium rounded-md capitalize transition-all whitespace-nowrap shrink-0 ${
                selectedLayer === layer
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {layer === 'transformer' ? 'Transformer Backbone' : layer}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Dual Architecture Visualizer (Directly faithful to Box 3) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        {/* Left Side: (a) Pre-trained Model (Initial State) */}
        <div className="md:col-span-5 bg-slate-50/70 rounded-2xl border border-slate-200 p-5 md:p-6 shadow-2xs">
          <div className="text-center pb-4 border-b border-slate-200 mb-5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Initial State
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              (a) Pre-trained Model
            </h3>
            <span className="text-xs text-slate-500">
              General linguistic knowledge only
            </span>
          </div>

          <div className="flex flex-col items-center space-y-3">
            {/* 1. Input Text */}
            <button
              onClick={() => setSelectedLayer('input')}
              className={`w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold border transition-all ${
                selectedLayer === 'input'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-blue-50 text-blue-900 border-blue-200 hover:border-blue-400'
              }`}
            >
              Input Text
            </button>

            <ArrowDown className="w-3.5 h-3.5 text-slate-400" />

            {/* 2. Embedding Layer */}
            <button
              onClick={() => setSelectedLayer('embedding')}
              className={`w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold border transition-all ${
                selectedLayer === 'embedding'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-purple-50 text-purple-900 border-purple-200 hover:border-purple-400'
              }`}
            >
              Embedding Layer
            </button>

            <ArrowDown className="w-3.5 h-3.5 text-slate-400" />

            {/* 3. Transformer / LSTM (Pre-trained Weights) */}
            <button
              onClick={() => setSelectedLayer('transformer')}
              className={`w-full py-3.5 px-4 rounded-xl text-center text-xs font-bold border transition-all ${
                selectedLayer === 'transformer'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-200'
                  : 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:border-emerald-500'
              }`}
            >
              <div>Transformer / LSTM</div>
              <div className="text-[11px] font-normal opacity-90 mt-0.5">
                (Pre-trained Weights)
              </div>
            </button>

            <ArrowDown className="w-3.5 h-3.5 text-slate-400" />

            {/* 4. Output Layer (Original Task) */}
            <button
              onClick={() => setSelectedLayer('output')}
              className={`w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold border transition-all ${
                selectedLayer === 'output'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:border-amber-400'
              }`}
            >
              <div>Output Layer</div>
              <div className="text-[11px] font-normal opacity-85 mt-0.5">
                (Original Task / Generic)
              </div>
            </button>

            <ArrowDown className="w-3.5 h-3.5 text-slate-400" />

            {/* 5. Prediction */}
            <button
              onClick={() => setSelectedLayer('prediction')}
              className={`w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold border transition-all ${
                selectedLayer === 'prediction'
                  ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
              }`}
            >
              Prediction (Low Confidence)
            </button>
          </div>
        </div>

        {/* Center Transfer Learning Transition Arrow */}
        <div className="md:col-span-1 flex flex-col items-center justify-center my-4 md:my-0">
          <div className="hidden md:flex flex-col items-center">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-2 rotate-90 whitespace-nowrap">
              Fine-tuning
            </span>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
              <ArrowRight className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-400 mt-2 font-mono text-center">
              lr=2e-5
            </span>
          </div>

          <div className="md:hidden flex items-center gap-2 py-2 text-blue-600 font-semibold text-xs">
            <ArrowDown className="w-4 h-4" />
            <span>Fine-tuning Adaptation (lr=2e-5)</span>
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Right Side: (b) Fine-tuned Model (After Adaptation) */}
        <div className="md:col-span-5 bg-blue-50/40 rounded-2xl border border-blue-200 p-5 md:p-6 shadow-2xs">
          <div className="text-center pb-4 border-b border-blue-200 mb-5">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              After Adaptation
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              (b) Fine-tuned Model
            </h3>
            <span className="text-xs text-blue-700">
              Task-specific specialized weights
            </span>
          </div>

          <div className="flex flex-col items-center space-y-3">
            {/* 1. Input Text */}
            <button
              onClick={() => setSelectedLayer('input')}
              className={`w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold border transition-all ${
                selectedLayer === 'input'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-blue-100/70 text-blue-900 border-blue-300 hover:border-blue-400'
              }`}
            >
              Input Text
            </button>

            <ArrowDown className="w-3.5 h-3.5 text-blue-400" />

            {/* 2. Embedding Layer */}
            <button
              onClick={() => setSelectedLayer('embedding')}
              className={`w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold border transition-all ${
                selectedLayer === 'embedding'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-purple-100/70 text-purple-900 border-purple-300 hover:border-purple-400'
              }`}
            >
              Embedding Layer
            </button>

            <ArrowDown className="w-3.5 h-3.5 text-blue-400" />

            {/* 3. Transformer / LSTM (Updated Weights) */}
            <button
              onClick={() => setSelectedLayer('transformer')}
              className={`w-full py-3.5 px-4 rounded-xl text-center text-xs font-bold border transition-all ${
                selectedLayer === 'transformer'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                  : 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:border-emerald-600'
              }`}
            >
              <div>Transformer / LSTM</div>
              <div className="text-[11px] font-semibold text-emerald-800 mt-0.5">
                (Updated Weights via Gradient Descent)
              </div>
            </button>

            <ArrowDown className="w-3.5 h-3.5 text-blue-400" />

            {/* 4. Output Layer (Task-specific) */}
            <button
              onClick={() => setSelectedLayer('output')}
              className={`w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold border transition-all ${
                selectedLayer === 'output'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-amber-100 text-amber-950 border-amber-400 hover:border-amber-600'
              }`}
            >
              <div>Output Layer</div>
              <div className="text-[11px] font-semibold text-amber-800 mt-0.5">
                (Task-Specific Head: Linear + Softmax)
              </div>
            </button>

            <ArrowDown className="w-3.5 h-3.5 text-blue-400" />

            {/* 5. Prediction */}
            <button
              onClick={() => setSelectedLayer('prediction')}
              className={`w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold border transition-all ${
                selectedLayer === 'prediction'
                  ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                  : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              }`}
            >
              Prediction (Calibrated & Accurate)
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Layer Deep Dive Panel */}
      <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Layer Inspection: {active.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              In Pre-Trained State (a)
            </span>
            <h4 className="text-sm font-bold text-slate-900 mt-1">
              {active.before.headline}
            </h4>
            <p className="mt-2 text-xs md:text-sm text-slate-600 leading-relaxed">
              {active.before.detail}
            </p>
            <div className="mt-3 p-2.5 rounded-lg bg-slate-50 font-mono text-xs text-slate-700 border border-slate-100">
              {active.before.specs}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-blue-200 shadow-2xs">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
              In Fine-Tuned State (b)
            </span>
            <h4 className="text-sm font-bold text-slate-900 mt-1">
              {active.after.headline}
            </h4>
            <p className="mt-2 text-xs md:text-sm text-slate-600 leading-relaxed">
              {active.after.detail}
            </p>
            <div className="mt-3 p-2.5 rounded-lg bg-blue-50/60 font-mono text-xs text-blue-900 border border-blue-100">
              {active.after.specs}
            </div>
          </div>
        </div>

        {/* Transfer learning theoretical takeaway */}
        <div className="mt-4 pt-4 border-t border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
          <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span><strong>Transfer Learning Rationale:</strong> {active.insight}</span>
        </div>
      </div>
    </section>
  );
};

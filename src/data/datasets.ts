import { DatasetOption, ModelArchitectureOption, TrainingSettings } from '../types/experiment';

export const DATASETS: DatasetOption[] = [
  {
    id: 'sentiment',
    name: 'Customer Reviews & Sentiment',
    domain: 'NLP / E-Commerce',
    description: 'Nuanced customer product feedback, detecting sentiment, complaints, defects, and satisfaction.',
    classes: ['Positive', 'Negative', 'Neutral'],
    sampleCount: 5000,
    trainCount: 3500,
    valCount: 750,
    testCount: 750,
    testSamples: [
      {
        text: 'The battery life is acceptable, but the software crashes whenever I attempt to export large 4K clips.',
        trueLabel: 'Negative',
        preTrainedPrediction: 'Neutral / Ambiguous',
        preTrainedConfidence: 0.54,
        fineTunedPrediction: 'Negative (Product Defect)',
        fineTunedConfidence: 0.94,
        difficulty: 'Nuanced',
        explanation: 'The pre-trained model gets confused by "acceptable" and misses the contrastive "but" clause. Fine-tuning adjusts attention weights toward "crashes" and "export".',
      },
      {
        text: 'I was skeptical because of the low price, yet the build quality and responsiveness blew my expectations away.',
        trueLabel: 'Positive',
        preTrainedPrediction: 'Neutral / Slightly Negative',
        preTrainedConfidence: 0.51,
        fineTunedPrediction: 'Positive (Strong Endorsement)',
        fineTunedConfidence: 0.97,
        difficulty: 'Hard (Sarcasm/Edge Case)',
        explanation: 'Pre-trained weights latch onto negative lexical words "skeptical" and "low price". Fine-tuning learns the adversative "yet...blew expectations away" construction.',
      },
      {
        text: 'Package arrived on Tuesday at 3:15 PM inside standard brown cardboard packaging.',
        trueLabel: 'Neutral',
        preTrainedPrediction: 'Neutral',
        preTrainedConfidence: 0.62,
        fineTunedPrediction: 'Neutral (Informational)',
        fineTunedConfidence: 0.92,
        difficulty: 'Easy',
        explanation: 'Factual delivery statement with zero emotive sentiment.',
      },
      {
        text: 'Customer support answered in 30 seconds, but they completely refused to authorize my warranty replacement.',
        trueLabel: 'Negative',
        preTrainedPrediction: 'Positive / Mixed',
        preTrainedConfidence: 0.56,
        fineTunedPrediction: 'Negative (Escalated Complaint)',
        fineTunedConfidence: 0.93,
        difficulty: 'Nuanced',
        explanation: 'Base model counts positive "30 seconds answered" tokens; task-tuned model knows warranty refusal is the operative outcome.',
      },
      {
        text: 'Absolute game changer for our daily workflow. Never going back to our legacy tooling.',
        trueLabel: 'Positive',
        preTrainedPrediction: 'Positive',
        preTrainedConfidence: 0.68,
        fineTunedPrediction: 'Positive (High Conviction)',
        fineTunedConfidence: 0.98,
        difficulty: 'Easy',
        explanation: 'Direct positive affirmation easily classified with near 100% confidence by adapted head.',
      },
    ],
  },
  {
    id: 'spam',
    name: 'Spam & Social Phishing Intent',
    domain: 'Cybersecurity / Fraud',
    description: 'Email and SMS security filtering targeting urgency deception, deceptive links, and social engineering.',
    classes: ['Spam / Phishing', 'Legitimate / Ham'],
    sampleCount: 4200,
    trainCount: 2940,
    valCount: 630,
    testCount: 630,
    testSamples: [
      {
        text: 'Urgent notice: your payroll direct deposit failed due to tax withholding updates. Verify credentials within 12 hours.',
        trueLabel: 'Spam / Phishing',
        preTrainedPrediction: 'Legitimate / Administrative',
        preTrainedConfidence: 0.58,
        fineTunedPrediction: 'Spam / Phishing (High Threat)',
        fineTunedConfidence: 0.96,
        difficulty: 'Nuanced',
        explanation: 'Base model sees standard corporate words ("payroll", "tax withholding"). Fine-tuned model recognizes the classic urgency scam pattern.',
      },
      {
        text: 'Hey Marcus, let me know if you are free for lunch at the cafeteria around 12:30 today.',
        trueLabel: 'Legitimate / Ham',
        preTrainedPrediction: 'Legitimate / Ham',
        preTrainedConfidence: 0.71,
        fineTunedPrediction: 'Legitimate / Ham',
        fineTunedConfidence: 0.99,
        difficulty: 'Easy',
        explanation: 'Casual peer communication with no fraud indicators.',
      },
      {
        text: 'Congratulations! You have been randomly selected for a $1,000 Walmart gift card. Click the link to claim before midnight.',
        trueLabel: 'Spam / Phishing',
        preTrainedPrediction: 'Positive / Promotional',
        preTrainedConfidence: 0.63,
        fineTunedPrediction: 'Spam / Phishing (Deceptive Prize)',
        fineTunedConfidence: 0.98,
        difficulty: 'Easy',
        explanation: 'A classic spam trope that base models treat as celebratory news without domain defense training.',
      },
    ],
  },
  {
    id: 'support_intent',
    name: 'Customer Support Routing',
    domain: 'Enterprise Operations',
    description: 'Classifying incoming enterprise user tickets into Billing, Bug Report, Account Access, or Feature Request.',
    classes: ['Billing', 'Bug Report', 'Account Access', 'Feature Request'],
    sampleCount: 6000,
    trainCount: 4200,
    valCount: 900,
    testCount: 900,
    testSamples: [
      {
        text: 'My credit card was charged twice on invoice #94012, please refund the duplicate pending charge.',
        trueLabel: 'Billing',
        preTrainedPrediction: 'General Inquiry',
        preTrainedConfidence: 0.52,
        fineTunedPrediction: 'Billing (Refund Dispute)',
        fineTunedConfidence: 0.97,
        difficulty: 'Easy',
        explanation: 'Fine-tuned classification head directly connects "invoice", "refund", and "charged twice" to the Billing route.',
      },
      {
        text: 'When I click the PDF export button on Safari 17, the screen turns blank and throws an unhandled JS error.',
        trueLabel: 'Bug Report',
        preTrainedPrediction: 'Technical Information',
        preTrainedConfidence: 0.49,
        fineTunedPrediction: 'Bug Report (UI Crash)',
        fineTunedConfidence: 0.95,
        difficulty: 'Nuanced',
        explanation: 'Base model perceives a descriptive text about Safari, while the fine-tuned model identifies reproducible defect criteria.',
      },
    ],
  },
  {
    id: 'biomedical',
    name: 'Biomedical & Clinical Notes',
    domain: 'Healthcare / BioNLP',
    description: 'Triage classification of clinical observations into Acute Critical, Chronic Management, or Routine Discharged.',
    classes: ['Acute Critical', 'Chronic Management', 'Routine Discharged'],
    sampleCount: 3800,
    trainCount: 2660,
    valCount: 570,
    testCount: 570,
    testSamples: [
      {
        text: 'Patient exhibits sudden onset dyspnea, diaphoresis, and ST-segment elevation on anterior leads.',
        trueLabel: 'Acute Critical',
        preTrainedPrediction: 'Medical Descriptive',
        preTrainedConfidence: 0.50,
        fineTunedPrediction: 'Acute Critical (Cardiac Emergency)',
        fineTunedConfidence: 0.98,
        difficulty: 'Hard (Sarcasm/Edge Case)',
        explanation: 'Base small model has low prior exposure to dense cardiology acronyms. Fine-tuning binds STEMI markers to high triage severity.',
      },
      {
        text: 'Annual wellness checkup completed. Vital signs stable, routine blood panels ordered, follow-up in 12 months.',
        trueLabel: 'Routine Discharged',
        preTrainedPrediction: 'Routine Checkup',
        preTrainedConfidence: 0.65,
        fineTunedPrediction: 'Routine Discharged',
        fineTunedConfidence: 0.96,
        difficulty: 'Easy',
        explanation: 'Clear routine discharge criteria recognized with high confidence.',
      },
    ],
  },
];

export const MODELS: ModelArchitectureOption[] = [
  {
    id: 'distilbert',
    name: 'DistilBERT',
    parameters: '66 Million',
    paramCountNum: 66,
    layers: 6,
    hiddenSize: 768,
    heads: 12,
    trainingTimeSec: 42,
    baseAccuracy: 72.8,
    fineTunedAccuracy: 88.6,
    description: 'Lightweight Transformer distilled from BERT-base. Retains 97% of language understanding while being 40% smaller and 60% faster.',
  },
  {
    id: 'tinybert',
    name: 'TinyBERT',
    parameters: '14.5 Million',
    paramCountNum: 14.5,
    layers: 4,
    hiddenSize: 312,
    heads: 12,
    trainingTimeSec: 18,
    baseAccuracy: 68.4,
    fineTunedAccuracy: 85.1,
    description: 'Ultra-compact model distilled using layer-to-layer attention and embedding loss. Extremely fast inference for edge devices.',
  },
  {
    id: 'mobilebert',
    name: 'MobileBERT',
    parameters: '25.3 Million',
    paramCountNum: 25.3,
    layers: 24,
    hiddenSize: 512,
    heads: 4,
    trainingTimeSec: 28,
    baseAccuracy: 70.9,
    fineTunedAccuracy: 87.2,
    description: 'Thin-and-deep compressed Transformer architecture optimized for mobile CPUs with bottleneck structures.',
  },
  {
    id: 'roberta-small',
    name: 'RoBERTa-Small',
    parameters: '45 Million',
    paramCountNum: 45,
    layers: 6,
    hiddenSize: 512,
    heads: 8,
    trainingTimeSec: 36,
    baseAccuracy: 74.1,
    fineTunedAccuracy: 89.8,
    description: 'Pre-trained using dynamic masking and larger mini-batches on diverse corpora without next-sentence prediction.',
  },
];

export const DEFAULT_TRAINING_SETTINGS: TrainingSettings = {
  learningRate: '2e-5',
  epochs: 3,
  batchSize: 16,
  optimizer: 'AdamW',
  warmupRatio: 0.1,
  weightDecay: 0.01,
};

// Generates simulated epoch-by-epoch loss & accuracy progress during fine-tuning
export function generateTrainingHistory(epochs: number, baseAcc: number, targetAcc: number) {
  const history = [];
  const baseLoss = 0.86;
  const targetLoss = 0.42;

  for (let i = 1; i <= epochs; i++) {
    const progress = i / epochs;
    const smoothProgress = 1 - Math.pow(1 - progress, 1.8);
    
    // Train Loss drops quickly then levels out
    const trainLoss = +(baseLoss - (baseLoss - (targetLoss - 0.08)) * smoothProgress + (Math.random() * 0.02 - 0.01)).toFixed(3);
    const valLoss = +(baseLoss - (baseLoss - targetLoss) * smoothProgress + (Math.random() * 0.02 - 0.01)).toFixed(3);
    
    // Accuracy rises steadily
    const trainAcc = +(baseAcc + (targetAcc + 2.5 - baseAcc) * smoothProgress + (Math.random() * 0.4 - 0.2)).toFixed(1);
    const valAcc = +(baseAcc + (targetAcc - baseAcc) * smoothProgress + (Math.random() * 0.4 - 0.2)).toFixed(1);

    history.push({
      epoch: i,
      trainLoss: Math.max(0.2, trainLoss),
      valLoss: Math.max(0.3, valLoss),
      trainAcc: Math.min(99.0, trainAcc),
      valAcc: Math.min(targetAcc, valAcc),
    });
  }

  return history;
}

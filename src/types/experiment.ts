export interface DatasetOption {
  id: string;
  name: string;
  domain: string;
  description: string;
  classes: string[];
  sampleCount: number;
  trainCount: number;
  valCount: number;
  testCount: number;
  testSamples: {
    text: string;
    trueLabel: string;
    preTrainedPrediction: string;
    preTrainedConfidence: number;
    fineTunedPrediction: string;
    fineTunedConfidence: number;
    difficulty: 'Easy' | 'Nuanced' | 'Hard (Sarcasm/Edge Case)';
    explanation: string;
  }[];
}

export interface ModelArchitectureOption {
  id: string;
  name: string;
  parameters: string;
  paramCountNum: number;
  layers: number;
  hiddenSize: number;
  heads: number;
  trainingTimeSec: number;
  baseAccuracy: number;
  fineTunedAccuracy: number;
  description: string;
}

export interface TrainingSettings {
  learningRate: string;
  epochs: number;
  batchSize: number;
  optimizer: string;
  warmupRatio: number;
  weightDecay: number;
}

export interface ExperimentMetrics {
  accuracy: { base: number; tuned: number };
  precision: { base: number; tuned: number };
  recall: { base: number; tuned: number };
  f1Score: { base: number; tuned: number };
  loss: { base: number; tuned: number };
}

export interface EpochRecord {
  epoch: number;
  trainLoss: number;
  valLoss: number;
  trainAcc: number;
  valAcc: number;
}

export interface PredictionResult {
  label: string;
  confidence: number;
  confidenceBreakdown: { label: string; probability: number }[];
  explanation: string;
  keyTokens: string[];
  loss: number;
}

export interface ComparisonResponse {
  task: string;
  input: string;
  preTrained: PredictionResult;
  fineTuned: PredictionResult;
  transferLearningInsight: string;
}

import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API endpoint for side-by-side model prediction simulation & generative breakdown
app.post('/api/compare-predictions', async (req, res) => {
  try {
    const {
      inputText,
      taskType = 'sentiment',
      modelArchitecture = 'DistilBERT',
      learningRate = '2e-5',
      epochs = 3,
    } = req.body;

    if (!inputText || typeof inputText !== 'string') {
      res.status(400).json({ error: 'inputText is required' });
      return;
    }

    if (!ai) {
      // Fallback response if API key is not configured
      res.json(getSimulatedComparison(inputText, taskType, modelArchitecture));
      return;
    }

    const prompt = `You are an educational machine learning demonstrator for a Generative AI and Transfer Learning course.
Analyze how a small pre-trained base model (e.g. ${modelArchitecture} before task fine-tuning) vs the same small model AFTER fine-tuning (${epochs} epochs at lr=${learningRate} on a task-specific ${taskType} dataset) processes the following input text.

Input Text: "${inputText}"
Task: ${taskType}

Return a valid JSON object matching this schema:
{
  "task": "${taskType}",
  "input": "${inputText}",
  "preTrained": {
    "label": "string (predicted class by pre-trained base model, e.g. Neutral, Positive, or Misclassified)",
    "confidence": number (between 0.40 and 0.72),
    "confidenceBreakdown": [
      {"label": "string", "probability": number}
    ],
    "explanation": "string (detailed 2-sentence explanation of why the generic pre-trained model struggles with domain nuance, sarcasm, or task-specific vocabulary)",
    "keyTokens": ["array of tokens with generic or weak attention weights"],
    "loss": number (e.g. 0.82 to 0.95)
  },
  "fineTuned": {
    "label": "string (accurate target task class after fine-tuning)",
    "confidence": number (between 0.88 and 0.98),
    "confidenceBreakdown": [
      {"label": "string", "probability": number}
    ],
    "explanation": "string (detailed 2-sentence explanation of how transfer learning and adjusted weights captured domain-specific intent and calibrated output probabilities)",
    "keyTokens": ["array of tokens that activated the task-specific classification head"],
    "loss": number (e.g. 0.28 to 0.45)
  },
  "transferLearningInsight": "string (educational takeaway explaining what happened to the transformer weights during adaptation)"
}

Output ONLY raw JSON with no markdown backticks or formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    try {
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch {
      res.json(getSimulatedComparison(inputText, taskType, modelArchitecture));
    }
  } catch (error) {
    console.error('Error generating comparison:', error);
    // Graceful fallback to offline deterministic evaluation
    res.json(getSimulatedComparison(req.body.inputText || '', req.body.taskType || 'sentiment', req.body.modelArchitecture || 'DistilBERT'));
  }
});

function getSimulatedComparison(text: string, task: string, model: string) {
  const lower = text.toLowerCase();
  
  if (task === 'sentiment') {
    const isNegative = lower.includes('crash') || lower.includes('poor') || lower.includes('bad') || lower.includes('slow') || lower.includes('worst') || lower.includes('defect') || lower.includes('fail');
    const isPositive = lower.includes('great') || lower.includes('love') || lower.includes('excellent') || lower.includes('fast') || lower.includes('best') || lower.includes('amazing');

    if (isNegative) {
      return {
        task,
        input: text,
        preTrained: {
          label: 'Neutral / Ambiguous',
          confidence: 0.58,
          confidenceBreakdown: [
            { label: 'Negative', probability: 0.46 },
            { label: 'Neutral', probability: 0.38 },
            { label: 'Positive', probability: 0.16 }
          ],
          explanation: `The raw ${model} model only holds masked-language general syntax. Without fine-tuning on user reviews, it fails to weight technical dissatisfaction and misinterprets passive phrasing as neutral.`,
          keyTokens: ['acceptable', 'software', 'clips'],
          loss: 0.88
        },
        fineTuned: {
          label: 'Negative (Product Defect)',
          confidence: 0.94,
          confidenceBreakdown: [
            { label: 'Negative', probability: 0.94 },
            { label: 'Neutral', probability: 0.04 },
            { label: 'Positive', probability: 0.02 }
          ],
          explanation: `After domain adaptation on sentiment reviews, the classification head strongly attends to failure verbs ('crashes', 'defect') and correctly weights the contrastive conjunction.`,
          keyTokens: ['crashes', 'export', 'large 4K'],
          loss: 0.38
        },
        transferLearningInsight: 'Fine-tuning adapted the upper self-attention heads to prioritize sentiment-bearing clauses while preserving lower-layer syntactical encodings.'
      };
    } else if (isPositive) {
      return {
        task,
        input: text,
        preTrained: {
          label: 'Positive',
          confidence: 0.64,
          confidenceBreakdown: [
            { label: 'Positive', probability: 0.64 },
            { label: 'Neutral', probability: 0.26 },
            { label: 'Negative', probability: 0.10 }
          ],
          explanation: `Base ${model} identifies positive lexical tokens but lacks calibrated probabilities for domain sentiment intensity.`,
          keyTokens: ['good', 'nice'],
          loss: 0.79
        },
        fineTuned: {
          label: 'Highly Positive (Endorsement)',
          confidence: 0.96,
          confidenceBreakdown: [
            { label: 'Positive', probability: 0.96 },
            { label: 'Neutral', probability: 0.03 },
            { label: 'Negative', probability: 0.01 }
          ],
          explanation: `Transfer learning adjusted the final feed-forward layers to output high probability confidence for validated domain praise.`,
          keyTokens: ['excellent', 'seamless', 'delighted'],
          loss: 0.31
        },
        transferLearningInsight: 'Domain tuning sharpened the decision boundary, reducing entropy in the softmax distribution.'
      };
    } else {
      return {
        task,
        input: text,
        preTrained: {
          label: 'Uncertain / Generic',
          confidence: 0.52,
          confidenceBreakdown: [
            { label: 'Neutral', probability: 0.52 },
            { label: 'Positive', probability: 0.28 },
            { label: 'Negative', probability: 0.20 }
          ],
          explanation: `Generic weights produce diffuse probability distributions across classes without task guidance.`,
          keyTokens: text.split(' ').slice(0, 3),
          loss: 0.86
        },
        fineTuned: {
          label: 'Neutral / Informational',
          confidence: 0.89,
          confidenceBreakdown: [
            { label: 'Neutral', probability: 0.89 },
            { label: 'Positive', probability: 0.06 },
            { label: 'Negative', probability: 0.05 }
          ],
          explanation: `The fine-tuned classification layer accurately categorizes neutral factual feedback without hallucinating false positive sentiment.`,
          keyTokens: text.split(' ').slice(0, 3),
          loss: 0.42
        },
        transferLearningInsight: 'Transfer learning calibrates uncertainty and anchors the model to task taxonomy.'
      };
    }
  }

  // Default fallback for other tasks (spam, medical triage, etc.)
  return {
    task,
    input: text,
    preTrained: {
      label: 'Default Baseline',
      confidence: 0.55,
      confidenceBreakdown: [
        { label: 'Class A', probability: 0.55 },
        { label: 'Class B', probability: 0.45 }
      ],
      explanation: `Pre-trained ${model} relies solely on language likelihood without task-specific target supervision.`,
      keyTokens: text.split(' ').slice(0, 3),
      loss: 0.86
    },
    fineTuned: {
      label: 'Target Adapted Class',
      confidence: 0.92,
      confidenceBreakdown: [
        { label: 'Class A', probability: 0.92 },
        { label: 'Class B', probability: 0.08 }
      ],
      explanation: `Fine-tuning successfully realigned embeddings and optimized classification loss for this specialized objective.`,
      keyTokens: text.split(' ').slice(0, 3),
      loss: 0.39
    },
    transferLearningInsight: 'Weight updates during fine-tuning specialized the attention patterns for domain discrimination.'
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pre-training vs Fine-tuning Lab server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

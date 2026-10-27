/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProblemStatement } from './components/ProblemStatement';
import { FlowchartPipeline } from './components/FlowchartPipeline';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { CurrentInputControls } from './components/CurrentInputControls';
import { ExpectedOutputMetrics } from './components/ExpectedOutputMetrics';
import { PredictionSandbox } from './components/PredictionSandbox';
import { AdvantagesSection } from './components/AdvantagesSection';
import { OriginalDiagramModal } from './components/OriginalDiagramModal';
import { CodeExportModal } from './components/CodeExportModal';

import { DATASETS, MODELS, DEFAULT_TRAINING_SETTINGS } from './data/datasets';
import { DatasetOption, ModelArchitectureOption, TrainingSettings } from './types/experiment';

export default function App() {
  const [selectedDataset, setSelectedDataset] = useState<DatasetOption>(DATASETS[0]);
  const [selectedModel, setSelectedModel] = useState<ModelArchitectureOption>(MODELS[0]);
  const [trainingSettings, setTrainingSettings] = useState<TrainingSettings>(DEFAULT_TRAINING_SETTINGS);
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState<boolean>(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);

  const handleUpdateSettings = (newSettings: Partial<TrainingSettings>) => {
    setTrainingSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleRunFullPipeline = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStep(1);

    // Step 1: Load Model
    setTimeout(() => {
      setCurrentStep(2); // Step 2: Evaluate on Task (Before Fine-tuning)
      
      setTimeout(() => {
        setCurrentStep(3); // Step 3: Fine-tune on Task-specific Dataset
        
        setTimeout(() => {
          setCurrentStep(4); // Step 4: Evaluate on Task (After Fine-tuning)
          
          setTimeout(() => {
            setCurrentStep(5); // Step 5: Compare Results & Analyze
            setIsRunning(false);

            // Smoothly scroll down to metrics if needed
            const metricsEl = document.getElementById('metrics');
            if (metricsEl) {
              metricsEl.scrollIntoView({ behavior: 'smooth' });
            }
          }, 1200);
        }, 1500);
      }, 1000);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 3-Zone Navigation Header */}
      <Header
        onRunExperiment={handleRunFullPipeline}
        onOpenDiagram={() => setIsDiagramModalOpen(true)}
        isRunning={isRunning}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Hero Section with Syllabus Syllabus Context */}
        <HeroSection
          onRunExperiment={handleRunFullPipeline}
          onOpenDiagram={() => setIsDiagramModalOpen(true)}
          onOpenCode={() => setIsCodeModalOpen(true)}
          selectedModel={selectedModel}
          selectedDataset={selectedDataset}
          isRunning={isRunning}
        />

        {/* Section 1: Problem Statement */}
        <ProblemStatement />

        {/* Section 2 & 4: Flowchart & Algorithm Explanation */}
        <FlowchartPipeline
          currentStep={currentStep}
          onSetStep={setCurrentStep}
          onRunFullPipeline={handleRunFullPipeline}
          isRunning={isRunning}
          selectedModel={selectedModel}
          selectedDataset={selectedDataset}
          trainingSettings={trainingSettings}
        />

        {/* Section 3: Architecture Diagram (Side-by-side (a) vs (b)) */}
        <ArchitectureDiagram
          selectedModel={selectedModel}
          selectedDataset={selectedDataset}
        />

        {/* Section 5: Current Input (Dataset, Model, Hyperparameters) */}
        <CurrentInputControls
          selectedDataset={selectedDataset}
          onSelectDataset={setSelectedDataset}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          trainingSettings={trainingSettings}
          onUpdateSettings={handleUpdateSettings}
        />

        {/* Section 6: Expected Output (Performance Metrics Table & Visual Charts) */}
        <ExpectedOutputMetrics
          selectedModel={selectedModel}
          selectedDataset={selectedDataset}
          trainingSettings={trainingSettings}
        />

        {/* Section 6 (Inference): Side-by-Side Live Prediction Sandbox */}
        <PredictionSandbox
          selectedDataset={selectedDataset}
          selectedModel={selectedModel}
          trainingSettings={trainingSettings}
        />

        {/* Section 7: Advantages and Benefits & Conclusion Banner */}
        <AdvantagesSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-800">Pre-training vs Fine-tuning Experiment Lab</span>
            <span className="mx-2">·</span>
            <span>Generative AI Course Project</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDiagramModalOpen(true)}
              className="hover:text-blue-600 transition-colors"
            >
              View Reference Infographic
            </button>
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="hover:text-blue-600 transition-colors"
            >
              PyTorch Script
            </button>
            <a href="#overview" className="hover:text-slate-900 transition-colors">
              Back to top
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <OriginalDiagramModal
        isOpen={isDiagramModalOpen}
        onClose={() => setIsDiagramModalOpen(false)}
      />

      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        selectedModel={selectedModel}
        selectedDataset={selectedDataset}
        trainingSettings={trainingSettings}
      />
    </div>
  );
}

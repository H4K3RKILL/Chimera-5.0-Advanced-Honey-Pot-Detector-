
import React, { useState, useCallback } from 'react';
import { AppState, AnalysisResult, ScanProfile } from './types';
import { runChimeraScan, runClassicScan } from './services/mockAnalysisService';
import WelcomeScreen from './components/WelcomeScreen';
import LoadingScreen from './components/LoadingScreen';
import ResultScreen from './components/ResultScreen';

function App(): React.ReactNode {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [scanHistory, setScanHistory] = useState<AnalysisResult[]>([]);
  const [activeResult, setActiveResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzingTarget, setAnalyzingTarget] = useState<{target: string, profile: ScanProfile} | null>(null);

  const handleAnalyze = useCallback(async (target: string, profile: ScanProfile) => {
    if (!target) return;
    setAppState(AppState.ANALYZING);
    setAnalyzingTarget({ target, profile });
    setError(null);
    try {
      let analysisResult: AnalysisResult;
      if (profile === 'level_0_classic') {
        analysisResult = await runClassicScan(target);
      } else {
        analysisResult = await runChimeraScan(target, profile);
      }
      
      setScanHistory(prev => [analysisResult, ...prev.slice(0, 4)]);
      setActiveResult(analysisResult);
      setAppState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
      setAppState(AppState.IDLE);
    }
  }, []);

  const handleReturnToDashboard = () => {
    setActiveResult(null);
    setError(null);
    setAnalyzingTarget(null);
    setAppState(AppState.IDLE);
  };
  
  const viewHistoricalResult = (result: AnalysisResult) => {
    setActiveResult(result);
    setAppState(AppState.RESULT);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.ANALYZING:
        return analyzingTarget && <LoadingScreen target={analyzingTarget.target} profile={analyzingTarget.profile} />;
      case AppState.RESULT:
        return activeResult && <ResultScreen result={activeResult} onReturnToDashboard={handleReturnToDashboard} />;
      case AppState.IDLE:
      default:
        return (
          <WelcomeScreen 
            onStart={handleAnalyze} 
            error={error} 
            isLoading={false}
            scanHistory={scanHistory}
            onViewHistory={viewHistoricalResult}
          />
        );
    }
  };

  return (
    <div className="min-h-screen w-full flex items-start justify-center py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 overflow-y-auto">
      <main className="w-full max-w-6xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
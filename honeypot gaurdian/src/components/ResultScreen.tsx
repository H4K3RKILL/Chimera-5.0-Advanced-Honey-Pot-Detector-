
import React from 'react';
import { AnalysisResult, Indicator, ProbeType, TranscriptStep } from '../types';

interface ResultScreenProps {
  result: AnalysisResult;
  onReturnToDashboard: () => void;
}

const getVerdictColor = (verdict: AnalysisResult['verdict']) => {
  if (verdict === 'Honeypot Detected') return '#ef4444'; // red-500
  if (verdict === 'Suspicious') return '#f59e0b'; // amber-500
  return '#22c55e'; // green-500
};

const getSeverityClasses = (severity: Indicator['severity']) => {
    switch (severity) {
        case 'Critical': return 'border-l-red-500 bg-red-900/20';
        case 'High': return 'border-l-orange-500 bg-orange-900/20';
        case 'Medium': return 'border-l-yellow-500 bg-yellow-900/20';
        case 'Low': return 'border-l-sky-500 bg-sky-900/20';
        default: return 'border-l-gray-500 bg-gray-800/20';
    }
};

const ThreatScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const needleRotation = -90 + (score / 100) * 180;

  return (
    <div className="relative w-full h-full">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        {/* Background Arc */}
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        {/* Foreground Arc */}
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          stroke="url(#gaugeGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
        {/* Needle */}
        <line
          x1="60"
          y1="60"
          x2="60"
          y2="20"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          transform-origin="center"
          style={{ transform: `rotate(${needleRotation}deg)`, transition: 'transform 1.5s ease-out' }}
        />
        <circle cx="60" cy="60" r="4" fill="white" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 sm:pb-4">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-gray-400 uppercase tracking-widest">Threat Score</span>
      </div>
    </div>
  );
};


const AgentTranscript: React.FC<{transcript: TranscriptStep[]}> = ({ transcript }) => (
    <div className="space-y-4">
        <div className="space-y-4 bg-gray-900/50 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-700/50">
            {transcript.map((step, index) => {
                if(step.source === 'agent') {
                    return (
                        <div key={index} className="flex justify-end">
                            <div className="bg-cyan-900/50 p-3 rounded-lg max-w-lg text-right">
                                <p className="text-sm text-gray-200">{step.content}</p>
                            </div>
                        </div>
                    );
                }
                if(step.source === 'verdict') {
                    return (
                        <div key={index} className="text-center font-bold text-yellow-400 p-2 border-y-2 border-yellow-500/30 my-4 text-glow">
                            <p>{step.content}</p>
                        </div>
                    )
                }
                return (
                    <div key={index} className="flex justify-start">
                        <div className="bg-gray-800/70 p-3 rounded-lg max-w-lg">
                             <pre className="text-xs text-gray-300 whitespace-pre-wrap">{step.content}</pre>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onReturnToDashboard }) => {
  const verdictColor = getVerdictColor(result.verdict);

  return (
    <div className="w-full text-left animate-fade-in-up">
      <header className="text-center space-y-1 mb-10">
        <h1 className="text-4xl font-bold text-white">Forensic Report</h1>
        <p className="text-gray-400 break-all">{result.target}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-pane text-center">
            <p className="text-sm uppercase tracking-wider font-bold text-gray-400">{result.confidence === 'Absolute' ? 'Deterministic Verdict' : 'Verdict'}</p>
            <p className="text-3xl font-bold" style={{color: verdictColor, textShadow: `0 0 10px ${verdictColor}`}}>{result.verdict}</p>
          </div>
          {result.scanProfile !== 'level_5_agentic' && (
            <div className="glass-pane flex justify-center items-center">
              <div className="w-40 h-40 md:w-48 md:h-48">
                <ThreatScoreGauge score={result.score} />
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-pane">
            <h3 className="text-xl font-semibold text-white mb-3">Cognitive Analysis Summary</h3>
            <p className="text-gray-300">{result.cognitiveSummary}</p>
          </div>

          <div className="glass-pane">
             <h3 className="text-xl text-white font-semibold mb-4">{result.transcript ? 'Agent Investigation Transcript' : 'Evidence & Indicators'}</h3>
             {result.transcript ? (
                <AgentTranscript transcript={result.transcript} />
             ) : (
                <div className="space-y-3">
                    {result.indicators.length > 0 ? result.indicators.map((indicator, index) => (
                        <div key={index} className={`flex items-start p-3 border-l-4 rounded-r-md ${getSeverityClasses(indicator.severity)}`}>
                            <div className="flex-grow">
                                <p className="text-gray-200">{indicator.finding}</p>
                                <div className="text-xs text-gray-500 mt-1 flex items-center gap-x-4">
                                    <span className="font-semibold">{indicator.probe} Probe</span>
                                    <span>Severity: {indicator.severity}</span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-4">
                            <p className="text-gray-400">No significant indicators found.</p>
                        </div>
                    )}
                </div>
             )}
          </div>
        </div>
      </div>

      <div className="text-center mt-12 md:mt-16 mb-8">
        <button
          onClick={onReturnToDashboard}
          className="relative overflow-hidden w-full sm:w-auto bg-gray-800 hover:bg-gray-700/80 text-gray-300 font-bold py-3 px-10 rounded-lg text-lg transition-all transform hover:scale-105 shimmer-button"
        >
          SCAN ANOTHER TARGET
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
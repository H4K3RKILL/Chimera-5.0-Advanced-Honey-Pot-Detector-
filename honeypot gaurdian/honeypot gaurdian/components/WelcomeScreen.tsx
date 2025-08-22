
import React, { useState } from 'react';
import { AnalysisResult, ScanProfile } from '../types';

interface DashboardScreenProps {
  onStart: (target: string, profile: ScanProfile) => void;
  error: string | null;
  isLoading: boolean;
  scanHistory: AnalysisResult[];
  onViewHistory: (result: AnalysisResult) => void;
}

const scanProfiles: { id: ScanProfile, name: string, description: string }[] = [
    { id: 'level_0_classic', name: 'Level 0: Classic Scan', description: 'Traditional engine. Good for basic checks.' },
    { id: 'level_1_heuristic', name: 'Level 1: Heuristic', description: 'Fastest. Basic checks for known signatures.' },
    { id: 'level_3_cognitive', name: 'Level 3: Cognitive', description: 'Statistical & behavioral analysis.' },
    { id: 'level_4_verification', name: 'Level 4: Verification', description: 'Deterministic proof via canary probe.' },
    { id: 'level_5_agentic', name: 'Level 5: Agentic', description: 'Deep investigation with an AI agent.' },
];

const getVerdictChipClasses = (verdict: AnalysisResult['verdict']) => {
  switch (verdict) {
    case 'Honeypot Detected': return 'text-red-400';
    case 'Suspicious': return 'text-yellow-400';
    default: return 'text-green-400';
  }
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onStart, error, isLoading, scanHistory, onViewHistory }) => {
  const [target, setTarget] = useState('nemesis-honeypot.');
  const [profile, setProfile] = useState<ScanProfile>('level_3_cognitive');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(target, profile);
  };

  const handleExampleClick = (exampleTarget: string, exampleProfile?: ScanProfile) => {
    setTarget(exampleTarget);
    if (exampleProfile) {
      setProfile(exampleProfile);
    }
  };

  return (
    <div className="animate-fade-in-up w-full">
       <header className="text-center space-y-2 mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-glow" style={{'--glow-color': 'rgba(255,255,255,0.5)'} as React.CSSProperties}>Chimera 5.0</h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-400">
          Cognitive Deception Analysis Engine
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="glass-pane space-y-8">
            <div>
              <label htmlFor="target-input" className="block text-sm font-medium text-[#00c6ff] mb-2">Target URL or IP Address</label>
              <input
                id="target-input"
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-gray-800/60 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c6ff] transition-all"
                placeholder="https://example.com or 192.168.1.1"
                aria-label="Target URL or IP Address"
                disabled={isLoading}
                required
              />
            </div>
            
            <div>
              <span className="block text-sm font-medium text-[#00c6ff] mb-4">Scan Profile</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {scanProfiles.map(p => (
                  <button 
                    type="button"
                    key={p.id} 
                    onClick={() => setProfile(p.id)}
                    data-selected={profile === p.id}
                    className="scan-profile-card text-left"
                    disabled={isLoading}
                  >
                    <span className="font-medium text-white">{p.name}</span>
                    <p className="text-sm text-gray-400 mt-1">{p.description}</p>
                  </button>
                ))}
              </div>
            </div>
            
            {error && (
              <div className="border border-red-500/50 bg-red-500/10 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
                <strong className="font-bold">ERROR: </strong>
                <span>{error}</span>
              </div>
            )}
              
            <button
              type="submit"
              disabled={isLoading || !target}
              className="relative w-full overflow-hidden flex items-center justify-center bg-[#00c6ff] text-gray-900 font-bold py-4 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#00c6ff] disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none shimmer-button"
            >
              {isLoading ? 'ANALYZING...' : 'INITIATE SCAN'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-8">
            <div className="glass-pane">
                 <h2 className="text-xl font-semibold text-white mb-4 text-glow" style={{'--glow-color': '#00c6ff'} as React.CSSProperties}>Examples</h2>
                 <ul className="space-y-3 font-mono text-sm">
                  <li><button type="button" className="text-left text-gray-400 hover:text-white transition-colors" onClick={() => handleExampleClick('google.com', 'level_0_classic')}>• google.com (Legitimate)</button></li>
                  <li><button type="button" className="text-left text-gray-400 hover:text-white transition-colors" onClick={() => handleExampleClick('cowrie-canary', 'level_4_verification')}>• cowrie-canary (Test L4)</button></li>
                  <li><button type="button" className="text-left text-gray-400 hover:text-white transition-colors" onClick={() => handleExampleClick('nemesis-agentic', 'level_5_agentic')}>• nemesis-agentic (Test L5)</button></li>
              </ul>
            </div>
            <div className="glass-pane">
              <h2 className="text-xl font-semibold text-white mb-4 text-glow" style={{'--glow-color': '#00c6ff'} as React.CSSProperties}>Scan History</h2>
              {scanHistory.length > 0 ? (
                  <div className="space-y-3">
                      {scanHistory.map((scan, index) => (
                          <button key={index} type="button" className="w-full text-left bg-gray-900/50 p-3 rounded-lg border border-gray-800 flex justify-between items-center hover:bg-gray-800/70 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#00c6ff]" onClick={() => onViewHistory(scan)}>
                            <div className="flex-1 min-w-0">
                                  <p className="text-white truncate font-mono">{scan.target}</p>
                                  <p className="text-xs text-gray-400">{scan.scanProfile.replace(/_/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())}</p>
                            </div>
                              <div className="flex-shrink-0 ml-2">
                                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${getVerdictChipClasses(scan.verdict)}`}>{scan.verdict}</span>
                              </div>
                          </button>
                      ))}
                  </div>
              ) : (
                  <div className="text-center text-gray-500 font-mono py-4">
                      <p>NO RECENT SCANS</p>
                  </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
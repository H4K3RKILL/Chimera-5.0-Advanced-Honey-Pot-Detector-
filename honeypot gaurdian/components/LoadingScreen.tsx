
import React, { useState, useEffect } from 'react';
import { ScanProfile } from '../types';

const profileMessages: Record<ScanProfile, string[]> = {
  level_0_classic: [
    "Running classic nmap port scan...",
    "Grabbing service banners...",
    "Performing traditional timing analysis...",
  ],
  level_1_heuristic: [
    "Running heuristic checks...",
    "Scanning for known signatures...",
    "Performing baseline reconnaissance...",
  ],
  level_3_cognitive: [
    "Deploying multi-modal probes...",
    "Establishing behavioral baseline...",
    "Running cognitive model inference...",
  ],
  level_4_verification: [
    "Deep interaction probes active...",
    "Deploying canary verification token...",
    "Awaiting out-of-band verification...",
  ],
  level_5_agentic: [
    "Initializing agentic core...",
    "Agent is formulating investigation plan...",
    "Executing agent-directed probe...",
  ],
};

const futuristicSpinner = (
    <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full"></div>
        <div className="absolute inset-2 border-2 border-cyan-500/30 rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
        <div className="absolute inset-4 border-t-2 border-cyan-500 rounded-full animate-spin" style={{animationDuration: '1.5s'}}></div>
    </div>
);

interface LoadingScreenProps {
  target: string;
  profile: ScanProfile;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ target, profile }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = profileMessages[profile] || profileMessages.level_3_cognitive;

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center text-center animate-fade-in-up h-96">
      {futuristicSpinner}
      <h2 className="text-3xl font-bold text-white mt-8 mb-2">ANALYZING TARGET...</h2>
      <p className="text-gray-300 bg-gray-900/80 px-3 py-1 rounded-md mb-4 font-mono">{target}</p>
      <p className="text-lg text-gray-400 transition-opacity duration-500 h-8">
        {messages[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingScreen;

export enum AppState {
  IDLE = 'idle',
  ANALYZING = 'analyzing',
  RESULT = 'result',
}

export type ScanProfile =
  | 'level_0_classic'
  | 'level_1_heuristic'
  | 'level_3_cognitive'
  | 'level_4_verification'
  | 'level_5_agentic';

export interface TranscriptStep {
  source: 'agent' | 'system' | 'verdict';
  content: string;
}

export type ProbeType = 
  | 'Port' 
  | 'Banner' 
  | 'TLS' 
  | 'HTTP' 
  | 'Behavioral' 
  | 'Contextual'
  | 'Interaction'
  | 'Cognitive'
  | 'Canary'
  | 'Agent'
  | 'Classic Scan'; // Added for the new engine

export interface Indicator {
  probe: ProbeType;
  finding: string;
  severity: 'Info' | 'Low' | 'Medium' | 'High' | 'Critical';
  score_impact: number;
}

export interface AnalysisResult {
  target: string;
  scanProfile: ScanProfile;
  verdict: 'Honeypot Detected' | 'Suspicious' | 'Likely Legitimate';
  confidence: 'Absolute' | 'Critical' | 'High' | 'Medium' | 'Low' | 'Very Low';
  score: number;
  cognitiveSummary: string;
  indicators: Indicator[];
  transcript?: TranscriptStep[];
}
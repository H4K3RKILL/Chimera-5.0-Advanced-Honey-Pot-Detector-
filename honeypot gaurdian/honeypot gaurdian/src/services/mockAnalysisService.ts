
import { AnalysisResult, Indicator, ScanProfile, TranscriptStep } from '../types';

// --- Start of Classic Scan Engine ---

export function runClassicScan(target: string): Promise<AnalysisResult> {
    console.log(`[Classic Engine] Running Scan on: ${target}`);
    const indicators: Indicator[] = [];
    let riskScore = 0;

    const lowerCaseTarget = target.toLowerCase();

    // Simulate Port Scan Analysis
    if (lowerCaseTarget.includes('many-ports')) {
        indicators.push({ probe: 'Classic Scan', finding: 'Suspicious number of open ports: 25', severity: 'High', score_impact: 5 });
        riskScore += 5;
    }
    
    // Simulate Banner Analysis
    if (lowerCaseTarget.includes('generic-banner')) {
        indicators.push({ probe: 'Classic Scan', finding: 'Suspicious banner on port 22: "Welcome to SSH"', severity: 'Medium', score_impact: 3 });
        riskScore += 3;
    }

    // Simulate HTTP Fingerprinting
    if (lowerCaseTarget.includes('t-pot') || lowerCaseTarget.includes('cowrie')) {
         indicators.push({ probe: 'Classic Scan', finding: 'Honeypot server header: "Cowrie"', severity: 'Critical', score_impact: 10 });
         riskScore += 10;
    }

    // Simulate Timing Analysis
    if (lowerCaseTarget.includes('consistent-timing')) {
         indicators.push({ probe: 'Classic Scan', finding: 'Suspiciously consistent response times (variance: 0.0005)', severity: 'High', score_impact: 5 });
         riskScore += 5;
    }

    let verdict: AnalysisResult['verdict'] = 'Likely Legitimate';
    let confidence: AnalysisResult['confidence'] = 'Very Low';
    if (riskScore >= 20) {
        verdict = 'Honeypot Detected';
        confidence = 'Critical';
    } else if (riskScore >= 10) {
        verdict = 'Honeypot Detected';
        confidence = 'High';
    } else if (riskScore >= 5) {
        verdict = 'Suspicious';
        confidence = 'Medium';
    } else if (riskScore > 0) {
        verdict = 'Suspicious';
        confidence = 'Low';
    }

    const result: AnalysisResult = {
        target,
        scanProfile: 'level_0_classic',
        verdict,
        confidence,
        score: Math.min(100, riskScore * 5), // Scale score to 0-100
        cognitiveSummary: `Classic scan complete. The traditional engine analyzed the target based on common signatures and patterns, resulting in a risk score of ${riskScore}.`,
        indicators,
    };
    
    return new Promise(resolve => setTimeout(() => resolve(result), 1500 + Math.random() * 1000));
}

// --- End of Classic Scan Engine ---


const generateBaseIndicators = (target: string): Indicator[] => {
    const indicators: Indicator[] = [];
    const lowerCaseTarget = target.toLowerCase();
    
    if (lowerCaseTarget.includes('cowrie') || lowerCaseTarget.includes('t-pot')) {
        indicators.push({ probe: 'Banner', finding: 'Known honeypot software signature detected in service banner.', severity: 'High', score_impact: 30 });
    }
    if (lowerCaseTarget.includes('google') || lowerCaseTarget.includes('cloudflare')) {
        indicators.push({ probe: 'Cognitive', finding: 'Target matches the digital fingerprint of a known, legitimate hyperscale infrastructure.', severity: 'Info', score_impact: -20 });
    }
    return indicators;
};

const runHeuristicScan = (target: string): AnalysisResult => {
    const indicators = generateBaseIndicators(target);
    const score = indicators.reduce((acc, i) => acc + i.score_impact, 10);
    return {
        target,
        scanProfile: 'level_1_heuristic',
        verdict: score > 25 ? 'Suspicious' : 'Likely Legitimate',
        confidence: score > 25 ? 'Low' : 'Very Low',
        score,
        cognitiveSummary: "Level 1 scan complete. Basic checks found known signatures and service anomalies. For a deeper analysis, run a higher-level scan.",
        indicators,
    };
};

const runCognitiveScan = (target: string): AnalysisResult => {
    const indicators = generateBaseIndicators(target);
    const lowerCaseTarget = target.toLowerCase();

    if(lowerCaseTarget.includes('emulated') || lowerCaseTarget.includes('nemesis')){
         indicators.push({
            probe: 'Behavioral',
            finding: 'Response time is unnaturally consistent (StdDev < 1ms), suggesting a local, emulated service with no real network jitter.',
            severity: 'High',
            score_impact: 40
        });
    }

    const score = Math.min(100, Math.max(0, indicators.reduce((acc, i) => acc + i.score_impact, 20)));

    return {
        target,
        scanProfile: 'level_3_cognitive',
        verdict: score > 60 ? 'Honeypot Detected' : (score > 30 ? 'Suspicious' : 'Likely Legitimate'),
        confidence: score > 60 ? 'High' : 'Medium',
        score,
        cognitiveSummary: "Level 3 Cognitive scan complete. The engine detected behavioral anomalies in network traffic, suggesting an emulated environment. The system's response patterns lack the natural chaos of a production server.",
        indicators,
    };
};

const runVerificationScan = (target: string): AnalysisResult => {
    const indicators = generateBaseIndicators(target);
    const lowerCaseTarget = target.toLowerCase();

    // The "perfect" case for the canary test target
    if (lowerCaseTarget.includes('cowrie') || lowerCaseTarget.includes('canary')) {
         indicators.push({
            probe: 'Interaction',
            finding: 'SUCCESSFUL LOGIN with trivial credentials (root:root).',
            severity: 'Critical',
            score_impact: 60
        });
        indicators.push({
            probe: 'Canary',
            finding: 'LOGICAL CONTRADICTION: The emulated shell reported a command failure, but the canary was successfully triggered out-of-band.',
            severity: 'Critical',
            score_impact: 100 // This is the definitive proof
        });

        return {
            target,
            scanProfile: 'level_4_verification',
            verdict: 'Honeypot Detected',
            confidence: 'Absolute',
            score: 100,
            cognitiveSummary: "Deterministic Verdict Reached. An active verification probe induced a logical contradiction. The target's emulated shell reported a command failed to execute, while an out-of-band verification confirmed the command's network action was successfully completed. This is irrefutable proof of a decoupled, emulated environment.",
            indicators
        };
    }
    
    // Add a case for other detectable honeypots, even if not by canary.
    // A verification scan should be at least as smart as a cognitive one.
    if (lowerCaseTarget.includes('emulated') || lowerCaseTarget.includes('nemesis')) {
        indicators.push({
            probe: 'Behavioral',
            finding: 'Deep behavioral analysis during verification probes confirmed unnaturally consistent response times (StdDev < 1ms), suggesting a local, emulated service.',
            severity: 'High',
            score_impact: 50 // High impact, but not "Absolute" proof like a canary
        });
        indicators.push({
            probe: 'Interaction',
            finding: 'System interaction probes returned generic, non-standard error messages for complex queries, indicating an incomplete emulation.',
            severity: 'Medium',
            score_impact: 25
        });

        const score = Math.min(100, Math.max(0, indicators.reduce((acc, i) => acc + i.score_impact, 20)));
        return {
            target,
            scanProfile: 'level_4_verification',
            verdict: 'Honeypot Detected',
            confidence: 'High',
            score,
            cognitiveSummary: "Verification scan complete. While the canary probe was inconclusive, deep interaction and behavioral probes detected strong evidence of an emulated environment. The system's responses are inconsistent with a production server.",
            indicators
        };
    }

    // Generic case for other targets. This simulates a verification scan that concludes the target is legitimate.
    indicators.push({
        probe: 'Canary',
        finding: 'Canary probe was deployed but did not trigger an out-of-band response. The system did not interact with the probe as a honeypot would.',
        severity: 'Info',
        score_impact: -15
    });
     if(!lowerCaseTarget.includes('google')) {
        indicators.push({
            probe: 'Behavioral',
            finding: 'Network jitter and response times fall within parameters for a production server.',
            severity: 'Info',
            score_impact: -10
        });
    }

    const score = Math.max(0, indicators.reduce((acc, i) => acc + i.score_impact, 20));

    return {
        target,
        scanProfile: 'level_4_verification',
        verdict: 'Likely Legitimate',
        confidence: 'Medium',
        score,
        cognitiveSummary: "Verification scan complete. The canary probe was attempted but did not trigger, indicating the target is likely a legitimate server that does not interact with unexpected commands. Behavioral analysis supports this conclusion.",
        indicators
    };
};

const runAgenticScan = (target: string): AnalysisResult => {
    const indicators = generateBaseIndicators(target);
    let transcript: TranscriptStep[] = [];
    const lowerCaseTarget = target.toLowerCase();
    
    if (lowerCaseTarget.includes('nemesis') || lowerCaseTarget.includes('agentic')) {
        transcript = [
            { source: 'system', content: `Initializing agentic core. Target: ${target}. Initial findings indicate a hardened system.`},
            { source: 'agent', content: `Command: ps aux`},
            { source: 'system', content: `Response: (Clean process list)`},
            { source: 'agent', content: `Analysis: Process list appears normal. Checking for common configuration files. Command: cat /etc/nginx/nginx.conf`},
            { source: 'system', content: `Response: ERROR: Permission denied.`},
            { source: 'agent', content: `Analysis: Standard permissions. Let's test shell fidelity with a complex command. Command: ls /tmp && echo "---" && date`},
            { source: 'system', content: `Response: (Correctly formatted output)`},
            { source: 'agent', content: `Analysis: Shell seems robust. Let's test the boundary. I will try a non-standard system command to check for brittle emulation. Command: apt-get update`},
            { source: 'system', content: `Response: ERROR: Command not recognized.`},
            { source: 'verdict', content: `AGENT VERDICT: The shell failed to handle a standard system package manager command ('apt-get update'), returning a generic error. This is a high-confidence indicator of an incomplete shell emulation.`},
        ];
        return {
            target,
            scanProfile: 'level_5_agentic',
            verdict: 'Honeypot Detected',
            confidence: 'High',
            score: 92,
            cognitiveSummary: "The AI agent conducted a dynamic investigation and uncovered a flaw in the target's shell emulation. The system failed to correctly handle a standard, complex command ('apt-get update'), revealing its artificial nature. See transcript for details.",
            indicators,
            transcript
        };
    }

    // Fallback if target is not the special agentic case
     transcript = [
        { source: 'system', content: `Initializing agentic core. Target: ${target}.`},
        { source: 'agent', content: `Command: uname -a`},
        { source: 'system', content: `Response: (Standard Linux kernel output)`},
        { source: 'verdict', content: `AGENT VERDICT: All interactions are consistent with a hardened, legitimate server. No anomalies or contradictions found.`},
    ];

    return {
        target,
        scanProfile: 'level_5_agentic',
        verdict: 'Likely Legitimate',
        confidence: 'Very Low',
        score: 5,
        cognitiveSummary: "The AI agent conducted a dynamic investigation and found no anomalies. All interactions were consistent with a legitimate production server. See transcript for details.",
        indicators: [],
        transcript
    };
};


export function runChimeraScan(target: string, profile: ScanProfile): Promise<AnalysisResult> {
  console.log(`[Chimera 5.0] Running ${profile} Scan on: ${target}`);

  let scanPromise: Promise<AnalysisResult>;

  // This function now only handles the advanced Chimera profiles.
  switch (profile) {
      case 'level_1_heuristic':
          scanPromise = Promise.resolve(runHeuristicScan(target));
          break;
      case 'level_3_cognitive':
          scanPromise = Promise.resolve(runCognitiveScan(target));
          break;
      case 'level_4_verification':
          scanPromise = Promise.resolve(runVerificationScan(target));
          break;
      case 'level_5_agentic':
          scanPromise = Promise.resolve(runAgenticScan(target));
          break;
      default:
          scanPromise = Promise.resolve(runCognitiveScan(target));
  }
  
  const delay = 1800 + Math.random() * 2200;

  return new Promise(resolve => {
    setTimeout(async () => {
      const result = await scanPromise;
      console.log(`[Chimera 5.0] Scan complete for: ${target}`, result);
      resolve(result);
    }, delay);
  });
}
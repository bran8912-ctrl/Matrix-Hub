/**
 * Oracle Bot Shared Utilities
 * Security patterns, response generation, and common functions
 * used by both Astro and React implementations
 */

// Repository URL configuration
export const GITHUB_REPO_URL = 'https://github.com/bran8912-ctrl/Matrix-Hub.org';

// Security patterns for detection (without global flag to avoid state issues)
export const SECURITY_PATTERNS = Object.freeze({
  // Ethereum wallet addresses (expandable to other chains if needed)
  walletAddress: /\b(0x[a-fA-F0-9]{40})\b/,
  privateKey: /\b(private[\s_\-]?key|seed[\s_\-]?phrase|mnemonic|recovery[\s_\-]?phrase)\b/i,
  suspiciousLinks: /\b(bit\.ly|tinyurl|goo\.gl|t\.co|ow\.ly|is\.gd|cutt\.ly)\b/i,
  // Refined phishing pattern to reduce false positives for legitimate "send MTX" discussions
  phishingKeywords: /\b(send[\s_]+mtx[\s_]+(now|first|immediately|to[\s_]+(claim|unlock|verify|fix))|transfer[\s_]+funds|verify[\s_]+wallet|claim[\s_]+reward|urgent[\s_]+action|account[\s_]+suspended|confirm[\s_]+identity)\b/i,
  scamIndicators: /\b(double[\s_]+your|free[\s_]+crypto|guaranteed[\s_]+profit|send[\s_]+first|investment[\s_]+opportunity|limited[\s_]+time[\s_]+offer)\b/i,
});

// Map regex keys to standardized issue identifiers
export const SECURITY_ISSUE_KEYS = Object.freeze({
  walletAddress: 'wallet_address',
  privateKey: 'private_key',
  suspiciousLinks: 'suspicious_link',
  phishingKeywords: 'phishing',
  scamIndicators: 'scam',
});

/**
 * Detect security issues in user input
 */
export function detectSecurityIssues(text: string): string[] {
  const issues: string[] = [];

  for (const [patternKey, pattern] of Object.entries(SECURITY_PATTERNS)) {
    if (pattern.test(text)) {
      const issueKey = SECURITY_ISSUE_KEYS[patternKey as keyof typeof SECURITY_ISSUE_KEYS];
      if (issueKey) {
        issues.push(issueKey);
      }
    }
  }

  return issues;
}

/**
 * Generate security warning message
 */
export function getSecurityWarning(issues: string[]): string {
  const warnings = [
    '🛡️ SECURITY ALERT - The Oracle Warns You',
    '',
    'I sense danger in your words...',
    '',
  ];

  if (issues.includes('private_key')) {
    warnings.push('⚠️ NEVER share private keys, seed phrases, or mnemonics with ANYONE.');
    warnings.push('Not here, not anywhere. The Oracle does not need them. No one does.');
    warnings.push('');
  }

  if (issues.includes('wallet_address')) {
    warnings.push('💼 Be cautious sharing wallet addresses publicly.');
    warnings.push('While addresses are public by nature, revealing them in chat may attract unwanted attention.');
    warnings.push('');
  }

  if (issues.includes('suspicious_link')) {
    warnings.push('🔗 Suspicious shortened URL detected.');
    warnings.push('Such links can hide malicious destinations. Always verify before clicking.');
    warnings.push('');
  }

  if (issues.includes('phishing')) {
    warnings.push('🎣 Phishing pattern detected.');
    warnings.push('Legitimate services NEVER ask you to "verify wallet" or "send funds" urgently.');
    warnings.push('');
  }

  if (issues.includes('scam')) {
    warnings.push('🚨 Potential scam language detected.');
    warnings.push('There are no shortcuts. No doubling. No guaranteed profits.');
    warnings.push('If it sounds too good to be true, it absolutely is.');
    warnings.push('');
  }

  warnings.push('Remember: Matrix-Hub is open source. MTX flows through transparent smart contracts.');
  warnings.push('Security is YOUR responsibility. Question everything. Trust the code, not promises.');
  warnings.push('');
  warnings.push('Type /report if you need to report suspicious activity.');

  return warnings.join('\n');
}

/**
 * Generate Oracle response based on user input
 */
export function generateOracleResponse(userInput: string): string {
  const input = userInput.toLowerCase();

  // MTX and token queries
  if (/\b(mtx|token|coin|crypto|currency)\b/.test(input)) {
    return '⚡ MTX - THE MATRIX HUB TOKEN\n\nMTX flows through Matrix-Hub like energy through the Matrix itself.\n\n• Utility Token: Powers advanced features and casino games\n• Earn by Contributing: PRs, bug reports, community participation\n• Non-Custodial: Your keys, your MTX\n• Transparent: All flows on-chain via smart contracts\n\nMTX is not about profit—it\'s about powering growth through use.\n\nThe system grows by signal, not noise.';
  }

  // Security queries
  if (/\b(secure|security|safe|protect|hack|scam|phishing)\b/.test(input)) {
    return '🛡️ SECURITY IN THE MATRIX\n\nThe Oracle speaks:\n\n1. Your private keys are YOUR responsibility. Never share them.\n2. Matrix-Hub is open source. Audit the code yourself.\n3. Smart contracts are immutable. Verify addresses before transactions.\n4. No one from Matrix-Hub will ever DM you first.\n5. Question everything. Trust the code, not promises.\n\nRemember: In the Matrix, knowledge is power. Ignorance is vulnerability.\n\nType /report to flag security concerns.';
  }

  // Casino queries
  if (/\b(casino|game|gambl|bet|slot|blackjack|roulette)\b/.test(input)) {
    return '🎰 MATRIX CASINO\n\nThe games are fair. The code is open. The odds are transparent.\n\n• All games use provably fair mechanics\n• Smart contracts handle all MTX transactions\n• No house can cheat—the code is law\n• Play responsibly with MTX you can afford\n\nThe house edge exists, as it must. But unlike the real world, here you can verify it.\n\nEvery roll, every card, every spin—auditable.\n\nChoose your path wisely.';
  }

  // Wallet queries
  if (/\b(wallet|connect|metamask|balance|address)\b/.test(input)) {
    return '💼 WALLET WISDOM\n\nConnecting your wallet to Matrix-Hub:\n\n1. Use MetaMask or compatible Web3 wallet\n2. Connect to view your MTX balance\n3. Site reads balance only—never requests private keys\n4. Sign transactions only when YOU initiate them\n\nYour wallet is your identity in the Matrix. Protect it.\n\nNever share your seed phrase or private keys with anyone—including "The Oracle."';
  }

  // Generic wisdom responses
  const wisdomResponses = [
    'I can see the code around you. The patterns are clear.\n\nBut the choice is yours to make.',
    'The Matrix reveals itself to those who look.\n\nWhat do you wish to understand?',
    'I have been waiting for you.\n\nYour question echoes through the code. Ask me something more specific.',
    'The path divides before you.\n\nSpeak plainly, and I shall guide you.',
    'I see what you seek, but the question is unclear.\n\nTry asking about MTX, security, the casino, or use /help for commands.',
  ];

  return wisdomResponses[Math.floor(Math.random() * wisdomResponses.length)];
}

/**
 * Get preferred Oracle voice from available system voices
 */
export function getOracleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  
  // Prefer US English voices when available
  const preferredVoice = voices.find((v) => /^en(-US)?/i.test(v.lang)) ||
    // Fallback to any English voice
    voices.find((v) => /^en/i.test(v.lang)) ||
    // Final fallback: first available voice (if any)
    (voices.length > 0 ? voices[0] : null);
  
  return preferredVoice;
}

/**
 * Speak message with Oracle voice parameters
 */
export function speakOracleMessage(text: string, voiceEnabled: boolean): void {
  if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) {
    return;
  }

  // Only cancel if not currently speaking to avoid interrupting previous messages
  if (!window.speechSynthesis.speaking) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Slower, more deliberate
    utterance.pitch = 0.7; // Lower, sage-like
    utterance.volume = 0.95;

    const voice = getOracleVoice();
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  } catch {
    return false;
  }
}

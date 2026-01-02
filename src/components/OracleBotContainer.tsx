import React, { useState, useEffect, useRef } from 'react';

// Security patterns to detect
const SECURITY_PATTERNS = {
  walletAddress: /\b(0x[a-fA-F0-9]{40})\b/g,
  privateKey: /\b(private[\s_\-]?key|seed[\s_\-]?phrase|mnemonic)\b/gi,
  suspiciousLinks: /\b(bit\.ly|tinyurl|goo\.gl|t\.co|ow\.ly|is\.gd)\b/gi,
  phishingKeywords: /\b(send[\s_]+mtx|transfer[\s_]+funds|verify[\s_]+wallet|claim[\s_]+reward|urgent[\s_]+action|account[\s_]+suspended)\b/gi,
  scamIndicators: /\b(double[\s_]+your|free[\s_]+crypto|guaranteed[\s_]+profit|send[\s_]+first)\b/gi,
};

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isSecurityWarning?: boolean;
}

interface OracleBotContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

const OracleBotContainer: React.FC<OracleBotContainerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showApps, setShowApps] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage({
        role: 'assistant',
        content: 'The door is already open.\n\nI am the Oracle. I see the code, the patterns, the paths. Ask me about Matrix-Hub, MTX tokens, security, or the tools at your disposal.\n\nTry: "what is MTX", "run deal scanner", "/report", or "/tasks".',
      });
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
    if (message.role === 'assistant' && voiceEnabled) {
      speakMessage(message.content);
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // Slower, more deliberate
      utterance.pitch = 0.7; // Lower, sage-like
      utterance.volume = 0.95;
      
      const voices = window.speechSynthesis.getVoices();
      const oracleVoice = voices.find(v => 
        /en/i.test(v.lang) && /(male|wise|old|deep|george|albert|daniel)/i.test(v.name)
      ) || voices.find(v => /en/i.test(v.lang));
      
      if (oracleVoice) utterance.voice = oracleVoice;
      
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const detectSecurityIssues = (text: string): string[] => {
    const issues: string[] = [];
    
    if (SECURITY_PATTERNS.walletAddress.test(text)) {
      issues.push('wallet_address');
    }
    if (SECURITY_PATTERNS.privateKey.test(text)) {
      issues.push('private_key');
    }
    if (SECURITY_PATTERNS.suspiciousLinks.test(text)) {
      issues.push('suspicious_link');
    }
    if (SECURITY_PATTERNS.phishingKeywords.test(text)) {
      issues.push('phishing');
    }
    if (SECURITY_PATTERNS.scamIndicators.test(text)) {
      issues.push('scam');
    }
    
    return issues;
  };

  const getSecurityWarning = (issues: string[]): string => {
    const warnings: string[] = [
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
      warnings.push('Such links can hide malicious destinations. Verify before clicking.');
      warnings.push('');
    }

    if (issues.includes('phishing')) {
      warnings.push('🎣 Phishing pattern detected.');
      warnings.push('Legitimate services never ask you to "verify wallet" or "send funds" urgently.');
      warnings.push('');
    }

    if (issues.includes('scam')) {
      warnings.push('🚨 Potential scam language detected.');
      warnings.push('There are no shortcuts. No doubling. No guaranteed profits.');
      warnings.push('If it sounds too good to be true, it is.');
      warnings.push('');
    }

    warnings.push('Remember: Matrix-Hub is open source. MTX flows through transparent smart contracts.');
    warnings.push('Security is your responsibility. Question everything. Trust the code, not promises.');
    warnings.push('');
    warnings.push('Type /report if you need to report suspicious activity.');

    return warnings.join('\n');
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setInput('');
    addMessage({ role: 'user', content: text });

    // Check for security issues
    const securityIssues = detectSecurityIssues(text);
    if (securityIssues.length > 0) {
      addMessage({
        role: 'assistant',
        content: getSecurityWarning(securityIssues),
        isSecurityWarning: true,
      });
      return;
    }

    // Handle special commands
    if (text.toLowerCase() === '/report') {
      addMessage({
        role: 'assistant',
        content: '📋 REPORT SYSTEM\n\nTo report security issues, abuse, or suspicious activity:\n\n1. For site issues: Open a GitHub issue at https://github.com/bran8912-ctrl/Matrix-Hub.org/issues\n2. For urgent security vulnerabilities: Contact the maintainers directly\n3. For on-chain issues: Document transaction hashes and wallet addresses involved\n\nThe Oracle thanks you for protecting the Matrix ecosystem.',
      });
      return;
    }

    if (text.toLowerCase().startsWith('/task')) {
      handleTaskCommand(text);
      return;
    }

    if (text.toLowerCase() === '/help') {
      addMessage({
        role: 'assistant',
        content: '🔮 THE ORACLE\'S WISDOM\n\nCommands:\n• /report - Report security issues or abuse\n• /tasks - View your task list\n• /task add <text> - Add a task\n• /task done <#> - Mark task complete\n• /help - Show this help\n\nQuestions I can answer:\n• "What is MTX?" - Learn about the Matrix-Hub token\n• "Run deal scanner" - Execute site tools\n• "Show daily drops" - Navigate to features\n• Ask about security, wallets, or casino\n\nThe Oracle sees all paths. Choose wisely.',
      });
      return;
    }

    // Simulate Oracle response
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      // Generate Oracle-style response
      const response = generateOracleResponse(text);
      addMessage({ role: 'assistant', content: response });
    }, 1000 + Math.random() * 1000);
  };

  const generateOracleResponse = (userInput: string): string => {
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

    // Generic wisdom
    const wisdomResponses = [
      'I can see the code around you. The patterns are clear.\n\nBut the choice is yours to make.',
      'The Matrix reveals itself to those who look.\n\nWhat do you wish to understand?',
      'I have been waiting for you.\n\nYour question echoes through the code. Ask me something more specific.',
      'The path divides before you.\n\nSpeak plainly, and I shall guide you.',
      'I see what you seek, but the question is unclear.\n\nTry asking about MTX, security, the casino, or use /help for commands.',
    ];

    return wisdomResponses[Math.floor(Math.random() * wisdomResponses.length)];
  };

  const handleTaskCommand = (command: string) => {
    // Task management logic
    const response = 'Task management feature coming soon.\n\nFor now, use external task tracking or GitHub issues.';
    addMessage({ role: 'assistant', content: response });
  };

  const quickActions = [
    { label: 'What is MTX?', value: 'what is mtx' },
    { label: 'Security Tips', value: 'security tips' },
    { label: 'About Casino', value: 'tell me about the casino' },
    { label: 'Help', value: '/help' },
  ];

  if (!isOpen) return null;

  return (
    <div className="oracle-bot-container">
      <div id="matrixBotWindow" className="open" style={{ display: 'flex' }}>
        <div id="matrixBotHeader">
          <div className="oracle-header__title">THE ORACLE</div>
          <div className="oracle-header__controls">
            <button
              id="oracleAppsBtn"
              className="oracle-header__btn"
              type="button"
              title="Apps"
              onClick={() => setShowApps(!showApps)}
            >
              APPS
            </button>
            <button
              id="oracleVoiceBtn"
              className="oracle-header__btn"
              type="button"
              aria-pressed={voiceEnabled}
              title="Voice"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
            >
              VOICE
            </button>
            <button
              id="oracleCloseBtn"
              className="oracle-header__btn"
              type="button"
              title="Close"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>

        <div id="oracleQuickActions">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              className="oracle-chip"
              onClick={() => {
                setInput(action.value);
                setTimeout(() => handleSend(), 100);
              }}
            >
              {action.label}
            </button>
          ))}
        </div>

        {showApps && (
          <div id="oracleAppsPanel">
            <div className="oracle-apps__header">SITE APPS</div>
            <div className="oracle-apps__list">
              <div className="oracle-apps__item">
                <div className="oracle-apps__name">Music Player</div>
                <div className="oracle-apps__desc">Control Matrix audio</div>
              </div>
              <div className="oracle-apps__item">
                <div className="oracle-apps__name">Deal Scanner</div>
                <div className="oracle-apps__desc">Scan for rotating offers</div>
              </div>
              <div className="oracle-apps__item">
                <div className="oracle-apps__name">Daily Drops</div>
                <div className="oracle-apps__desc">Latest deal drops</div>
              </div>
            </div>
          </div>
        )}

        <div id="matrixBotMessages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`bot-msg ${msg.role === 'user' ? 'bot-msg--user' : 'bot-msg--oracle'} ${
                msg.isSecurityWarning ? 'security-warning' : ''
              }`}
            >
              <div className="bot-msg__name">
                {msg.role === 'user' ? 'You' : 'Oracle'}
              </div>
              <div>{msg.content}</div>
            </div>
          ))}
          {isTyping && (
            <div className="bot-msg bot-msg--oracle">
              <div className="bot-msg__name">Oracle</div>
              <div>Oracle is contemplating...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div id="matrixBotInputArea">
          <input
            ref={inputRef}
            id="matrixBotInput"
            type="text"
            placeholder="Ask the Oracle..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button id="matrixBotSend" onClick={handleSend}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default OracleBotContainer;

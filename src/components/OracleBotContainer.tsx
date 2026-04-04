import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: number;
}

// Security patterns to detect and block
const SECURITY_PATTERNS = {
  privateKey: /\b(private\s*key|seed\s*phrase|mnemonic|recovery\s*phrase|12\s*words|24\s*words|secret\s*key)\b/i,
  walletAddress: /\b0x[a-fA-F0-9]{40}\b/,
  suspiciousLinks: /\b(bit\.ly|tinyurl|goo\.gl|shorturl|t\.co|ow\.ly)\b/i,
  phishing: /\b(verify\s*wallet|claim\s*airdrop|urgent\s*action|limited\s*time|send\s*eth|send\s*mtx|double\s*your|guaranteed\s*profit)\b/i,
};

// Matrix-style Oracle responses
const ORACLE_RESPONSES = {
  greeting: "Welcome, seeker. I am the Oracle. The digital realm reveals all truths to those who ask. What knowledge do you seek from the Matrix?",
  securityWarning: "⚠️ SECURITY BREACH DETECTED ⚠️\n\nThe Oracle sees all, Neo. Never share your private keys, seed phrases, or wallet secrets in any system. The Matrix protects those who protect themselves.\n\nRemember: Real agents never ask for your keys. Stay vigilant.",
  mtxInfo: "The MTX token is the lifeblood of the Matrix Hub ecosystem. Here is what the Oracle knows:\n\n• MTX powers all casino games — Slots, Blackjack, and Roulette\n• Holding MTX unlocks premium features and advanced tools\n• Your balance is read directly from your wallet — we are non-custodial; we never hold your tokens\n• MTX can be earned by contributing to the platform: accepted PRs and approved issues are rewarded\n• Supply is managed through burn and lock mechanisms to reduce inflation over time\n\nThe choice to hold, earn, or spend is always yours.",
  casinoInfo: "The Oracle reveals the casino's inner workings:\n\n• Three games are available: Slots (1 MTX/spin), Blackjack (2 MTX/hand), and Roulette (1 MTX minimum bet)\n• All transactions are on-chain — every spin, hand, and bet is transparent and verifiable on the blockchain\n• Provably fair mechanics ensure no outcome can be manipulated — mathematics, not faith\n• Connect your wallet first to view your MTX balance before playing\n• Discipline is the true edge: set a session bankroll and a loss limit before you begin\n\nThe house has an edge, seeker. Play with awareness, not hope.",
  walletSafety: "Your wallet is your identity in the Matrix. The Oracle's security doctrine:\n\n• Never share your private key or seed phrase — not with this site, not with anyone\n• Always verify the contract address before approving any transaction\n• Use a hardware wallet for large holdings — software wallets are convenient but vulnerable\n• Check the URL carefully before connecting — phishing sites mimic legitimate ones pixel-perfectly\n• Revoke unused token approvals regularly via a trusted revoke tool (e.g. revoke.cash)\n• When in doubt, do nothing. A missed opportunity is recoverable. A compromised wallet may not be.\n\nThe Oracle has spoken. Stay vigilant.",
  help: "The Oracle can guide you through:\n• MTX Token System — type 'mtx' or 'token'\n• Casino Games & Strategy — type 'casino' or 'blackjack'\n• Wallet Safety — type 'wallet' or 'security'\n• Earning MTX — type 'earn' or 'contribute'\n• DeFi & Blockchain — type 'defi' or 'blockchain'\n• Site Tools & Features — type 'tools' or 'features'\n• Governance & DAO — type 'dao' or 'governance'\n• NFTs — type 'nft'\n\nSpeak your query, and the truth shall be revealed.",
  earning: "The Oracle reveals the paths to earning MTX:\n\n• Submit a Pull Request — accepted PRs earn MTX rewards based on impact\n• File a quality Issue — approved bug reports and feature suggestions earn MTX\n• Gameplay rewards — casino games offer on-chain payouts for winning outcomes\n• Community contributions — active, valuable community participation is recognised\n\nQuality is the only currency that matters here. The Matrix does not reward noise. Contribute substance, and the system will respond in kind.",
  defi: "Decentralised Finance is the Oracle's domain. The fundamentals:\n\n• DeFi removes intermediaries — code enforces rules, not institutions\n• Key risks: smart contract bugs, rug pulls, impermanent loss, liquidation on leveraged positions\n• Always audit or use audited protocols — the code is the contract\n• Liquidity pools let you earn fees but expose you to impermanent loss when asset prices diverge\n• Yield farming rewards exist to incentivise liquidity — unsustainable APYs are a warning, not a gift\n• On-chain analytics (Etherscan, Dune, DefiLlama) reveal what wallets and protocols are actually doing\n\nDeFi is powerful. Approach it as an engineer, not a gambler.",
  blockchain: "The Oracle on blockchain fundamentals:\n\n• A blockchain is an append-only, distributed ledger — once data is written, it cannot be altered without consensus\n• Ethereum is the smart contract layer — MTX is an ERC-20 token on this network\n• Gas fees are the cost of computation on Ethereum — they fluctuate with network demand\n• Solidity 0.8.x (the version used here) includes built-in overflow protection — a critical security improvement over earlier versions\n• Block finality: on Ethereum, 12+ block confirmations are considered practically irreversible\n• Public keys are safe to share; private keys are never to be shared — this is non-negotiable\n\nThe blockchain does not lie. Learn to read it.",
  tools: "The Matrix Hub provides a suite of tools for those who seek an edge:\n\n• Free Financial Tools — live TradingView charts, crypto market screener, and ticker tape with real-time prices\n• Casino Games — on-chain provably fair gaming with MTX\n• Arcade — classic browser games and playgrounds for experimentation\n• Wallet Connect — non-custodial MTX balance and feature access\n• Daily Drops — check in daily for rewards and updates\n• OracleBot (this bot) — site-wide intelligent assistant\n\nAll tools are accessible without MTX. Premium tiers unlock advanced features. Explore the navigation above.",
  dao: "The Oracle on governance and DAO:\n\n• Matrix Hub is evolving toward community governance — MTX holders will have proportional voting power\n• Proposals can cover: fee structures, new game modules, tool integrations, reward pools, and treasury allocation\n• DAO participation rewards active, engaged token holders over passive speculators\n• Governance is not a right — it is a responsibility. Low participation leads to capture by a small group\n• Follow the whitepaper and docs folder for the current governance roadmap\n\nThe Oracle advises: hold MTX not just to speculate, but to shape what this system becomes.",
  nft: "The Oracle on NFTs in the Matrix Hub context:\n\n• NFTs can represent on-chain ownership of unique items, game assets, or membership tiers\n• Matrix Hub's roadmap includes NFT-gated features — holding certain NFTs may unlock exclusive modules\n• Verify NFT contract addresses independently before minting or purchasing\n• Floor price is not intrinsic value — understand the utility behind an NFT before acquisition\n• Gas fees for minting can be significant during peak network congestion — time your transactions wisely\n\nNFTs are a tool, not a destination. Ask what the token does, not just what it costs.",
  blackjack: "The Oracle's blackjack doctrine — basic strategy distilled:\n\n• Always stand on hard 17+. Always hit on hard 8 or less.\n• Double down on hard 11 vs dealer 2–10. Double on hard 10 vs dealer 2–9.\n• Split Aces and 8s — always. Never split 10s, 5s, or 4s.\n• Never take insurance — it is a side bet with a negative expected value.\n• On soft 18 (Ace+7): hit against dealer 9, 10, or Ace — standing is a common mistake.\n• Surrender hard 16 vs dealer 10 when surrender is available.\n• With perfect basic strategy, the house edge drops to ~0.5%.\n\nThe Oracle reminds you: discipline in execution is what separates strategy from luck.",
  slots: "The Oracle on slots strategy:\n\n• RTP (Return to Player) is the long-run theoretical return — 96% means the house keeps 4% over millions of spins\n• High-variance slots pay larger but less frequently. Low-variance slots sustain your bankroll longer.\n• Set a hard session bankroll before spinning — slots are designed to make time disappear\n• Bonus rounds carry most of a slot's expected payout. Without triggering them, your RTP is lower than advertised.\n• The 'hot machine' fallacy is a myth — each spin is statistically independent\n\nThe Matrix is honest. The machine has no memory of your previous spins.",
  roulette: "The Oracle on roulette strategy:\n\n• European roulette (single zero) has a 2.7% house edge. American (double zero) is 5.26% — always prefer European.\n• Outside bets (red/black, odd/even) give ~48.6% win probability — the safest starting point.\n• The Martingale (doubling after loss) works until it doesn't. Table limits and bankroll constraints will stop it.\n• D'Alembert (±1 unit after loss/win) is a lower-variance alternative with similar long-run outcomes.\n• No system can change the house edge. Betting systems manage risk distribution, not expected value.\n• Neighbour bets target a wheel sector — useful for tracking wheel bias, though modern wheels are extremely precise.\n\nMathematics governs the wheel. Strategies manage variance, not destiny.",
};

// Check if message contains sensitive information
const detectSecurityIssue = (text: string): string | null => {
  // Note: lowerText is not used in current implementation but reserved for future checks
  // const lowerText = text.toLowerCase();
  
  if (SECURITY_PATTERNS.privateKey.test(text)) {
    return "⚠️ CRITICAL: Never share private keys or seed phrases! The Oracle has blocked this message for your protection.";
  }
  
  if (SECURITY_PATTERNS.phishing.test(text)) {
    return "⚠️ PHISHING DETECTED: This appears to be a scam attempt. The Matrix does not operate through urgency or guaranteed profits. Stay vigilant.";
  }
  
  if (SECURITY_PATTERNS.suspiciousLinks.test(text)) {
    return "⚠️ SUSPICIOUS LINK: Shortened URLs can hide malicious destinations. The Oracle recommends caution with all external links.";
  }
  
  return null;
};

// Generate Oracle response based on query
const generateOracleResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  // Security issue check first
  const securityIssue = detectSecurityIssue(query);
  if (securityIssue) {
    return securityIssue + "\n\n" + ORACLE_RESPONSES.securityWarning;
  }
  
  // Blackjack / roulette / slots — more specific than generic 'casino'
  if (lowerQuery.includes('blackjack') || lowerQuery.includes('21') || lowerQuery.includes('double down') || lowerQuery.includes('split')) {
    return ORACLE_RESPONSES.blackjack;
  }

  if (lowerQuery.includes('roulette') || lowerQuery.includes('martingale') || lowerQuery.includes('red black') || lowerQuery.includes('roulette spin') || lowerQuery.includes('wheel spin')) {
    return ORACLE_RESPONSES.roulette;
  }

  if (lowerQuery.includes('slot') || lowerQuery.includes('rtp') || lowerQuery.includes('jackpot') || lowerQuery.includes('bonus round')) {
    return ORACLE_RESPONSES.slots;
  }

  // Earning / contributing
  if (lowerQuery.includes('earn') || lowerQuery.includes('reward') || lowerQuery.includes('contribut') || lowerQuery.includes('pull request') || lowerQuery.includes('pr ')) {
    return ORACLE_RESPONSES.earning;
  }

  // DeFi
  if (lowerQuery.includes('defi') || lowerQuery.includes('decentrali') || lowerQuery.includes('yield') || lowerQuery.includes('liquidity') || lowerQuery.includes('pool') || lowerQuery.includes('farm')) {
    return ORACLE_RESPONSES.defi;
  }

  // Blockchain / Ethereum / Solidity
  if (lowerQuery.includes('blockchain') || lowerQuery.includes('ethereum') || lowerQuery.includes('solidity') || lowerQuery.includes('smart contract') || lowerQuery.includes('gas') || lowerQuery.includes('block')) {
    return ORACLE_RESPONSES.blockchain;
  }

  // NFT
  if (lowerQuery.includes('nft') || lowerQuery.includes('non-fungible') || lowerQuery.includes('mint') || lowerQuery.includes('token gat')) {
    return ORACLE_RESPONSES.nft;
  }

  // DAO / governance
  if (lowerQuery.includes('dao') || lowerQuery.includes('governance') || lowerQuery.includes('vote') || lowerQuery.includes('proposal') || lowerQuery.includes('treasury')) {
    return ORACLE_RESPONSES.dao;
  }

  // Tools / features
  if (lowerQuery.includes('tool') || lowerQuery.includes('feature') || lowerQuery.includes('chart') || lowerQuery.includes('screener') || lowerQuery.includes('ticker') || lowerQuery.includes('trading')) {
    return ORACLE_RESPONSES.tools;
  }

  // MTX token
  if (lowerQuery.includes('mtx') || lowerQuery.includes('token') || lowerQuery.includes('coin') || lowerQuery.includes('balance') || lowerQuery.includes('supply')) {
    return ORACLE_RESPONSES.mtxInfo;
  }
  
  // Casino (generic)
  if (lowerQuery.includes('casino') || lowerQuery.includes('game') || lowerQuery.includes('bet') || lowerQuery.includes('wager') || lowerQuery.includes('gambl')) {
    return ORACLE_RESPONSES.casinoInfo;
  }
  
  // Wallet / security
  if (lowerQuery.includes('wallet') || lowerQuery.includes('safe') || lowerQuery.includes('security') || lowerQuery.includes('key') || lowerQuery.includes('phish') || lowerQuery.includes('scam') || lowerQuery.includes('hack')) {
    return ORACLE_RESPONSES.walletSafety;
  }
  
  // Help
  if (lowerQuery.includes('help') || lowerQuery.includes('guide') || lowerQuery.includes('what can') || lowerQuery.includes('what do')) {
    return ORACLE_RESPONSES.help;
  }
  
  // Default Oracle wisdom
  return "The Oracle sees your question, seeker. The path forward reveals itself to those who persist. Explore the Matrix Hub — each module holds its own truth.\n\nType 'help' to see the full list of topics the Oracle can illuminate.";
};

export default function OracleBotContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Show welcome message when first opened
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: `bot-${Date.now()}`,
        text: ORACLE_RESPONSES.greeting,
        isBot: true,
        timestamp: Date.now(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);
  
  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      isBot: false,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate Oracle "thinking" delay
    setTimeout(() => {
      const botResponse = generateOracleResponse(inputValue);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        isBot: true,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 400);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <>
      {/* Matrix CSS Effects and Styles */}
      <style>{`
        @keyframes matrixRainBot {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes oracleGlow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.5), 0 0 40px rgba(0, 255, 0, 0.3);
            filter: drop-shadow(0 0 10px rgba(0, 255, 0, 0.8));
          }
          50% { 
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.8), 0 0 60px rgba(0, 255, 0, 0.5);
            filter: drop-shadow(0 0 15px rgba(0, 255, 0, 1));
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        .oracle-bot-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid #00ff00;
          color: #00ff00;
          font-size: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 9998;
          transition: all 0.3s ease;
          animation: oracleGlow 2s infinite;
          font-family: 'Courier New', monospace;
          user-select: none;
        }
        
        .oracle-bot-button:hover {
          transform: scale(1.1);
          border-color: #00ffff;
          color: #00ffff;
        }
        
        .oracle-bot-window {
          position: fixed;
          bottom: 100px;
          right: 24px;
          width: min(440px, calc(100vw - 48px));
          height: min(620px, calc(100vh - 140px));
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid #00ff00;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          z-index: 9999;
          box-shadow: 0 0 40px rgba(0, 255, 0, 0.4), inset 0 0 60px rgba(0, 255, 0, 0.05);
          backdrop-filter: blur(10px);
          font-family: 'Courier New', monospace;
          overflow: hidden;
        }
        
        .oracle-header {
          background: rgba(0, 20, 0, 0.8);
          border-bottom: 2px solid #00ff00;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }
        
        .oracle-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #00ff00, transparent);
          animation: scanline 3s linear infinite;
        }
        
        .oracle-avatar {
          width: 48px;
          height: 48px;
          margin-right: 12px;
        }
        
        .oracle-title {
          flex: 1;
        }
        
        .oracle-title h3 {
          margin: 0;
          color: #00ff00;
          font-size: 18px;
          font-weight: bold;
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
          letter-spacing: 2px;
        }
        
        .oracle-title p {
          margin: 4px 0 0 0;
          color: #00ffaa;
          font-size: 11px;
          opacity: 0.8;
        }
        
        .oracle-close {
          background: transparent;
          border: 1px solid #00ff00;
          color: #00ff00;
          width: 32px;
          height: 32px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .oracle-close:hover {
          background: rgba(0, 255, 0, 0.1);
          border-color: #00ffff;
          color: #00ffff;
        }
        
        .oracle-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          position: relative;
          background: rgba(0, 10, 0, 0.3);
        }
        
        .oracle-messages::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 255, 0, 0.03) 0px,
            transparent 1px,
            transparent 2px,
            rgba(0, 255, 0, 0.03) 3px
          );
          pointer-events: none;
          z-index: 1;
        }
        
        .oracle-messages > * {
          position: relative;
          z-index: 2;
        }
        
        .oracle-message {
          margin-bottom: 16px;
          animation: fadeInMessage 0.3s ease-out;
        }
        
        @keyframes fadeInMessage {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .message-user {
          text-align: right;
        }
        
        .message-bot {
          text-align: left;
        }
        
        .message-bubble {
          display: inline-block;
          max-width: 85%;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          line-height: 1.5;
          word-wrap: break-word;
        }
        
        .message-user .message-bubble {
          background: rgba(0, 100, 0, 0.3);
          border: 1px solid #00ff00;
          color: #00ff00;
        }
        
        .message-bot .message-bubble {
          background: rgba(0, 50, 50, 0.3);
          border: 1px solid #00ffaa;
          color: #00ffaa;
        }
        
        .typing-indicator {
          display: inline-flex;
          gap: 4px;
          padding: 12px 16px;
          background: rgba(0, 50, 50, 0.3);
          border: 1px solid #00ffaa;
          border-radius: 8px;
        }
        
        .typing-dot {
          width: 8px;
          height: 8px;
          background: #00ffaa;
          border-radius: 50%;
          animation: pulse 1.4s infinite;
        }
        
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        .oracle-input-area {
          border-top: 2px solid #00ff00;
          padding: 16px;
          background: rgba(0, 20, 0, 0.8);
          display: flex;
          gap: 8px;
        }
        
        .oracle-input {
          flex: 1;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid #00ff00;
          border-radius: 6px;
          padding: 12px;
          color: #00ff00;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }
        
        .oracle-input::placeholder {
          color: rgba(0, 255, 0, 0.5);
        }
        
        .oracle-input:focus {
          border-color: #00ffff;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        }
        
        .oracle-send-btn {
          background: rgba(0, 100, 0, 0.4);
          border: 1px solid #00ff00;
          border-radius: 6px;
          color: #00ff00;
          width: 48px;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .oracle-send-btn:hover:not(:disabled) {
          background: rgba(0, 150, 0, 0.5);
          border-color: #00ffff;
          color: #00ffff;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        }
        
        .oracle-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .oracle-footer {
          padding: 8px 16px;
          background: rgba(0, 20, 0, 0.8);
          border-top: 1px solid rgba(0, 255, 0, 0.3);
          font-size: 11px;
          color: rgba(0, 255, 0, 0.6);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .oracle-footer a {
          color: #00ffaa;
          text-decoration: none;
          transition: color 0.2s;
        }
        
        .oracle-footer a:hover {
          color: #00ffff;
          text-decoration: underline;
        }
        
        .matrix-rain-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
          opacity: 0.15;
        }
        
        .matrix-rain-char {
          position: absolute;
          color: #00ff00;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          animation: matrixRainBot 8s linear infinite;
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
          .oracle-bot-button {
            bottom: 16px;
            right: 16px;
            width: 56px;
            height: 56px;
            font-size: 24px;
          }
          
          .oracle-bot-window {
            bottom: 84px;
            right: 16px;
            left: 16px;
            width: calc(100vw - 32px);
            height: calc(100vh - 120px);
          }
        }
        
        /* Accessibility */
        .oracle-bot-button:focus,
        .oracle-close:focus,
        .oracle-send-btn:focus,
        .oracle-input:focus {
          outline: 2px solid #00ffff;
          outline-offset: 2px;
        }
      `}</style>
      
      {/* Floating Oracle Button */}
      <button
        className="oracle-bot-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Oracle Chat"
        title="Ask the Oracle"
      >
        <OracleHeadSVG />
      </button>
      
      {/* Chat Window */}
      {isOpen && (
        <div className="oracle-bot-window">
          {/* Matrix Rain Effect */}
          <MatrixRain />
          
          {/* Header */}
          <div className="oracle-header">
            <div className="oracle-avatar">
              <OracleHeadSVG />
            </div>
            <div className="oracle-title">
              <h3>THE ORACLE</h3>
              <p>Matrix Hub Guardian • Always Vigilant</p>
            </div>
            <button
              className="oracle-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close Oracle Chat"
            >
              ×
            </button>
          </div>
          
          {/* Messages */}
          <div className="oracle-messages">
            {messages.map(message => (
              <div
                key={message.id}
                className={`oracle-message ${message.isBot ? 'message-bot' : 'message-user'}`}
              >
                <div className="message-bubble">
                  {message.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < message.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="oracle-message message-bot">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="oracle-input-area">
            <input
              type="text"
              className="oracle-input"
              placeholder="Ask the Oracle..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              aria-label="Message input"
            />
            <button
              className="oracle-send-btn"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
          
          {/* Footer */}
          <div className="oracle-footer">
            <span>🔒 Never share private keys</span>
            <div>
              <a href="#help" onClick={(e) => { e.preventDefault(); setInputValue('help'); }}>Help</a>
              {' • '}
              <a href="https://github.com/bran8912-ctrl/Matrix-Hub.org/issues" target="_blank" rel="noopener noreferrer">Report</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Oracle Head SVG Component
function OracleHeadSVG() {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Digital Glow Effect */}
      <defs>
        <radialGradient id="oracleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00ff00" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#00ff00" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#00ff00" stopOpacity="0" />
        </radialGradient>
        <filter id="digitalGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Glow background */}
      <circle cx="50" cy="50" r="45" fill="url(#oracleGlow)" opacity="0.6" />
      
      {/* Head outline */}
      <circle cx="50" cy="45" r="28" fill="none" stroke="#00ff00" strokeWidth="2" filter="url(#digitalGlow)" />
      
      {/* Eyes - Matrix style digital eyes */}
      <rect x="40" y="38" width="6" height="10" fill="#00ff00" opacity="0.9" filter="url(#digitalGlow)" />
      <rect x="54" y="38" width="6" height="10" fill="#00ff00" opacity="0.9" filter="url(#digitalGlow)" />
      
      {/* Digital scan lines across eyes */}
      <line x1="38" y1="41" x2="48" y2="41" stroke="#00ffff" strokeWidth="1" opacity="0.6" />
      <line x1="52" y1="41" x2="62" y2="41" stroke="#00ffff" strokeWidth="1" opacity="0.6" />
      <line x1="38" y1="45" x2="48" y2="45" stroke="#00ffff" strokeWidth="1" opacity="0.6" />
      <line x1="52" y1="45" x2="62" y2="45" stroke="#00ffff" strokeWidth="1" opacity="0.6" />
      
      {/* Mouth - digital code stream */}
      <path d="M 38 58 Q 50 62 62 58" fill="none" stroke="#00ff00" strokeWidth="2" filter="url(#digitalGlow)" />
      
      {/* Digital nodes around head */}
      <circle cx="30" cy="35" r="2" fill="#00ff00" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="70" cy="35" r="2" fill="#00ff00" opacity="0.8">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="35" cy="60" r="2" fill="#00ff00" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="65" cy="60" r="2" fill="#00ff00" opacity="0.8">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite" />
      </circle>
      
      {/* Digital circuit lines */}
      <path d="M 50 73 L 50 85" stroke="#00ff00" strokeWidth="1.5" opacity="0.6" />
      <path d="M 45 80 L 55 80" stroke="#00ff00" strokeWidth="1.5" opacity="0.6" />
      <circle cx="50" cy="85" r="3" fill="none" stroke="#00ff00" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

// Matrix Rain Background Effect
function MatrixRain() {
  const [chars, setChars] = useState<Array<{ char: string; left: number; delay: number }>>([]);
  
  useEffect(() => {
    const matrixChars = 'アイウエオカキクケコサシスセソタチツテト01';
    const columns = 12;
    
    const newChars = Array.from({ length: columns }, (_, i) => ({
      char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
      left: (i / columns) * 100,
      delay: Math.random() * 5,
    }));
    
    setChars(newChars);
  }, []);
  
  return (
    <div className="matrix-rain-container">
      {chars.map((item, i) => (
        <div
          key={i}
          className="matrix-rain-char"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.char}
        </div>
      ))}
    </div>
  );
}

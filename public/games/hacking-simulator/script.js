const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const accuracyDisplay = document.getElementById('accuracy');
const missionText = document.getElementById('mission-text');

let score = 0;
let level = 1;
let totalAttempts = 0;
let successfulAttempts = 0;
let currentTarget = '';
let gameActive = false;

const codeSequences = [
    'SYSTEM.ACCESS',
    'ROOT.OVERRIDE',
    'FIREWALL.BYPASS',
    'ENCRYPTION.DECRYPT',
    'DATABASE.QUERY',
    'KERNEL.INJECT',
    'NETWORK.SCAN',
    'ADMIN.PRIVILEGE',
    'PROTOCOL.BREACH',
    'MATRIX.ENTER',
    'CIPHER.BREAK',
    'MAINFRAME.ACCESS',
    'SECURITY.DISABLE',
    'BACKDOOR.OPEN',
    'TRACE.EVADE',
    'PASSWORD.CRACK',
    'AUTHENTICATION.BYPASS',
    'UPLOAD.VIRUS',
    'DOWNLOAD.DATA',
    'EXECUTE.COMMAND'
];

const hackingMessages = [
    'Bypassing security protocols...',
    'Decrypting access codes...',
    'Breaching firewall layer...',
    'Accessing mainframe...',
    'Establishing backdoor...',
    'Gaining root access...',
    'Uploading exploit...',
    'Scanning for vulnerabilities...',
    'Injecting payload...',
    'Escalating privileges...'
];

function addLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.textContent = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function addTargetLine(text) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `[TARGET] >>> <span class="target-code">${text}</span>`;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function getRandomSequence() {
    return codeSequences[Math.floor(Math.random() * codeSequences.length)];
}

function getRandomMessage() {
    return hackingMessages[Math.floor(Math.random() * hackingMessages.length)];
}

function startGame() {
    gameActive = true;
    score = 0;
    level = 1;
    totalAttempts = 0;
    successfulAttempts = 0;
    
    terminalOutput.innerHTML = '';
    updateStats();
    
    addLine('='.repeat(50), 'system-line');
    addLine('MATRIX HACKING SYSTEM v3.14', 'system-line');
    addLine('='.repeat(50), 'system-line');
    addLine('');
    addLine('Initializing connection...');
    
    setTimeout(() => {
        addLine('Connection established.', 'success-line');
        addLine('');
        nextChallenge();
    }, 1000);
    
    startBtn.disabled = true;
    terminalInput.disabled = false;
    terminalInput.focus();
    missionText.textContent = 'Type the code sequences exactly as shown to hack the system!';
}

function nextChallenge() {
    if (!gameActive) return;
    
    currentTarget = getRandomSequence();
    addLine('');
    addLine(getRandomMessage(), 'system-line');
    addTargetLine(currentTarget);
    terminalInput.value = '';
    terminalInput.focus();
}

function checkInput() {
    const input = terminalInput.value.trim();
    
    if (!input) return;
    
    totalAttempts++;
    addLine(`> ${input}`);
    
    if (input === currentTarget) {
        successfulAttempts++;
        const points = level * 10;
        score += points;
        
        addLine(`✓ ACCESS GRANTED! +${points} points`, 'success-line');
        
        if (successfulAttempts % 5 === 0) {
            level++;
            addLine('', 'system-line');
            addLine(`>>> LEVEL UP! NOW AT LEVEL ${level} <<<`, 'success-line');
            addLine('', 'system-line');
        }
        
        updateStats();
        
        setTimeout(() => {
            nextChallenge();
        }, 1000);
        
    } else {
        addLine('✗ ACCESS DENIED! Incorrect sequence.', 'error-line');
        updateStats();
        terminalInput.value = '';
    }
}

function updateStats() {
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    
    const accuracy = totalAttempts > 0 
        ? Math.round((successfulAttempts / totalAttempts) * 100) 
        : 100;
    accuracyDisplay.textContent = accuracy + '%';
}

function restartGame() {
    gameActive = false;
    terminalOutput.innerHTML = '';
    terminalInput.value = '';
    startBtn.disabled = false;
    terminalInput.disabled = true;
    missionText.textContent = 'Type the highlighted code sequences as they appear to hack into the system...';
    score = 0;
    level = 1;
    totalAttempts = 0;
    successfulAttempts = 0;
    updateStats();
}

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

terminalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && gameActive) {
        checkInput();
    }
});

// Initialize
terminalInput.disabled = true;
updateStats();

// Boot sequence on load
window.addEventListener('load', () => {
    addLine('System ready. Click START HACKING to begin.', 'system-line');
});

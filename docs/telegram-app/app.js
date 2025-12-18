// Initialize Telegram Web App
const tg = window.Telegram.WebApp;

// Initialize the app
function initApp() {
    // Expand to full height
    tg.expand();
    
    // Set header color
    tg.setHeaderColor('#000000');
    
    // Apply theme
    applyTheme();
    
    // Load user info
    loadUserInfo();
    
    // Ready to show
    tg.ready();
    
    // Enable closing confirmation
    tg.enableClosingConfirmation();
    
    console.log('Matrix Hub Telegram App initialized');
}

// Apply Telegram theme
function applyTheme() {
    const themeParams = tg.themeParams;
    
    if (themeParams.bg_color) {
        document.body.style.setProperty('--tg-bg-color', themeParams.bg_color);
    }
    
    if (themeParams.text_color) {
        document.body.style.setProperty('--tg-text-color', themeParams.text_color);
    }
    
    // Detect light/dark mode
    if (tg.colorScheme === 'light') {
        document.body.classList.add('telegram-light');
    }
}

// Load user information
function loadUserInfo() {
    const user = tg.initDataUnsafe?.user;
    
    if (user) {
        const usernameEl = document.getElementById('username');
        const userIdEl = document.getElementById('userId');
        const avatarEl = document.getElementById('avatar');
        
        // Set username
        const displayName = user.username || user.first_name || 'User';
        usernameEl.textContent = displayName;
        
        // Set user ID
        userIdEl.textContent = `ID: ${user.id}`;
        
        // Set avatar (first letter of name)
        if (user.first_name) {
            avatarEl.textContent = user.first_name.charAt(0).toUpperCase();
        }
        
        // Send user data to backend (if needed)
        console.log('User data:', user);
    } else {
        // Demo mode (when opened outside Telegram)
        document.getElementById('username').textContent = 'Demo User';
        document.getElementById('userId').textContent = 'Try in Telegram for full features';
    }
}

// Feature functions
function openDailyDrops() {
    tg.HapticFeedback.impactOccurred('medium');
    tg.openLink('https://matrix-hub.org/#daily-drops-bot', { try_instant_view: true });
}

function openOracle() {
    tg.HapticFeedback.impactOccurred('medium');
    tg.openLink('https://matrix-hub.org/#oracle-section', { try_instant_view: true });
}

function openMusicPlayer() {
    tg.HapticFeedback.impactOccurred('medium');
    tg.openLink('https://matrix-hub.org/#music-player', { try_instant_view: true });
}

function openArtGenerator() {
    tg.HapticFeedback.impactOccurred('medium');
    tg.openLink('https://matrix-hub.org/#art-generator', { try_instant_view: true });
}

function openVideoGenerator() {
    tg.HapticFeedback.impactOccurred('medium');
    tg.openLink('https://matrix-hub.org/#video-generator', { try_instant_view: true });
}

function openDealScanner() {
    tg.HapticFeedback.impactOccurred('medium');
    tg.openLink('https://matrix-hub.org/#deal-scanner', { try_instant_view: true });
}

function openWebsite() {
    tg.HapticFeedback.impactOccurred('light');
    tg.openLink('https://matrix-hub.org');
}

function shareApp() {
    tg.HapticFeedback.impactOccurred('light');
    
    const shareUrl = 'https://t.me/matrixhuborg';
    const shareText = '🎯 Check out Matrix Hub - Your Digital Command Center!\n\n💰 Daily Deals\n🤖 AI Assistant\n🎨 Art Generator\n🎬 Video Creator\n\nJoin now:';
    
    // Try to share via Telegram
    if (tg.initDataUnsafe?.user) {
        tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`);
    } else {
        // Fallback for web
        if (navigator.share) {
            navigator.share({
                title: 'Matrix Hub',
                text: shareText,
                url: shareUrl
            }).catch(err => console.log('Share failed:', err));
        } else {
            tg.openLink(shareUrl);
        }
    }
}

// Send data to bot (example)
function sendDataToBot(data) {
    if (tg.initDataUnsafe?.user) {
        tg.sendData(JSON.stringify(data));
    }
}

// Main button example (can be used for primary actions)
function setupMainButton() {
    tg.MainButton.text = 'Open Full Site';
    tg.MainButton.color = '#00ff41';
    tg.MainButton.textColor = '#000000';
    tg.MainButton.onClick(openWebsite);
    tg.MainButton.show();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Optional: Setup main button
// setupMainButton();

// Matrix Hub Leaderboard System
class MatrixLeaderboard {
    constructor(gameName, maxEntries = 10) {
        this.gameName = gameName;
        this.maxEntries = maxEntries;
        this.storageKey = `matrix_leaderboard_${gameName}`;
    }

    addScore(playerName, score, extraData = {}) {
        const scores = this.getScores();
        const newEntry = {
            name: playerName.substring(0, 20), // Limit name length
            score: score,
            date: new Date().toISOString(),
            ...extraData
        };
        
        scores.push(newEntry);
        scores.sort((a, b) => b.score - a.score);
        
        const topScores = scores.slice(0, this.maxEntries);
        localStorage.setItem(this.storageKey, JSON.stringify(topScores));
        
        return this.getRank(score);
    }

    getScores() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    getRank(score) {
        const scores = this.getScores();
        const rank = scores.findIndex(entry => entry.score <= score);
        return rank === -1 ? scores.length + 1 : rank + 1;
    }

    clearScores() {
        localStorage.removeItem(this.storageKey);
    }

    renderLeaderboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const scores = this.getScores();
        
        if (scores.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--theme-text, #0a0);">
                    No scores yet. Be the first!
                </div>
            `;
            return;
        }

        const html = `
            <div class="leaderboard-list">
                ${scores.map((entry, index) => `
                    <div class="leaderboard-entry ${index < 3 ? 'top-three' : ''}" data-rank="${index + 1}">
                        <span class="rank">${this.getRankIcon(index + 1)}</span>
                        <span class="player-name">${this.escapeHtml(entry.name)}</span>
                        <span class="score">${entry.score.toLocaleString()}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        container.innerHTML = html;
    }

    getRankIcon(rank) {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Player Name Modal System
class PlayerNameModal {
    constructor(onSubmit) {
        this.onSubmit = onSubmit;
        this.playerName = localStorage.getItem('matrix_player_name') || '';
        this.modal = null;
    }

    show() {
        if (this.playerName) {
            this.onSubmit(this.playerName);
            return;
        }

        this.createModal();
    }

    createModal() {
        // Remove existing modal if any
        const existing = document.getElementById('player-name-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'player-name-modal';
        modal.className = 'matrix-modal';
        modal.innerHTML = `
            <div class="matrix-modal-content">
                <h2>ENTER THE MATRIX</h2>
                <p>Identify yourself, Neo...</p>
                <input type="text" id="player-name-input" maxlength="20" placeholder="Your Name" autocomplete="off">
                <div class="modal-buttons">
                    <button id="submit-name-btn" class="modal-btn primary">JACK IN</button>
                </div>
                <p class="modal-hint">Your name will be saved for future sessions</p>
            </div>
        `;

        document.body.appendChild(modal);
        this.modal = modal;

        const input = document.getElementById('player-name-input');
        const submitBtn = document.getElementById('submit-name-btn');

        input.focus();

        const submit = () => {
            const name = input.value.trim();
            if (name.length >= 2) {
                this.playerName = name;
                localStorage.setItem('matrix_player_name', name);
                this.close();
                this.onSubmit(name);
            } else {
                input.style.borderColor = '#f00';
                setTimeout(() => {
                    input.style.borderColor = '';
                }, 500);
            }
        };

        submitBtn.addEventListener('click', submit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submit();
        });
    }

    close() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
    }
}

// Add CSS for modals and leaderboards
const style = document.createElement('style');
style.textContent = `
    .matrix-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: modalFadeIn 0.3s ease;
    }

    @keyframes modalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .matrix-modal-content {
        background: #000;
        border: 3px solid #0f0;
        border-radius: 10px;
        padding: 30px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
        text-align: center;
    }

    .matrix-modal-content h2 {
        color: #0f0;
        text-shadow: 0 0 10px #0f0;
        margin-bottom: 15px;
        font-family: 'Courier New', monospace;
        letter-spacing: 3px;
    }

    .matrix-modal-content p {
        color: #0a0;
        margin-bottom: 20px;
        font-family: 'Courier New', monospace;
    }

    .matrix-modal-content input {
        width: 100%;
        padding: 12px;
        font-size: 1.1rem;
        font-family: 'Courier New', monospace;
        background: #000;
        border: 2px solid #0f0;
        color: #0f0;
        text-align: center;
        border-radius: 5px;
        margin-bottom: 20px;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
    }

    .matrix-modal-content input:focus {
        outline: none;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
    }

    .modal-buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
    }

    .modal-btn {
        padding: 12px 24px;
        font-size: 1rem;
        font-family: 'Courier New', monospace;
        border: 2px solid #0f0;
        background: #000;
        color: #0f0;
        cursor: pointer;
        border-radius: 5px;
        transition: all 0.3s ease;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
    }

    .modal-btn:hover {
        background: #0f0;
        color: #000;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
    }

    .modal-hint {
        font-size: 0.8rem;
        opacity: 0.6;
        margin-top: 15px;
    }

    .leaderboard-list {
        max-height: 400px;
        overflow-y: auto;
    }

    .leaderboard-entry {
        display: grid;
        grid-template-columns: 50px 1fr 100px;
        align-items: center;
        padding: 12px;
        border: 1px solid rgba(0, 255, 0, 0.3);
        background: rgba(0, 20, 0, 0.3);
        margin-bottom: 8px;
        border-radius: 5px;
        font-family: 'Courier New', monospace;
        transition: all 0.3s ease;
    }

    .leaderboard-entry:hover {
        background: rgba(0, 40, 0, 0.5);
        border-color: #0f0;
        box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
    }

    .leaderboard-entry.top-three {
        border-width: 2px;
        background: rgba(0, 30, 0, 0.5);
    }

    .leaderboard-entry .rank {
        font-size: 1.3rem;
        text-align: center;
    }

    .leaderboard-entry .player-name {
        color: #0f0;
        text-shadow: 0 0 5px #0f0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .leaderboard-entry .score {
        color: #0ff;
        text-align: right;
        font-weight: bold;
        text-shadow: 0 0 5px #0ff;
    }

    @media (max-width: 768px) {
        .matrix-modal-content {
            padding: 20px;
        }

        .leaderboard-entry {
            grid-template-columns: 40px 1fr 80px;
            padding: 10px;
            font-size: 0.9rem;
        }
    }
`;
document.head.appendChild(style);

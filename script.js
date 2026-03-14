class Candy21Game {
    constructor() {
        this.namesDB = {
            ai: [
                { name: 'Маршмеллоу Мечтатель', avatar: '🍡' },
                { name: 'Карамельный Лорд', avatar: '🍬' },
                { name: 'Сахарная Фея', avatar: '🧚' },
                { name: 'Вафельный Рыцарь', avatar: '🧇' },
                { name: 'Шоколадный Барон', avatar: '🍫' },
                { name: 'Печеньковый Маг', avatar: '🍪' },
                { name: 'Мятный Принц', avatar: '🌿' },
                { name: 'Клубничный Зефир', avatar: '🍓' },
                { name: 'Медовый Соня', avatar: '🍯' },
                { name: 'Пудровая Звезда', avatar: '⭐' },
                { name: 'Леденцовый Бродяга', avatar: '🍭' },
                { name: 'Кексик Король', avatar: '🧁' },
                { name: 'Пончик Бандит', avatar: '🍩' },
                { name: 'Карамельный Ниндзя', avatar: '🍬' },
                { name: 'Сахарный Самурай', avatar: '⚔️' },
                { name: 'Молочный Шоколад', avatar: '🥛' },
                { name: 'Зефирный Облачко', avatar: '☁️' },
                { name: 'Ванильный Капитан', avatar: '🍦' },
                { name: 'Бисквитный Герой', avatar: '🍰' },
                { name: 'Карамельная Молния', avatar: '⚡' },
                { name: 'Пудровый Волшебник', avatar: '✨' },
                { name: 'Мармеладный Лис', avatar: '🦊' },
                { name: 'Конфетный Дракон', avatar: '🐉' },
                { name: 'Сиропный Мастер', avatar: '🍯' },
                { name: 'Тортовый Император', avatar: '🎂' },
                { name: 'Желейный Пират', avatar: '🏴‍☠️' },
                { name: 'Пастельный Единорог', avatar: '🦄' },
                { name: 'Кремовый Страж', avatar: '🛡️' },
                { name: 'Клубничный Капкейк', avatar: '🧁' },
                { name: 'Шоколадный Самородок', avatar: '🍫' },
                { name: 'Карамельный Лис', avatar: '🦊' },
                { name: 'Медовый Странник', avatar: '🍯' },
                { name: 'Вафельный Путник', avatar: '🧇' },
                { name: 'Сладкий Босс', avatar: '👑' },
                { name: 'Марципановый Маг', avatar: '✨' },
                { name: 'Какао Командир', avatar: '☕' },
                { name: 'Зефирный Король', avatar: '👑' },
                { name: 'Леденцовый Рыцарь', avatar: '🍭' },
                { name: 'Сахарный Фантом', avatar: '👻' },
                { name: 'Пончик Страж', avatar: '🍩' },
                { name: 'Кремовый Дракон', avatar: '🐉' },
                { name: 'Карамельный Искатель', avatar: '🧭' },
                { name: 'Желейный Волшебник', avatar: '🔮' },
                { name: 'Сладкий Самурай', avatar: '⚔️' },
                { name: 'Шоколадный Лорд', avatar: '🍫' },
                { name: 'Мармеладный Капитан', avatar: '🎖️' },
                { name: 'Зефирный Странник', avatar: '🌙' },
                { name: 'Сиропный Рыцарь', avatar: '🛡️' },
                { name: 'Печеньковый Король', avatar: '👑' },
                { name: 'Карамельная Звезда', avatar: '⭐' }
            ]
        };
        
        this.deck = [];
        this.players = [];
        this.humanPlayer = null;
        this.opponents = [];
        this.dealer = null;
        this.currentTurnIndex = 0;
        this.turnOrder = [];
        this.gameState = 'menu';
        this.playersReady = new Set();
        this.cardValues = {
            '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 
            'J': 2, 'Q': 3, 'K': 4, 'A': 11
        };
        
        this.currentResultMessage = null;

        // МУЗЫКА — сразу инициализируем
        this.music = document.getElementById('bg-music');
        this.isMusicOn = true;          // включена по умолчанию
        this.musicVolume = 0.4;         // 40% по умолчанию

        this.initDOM();
        this.setupEventListeners();

        // Запускаем музыку сразу в меню
        this.playMusic();
    }

    initDOM() {
        this.mainMenu = document.getElementById('main-menu');
        this.gameScreen = document.getElementById('game-screen');
        this.playerNameInput = document.getElementById('player-name');
        this.playerCountSpan = document.getElementById('player-count');
        this.decreaseBtn = document.getElementById('decrease-players');
        this.increaseBtn = document.getElementById('increase-players');
        this.startGameBtn = document.getElementById('start-game-btn');
        this.backToMenuBtn = document.getElementById('back-to-menu');
        this.gameMessage = document.getElementById('game-message');
        this.turnText = document.getElementById('turn-text');
        
        this.hitBtn = document.getElementById('hit-btn');
        this.standBtn = document.getElementById('stand-btn');
        this.revealBtn = document.getElementById('reveal-btn');
        this.restartBtn = document.getElementById('restart-game-btn');
        
        this.centerPlayerDiv = document.getElementById('center-player');
        this.opponentsCircle = document.getElementById('opponents-circle');

        // Слайдер громкости сразу влияет на музыку
        const volumeSlider = document.getElementById('volume-slider');
        const volumeValue = document.getElementById('volume-value');
        if (volumeSlider && volumeValue) {
            volumeSlider.value = this.musicVolume * 100;
            volumeValue.textContent = Math.round(this.musicVolume * 100) + '%';

            volumeSlider.addEventListener('input', (e) => {
                this.musicVolume = e.target.value / 100;
                if (this.music) this.music.volume = this.musicVolume;
                volumeValue.textContent = e.target.value + '%';
            });
        }

        this.musicBtn = null;
    }

    setupEventListeners() {
        this.decreaseBtn.addEventListener('click', () => this.changePlayerCount(-1));
        this.increaseBtn.addEventListener('click', () => this.changePlayerCount(1));
        this.startGameBtn.addEventListener('click', () => this.startGame());
        this.backToMenuBtn.addEventListener('click', () => this.showMenu());
        
        if (this.hitBtn) this.hitBtn.addEventListener('click', () => this.hit());
        if (this.standBtn) this.standBtn.addEventListener('click', () => this.stand());
        if (this.revealBtn) this.revealBtn.addEventListener('click', () => this.toggleReady());
        if (this.restartBtn) this.restartBtn.addEventListener('click', () => this.restartGame());
    }

    // МЕТОДЫ МУЗЫКИ
    playMusic() {
        if (this.music && this.isMusicOn) {
            this.music.volume = this.musicVolume;
            this.music.play().catch(err => {
                console.log("Автозапуск заблокирован:", err);
            });
        }
    }

    pauseMusic() {
        if (this.music) this.music.pause();
    }

    toggleMusic() {
        this.isMusicOn = !this.isMusicOn;
        if (this.isMusicOn) {
            this.playMusic();
            if (this.musicBtn) this.musicBtn.textContent = '🎵 Выкл';
        } else {
            this.pauseMusic();
            if (this.musicBtn) this.musicBtn.textContent = '🔇 Вкл';
        }
    }

    changePlayerCount(delta) {
        let current = parseInt(this.playerCountSpan.textContent);
        current = Math.max(2, Math.min(6, current + delta));
        this.playerCountSpan.textContent = current;
    }

    showMenu() {
        this.removeResultMessage();
        
        this.mainMenu.style.display = 'flex';
        this.gameScreen.style.display = 'none';
        this.gameState = 'menu';

        // Музыка остаётся играть в меню
        this.playMusic();
    }

    restartGame() {
        this.removeResultMessage();
        
        this.hitBtn.style.display = 'block';
        this.standBtn.style.display = 'block';
        this.revealBtn.style.display = 'block';
        this.restartBtn.style.display = 'none';
        
        this.hitBtn.disabled = true;
        this.standBtn.disabled = true;
        this.revealBtn.disabled = true;
        
        this.startGame();
    }

    startGame() {
        const totalPlayers = parseInt(this.playerCountSpan.textContent);
        const playerName = this.playerNameInput.value.trim() || 'Сахарный Король';
        
        this.createPlayers(totalPlayers, playerName);
        this.createDeck();
        
        this.mainMenu.style.display = 'none';
        this.gameScreen.style.display = 'block';
        
        this.centerPlayerDiv.innerHTML = '';
        this.opponentsCircle.innerHTML = '';
        
        const oldHuman = document.querySelector('.player-spot.human');
        if (oldHuman) oldHuman.remove();
        
        this.createGameLayout();
        this.startRound();

        // Создаём кнопку музыки
        const corner = document.querySelector('.menu-corner');
        if (corner && !this.musicBtn) {
            this.musicBtn = document.createElement('button');
            this.musicBtn.className = 'menu-btn';
            this.musicBtn.id = 'music-toggle-btn';
            this.musicBtn.textContent = this.isMusicOn ? '🎵 Выкл' : '🔇 Вкл';
            this.musicBtn.style.marginLeft = '12px';
            corner.appendChild(this.musicBtn);

            this.musicBtn.addEventListener('click', () => this.toggleMusic());
        }

        this.playMusic();
    }

    createPlayers(total, humanName) {
        this.players = [];
        this.opponents = [];
        
        this.dealer = {
            id: 'dealer',
            name: 'КРУПЬЕ',
            hand: [],
            isDealer: true,
            avatar: '🎩'
        };
        
        this.humanPlayer = {
            id: 0,
            name: humanName,
            hand: [],
            score: 0,
            isFinished: false,
            isAI: false,
            cardsRevealed: true,
            avatar: '🍭',
            ready: false,
            lastAction: 'waiting'
        };
        this.players.push(this.humanPlayer);
        
        const botCount = total - 1;
        const shuffledAI = [...this.namesDB.ai].sort(() => Math.random() - 0.5);
        
        for (let i = 1; i <= botCount; i++) {
            const ai = shuffledAI[(i - 1) % shuffledAI.length];
            
            const opponent = {
                id: i,
                name: ai.name,
                hand: [],
                score: 0,
                isFinished: false,
                isAI: true,
                cardsRevealed: false,
                avatar: ai.avatar,
                ready: false,
                lastAction: 'waiting'
            };
            this.players.push(opponent);
            this.opponents.push(opponent);
        }
        
        this.setTurnOrder();
    }
    
    setTurnOrder() {
        this.turnOrder = [0];
        for (let i = 1; i < this.players.length; i++) {
            this.turnOrder.push(i);
        }
    }

    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.deck = [];
        
        for (let suit of suits) {
            for (let value of values) {
                this.deck.push({
                    suit,
                    value,
                    isRed: suit === '♥' || suit === '♦'
                });
            }
        }
        this.shuffleDeck();
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    calculateHand(hand) {
        if (!hand || hand.length === 0) return 0;
        
        let sum = 0;
        let aces = 0;
        
        for (let card of hand) {
            if (card.value === 'A') {
                aces++;
                sum += 11;
            } else {
                sum += this.cardValues[card.value];
            }
        }
        
        while (sum > 21 && aces > 0) {
            sum -= 10;
            aces--;
        }
        
        return sum;
    }

    createGameLayout() {
        this.centerPlayerDiv.innerHTML = `
            <div class="dealer-spot">
                <div class="dealer-deck">
                    <div class="mini-deck">🃏</div>
                    <div class="deck-count-small">${this.deck.length}</div>
                </div>
            </div>
        `;
        
        const humanEl = document.createElement('div');
        humanEl.className = 'player-spot human';
        humanEl.innerHTML = `
            <div class="player-avatar">${this.humanPlayer.avatar}</div>
            <div class="player-cards" id="human-cards"></div>
            <div class="player-score">0</div>
        `;
        this.gameScreen.appendChild(humanEl);
        
        const positions = [
            { top: '4%', left: '50%' },
            { top: '22%', left: '10%' },
            { top: '22%', left: '90%' },
            { top: '90%', left: '8%' },
            { top: '90%', left: '92%' }
        ];
        
        this.opponentsCircle.innerHTML = '';
        
        this.opponents.forEach((opponent, index) => {
            if (index >= positions.length) return;
            
            const pos = positions[index];
            
            const opponentEl = document.createElement('div');
            opponentEl.className = 'opponent-spot';
            opponentEl.id = `opponent-${opponent.id}`;
            opponentEl.style.top = pos.top;
            opponentEl.style.left = pos.left;
            opponentEl.style.transform = 'translate(-50%, -50%)';
            
            opponentEl.innerHTML = `
                <div class="top-row">
                    <div class="player-avatar">${opponent.avatar}</div>
                    <div class="player-score">?</div>
                </div>
                <div class="player-name">${opponent.name}</div>
                <div class="player-cards" id="opponent-${opponent.id}-cards"></div>
                <div class="player-status">⏳ ЖДЁТ</div>
            `;
            
            this.opponentsCircle.appendChild(opponentEl);
        });
    }

    async startRound() {
        this.gameState = 'dealing';
        this.playersReady.clear();
        
        for (let player of this.players) {
            player.hand = [];
            player.score = 0;
            player.isFinished = false;
            player.ready = false;
            player.lastAction = 'waiting';
            if (player.isAI) player.cardsRevealed = false;
        }
        
        document.getElementById('human-cards').innerHTML = '';
        this.opponents.forEach(opponent => {
            const cardsContainer = document.getElementById(`opponent-${opponent.id}-cards`);
            if (cardsContainer) cardsContainer.innerHTML = '';
            
            // Сбрасываем статус на ЖДЁТ при начале раздачи
            this.updateOpponentStatus(opponent);
        });
        
        this.showMessage(`🍬 Крупье ловко тасует колоду и начинает раздачу... 🎴`);
        
        for (let i = 0; i < 2; i++) {
            for (let player of this.players) {
                await this.dealCardFromDealer(player, player === this.humanPlayer);
                await this.sleep(300);
            }
        }
        
        this.humanPlayer.score = this.calculateHand(this.humanPlayer.hand);
        this.updateHumanPlayerScore();
        
        // После раздачи у всех статус ЖДЁТ
        this.opponents.forEach(opponent => {
            opponent.lastAction = 'waiting';
            this.updateOpponentStatus(opponent);
        });
        
        this.gameState = 'playing';
        this.currentTurnIndex = 0;
        
        this.showMessage(`🎯 ${this.humanPlayer.name}, твой ход! У тебя ${this.humanPlayer.score} очков. Будешь брать ещё?`, 4000);
        this.updateTurnIndicator();
        this.updateButtons();
    }

    async dealCardFromDealer(target, isVisible = true) {
        if (this.deck.length === 0) {
            this.createDeck();
        }
        
        const card = this.deck.pop();
        card.isVisible = isVisible;
        
        this.updateDeckCount();
        
        const dealerEl = document.querySelector('.dealer-spot');
        if (!dealerEl) return;
        
        const dealerRect = dealerEl.getBoundingClientRect();
        const dealerX = dealerRect.left + dealerRect.width / 2;
        const dealerY = dealerRect.top + dealerRect.height / 2;
        
        let targetX, targetY;
        let targetElement;
        
        if (target === this.humanPlayer) {
            targetElement = document.getElementById('human-cards');
        } else {
            targetElement = document.getElementById(`opponent-${target.id}-cards`);
        }
        
        if (targetElement) {
            const targetRect = targetElement.getBoundingClientRect();
            targetX = targetRect.left + targetRect.width / 2;
            targetY = targetRect.top + targetRect.height / 2;
        } else {
            targetX = window.innerWidth / 2;
            targetY = window.innerHeight / 2;
        }
        
        const flyingCard = document.createElement('div');
        flyingCard.className = 'card flying';
        flyingCard.innerHTML = isVisible ? `${card.value}${card.suit}` : '?';
        flyingCard.style.left = dealerX + 'px';
        flyingCard.style.top = dealerY + 'px';
        flyingCard.style.transform = 'translate(-50%, -50%) rotate(0deg)';
        document.body.appendChild(flyingCard);
        
        target.hand.push(card);
        
        await this.sleep(10);
        
        flyingCard.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        flyingCard.style.left = targetX + 'px';
        flyingCard.style.top = targetY + 'px';
        flyingCard.style.transform = 'translate(-50%, -50%) rotate(360deg)';
        
        await this.sleep(400);
        flyingCard.remove();
        
        if (target === this.humanPlayer) {
            this.addCardToHuman(card);
        } else {
            this.addCardToOpponent(target, card);
        }
        
        if (target === this.humanPlayer || target.cardsRevealed) {
            target.score = this.calculateHand(target.hand);
            if (target === this.humanPlayer) {
                this.updateHumanPlayerScore();
            } else {
                this.updateOpponentScore(target);
            }
        }
        
        // Обновляем статус после получения карты (только для ИИ, если это их ход)
        if (target !== this.humanPlayer && target === this.players[this.turnOrder[this.currentTurnIndex]]) {
            target.lastAction = 'hit';
            this.updateOpponentStatus(target);
        }
    }

    addCardToHuman(card) {
        const cardsContainer = document.getElementById('human-cards');
        if (!cardsContainer) return;
        
        const cardEl = this.createCardElement(card);
        cardEl.classList.add('just-dealt');
        cardsContainer.appendChild(cardEl);
        
        setTimeout(() => {
            cardEl.classList.remove('just-dealt');
        }, 300);
    }

    addCardToOpponent(opponent, card) {
        const cardsContainer = document.getElementById(`opponent-${opponent.id}-cards`);
        if (!cardsContainer) return;
        
        const cardEl = this.createCardElement(card);
        cardEl.classList.add('just-dealt');
        cardsContainer.appendChild(cardEl);
        
        setTimeout(() => {
            cardEl.classList.remove('just-dealt');
        }, 300);
    }

    updateHumanPlayerScore() {
        const scoreEl = document.querySelector('.player-spot.human .player-score');
        if (scoreEl) {
            scoreEl.textContent = this.humanPlayer.score;
        }
    }

    updateOpponentScore(opponent) {
        const opponentEl = document.getElementById(`opponent-${opponent.id}`);
        if (!opponentEl) return;
        
        const scoreEl = opponentEl.querySelector('.player-score');
        if (scoreEl) {
            const displayScore = opponent.cardsRevealed ? opponent.score : '?';
            scoreEl.textContent = displayScore;
        }
    }

    updateOpponentStatus(opponent) {
        const opponentEl = document.getElementById(`opponent-${opponent.id}`);
        if (!opponentEl) return;
        
        const statusEl = opponentEl.querySelector('.player-status');
        if (!statusEl) return;
        
        let statusText = '⏳ ЖДЁТ';
        let statusClass = '';
        
        // Определяем текущего игрока
        const currentPlayer = this.players[this.turnOrder[this.currentTurnIndex]];
        
        // Если это ход данного противника и игра в процессе
        if (currentPlayer === opponent && this.gameState === 'playing' && !opponent.isFinished) {
            statusText = '🎯 ХОДИТ';
            statusClass = 'thinking';
        } 
        // Иначе показываем последнее действие
        else if (opponent.lastAction === 'hit') {
            statusText = '🃏 ВЗЯЛ';
            statusClass = 'hit';
        } else if (opponent.lastAction === 'stand' || opponent.isFinished) {
            statusText = '✋ ПАС';
            statusClass = 'stand';
        }
        // Иначе оставляем ЖДЁТ (waiting)
        
        statusEl.textContent = statusText;
        statusEl.className = `player-status ${statusClass}`;
    }

    updateDeckCount() {
        const deckCountEl = document.querySelector('.deck-count-small');
        if (deckCountEl) {
            deckCountEl.textContent = this.deck.length;
        }
    }

    updateTurnIndicator() {
        if (!this.turnText || this.players.length === 0) return;
        
        const currentPlayer = this.players[this.turnOrder[this.currentTurnIndex]];
        
        if (currentPlayer === this.humanPlayer) {
            this.turnText.textContent = `🍭 ${this.humanPlayer.name}, твой ход`;
            
            const humanSpot = document.querySelector('.player-spot.human');
            if (humanSpot) {
                humanSpot.classList.add('my-turn');
            }
        } else {
            this.turnText.textContent = `🎯 ХОДИТ: ${currentPlayer.name}`;
            
            const humanSpot = document.querySelector('.player-spot.human');
            if (humanSpot) {
                humanSpot.classList.remove('my-turn');
            }
        }
        
        document.querySelectorAll('.opponent-spot').forEach(el => {
            el.classList.remove('active-turn');
        });
        
        if (currentPlayer !== this.humanPlayer) {
            const activeOpponent = document.getElementById(`opponent-${currentPlayer.id}`);
            if (activeOpponent) {
                activeOpponent.classList.add('active-turn');
            }
        }
        
        // Обновляем статусы всех противников при смене хода
        this.opponents.forEach(opponent => {
            this.updateOpponentStatus(opponent);
        });
    }

    updateButtons() {
        if (!this.hitBtn || !this.standBtn || !this.revealBtn || !this.restartBtn) return;
        
        const currentPlayer = this.players[this.turnOrder[this.currentTurnIndex]];
        
        if (this.gameState === 'revealed') {
            this.hitBtn.style.display = 'none';
            this.standBtn.style.display = 'none';
            this.revealBtn.style.display = 'none';
            this.restartBtn.style.display = 'block';
            return;
        } 
        else if (this.gameState === 'waitingForReveal') {
            this.hitBtn.style.display = 'none';
            this.standBtn.style.display = 'none';
            this.revealBtn.style.display = 'block';
            this.restartBtn.style.display = 'none';
            this.revealBtn.disabled = false;
        } 
        else {
            // В начале игры и во время игры показываем только кнопки ВЗЯТЬ и ПАС
            this.hitBtn.style.display = 'block';
            this.standBtn.style.display = 'block';
            this.revealBtn.style.display = 'none';  // ЯВНО СКРЫВАЕМ КНОПКУ ОТКРЫТЬ
            this.restartBtn.style.display = 'none';
            
            if (this.gameState === 'playing' && currentPlayer === this.humanPlayer && !currentPlayer.isFinished) {
                this.hitBtn.disabled = false;
                this.standBtn.disabled = false;
            } else {
                this.hitBtn.disabled = true;
                this.standBtn.disabled = true;
            }
        }
    }

    async hit() {
        if (this.gameState !== 'playing') return;
        
        const currentPlayer = this.players[this.turnOrder[this.currentTurnIndex]];
        if (currentPlayer !== this.humanPlayer || currentPlayer.isFinished) return;
        
        this.showMessage(`🎴 ${this.humanPlayer.name}, ты берёшь одну карту...`, 1000);
        await this.sleep(400);
        
        await this.dealCardFromDealer(this.humanPlayer, true);
        
        if (this.humanPlayer.score > 21) {
            this.humanPlayer.isFinished = true;
            this.humanPlayer.lastAction = 'stand';
            this.showMessage(`❌ ${this.humanPlayer.name}, перебор! ${this.humanPlayer.score} очков.`, 2000);
            await this.sleep(1200);
            await this.nextTurn();
        } else if (this.humanPlayer.score === 21) {
            this.humanPlayer.isFinished = true;
            this.humanPlayer.lastAction = 'stand';
            this.showMessage(`✅ ${this.humanPlayer.name}, 21!`, 2000);
            await this.sleep(1200);
            await this.nextTurn();
        } else {
            this.humanPlayer.lastAction = 'hit';
            this.showMessage(`➡️ Ход переходит дальше.`, 1500);
            await this.sleep(1000);
            await this.nextTurn();
        }
    }

    async stand() {
        if (this.gameState !== 'playing') return;
        
        const currentPlayer = this.players[this.turnOrder[this.currentTurnIndex]];
        if (currentPlayer !== this.humanPlayer || currentPlayer.isFinished) return;
        
        this.humanPlayer.isFinished = true;
        this.humanPlayer.lastAction = 'stand';
        this.showMessage(`⏸️ ${this.humanPlayer.name}, ты останавливаешься на ${this.humanPlayer.score} очках.`, 2000);
        
        await this.sleep(1200);
        await this.nextTurn();
    }

    async nextTurn() {
        let nextIndex = -1;
        const startIndex = this.currentTurnIndex;
        
        for (let i = 1; i <= this.turnOrder.length; i++) {
            const checkIndex = (startIndex + i) % this.turnOrder.length;
            const player = this.players[this.turnOrder[checkIndex]];
            if (!player.isFinished) {
                nextIndex = checkIndex;
                break;
            }
        }
        
        if (nextIndex === -1) {
            this.startRevealPhase();
            return;
        }
        
        this.currentTurnIndex = nextIndex;
        const nextPlayer = this.players[this.turnOrder[this.currentTurnIndex]];
        
        this.updateTurnIndicator();
        this.updateButtons();
        
        if (nextPlayer.isAI) {
            await this.sleep(500);
            await this.aiTurn(nextPlayer);
        } else {
            this.showMessage(`🎯 ${this.humanPlayer.name}, твой ход! У тебя ${this.humanPlayer.score} очков.`, 3000);
        }
    }

    async aiTurn(aiPlayer) {
        const thoughts = [
            '🤔 анализирует ситуацию...', 
            '🧐 прищуривается...', 
            '📊 оценивает шансы...', 
            '💭 размышляет...',
            '😏 улыбается...',
            '🤨 хмурится...'
        ];
        const thought = thoughts[Math.floor(Math.random() * thoughts.length)];
        
        this.showMessage(`${aiPlayer.name} ${thought}`, 1500);
        await this.sleep(1500);
        
        const score = this.calculateHand(aiPlayer.hand);
        
        if (score < 16) {
            await this.dealCardFromDealer(aiPlayer, false);
            const newScore = this.calculateHand(aiPlayer.hand);
            
            if (newScore > 21) {
                aiPlayer.isFinished = true;
                aiPlayer.lastAction = 'stand';
                this.showMessage(`${aiPlayer.name} перебрал! ➡️`, 1500);
            } else {
                aiPlayer.lastAction = 'hit';
                this.showMessage(`${aiPlayer.name} взял карту ➡️`, 1500);
            }
        } else {
            aiPlayer.isFinished = true;
            aiPlayer.lastAction = 'stand';
            this.showMessage(`${aiPlayer.name} пасует ➡️`, 1500);
        }
        
        // Обновляем статус после действия
        this.updateOpponentStatus(aiPlayer);
        
        await this.sleep(1500);
        await this.nextTurn();
    }

    startRevealPhase() {
        this.gameState = 'waitingForReveal';
        
        this.showMessage('🎯 Все сделали выбор! Открываем карты! 🃏', 3000);
        
        this.turnText.textContent = '🃏 ОТКРОЙ КАРТЫ';
        const indicator = document.querySelector('.turn-indicator');
        if (indicator) {
            indicator.style.backgroundColor = '#d4a5ff';
        }
        
        for (let opponent of this.opponents) {
            opponent.ready = true;
        }
        
        this.updateButtons();
    }

    toggleReady() {
        if (this.gameState !== 'waitingForReveal') return;
        
        this.humanPlayer.ready = true;
        this.revealAllCards();
    }

    revealAllCards() {
        this.gameState = 'revealed';
        
        const indicator = document.querySelector('.turn-indicator');
        if (indicator) {
            indicator.style.backgroundColor = '#ffb5a5';
        }
        
        this.showMessage('📯 Барабанная дробь... Открываем карты!', 1500);
        
        for (let player of this.players) {
            player.cardsRevealed = true;
            player.hand.forEach(card => card.isVisible = true);
            player.score = this.calculateHand(player.hand);
            
            if (player === this.humanPlayer) {
                const cardsContainer = document.getElementById('human-cards');
                cardsContainer.innerHTML = '';
                player.hand.forEach(card => {
                    cardsContainer.appendChild(this.createCardElement(card));
                });
                this.updateHumanPlayerScore();
            } else {
                const cardsContainer = document.getElementById(`opponent-${player.id}-cards`);
                if (cardsContainer) {
                    cardsContainer.innerHTML = '';
                    player.hand.forEach(card => {
                        cardsContainer.appendChild(this.createCardElement(card));
                    });
                }
                this.updateOpponentScore(player);
            }
        }
        
        setTimeout(() => {
            document.querySelectorAll('.opponent-spot .player-score').forEach(el => {
                el.classList.add('revealed');
            });
        }, 100);
        
        setTimeout(() => {
            this.determineWinner();
        }, 1000);
        
        this.updateButtons();
    }

    determineWinner() {
        const human = this.humanPlayer;
        
        // Перебор у тебя — сразу показываем, кто выиграл
        if (human.score > 21) {
            let maxScore = 0;
            let winners = [];
            
            for (let opponent of this.opponents) {
                if (opponent.score <= 21) {
                    if (opponent.score > maxScore) {
                        maxScore = opponent.score;
                        winners = [opponent];
                    } else if (opponent.score === maxScore) {
                        winners.push(opponent);
                    }
                }
            }
            
            if (winners.length === 0) {
                // Никто не выиграл (все перебрали) — редкий случай
                this.showResultPersistent('🤯 НИКТО НЕ ВЫИГРАЛ!', 'Все перебрали...', '#cccccc', '#999999');
            } else if (winners.length === 1) {
                const winner = winners[0];
                this.showResultPersistent('💔 ТЫ ПРОИГРАЛ', `${winner.avatar} ${winner.name} победил с ${winner.score} очками`, '#ff9fa6', '#ff7f8a');
            } else {
                const names = winners.map(w => `${w.avatar} ${w.name}`).join(', ');
                this.showResultPersistent('💔 ТЫ ПРОИГРАЛ', `Ничья между: ${names} (${maxScore} очков)`, '#ff9fa6', '#ff7f8a');
            }
            return;
        }
        
        // Нормальная проверка
        let winners = [];
        let maxScore = human.score;
        
        for (let opponent of this.opponents) {
            if (opponent.score <= 21) {
                if (opponent.score > maxScore) {
                    maxScore = opponent.score;
                    winners = [opponent];
                } else if (opponent.score === maxScore) {
                    winners.push(opponent);
                }
            }
        }
        
        if (maxScore === human.score && human.score <= 21) {
            if (winners.length === 0) {
                // Только ты победил
                this.showResultPersistent('🏆 ПОБЕДА!', `${human.name}, ты выиграл с ${human.score} очками!`, '#ffd700', '#ffaa00');
                this.createConfettiEffect();
            } else {
                // Ничья с кем-то
                const names = winners.map(w => `${w.avatar} ${w.name}`).join(', ');
                this.showResultPersistent('🤝 НИЧЬЯ!', `${human.name}, ${names} — все с ${human.score} очками`, '#a5d6ff', '#7fa6ff');
            }
        } else {
            // Кто-то из ботов выиграл
            const winner = winners[0];
            if (winners.length === 1) {
                this.showResultPersistent('💔 ПОРАЖЕНИЕ', `${winner.avatar} ${winner.name} победил с ${winner.score} очками`, '#ff9fa6', '#ff7f8a');
            } else {
                const names = winners.map(w => `${w.avatar} ${w.name}`).join(', ');
                this.showResultPersistent('💔 ПОРАЖЕНИЕ', `Ничья между: ${names} (${maxScore} очков)`, '#ff9fa6', '#ff7f8a');
            }
        }
    }
    
    showResultPersistent(mainText, subText, color1, color2) {
        this.removeResultMessage();
        
        const resultDiv = document.createElement('div');
        resultDiv.className = 'winner-message persistent';
        resultDiv.style.background = `linear-gradient(145deg, ${color1}, ${color2})`;
        resultDiv.style.cursor = 'pointer';
        resultDiv.style.fontSize = '2.4rem';          // чуть крупнее
        resultDiv.style.padding = '25px 50px';        // больше места
        resultDiv.style.maxWidth = '90%';             // чтобы длинные имена помещались
        resultDiv.style.whiteSpace = 'normal';        // перенос строк
        resultDiv.style.lineHeight = '1.4';
        
        resultDiv.innerHTML = `
            ${mainText}<br>
            <span class="winner-sub" style="font-size: 1.5rem; display: block; margin-top: 12px;">${subText}</span>
        `;
        
        document.body.appendChild(resultDiv);
        this.currentResultMessage = resultDiv;
        
        // Конфетти только при победе
        if (mainText.includes('ПОБЕДА') || mainText.includes('🏆')) {
            this.createConfettiEffect();
        }
    }

    removeResultMessage() {
        if (this.currentResultMessage) {
            this.currentResultMessage.remove();
            this.currentResultMessage = null;
        }
    }

    createConfettiEffect() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createConfetti();
            }, i * 80);
        }
    }

    createConfetti() {
        const colors = ['#ffd700', '#ffaa00', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.animationDuration = Math.random() * 2.5 + 1.5 + 's';
        confetti.style.animationDelay = Math.random() * 1.5 + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }

    showMessage(text, duration = 3000) {
        if (!this.gameMessage) return;
        
        this.gameMessage.textContent = text;
        this.gameMessage.style.display = 'block';
        
        setTimeout(() => {
            this.gameMessage.style.display = 'none';
        }, duration);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.isRed ? 'red' : 'black'} ${!card.isVisible ? 'hidden' : ''}`;
        
        if (card.isVisible) {
            cardDiv.innerHTML = `
                <span class="card-value">${card.value}</span>
                <span class="card-suit">${card.suit}</span>
            `;
        }
        
        return cardDiv;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.game = new Candy21Game();
});
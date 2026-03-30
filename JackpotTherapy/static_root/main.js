/* ============================================================
   JACKPOT THERAPY — main.js
   Fully rebuilt: screen-based navigation, all game logic,
   win effects, jackpot banner, lose screen restart, theme fix.
   ============================================================ */

// ── Audio ──────────────────────────────────────────────────────
const music       = document.getElementById('music');
const clickSound  = document.getElementById('clickSound');
const spinSound   = document.getElementById('spinSound');
const jackpotSound= document.getElementById('jackpotSound');

// ── Screens ────────────────────────────────────────────────────
const screenTitle         = document.getElementById('screen-title');
const screenProfileSelect = document.getElementById('screen-profile-select');
const screenAvatarSelect  = document.getElementById('screen-avatar-select');
const screenNameEntry     = document.getElementById('screen-name-entry');
const screenMain          = document.getElementById('screen-main');

// ── Universal ──────────────────────────────────────────────────
const background        = document.getElementById('background');
const backOrQuitButton  = document.getElementById('backOrQuitButton');

// ── Title screen ───────────────────────────────────────────────
const startButton       = document.getElementById('startButton');

// ── Profile select ─────────────────────────────────────────────
const profileGrid       = document.getElementById('profileGrid');
const profileText       = document.getElementById('profileText');
const selectButton      = document.getElementById('selectButton');
const createNewProfile  = document.getElementById('createNewProfile');

// ── Avatar select ──────────────────────────────────────────────
const avatarSelectMid   = document.getElementById('avatarSelectMid');
const avatarSelectLeft  = document.getElementById('avatarSelectLeft');
const avatarSelectRight = document.getElementById('avatarSelectRight');
const selectLeftButton  = document.getElementById('selectLeftButton');
const selectRightButton = document.getElementById('selectRightButton');
const confirmAvatarBtn  = document.getElementById('confirmAvatarButton');

// ── Name entry ─────────────────────────────────────────────────
const nameInput         = document.getElementById('nameInput');
const confirmNameBtn    = document.getElementById('confirmNameButton');

// ── HUD ────────────────────────────────────────────────────────
const hudAvatar         = document.getElementById('hudAvatar');
const profileNameEl     = document.getElementById('profileName');
const balanceEl         = document.getElementById('balance');
const debtElement       = document.getElementById('debtElement');
const debtNumEl         = document.getElementById('debtNum');

// ── Slot reels ─────────────────────────────────────────────────
const slot1             = document.getElementById('slot1');
const slot2             = document.getElementById('slot2');
const slot3             = document.getElementById('slot3');
const reel1             = document.getElementById('reel1');
const reel2             = document.getElementById('reel2');
const reel3             = document.getElementById('reel3');

// ── Game controls ──────────────────────────────────────────────
const spinButton        = document.getElementById('spinButton');
const betButton         = document.getElementById('betButton');
const betAmountEl       = document.getElementById('betAmount');
const loanButton        = document.getElementById('loanButton');
const amountOptions     = document.getElementById('amountOptions');
const bet10             = document.getElementById('bet10');
const bet100            = document.getElementById('bet100');
const bet1000           = document.getElementById('bet1000');
const betAll            = document.getElementById('betAll');

// ── Effects ────────────────────────────────────────────────────
const winFlash          = document.getElementById('winFlash');
const jackpotBanner     = document.getElementById('jackpotBanner');

// ── Lose screen ────────────────────────────────────────────────
const loseScreen        = document.getElementById('loseScreen');
const loseRestartButton = document.getElementById('loseRestartButton');
const loseQuitButton    = document.getElementById('loseQuitButton');

// ── Theme ──────────────────────────────────────────────────────
const themeButton       = document.getElementById('themeButton');
const themeManager      = document.getElementById('themeManager');
const themePurple       = document.getElementById('themePurple');
const themeBlue         = document.getElementById('themeBlue');
const themeDark         = document.getElementById('themeDark');
const themeGold         = document.getElementById('themeGold');
const closeThemeManager = document.getElementById('closeThemeManager');

// ── Static Root ────────────────────────────────────────────────
const staticRoot        = document.body.dataset.staticRoot;

// ── Game State ─────────────────────────────────────────────────
let currentScreen    = 'title';
let profilePic       = 1;
let profileName      = '';
let balance          = 1000;
let currentBet       = 100;
let debt             = 0;
let slotArray        = [1, 1, 1];
let isSpinning       = false;
let brokeCheckInterval = null;

// profileMatrix: [{name, avatar, balance}]
let profileMatrix    = [];
let selectedProfileIndex = -1; // -1 = nothing, 0 = createNew, 1+ = saved profile

// ── Helpers ────────────────────────────────────────────────────

function showScreen(id) {
    [screenTitle, screenProfileSelect, screenAvatarSelect, screenNameEntry, screenMain]
        .forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'flex';
}

function setBackground(src) {
    background.style.opacity = '0';
    setTimeout(() => {
        background.setAttribute('src', src);
        background.style.opacity = '1';
    }, 200);
}

function formatMoney(n) {
    return '$' + Number(n).toLocaleString();
}

function updateBalanceDisplay() {
    balanceEl.textContent = formatMoney(balance);
    balanceEl.classList.remove('balance-pop');
    void balanceEl.offsetWidth; // reflow to restart animation
    balanceEl.classList.add('balance-pop');
    balanceEl.classList.toggle('losing', balance < 200);
}

function updateDebtDisplay() {
    debtNumEl.textContent = debt;
    debtElement.style.display = debt > 0 ? 'block' : 'none';
}

function updateSpinButtonState() {
    const bet = currentBet === 'ALL IN' ? balance : currentBet;
    if (balance > 0 && balance >= bet && !isSpinning) {
        spinButton.className = 'open spin-btn';
        spinButton.disabled = false;
    } else {
        spinButton.className = 'disabled spin-btn';
        spinButton.disabled = true;
    }
}

function updateLoanButtonState() {
    if (debt > 0 && balance >= debt) {
        loanButton.style.display = '';
        loanButton.textContent = 'Pay Back';
        loanButton.className = 'open loan-btn';
    } else if (debt === 0) {
        loanButton.style.display = '';
        loanButton.textContent = 'Loan';
        loanButton.className = 'open loan-btn';
    } else {
        loanButton.style.display = 'none';
    }
}

// ── Button click helper (press/release animation + sound) ──────
function buttonClick(button, action) {
    button.classList.add('closed');
    button.classList.remove('open');
    playSfx(clickSound, staticRoot + 'sounds/click.mp3');
    
    const onUp = () => {
        button.classList.remove('closed');
        button.classList.add('open');
        playSfx(clickSound, staticRoot + 'sounds/unclick.mp3');
        action();
        document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mouseup', onUp);
}

function playSfx(audioEl, src) {
    audioEl.src = src;
    audioEl.currentTime = 0;
    audioEl.play().catch(() => {});
}

// ── Music ──────────────────────────────────────────────────────
function startMusic() {
    if (music.paused) {
        music.volume = 0.45;
        music.play().catch(() => {});
    }
}

// ============================================================
//  NAVIGATION
// ============================================================

// Title → Profile Select
startButton.onmousedown = function () {
    buttonClick(startButton, () => {
        startMusic();
        goToProfileSelect();
    });
};

function goToProfileSelect() {
    currentScreen = 'profile-select';
    selectedProfileIndex = -1;
    selectButton.style.display = 'none';
    backOrQuitButton.textContent = 'Back';
    setBackground(staticRoot + 'images/ProfileScreen.jpg');
    rebuildProfileGrid();
    showScreen('screen-profile-select');
}

function rebuildProfileGrid() {
    // Clear existing saved cards (keep createNew)
    Array.from(profileGrid.querySelectorAll('.saved-profile-card')).forEach(c => c.remove());

    profileMatrix.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'profile-card saved-profile-card';
        card.dataset.index = i + 1;
        card.innerHTML = `
            <img src="${staticRoot}images/Avatars/${p.avatar}.png" alt="${p.name}">
            <span>${p.name}</span>
        `;
        card.onmousedown = () => {
            clickSound.src = staticRoot + 'sounds/click.mp3';
            clickSound.currentTime = 0;
            clickSound.play().catch(()=>{});
            document.querySelectorAll('.profile-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedProfileIndex = i + 1;
            selectButton.style.display = '';
        };
        profileGrid.appendChild(card);
    });
}

// Profile card — createNew
createNewProfile.onmousedown = function () {
    playSfx(clickSound, staticRoot + 'sounds/click.mp3');
    document.querySelectorAll('.profile-card').forEach(c => c.classList.remove('selected'));
    createNewProfile.classList.add('selected');
    selectedProfileIndex = 0;
    selectButton.style.display = '';
    const onUp = () => { playSfx(clickSound, staticRoot + 'sounds/unclick.mp3'); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mouseup', onUp);
};

// Profile select → Avatar select (new profile) OR main (existing)
selectButton.onmousedown = function () {
    buttonClick(selectButton, () => {
        if (selectedProfileIndex === 0) {
            // New profile: go to avatar select
            goToAvatarSelect();
        } else if (selectedProfileIndex > 0) {
            // Load saved profile
            const p = profileMatrix[selectedProfileIndex - 1];
            profileName = p.name;
            profilePic  = p.avatar;
            balance     = p.balance;
            debt        = p.debt || 0;
            goToMainScreen();
        }
    });
};

// Avatar Select
function goToAvatarSelect() {
    currentScreen = 'profile-avatar';
    profilePic = 1;
    updateAvatarCarousel();
    backOrQuitButton.textContent = 'Back';
    showScreen('screen-avatar-select');
}

function updateAvatarCarousel() {
    const total = 10;
    const left  = profilePic === 1 ? total : profilePic - 1;
    const right = profilePic === total ? 1 : profilePic + 1;
    avatarSelectLeft.src  = staticRoot + `images/Avatars/${left}.png`;
    avatarSelectMid.src   = staticRoot + `images/Avatars/${profilePic}.png`;
    avatarSelectRight.src = staticRoot + `images/Avatars/${right}.png`;
}

selectLeftButton.onmousedown = function () {
    buttonClick(selectLeftButton, () => {
        profilePic = profilePic === 1 ? 10 : profilePic - 1;
        updateAvatarCarousel();
    });
};

selectRightButton.onmousedown = function () {
    buttonClick(selectRightButton, () => {
        profilePic = profilePic === 10 ? 1 : profilePic + 1;
        updateAvatarCarousel();
    });
};

confirmAvatarBtn.onmousedown = function () {
    buttonClick(confirmAvatarBtn, () => {
        goToNameEntry();
    });
};

// Name Entry
function goToNameEntry() {
    currentScreen = 'profile-name';
    nameInput.value = '';
    backOrQuitButton.textContent = 'Back';
    showScreen('screen-name-entry');
    setTimeout(() => nameInput.focus(), 100);
}

confirmNameBtn.onmousedown = function () {
    buttonClick(confirmNameBtn, () => {
        const enteredName = nameInput.value.trim();
        if (!enteredName) {
            nameInput.style.borderColor = '#f00';
            nameInput.style.boxShadow = '0 0 20px #f00';
            setTimeout(() => {
                nameInput.style.borderColor = '';
                nameInput.style.boxShadow = '';
            }, 800);
            return;
        }
        profileName = enteredName;
        balance = 1000;
        debt = 0;
        // Save new profile
        profileMatrix.push({ name: profileName, avatar: profilePic, balance: 1000, debt: 0 });
        goToMainScreen();
    });
};

nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmNameBtn.onmousedown && confirmNameBtn.dispatchEvent(new MouseEvent('mousedown'));
});

// Main Screen
function goToMainScreen() {
    currentScreen = 'main';
    backOrQuitButton.textContent = 'Save & Quit';
    setBackground(staticRoot + 'images/MainScreen.jpg');

    // Update HUD
    profileNameEl.textContent = profileName;
    hudAvatar.src = staticRoot + `images/Avatars/${profilePic}.png`;
    updateBalanceDisplay();
    updateDebtDisplay();
    updateSpinButtonState();
    updateLoanButtonState();

    // Reset bet
    currentBet = 100;
    betAmountEl.textContent = '100';
    betButton.innerHTML = '↓ Bet: $<strong id="betAmount">100</strong> ↓';

    amountOptions.style.display = 'none';
    themeManager.style.display = 'none';
    loseScreen.style.display = 'none';

    showScreen('screen-main');
    startBrokeCheck();
}

// ── Back / Quit ────────────────────────────────────────────────
backOrQuitButton.onmousedown = function () {
    buttonClick(backOrQuitButton, () => {
        if (currentScreen === 'title') {
            window.close();
        } else if (currentScreen === 'main') {
            // Save current profile state
            const idx = profileMatrix.findIndex(p => p.name === profileName && p.avatar === profilePic);
            if (idx >= 0) { profileMatrix[idx].balance = balance; profileMatrix[idx].debt = debt; }
            stopBrokeCheck();
            spinSound.pause();
            resetToTitle();
        } else if (currentScreen === 'profile-select') {
            resetToTitle();
        } else if (currentScreen === 'profile-avatar') {
            goToProfileSelect();
        } else if (currentScreen === 'profile-name') {
            goToAvatarSelect();
        }
    });
};

function resetToTitle() {
    currentScreen = 'title';
    backOrQuitButton.textContent = 'Quit';
    setBackground(staticRoot + 'images/TitleScreen.jpg');
    showScreen('screen-title');
    startMusic();
}

// ============================================================
//  BETTING
// ============================================================
betButton.onmousedown = function () {
    buttonClick(betButton, () => {
        amountOptions.style.display = amountOptions.style.display === 'none' ? '' : 'none';
        const arrow = amountOptions.style.display === 'none' ? '↓' : '↑';
        betButton.innerHTML = `${arrow} Bet: $<strong id="betAmount">${currentBet === 'ALL IN' ? 'ALL IN' : currentBet}</strong> ${arrow}`;
    });
};

function selectBet(amount) {
    currentBet = amount;
    amountOptions.style.display = 'none';
    const label = amount === 'ALL IN' ? 'ALL IN' : amount.toLocaleString();
    betButton.innerHTML = `↓ Bet: $<strong id="betAmount">${label}</strong> ↓`;
    updateSpinButtonState();
}

bet10.onmousedown   = function () { buttonClick(bet10,   () => selectBet(10));      };
bet100.onmousedown  = function () { buttonClick(bet100,  () => selectBet(100));     };
bet1000.onmousedown = function () { buttonClick(bet1000, () => selectBet(1000));    };
betAll.onmousedown  = function () { buttonClick(betAll,  () => selectBet('ALL IN')); };

// ============================================================
//  LOANS
// ============================================================
loanButton.onmousedown = function () {
    buttonClick(loanButton, () => {
        if (loanButton.textContent.includes('Pay Back')) {
            balance -= debt;
            debt = 0;
            updateBalanceDisplay();
            updateDebtDisplay();
            updateLoanButtonState();
            updateSpinButtonState();
        } else {
            balance += 500;
            debt    += 750;
            updateBalanceDisplay();
            updateDebtDisplay();
            updateLoanButtonState();
            updateSpinButtonState();
        }
    });
};

// ============================================================
//  SPINNING
// ============================================================
spinButton.onmousedown = function () {
    if (spinButton.classList.contains('disabled') || isSpinning) return;
    buttonClick(spinButton, () => startSpin());
};

function startSpin() {
    const bet = currentBet === 'ALL IN' ? balance : currentBet;
    if (balance < bet || bet <= 0) return;

    isSpinning = true;
    balance -= bet;
    updateBalanceDisplay();

    // Lock UI
    spinButton.className = 'disabled spin-btn';
    spinButton.disabled = true;
    betButton.style.display = 'none';
    loanButton.style.display = 'none';
    backOrQuitButton.style.display = 'none';
    amountOptions.style.display = 'none';

    // Reel spin animation
    [reel1, reel2, reel3].forEach(r => r.classList.add('spinning'));

    spinSound.currentTime = 0;
    spinSound.play().catch(() => {});

    const spinInterval = setInterval(() => {
        slotArray[0] = Math.floor(Math.random() * 10) + 1;
        slotArray[1] = Math.floor(Math.random() * 10) + 1;
        slotArray[2] = Math.floor(Math.random() * 10) + 1;
        slot1.src = staticRoot + `images/Icons/${slotArray[0]}.png`;
        slot2.src = staticRoot + `images/Icons/${slotArray[1]}.png`;
        slot3.src = staticRoot + `images/Icons/${slotArray[2]}.png`;
    }, 100);

    setTimeout(() => {
        clearInterval(spinInterval);
        spinSound.pause();
        [reel1, reel2, reel3].forEach(r => r.classList.remove('spinning'));
        isSpinning = false;

        // Evaluate result
        evaluateSpin(bet);

        // Restore UI
        betButton.style.display = '';
        backOrQuitButton.style.display = '';
        updateLoanButtonState();
        updateSpinButtonState();

        if (balance > 0) brokeCheck();
    }, 4000);
}

function evaluateSpin(bet) {
    const [a, b, c] = slotArray;
    const isJackpot  = a === b && b === c;
    const isTwoOfKind = !isJackpot && (a === b || b === c || a === c);

    if (isJackpot) {
        balance += bet * 10;
        showJackpotBanner('🎰 JACKPOT! 🎰');
        showWinFlash();
        highlightReels([reel1, reel2, reel3]);
        jackpotSound.currentTime = 0;
        jackpotSound.play().catch(() => {});
    } else if (isTwoOfKind) {
        balance += bet * 2;
        showJackpotBanner('🎉 Two of a Kind!');
        showWinFlash();
        // highlight matching reels
        const winners = [];
        if (a === b) { winners.push(reel1, reel2); }
        if (b === c) { winners.push(reel2, reel3); }
        if (a === c) { winners.push(reel1, reel3); }
        highlightReels([...new Set(winners)]);
        jackpotSound.currentTime = 0;
        jackpotSound.play().catch(() => {});
    }

    updateBalanceDisplay();
    brokeCheck();
}

function showWinFlash() {
    winFlash.style.display = 'block';
    winFlash.style.animation = 'none';
    void winFlash.offsetWidth;
    winFlash.style.animation = 'flashAnim 0.8s ease forwards';
    setTimeout(() => { winFlash.style.display = 'none'; }, 900);
}

function showJackpotBanner(text) {
    jackpotBanner.textContent = text;
    jackpotBanner.style.display = 'block';
    jackpotBanner.style.animation = 'none';
    void jackpotBanner.offsetWidth;
    jackpotBanner.style.animation = 'jackpotPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
    setTimeout(() => { jackpotBanner.style.display = 'none'; }, 2200);
}

function highlightReels(reels) {
    reels.forEach(r => {
        r.classList.add('win-highlight');
        setTimeout(() => r.classList.remove('win-highlight'), 1600);
    });
}

// ============================================================
//  BROKE CHECK
// ============================================================
function startBrokeCheck() {
    stopBrokeCheck();
    brokeCheckInterval = setInterval(brokeCheck, 500);
}

function stopBrokeCheck() {
    if (brokeCheckInterval) { clearInterval(brokeCheckInterval); brokeCheckInterval = null; }
}

function brokeCheck() {
    if (currentScreen !== 'main' || isSpinning) return;

    updateSpinButtonState();
    updateLoanButtonState();

    if (balance <= 0 && debt > 0) {
        stopBrokeCheck();
        showLoseScreen();
    }
}

// ============================================================
//  LOSE SCREEN
// ============================================================
function showLoseScreen() {
    loseScreen.style.display = 'flex';
    music.pause();
}

loseRestartButton.onmousedown = function () {
    buttonClick(loseRestartButton, () => {
        loseScreen.style.display = 'none';
        // Reset current profile
        balance = 1000;
        debt = 0;
        const idx = profileMatrix.findIndex(p => p.name === profileName && p.avatar === profilePic);
        if (idx >= 0) { profileMatrix[idx].balance = 1000; profileMatrix[idx].debt = 0; }
        goToMainScreen();
        startMusic();
    });
};

loseQuitButton.onmousedown = function () {
    buttonClick(loseQuitButton, () => {
        loseScreen.style.display = 'none';
        stopBrokeCheck();
        balance = 1000;
        debt = 0;
        resetToTitle();
        startMusic();
    });
};

// ============================================================
//  THEME MANAGER
// ============================================================
themeButton.onmousedown = function () {
    buttonClick(themeButton, () => {
        themeManager.style.display = themeManager.style.display === 'none' ? '' : 'none';
    });
};

closeThemeManager.onmousedown = function () {
    buttonClick(closeThemeManager, () => { themeManager.style.display = 'none'; });
};

function applyTheme(name) {
    document.body.classList.remove('theme-blue', 'theme-dark', 'theme-gold', 'theme-purple');
    if (name) document.body.classList.add(name);
}

themePurple.onmousedown = function () { buttonClick(themePurple, () => applyTheme('theme-purple')); };
themeBlue.onmousedown   = function () { buttonClick(themeBlue,   () => applyTheme('theme-blue')); };
themeDark.onmousedown   = function () { buttonClick(themeDark,   () => applyTheme('theme-dark')); };
themeGold.onmousedown   = function () { buttonClick(themeGold,   () => applyTheme('theme-gold')); };

// ============================================================
//  INIT
// ============================================================
window.addEventListener('load', () => {
    // Music starts on first user interaction (browser policy)
    document.addEventListener('click', startMusic, { once: true });
    document.addEventListener('mousedown', startMusic, { once: true });
});
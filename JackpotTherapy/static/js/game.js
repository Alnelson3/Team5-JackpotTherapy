// ── Audio ──────────────────────────────────────────────────────
const music        = document.getElementById('music');
const clickSound   = document.getElementById('clickSound');
const spinSound    = document.getElementById('spinSound');
const jackpotSound = document.getElementById('jackpotSound');

// ── HUD ────────────────────────────────────────────────────────
const balanceEl    = document.getElementById('balance');
const debtElement  = document.getElementById('debtElement');
const debtNumEl    = document.getElementById('debtNum');
const hudAvatar    = document.getElementById('hudAvatar');

// ── Reels ──────────────────────────────────────────────────────
const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');

// ── Controls ───────────────────────────────────────────────────
const spinButton   = document.getElementById('spinButton');
const betButton    = document.getElementById('betButton');
const betAmountEl  = document.getElementById('betAmount');
const loanButton   = document.getElementById('loanButton');
const amountOptions= document.getElementById('amountOptions');
const quitButton   = document.getElementById('quitButton');

// ── Effects ────────────────────────────────────────────────────
const winFlash     = document.getElementById('winFlash');
const jackpotBanner= document.getElementById('jackpotBanner');

// ── Lose screen ────────────────────────────────────────────────
const loseScreen       = document.getElementById('loseScreen');
const loseRestartButton= document.getElementById('loseRestartButton');
const loseExitButton   = document.getElementById('loseExitButton');

// ── Theme ──────────────────────────────────────────────────────
const themeButton      = document.getElementById('themeButton');
const themeManager     = document.getElementById('themeManager');

// ── State ──────────────────────────────────────────────────────
let balance    = DJANGO_DATA.balance;
let debt       = DJANGO_DATA.debt;
let currentBet = 100;
let isSpinning = false;
let brokeCheckInterval = null;
const BASE    = DJANGO_DATA.staticBase;
const CSRF    = DJANGO_DATA.csrfToken;

// ── Helpers ────────────────────────────────────────────────────
function fmt(n) {
    return '$' + Number(n).toLocaleString();
}

function updateBalanceDisplay() {
    balanceEl.textContent = fmt(balance);
    balanceEl.classList.remove('balance-pop');
    void balanceEl.offsetWidth;
    balanceEl.classList.add('balance-pop');
    balanceEl.classList.toggle('losing', balance < 200);
}

function updateDebtDisplay() {
    debtNumEl.textContent = debt;
    debtElement.style.display = debt > 0 ? 'block' : 'none';
}

function updateSpinButton() {
    const bet = currentBet === 'ALL IN' ? balance : currentBet;
    const canSpin = balance > 0 && balance >= bet && !isSpinning;
    spinButton.disabled = !canSpin;
    spinButton.classList.toggle('disabled', !canSpin);
}

function updateLoanButton() {
    if (debt > 0 && balance >= debt) {
        loanButton.style.display = '';
        loanButton.textContent = 'Pay Back';
    } else if (debt === 0) {
        loanButton.style.display = '';
        loanButton.textContent = 'Loan';
    } else {
        loanButton.style.display = 'none';
    }
}

function playSfx(el, src) {
    el.src = src;
    el.currentTime = 0;
    el.play().catch(() => {});
}

function startMusic() {
    if (music && music.paused) {
        music.volume = 0.45;
        music.play().catch(() => {});
    }
}

// ── API helper ─────────────────────────────────────────────────
async function apiPost(url, body) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': CSRF },
        body: JSON.stringify(body),
    });
    return res.json();
}

// ============================================================
//  SPINNING
// ============================================================

spinButton.addEventListener('click', () => {
    if (spinButton.disabled || isSpinning) return;
    startSpin();
});

async function startSpin() {
    const bet = currentBet === 'ALL IN' ? balance : currentBet;
    if (balance < bet || bet <= 0) return;

    isSpinning = true;
    playSfx(clickSound, BASE + 'sounds/click.mp3');

    // Lock UI
    spinButton.disabled = true;
    spinButton.classList.add('disabled');
    betButton.style.display = 'none';
    loanButton.style.display = 'none';
    quitButton.style.display = 'none';
    amountOptions.style.display = 'none';

    // Animate reels
    [reel1, reel2, reel3].forEach(r => r.classList.add('spinning'));
    if (spinSound) { spinSound.currentTime = 0; spinSound.play().catch(() => {}); }

    // Random icons during spin
    const spinInterval = setInterval(() => {
        slot1.src = BASE + `images/Icons/${Math.floor(Math.random()*10)+1}.png`;
        slot2.src = BASE + `images/Icons/${Math.floor(Math.random()*10)+1}.png`;
        slot3.src = BASE + `images/Icons/${Math.floor(Math.random()*10)+1}.png`;
    }, 100);

    // Call Django spin API
    const data = await apiPost(DJANGO_DATA.spinUrl, { bet: currentBet });

    // Wait 4s for visual effect
    await new Promise(r => setTimeout(r, 4000));

    clearInterval(spinInterval);
    if (spinSound) spinSound.pause();
    [reel1, reel2, reel3].forEach(r => r.classList.remove('spinning'));

    // Show result
    const [a, b, c] = data.slots;
    slot1.src = BASE + `images/Icons/${a}.png`;
    slot2.src = BASE + `images/Icons/${b}.png`;
    slot3.src = BASE + `images/Icons/${c}.png`;

    balance = data.balance;
    debt    = data.debt;
    updateBalanceDisplay();
    updateDebtDisplay();

    // Visual feedback
    if (data.result === 'jackpot') {
        showJackpotBanner('🎰 JACKPOT! 🎰');
        showWinFlash();
        highlightReels([reel1, reel2, reel3]);
        if (jackpotSound) { jackpotSound.currentTime = 0; jackpotSound.play().catch(() => {}); }
    } else if (data.result === 'two_of_a_kind') {
        showJackpotBanner('🎉 Two of a Kind!');
        showWinFlash();
        const winners = [];
        if (a === b) { winners.push(reel1, reel2); }
        if (b === c) { winners.push(reel2, reel3); }
        if (a === c) { winners.push(reel1, reel3); }
        highlightReels([...new Set(winners)]);
        if (jackpotSound) { jackpotSound.currentTime = 0; jackpotSound.play().catch(() => {}); }
    }

    // Restore UI
    isSpinning = false;
    betButton.style.display = '';
    quitButton.style.display = '';
    updateLoanButton();
    updateSpinButton();
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
    jackpotBanner.style.animation = 'jackpotPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards';
    setTimeout(() => { jackpotBanner.style.display = 'none'; }, 2200);
}

function highlightReels(reels) {
    reels.forEach(r => {
        r.classList.add('win-highlight');
        setTimeout(() => r.classList.remove('win-highlight'), 1600);
    });
}

// ============================================================
//  BETTING
// ============================================================

betButton.addEventListener('click', () => {
    const open = amountOptions.style.display === 'none';
    amountOptions.style.display = open ? '' : 'none';
    const arrow = open ? '↑' : '↓';
    betButton.innerHTML = `${arrow} Bet: $<strong id="betAmount">${currentBet === 'ALL IN' ? 'ALL IN' : currentBet.toLocaleString()}</strong> ${arrow}`;
    playSfx(clickSound, BASE + 'sounds/click.mp3');
});

function selectBet(amount) {
    currentBet = amount;
    amountOptions.style.display = 'none';
    const label = amount === 'ALL IN' ? 'ALL IN' : Number(amount).toLocaleString();
    betButton.innerHTML = `↓ Bet: $<strong id="betAmount">${label}</strong> ↓`;
    updateSpinButton();
}

document.getElementById('bet10').addEventListener('click',  () => selectBet(10));
document.getElementById('bet100').addEventListener('click', () => selectBet(100));
document.getElementById('bet1000').addEventListener('click',() => selectBet(1000));
document.getElementById('betAll').addEventListener('click', () => selectBet('ALL IN'));

// ============================================================
//  LOANS
// ============================================================

loanButton.addEventListener('click', async () => {
    const action = loanButton.textContent.includes('Pay Back') ? 'repay' : 'take';
    playSfx(clickSound, BASE + 'sounds/click.mp3');
    const data = await apiPost(DJANGO_DATA.loanUrl, { action });
    balance = data.balance;
    debt    = data.debt;
    updateBalanceDisplay();
    updateDebtDisplay();
    updateLoanButton();
    updateSpinButton();
});

// ============================================================
//  BROKE CHECK
// ============================================================

function brokeCheck() {
    updateSpinButton();
    updateLoanButton();
    if (balance <= 0 && debt > 0) {
        stopBrokeCheck();
        showLoseScreen();
    }
}

function startBrokeCheck() {
    stopBrokeCheck();
    brokeCheckInterval = setInterval(brokeCheck, 500);
}

function stopBrokeCheck() {
    if (brokeCheckInterval) { clearInterval(brokeCheckInterval); brokeCheckInterval = null; }
}

function showLoseScreen() {
    loseScreen.style.display = 'flex';
    if (music) music.pause();
}

loseRestartButton.addEventListener('click', async () => {
    playSfx(clickSound, BASE + 'sounds/click.mp3');
    await apiPost(DJANGO_DATA.resetUrl, {});
    window.location.href = DJANGO_DATA.gameOverUrl;
});

loseExitButton.addEventListener('click', () => {
    window.location.href = DJANGO_DATA.gameOverUrl;
});

// ============================================================
//  QUIT
// ============================================================

quitButton.addEventListener('click', () => {
    playSfx(clickSound, BASE + 'sounds/click.mp3');
    window.location.href = DJANGO_DATA.quitUrl;
});

// ============================================================
//  THEME
// ============================================================

themeButton.addEventListener('click', () => {
    themeManager.style.display = themeManager.style.display === 'none' ? '' : 'none';
});

document.getElementById('closeThemeManager').addEventListener('click', () => {
    themeManager.style.display = 'none';
});

function applyTheme(name) {
    document.body.classList.remove('theme-blue','theme-dark','theme-gold','theme-purple');
    if (name) document.body.classList.add(name);
    localStorage.setItem('jt-theme', name);
}

document.getElementById('themePurple').addEventListener('click', () => applyTheme('theme-purple'));
document.getElementById('themeBlue').addEventListener('click',   () => applyTheme('theme-blue'));
document.getElementById('themeDark').addEventListener('click',   () => applyTheme('theme-dark'));
document.getElementById('themeGold').addEventListener('click',   () => applyTheme('theme-gold'));

// ============================================================
//  INIT
// ============================================================

window.addEventListener('load', () => {
    // Restore saved theme
    const saved = localStorage.getItem('jt-theme');
    if (saved) applyTheme(saved);

    updateBalanceDisplay();
    updateDebtDisplay();
    updateSpinButton();
    updateLoanButton();
    startBrokeCheck();

    // Start music on first interaction
    document.addEventListener('click', startMusic, { once: true });
    document.addEventListener('keydown', startMusic, { once: true });
});
// ----------------------------
// Load profile safely
// ----------------------------
let playerProfile;

try {
    const stored = localStorage.getItem("playerProfile");
    playerProfile = stored ? JSON.parse(stored) : null;
} catch (e) {
    console.warn("Invalid profile data in localStorage. Re-initializing.", e);
    playerProfile = null;
}

// Initialize default profile if none exists
if (!playerProfile) {
    playerProfile = {
        name: "Player",
        balance: 1000,       // Starting money
        totalDebt: 0,
        totalLoans: [],
        hasTakenLoan: false  // disables "No Loan" after first loan
    };
    localStorage.setItem("playerProfile", JSON.stringify(playerProfile));
}

// ----------------------------
// UI Update Functions
// ----------------------------
function updateUI() {
    document.getElementById("playerName").innerText = playerProfile.name;
    document.getElementById("balance").innerText = playerProfile.balance.toFixed(2);
    document.getElementById("debt").innerText = playerProfile.totalDebt.toFixed(2);

    if (playerProfile.hasTakenLoan) {
        document.getElementById("noLoan").disabled = true;
    }
}

function displayLoanHistory() {
    const list = document.getElementById("loanList");
    if (playerProfile.totalLoans.length === 0) {
        list.innerHTML = "<li>No loans taken yet.</li>";
    } else {
        list.innerHTML = playerProfile.totalLoans.map(
            loan => `<li>💵 Borrowed $${loan.amount} (Due: $${loan.totalDue.toFixed(2)})
                     <br><small>Time: ${loan.timeTaken}</small></li>`
        ).join("");
    }
}

function saveProfile() {
    localStorage.setItem("playerProfile", JSON.stringify(playerProfile));
}

function displayMessage(text) {
    document.getElementById("message").innerText = text;
}

// ----------------------------
// Microtransaction Manager
// ----------------------------
class MicrotransactionManager {
    constructor() {
        this.interestRate = 0.05;
    }

    grantLoan(amount) {
        const interest = amount * this.interestRate;
        const totalDue = amount + interest;

        playerProfile.balance += amount;
        playerProfile.totalDebt += totalDue;
        playerProfile.totalLoans.push({
            amount,
            interest,
            totalDue,
            timeTaken: new Date().toLocaleTimeString()
        });

        if (!playerProfile.hasTakenLoan) playerProfile.hasTakenLoan = true;

        updateUI();
        displayLoanHistory();
        saveProfile();
        displayMessage(`You borrowed $${amount}.`);
    }
}

// ----------------------------
// Event Listeners
// ----------------------------
const microtx = new MicrotransactionManager();

// Loan buttons
document.querySelectorAll(".loanOption").forEach(btn => {
    btn.addEventListener("click", e => {
        const amount = parseInt(e.target.dataset.amount);
        microtx.grantLoan(amount);
    });
});

// "No Loan" button
document.getElementById("noLoan").addEventListener("click", () => {
    displayMessage("No loan selected.");
    playerProfile.hasTakenLoan = true;
    saveProfile();
    updateUI();
});

// Continue button → Loan Summary page
document.getElementById("continueBtn").addEventListener("click", () => {
    window.location.href = "loan_summary.html";
});

// Quit button → go back to profile selection
document.getElementById("quitBtn").addEventListener("click", () => {
    saveProfile();
    window.location.href = "end_scene.html";
});

// ----------------------------
// Initialize on Page Load
// ----------------------------
updateUI();
displayLoanHistory();

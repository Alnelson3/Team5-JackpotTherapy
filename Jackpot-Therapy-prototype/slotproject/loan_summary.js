// Load profile from localStorage
const playerProfile = JSON.parse(localStorage.getItem("playerProfile"));

if (!playerProfile) {
    alert("No profile found! Returning to Loan Page...");
    window.location.href = "microtransactions.html";
} else {
    document.getElementById("playerName").innerText = playerProfile.name;
    document.getElementById("balance").innerText = playerProfile.balance.toFixed(2);
    document.getElementById("debt").innerText = playerProfile.totalDebt.toFixed(2);

    const netBalance = playerProfile.balance - playerProfile.totalDebt;
    document.getElementById("netBalance").innerText = netBalance.toFixed(2);

    // Populate collapsible loan history
    const list = document.getElementById("loanList");
    if (playerProfile.totalLoans.length === 0) {
        list.innerHTML = "<li>No loans taken yet.</li>";
    } else {
        list.innerHTML = playerProfile.totalLoans.map(
            loan => `<li>💵 Borrowed $${loan.amount} (Due: $${loan.totalDue.toFixed(2)})<br>
                     <small>Time: ${loan.timeTaken}</small></li>`
        ).join("");
    }
}

// Return button → back to microtransactions page
document.getElementById("returnBtn").addEventListener("click", () => {
    window.location.href = "microtransactions.html";
});

// Quit → end scene (replace with your page)
document.getElementById("quitBtn").addEventListener("click", () => {
    window.location.href = "end_scene.html";
});



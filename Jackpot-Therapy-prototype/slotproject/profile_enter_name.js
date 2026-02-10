document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const preview = document.getElementById("profilePreview");
    const input = document.getElementById("profileName");
    const message = document.getElementById("message");

    const selectedProfileImg = localStorage.getItem("selectedProfileImg");
    if (selectedProfileImg) {
        preview.innerHTML = `<img src="${selectedProfileImg}" alt="Profile Preview">`;
    }

    setTimeout(() => { body.style.opacity = "1"; }, 50);
    input.focus();

    document.getElementById("startBtn").addEventListener("click", () => {
        const name = input.value.trim();
        if (!name) {
            message.textContent = "Please enter a name!";
            return;
        }

        const playerProfile = {
            name,
            balance: 1000,
            totalDebt: 0,
            totalLoans: [],
            hasTakenLoan: false
        };

        localStorage.setItem("playerProfile", JSON.stringify(playerProfile));

        body.style.opacity = "0";
        setTimeout(() => {
            window.location.href = "microtransactions.html";
        }, 400);
    });
});

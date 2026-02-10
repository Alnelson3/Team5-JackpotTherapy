document.addEventListener("DOMContentLoaded", () => {
    const message = document.getElementById("message");

    document.querySelectorAll(".profile-card").forEach(card => {
        card.addEventListener("click", () => {
            const selectedProfileImg = card.dataset.img;

            if (!selectedProfileImg) {
                message.innerText = "Error: No profile image selected.";
                return;
            }

            // Store selected image and clear previous profile data
            localStorage.setItem("selectedProfileImg", selectedProfileImg);
            localStorage.removeItem("playerProfile");
            localStorage.removeItem("hasPlayedBefore");

            console.log("Saved selected image:", selectedProfileImg);

            // Fade out transition before redirect
            document.body.style.transition = "opacity 0.4s ease";
            document.body.style.opacity = "0";

            setTimeout(() => {
                window.location.href = "profile_enter_name.html";
            }, 400);
        });
    });
});

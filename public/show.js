document.addEventListener("DOMContentLoaded", () => {
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const navLinks = document.getElementById("navLinks");

    hamburgerBtn.addEventListener("click", () => {
        navLinks.classList.toggle("hidden");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const logoutMenuBtn = document.getElementById("logoutMenuBtn");
    const logoutMenu = document.getElementById("logoutMenu");

    function toggleLogoutMenu() {
        logoutMenu.classList.toggle("hidden");
    }

    logoutMenuBtn.addEventListener("click", function () {
        toggleLogoutMenu();
    });

    document.addEventListener("click", function (event) {
        if (
            !logoutMenuBtn.contains(event.target) &&
            !logoutMenu.contains(event.target)
        ) {
            logoutMenu.classList.add("hidden");
        }
    });
});

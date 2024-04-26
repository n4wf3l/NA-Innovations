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

window.addEventListener("scroll", function () {
    var scrollToTop = document.getElementById("scrollToTop");
    if (window.scrollY > 100) {
        scrollToTop.classList.add("show");
    } else {
        scrollToTop.classList.remove("show");
    }
});

document.getElementById("scrollToTop").addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

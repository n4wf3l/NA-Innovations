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

function deleteProjet(projetId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
        axios
            .delete(`/projets/${projetId}`)
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                console.error(
                    "Une erreur s'est produite lors de la suppression du projet :",
                    error
                );
            });
    }
}

function deleteAcademicProjet(academicProjetId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet académique ?")) {
        axios
            .delete(`/academic_projets/${academicProjetId}`)
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                console.error(
                    "Une erreur s'est produite lors de la suppression du projet académique :",
                    error
                );
            });
    }
}

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

document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("background-toggle-button");
    const targetElement = document.querySelector(".flex-1").parentNode;

    const initialColor = window.getComputedStyle(targetElement).backgroundColor;

    button.addEventListener("click", function () {
        const currentColor =
            window.getComputedStyle(targetElement).backgroundColor;

        const colors = [
            { name: "yellow", rgb: "rgb(255, 255, 0)", icon: "🌞" },
            { name: "red", rgb: "rgb(200, 0, 0)", icon: "😎" },
            { name: "gray", rgb: initialColor, icon: "🌙" },
        ];

        const currentColorObj = colors.find(
            (color) => color.rgb === currentColor
        );
        const nextIndex = (colors.indexOf(currentColorObj) + 1) % colors.length;
        targetElement.style.backgroundColor = colors[nextIndex].rgb;
        const toggleIcon = document.getElementById("toggle-icon");
        toggleIcon.innerHTML = colors[nextIndex].icon;
        if (nextIndex === 1) {
            alert(
                "Les curieux comme vous sont ceux avec le plus de goûts design"
            );
        }
    });
});

document
    .querySelector(".messages-container")
    .addEventListener("mouseenter", function () {
        var messagesList = document.querySelector(".messages-list");
        messagesList.style.animationPlayState = "paused";
    });

document
    .querySelector(".messages-container")
    .addEventListener("mouseleave", function () {
        var messagesList = document.querySelector(".messages-list");
        messagesList.style.animationPlayState = "running";
    });

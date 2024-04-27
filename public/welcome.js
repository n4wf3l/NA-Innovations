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
    if (confirm("Are you sure you want to delete this project?")) {
        axios
            .delete(`/projets/${projetId}`)
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                console.error(
                    "An error occurred while deleting the project:",
                    error
                );
            });
    }
}

function deleteAcademicProjet(academicProjetId) {
    if (confirm("Are you sure you want to delete this academic project?")) {
        axios
            .delete(`/academic_projets/${academicProjetId}`)
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                console.error(
                    "An error occurred while deleting the academic project.",
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
                "Who would have thought that by clicking on this button, you would unleash an avalanche of creativity? Welcome to my universe, where every pixel tells a story."
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

AOS.init();

window.addEventListener("load", function () {
    document.body.classList.add("loaded");
});

doorElement.addEventListener("animationend", () => {
    // Supprimez la classe qui désactive le défilement
    document.body.classList.remove("no-scroll");

    // Ajoutez l'élément "NA" au DOM lorsque la porte s'ouvre
    const naText = document.createElement("div");
    naText.textContent = "NA";
    naText.classList.add("na-text");
    document.body.appendChild(naText);

    // Supprimez l'élément "NA" après un certain délai (par exemple, 1000 ms)
    setTimeout(() => {
        naText.remove();
    }, 1000);
});

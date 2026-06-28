// theme.js

function toggleTheme() {

    const currentTheme =
        document.documentElement.getAttribute("data-theme");

    if(currentTheme === "light") {

        document.documentElement.removeAttribute("data-theme");

        localStorage.setItem(
            "theme",
            "dark"
        );

    } else {

        document.documentElement.setAttribute(
            "data-theme",
            "light"
        );

        localStorage.setItem(
            "theme",
            "light"
        );
    }
}

window.addEventListener("DOMContentLoaded", () => {

    const savedTheme =
        localStorage.getItem("theme");

    if(savedTheme === "light") {

        document.documentElement.setAttribute(
            "data-theme",
            "light"
        );
    }
});
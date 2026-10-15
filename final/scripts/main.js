const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");

        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    navigation.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            navigation.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            navigation.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
        }
    });

    window.addEventListener("resize", () => {
        if (window.matchMedia("(min-width: 700px)").matches) {
            navigation.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
        }
    });
}

// Add wayfinding to the matching navigation link.
const currentFile = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll("#navigation a").forEach((link) => {
    const linkFile = new URL(link.href).pathname.split("/").pop();

    if (linkFile === currentFile) {
        link.setAttribute("aria-current", "page");
    }
});
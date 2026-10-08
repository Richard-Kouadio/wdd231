
/* 
 * Grand-Bassam Cultural Heritage and Tourism Guide
 * Main JavaScript file
 */

// Wait until the HTML document is ready
document.addEventListener("DOMContentLoaded", () => {
    // ==============================
    // Mobile Navigation Menu
    // ==============================
    const menuButton = document.querySelector("#menu-button");
    const navigation = document.querySelector("#navigation");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            const isExpanded =
                menuButton.getAttribute("aria-expanded") === "true";

            menuButton.setAttribute("aria-expanded", String(!isExpanded));
            menuButton.setAttribute(
                "aria-label",
                isExpanded ? "Open navigation menu" : "Close navigation menu"
            );

            navigation.classList.toggle("open", !isExpanded);
        });

        // Close the menu after selecting a navigation link
        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Open navigation menu");
                navigation.classList.remove("open");
            });
        });

        // Close the menu when the Escape key is pressed
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Open navigation menu");
                navigation.classList.remove("open");
                menuButton.focus();
            }
        });
    }

    // ==============================
    // Highlight the Current Page
    // ==============================
    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("#navigation a").forEach((link) => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    // ==============================
    // Update the Footer Year
    // ==============================
    const yearElements = document.querySelectorAll("[data-current-year]");

    yearElements.forEach((element) => {
        element.textContent = new Date().getFullYear();
    });

    // ==============================
    // Back to Top Functionality
    // ==============================
    const backToTopButtons = document.querySelectorAll(".back-to-top");

    backToTopButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    });

    console.log("Grand-Bassam website initialized successfully.");
});
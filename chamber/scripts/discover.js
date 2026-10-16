import { discoverItems } from "../data/discover.mjs";

/* =========================================
   SELECT PAGE ELEMENTS
========================================= */

const discoverGrid = document.querySelector("#discover-grid");
const visitMessage = document.querySelector("#visit-message");
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");

const LAST_VISIT_KEY = "discoverLastVisit";

/* =========================================
   CREATE DISCOVER CARDS
========================================= */

function displayPlaces() {
    if (!discoverGrid) {
        return;
    }

    // Make sure the data contains the expected eight places.
    if (!Array.isArray(discoverItems) || discoverItems.length !== 8) {
        console.error(
            "Discover page error: expected exactly eight places in discover.mjs."
        );
        discoverGrid.textContent =
            "The places of interest could not be loaded. Please try again later.";
        return;
    }

    const fragment = document.createDocumentFragment();

    discoverItems.forEach((place, index) => {
        const card = document.createElement("article");
        card.className = "discover-card";
        card.setAttribute("aria-labelledby", `place-title-${index + 1}`);

        // Named grid-area classes will be used by discover.css.
        card.classList.add(`place-${index + 1}`);

        const title = document.createElement("h2");
        title.id = `place-title-${index + 1}`;
        title.textContent = place.name;

        const figure = document.createElement("figure");
        figure.className = "discover-card-figure";

        const image = document.createElement("img");
        image.src = place.image;
        image.alt = place.alt || place.name;
        image.width = 300;
        image.height = 200;
        image.loading = "lazy";
        image.decoding = "async";

        figure.appendChild(image);

        const address = document.createElement("address");
        address.textContent = place.address;

        const description = document.createElement("p");
        description.textContent = place.description;

        const learnMore = document.createElement("a");
        learnMore.className = "view-button";
        learnMore.href =
            `https://www.google.com/search?q=${encodeURIComponent(
                `${place.name} Grand-Bassam Côte d'Ivoire`
            )}`;
        learnMore.target = "_blank";
        learnMore.rel = "noopener noreferrer";
        learnMore.textContent = "Learn More";
        learnMore.setAttribute(
            "aria-label",
            `Learn more about ${place.name}`
        );

        card.append(
            title,
            figure,
            address,
            description,
            learnMore
        );

        fragment.appendChild(card);
    });

    discoverGrid.replaceChildren(fragment);
}

/* =========================================
   VISITOR MESSAGE USING LOCALSTORAGE
========================================= */

function displayVisitMessage() {
    if (!visitMessage) {
        return;
    }

    const now = Date.now();
    const storedVisit = localStorage.getItem(LAST_VISIT_KEY);

    let message = "";

    if (storedVisit === null) {
        // First visit.
        message = "Welcome! Let us know if you have any questions.";
    } else {
        const previousVisit = Number(storedVisit);

        if (!Number.isFinite(previousVisit) || previousVisit <= 0) {
            // Recover safely if the stored value is invalid.
            message = "Welcome! Let us know if you have any questions.";
        } else {
            const elapsedMilliseconds = Math.max(0, now - previousVisit);
            const oneDay = 24 * 60 * 60 * 1000;

            if (elapsedMilliseconds < oneDay) {
                message = "Back so soon! Awesome!";
            } else {
                const days = Math.floor(
                    elapsedMilliseconds / oneDay
                );

                const unit = days === 1 ? "day" : "days";

                message = `You last visited ${days} ${unit} ago.`;
            }
        }
    }

    visitMessage.textContent = message;

    // Save the current visit time for the next page visit.
    localStorage.setItem(LAST_VISIT_KEY, String(now));
}

/* =========================================
   RESPONSIVE MOBILE NAVIGATION
========================================= */

function toggleNavigation() {
    if (!menuButton || !navigation) {
        return;
    }

    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", String(isOpen));

    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
}

function closeNavigationOnLinkClick(event) {
    if (!menuButton || !navigation) {
        return;
    }

    if (event.target.closest("a")) {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
    }
}

if (menuButton && navigation) {
    menuButton.addEventListener("click", toggleNavigation);
    navigation.addEventListener("click", closeNavigationOnLinkClick);
}

/* =========================================
   INITIALIZE DISCOVER PAGE
========================================= */

displayPlaces();
displayVisitMessage();
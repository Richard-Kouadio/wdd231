import { discoverItems } from "../data/discover.mjs";

const discoverGrid = document.querySelector("#discover-grid");
const visitMessage = document.querySelector("#visit-message");
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");

/* =========================================
   BUILD DISCOVER CARDS
========================================= */

function displayDiscoverItems(items) {
    discoverGrid.innerHTML = "";

    items.forEach((item, index) => {
        const card = document.createElement("article");

        card.classList.add("discover-card");
        card.style.gridArea = `card${index + 1}`;

        card.innerHTML = `
            <h3>${item.name}</h3>

            <figure>
                <img
                    src="${item.image}"
                    alt="${item.name}"
                    width="300"
                    height="200"
                    loading="lazy"
                >
            </figure>

            <address>${item.address}</address>

            <p>${item.description}</p>

            <button type="button">
                Learn More
            </button>
        `;

        discoverGrid.appendChild(card);
    });
}

/* =========================================
   LOCAL STORAGE - LAST VISIT
========================================= */

function displayVisitMessage() {
    const currentTime = Date.now();
    const lastVisit = localStorage.getItem("discoverLastVisit");

    let message = "";

    if (!lastVisit) {
        message = "Welcome! Let us know if you have any questions.";
    } else {
        const difference = currentTime - Number(lastVisit);
        const oneDay = 24 * 60 * 60 * 1000;

        if (difference < oneDay) {
            message = "Back so soon! Awesome!";
        } else {
            const days = Math.floor(difference / oneDay);

            const dayText = days === 1 ? "day" : "days";

            message = `You last visited ${days} ${dayText} ago.`;
        }
    }

    visitMessage.textContent = message;

    localStorage.setItem("discoverLastVisit", currentTime.toString());
}

/* =========================================
   RESPONSIVE NAVIGATION
========================================= */

function toggleNavigation() {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute(
        "aria-expanded",
        isOpen.toString()
    );

    menuButton.setAttribute(
        "aria-label",
        isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
    );
}

menuButton.addEventListener("click", toggleNavigation);

/* =========================================
   INITIALIZE PAGE
========================================= */

displayDiscoverItems(discoverItems);
displayVisitMessage();

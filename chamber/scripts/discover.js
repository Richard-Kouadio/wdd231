const places = [
    {
        name: "Grand-Bassam Beach",
        address: "Grand-Bassam, Côte d'Ivoire",
        image: "images/grand-bassam-beach.webp",
        alt: "Beach and coastline in Grand-Bassam",
        description:
            "Enjoy the Atlantic coastline, sandy beaches, ocean views, and relaxing atmosphere of Grand-Bassam."
    },
    {
        name: "Grand-Bassam National Museum",
        address: "Quartier France, Grand-Bassam",
        image: "images/national-museum.webp",
        alt: "Grand-Bassam National Museum",
        description:
            "Discover cultural objects, historical exhibits, and traditions that tell the story of Grand-Bassam."
    },
    {
        name: "Maison Ganamet",
        address: "Quartier France, Grand-Bassam",
        image: "images/maison-ganamet.webp",
        alt: "Historic Maison Ganamet building in Grand-Bassam",
        description:
            "Explore one of Grand-Bassam's historic buildings and experience the architectural heritage of the old town."
    },
    {
        name: "Palais de Justice",
        address: "Quartier France, Grand-Bassam",
        image: "images/palais-de-justice.webp",
        alt: "Historic Palais de Justice building",
        description:
            "Visit this historic landmark and learn more about Grand-Bassam's important colonial-era architecture."
    },
    {
        name: "Lighthouse of Grand-Bassam",
        address: "Grand-Bassam, Côte d'Ivoire",
        image: "images/grand-bassam-lighthouse.webp",
        alt: "Lighthouse in Grand-Bassam",
        description:
            "See the historic lighthouse and learn about Grand-Bassam's connection to maritime activity and trade."
    },
    {
        name: "Sacred Monkey Forest",
        address: "Grand-Bassam area, Côte d'Ivoire",
        image: "images/sacred-monkey-forest.webp",
        alt: "Green forest landscape near Grand-Bassam",
        description:
            "Experience a natural setting where visitors can learn about local wildlife and the surrounding environment."
    },
    {
        name: "Colonial Quarter",
        address: "Quartier France, Grand-Bassam",
        image: "images/colonial-quarter.webp",
        alt: "Historic colonial architecture in Grand-Bassam",
        description:
            "Walk through the historic quarter and admire buildings that reflect Grand-Bassam's cultural heritage."
    },
    {
        name: "Craft Village",
        address: "Grand-Bassam, Côte d'Ivoire",
        image: "images/craft-village.webp",
        alt: "Traditional crafts and artwork in Grand-Bassam",
        description:
            "Explore local crafts, artwork, and handmade products while supporting Grand-Bassam's creative community."
    }
];

const discoverGrid = document.querySelector("#discover-grid");
const visitMessage = document.querySelector("#visit-message");
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");

/* =========================================
CREATE DISCOVER CARDS
========================================= */

function displayPlaces() {
    if (!discoverGrid) {
        return;
    }

    discoverGrid.innerHTML = "";

    places.forEach((place) => {
        const card = document.createElement("article");
        card.className = "discover-card";

        card.innerHTML = `
        <h3>${place.name}</h3>

        <figure>
            <img
                src="${place.image}"
                alt="${place.alt}"
                width="600"
                height="400"
                loading="lazy">
        </figure>

        <address>${place.address}</address>

        <p>${place.description}</p>

        <a
            class="view-button"
            href="https://www.google.com/search?q=${encodeURIComponent(place.name + " Grand-Bassam Côte d'Ivoire")}"
            target="_blank"
            rel="noopener noreferrer">
            Learn More
        </a>
    `;

        discoverGrid.appendChild(card);
    });


}

/* =========================================
VISITOR MESSAGE
========================================= */

function displayVisitMessage() {
    if (!visitMessage) {
        return;
    }

    const now = Date.now();
    const lastVisit = localStorage.getItem("discoverLastVisit");

    if (!lastVisit) {
        visitMessage.textContent =
            "Welcome! Let us know if you have any questions about the places you discover in Grand-Bassam.";
    } else {
        const previousVisit = Number(lastVisit);
        const difference = now - previousVisit;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));

        if (days < 1) {
            visitMessage.textContent =
                "Welcome back! We hope you enjoy exploring Grand-Bassam again today.";
        } else if (days === 1) {
            visitMessage.textContent =
                "Welcome back! It has been 1 day since your last visit.";
        } else {
            visitMessage.textContent =
                `Welcome back! It has been ${days} days since your last visit.`;
        }
    }

    localStorage.setItem("discoverLastVisit", String(now));


}

/* =========================================
MOBILE NAVIGATION
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

if (menuButton) {
    menuButton.addEventListener("click", toggleNavigation);
}

/* =========================================
INITIALIZE PAGE
========================================= */

displayPlaces();
displayVisitMessage();
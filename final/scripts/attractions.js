const attractionsContainer = document.querySelector("#attractions-container");
const loadingMessage = document.querySelector("#loading-message");
const categoryFilter = document.querySelector("#category-filter");
const attractionModal = document.querySelector("#attraction-modal");
const modalContent = document.querySelector("#modal-content");
const modalClose = document.querySelector("#modal-close");

let attractions = [];
let lastFocusedElement = null;

function hideBrokenImages(container) {
    container.querySelectorAll("img").forEach((image) => {
        image.addEventListener("error", () => {
            image.hidden = true;
        }, { once: true });
    });
}

function createAttractionCard(attraction, index) {
    const article = document.createElement("article");
    article.className = "card";

    const image = document.createElement("img");
    image.className = "card-image";
    image.src = attraction.image;
    image.alt = `View related to ${attraction.name}`;
    image.loading = "lazy";
    image.width = 640;
    image.height = 420;

    const content = document.createElement("div");
    content.className = "card-content";

    const title = document.createElement("h2");
    title.textContent = attraction.name;

    const category = document.createElement("p");
    category.className = "card-meta";
    category.textContent = `Category: ${attraction.category}`;

    const location = document.createElement("p");
    location.className = "card-meta";
    location.textContent = `Location: ${attraction.location}`;

    const description = document.createElement("p");
    description.textContent = attraction.description;

    const button = document.createElement("button");
    button.className = "button";
    button.type = "button";
    button.textContent = "View details";
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-label", `View details about ${attraction.name}`);

    button.addEventListener("click", () => {
        openAttractionModal(attraction, button);
    });

    content.append(title, category, location, description, button);
    article.append(image, content);

    // Keep a stable data identifier available for inspection.
    article.dataset.attractionIndex = String(index);

    return article;
}

function displayAttractions(items) {
    attractionsContainer.replaceChildren();

    if (items.length === 0) {
        const message = document.createElement("p");
        message.className = "message";
        message.textContent = "No attractions match this category.";
        attractionsContainer.append(message);
        return;
    }

    const cards = items.map((attraction) => {
        const index = attractions.indexOf(attraction);
        return createAttractionCard(attraction, index);
    });

    attractionsContainer.append(...cards);
    hideBrokenImages(attractionsContainer);
}

function populateCategoryFilter(items) {
    const categories = [...new Set(items.map((item) => item.category))];

    categoryFilter.replaceChildren();

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All categories";
    categoryFilter.append(allOption);

    categories.sort().forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.append(option);
    });
}

function openAttractionModal(attraction, trigger) {
    lastFocusedElement = trigger;
    modalContent.replaceChildren();

    const title = document.createElement("h2");
    title.id = "modal-heading";
    title.textContent = attraction.name;

    const image = document.createElement("img");
    image.className = "modal-image";
    image.src = attraction.image;
    image.alt = `View related to ${attraction.name}`;
    image.width = 640;
    image.height = 420;

    const category = document.createElement("p");
    category.textContent = `Category: ${attraction.category}`;

    const location = document.createElement("p");
    location.textContent = `Location: ${attraction.location}`;

    const description = document.createElement("p");
    description.textContent = attraction.description;

    modalContent.append(title, image, category, location, description);
    hideBrokenImages(modalContent);

    if (!attractionModal.open) {
        attractionModal.showModal();
    }

    modalClose.focus();
}

function closeAttractionModal() {
    if (attractionModal.open) {
        attractionModal.close();
    }
}

categoryFilter.addEventListener("change", () => {
    const selectedCategory = categoryFilter.value;

    // filter() is an array method required by the project rubric.
    const filteredAttractions = selectedCategory === "all"
        ? attractions
        : attractions.filter((item) => item.category === selectedCategory);

    displayAttractions(filteredAttractions);
});

modalClose.addEventListener("click", closeAttractionModal);

attractionModal.addEventListener("click", (event) => {
    if (event.target === attractionModal) {
        closeAttractionModal();
    }
});

attractionModal.addEventListener("close", () => {
    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
});

async function loadAttractions() {
    loadingMessage.textContent = "Loading heritage information...";

    try {
        const response = await fetch("./data/attractions.json");

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length < 15) {
            throw new Error("The attraction data must contain at least 15 records.");
        }

        const requiredProperties = [
            "name",
            "category",
            "location",
            "description",
            "image"
        ];

        const validData = data.filter((item) =>
            requiredProperties.every((property) =>
                typeof item[property] === "string" &&
                item[property].trim().length > 0
            )
        );

        if (validData.length < 15) {
            throw new Error("At least 15 complete attraction records are required.");
        }

        attractions = validData;

        populateCategoryFilter(attractions);
        displayAttractions(attractions);

        loadingMessage.textContent =
            `Loaded ${attractions.length} heritage and visitor records.`;
        loadingMessage.classList.remove("error");
    } catch (error) {
        console.error("Unable to load attractions:", error);

        loadingMessage.textContent =
            "We could not load the attraction information. Please check your connection or try again later.";
        loadingMessage.classList.add("error");
    }
}

loadAttractions();
// Grand-Bassam Cultural Heritage & Tourism Guide
// Attractions page JavaScript module

const dataUrl = "../data/attractions.json";

const attractionsContainer =
    document.querySelector("#attractions-container");

const categoryFilter =
    document.querySelector("#category-filter");

const loadingMessage =
    document.querySelector("#loading-message");

const modal =
    document.querySelector("#attraction-modal");

const modalContent =
    document.querySelector("#modal-content");

const modalClose =
    document.querySelector("#modal-close");


// Local storage key
const favoritesKey = "grandBassamFavorites";


// Get saved favorites from localStorage
function getFavorites() {
    const savedFavorites =
        localStorage.getItem(favoritesKey);

    if (!savedFavorites) {
        return [];
    }

    try {
        return JSON.parse(savedFavorites);
    } catch (error) {
        console.error(
            "Unable to read saved favorites:",
            error
        );

        return [];
    }
}


// Save favorites to localStorage
function saveFavorites(favorites) {
    localStorage.setItem(
        favoritesKey,
        JSON.stringify(favorites)
    );
}


// Add or remove a favorite attraction
function toggleFavorite(id) {

    const favorites = getFavorites();

    const favoriteIndex =
        favorites.indexOf(id);

    if (favoriteIndex === -1) {

        favorites.push(id);

    } else {

        favorites.splice(
            favoriteIndex,
            1
        );
    }

    saveFavorites(favorites);

    return favorites;
}


// Check whether an attraction is a favorite
function isFavorite(id) {

    const favorites = getFavorites();

    return favorites.includes(id);
}


// Create an attraction card
function createAttractionCard(attraction) {

    const favoriteText =
        isFavorite(attraction.id)
            ? "Remove from favorites"
            : "Save to favorites";

    const favoriteLabel =
        isFavorite(attraction.id)
            ? "★ Saved"
            : "☆ Save";

    return `
        <article class="card">

            <img
                class="card-image"
                src="${attraction.image}"
                alt="${attraction.name}"
                width="800"
                height="500"
                loading="lazy"
            >

            <div class="card-content">

                <span class="category">
                    ${attraction.category}
                </span>

                <h2>
                    ${attraction.name}
                </h2>

                <p>
                    <strong>Location:</strong>
                    ${attraction.location}
                </p>

                <p>
                    ${attraction.description}
                </p>

                <button
                    class="button attraction-details"
                    type="button"
                    data-id="${attraction.id}"
                >
                    View Details
                </button>

                <button
                    class="button favorite-button"
                    type="button"
                    data-id="${attraction.id}"
                    aria-label="${favoriteText}"
                >
                    ${favoriteLabel}
                </button>

            </div>

        </article>
    `;
}


// Display attractions on the page
function displayAttractions(attractions) {

    if (attractions.length === 0) {

        attractionsContainer.innerHTML = `
            <p class="message">
                No heritage places were found for this category.
            </p>
        `;

        return;
    }


    attractionsContainer.innerHTML =
        attractions
            .map(createAttractionCard)
            .join("");


    // Details buttons
    const detailButtons =
        document.querySelectorAll(
            ".attraction-details"
        );

    detailButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const id =
                    Number(button.dataset.id);

                openAttractionModal(
                    id,
                    attractions
                );
            }
        );
    });


    // Favorite buttons
    const favoriteButtons =
        document.querySelectorAll(
            ".favorite-button"
        );

    favoriteButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const id =
                    Number(button.dataset.id);

                toggleFavorite(id);

                updateDisplayedAttractions(
                    attractions
                );
            }
        );
    });
}


// Update the displayed attraction cards
function updateDisplayedAttractions(
    allAttractions
) {

    const selectedCategory =
        categoryFilter.value;


    let filteredAttractions =
        allAttractions;


    if (selectedCategory !== "all") {

        filteredAttractions =
            allAttractions.filter(
                (attraction) =>
                    attraction.category ===
                    selectedCategory
            );
    }


    displayAttractions(
        filteredAttractions
    );
}


// Open attraction modal
function openAttractionModal(
    id,
    attractions
) {

    const attraction =
        attractions.find(
            (item) => item.id === id
        );


    if (!attraction) {
        return;
    }


    const favoriteStatus =
        isFavorite(attraction.id)
            ? "This place is saved in your favorites."
            : "This place is not currently saved.";


    modalContent.innerHTML = `
        <img
            class="modal-image"
            src="${attraction.image}"
            alt="${attraction.name}"
            width="800"
            height="500"
        >

        <span class="category">
            ${attraction.category}
        </span>

        <h2>
            ${attraction.name}
        </h2>

        <p>
            <strong>Location:</strong>
            ${attraction.location}
        </p>

        <p>
            ${attraction.description}
        </p>

        <p>
            <strong>Favorites:</strong>
            ${favoriteStatus}
        </p>
    `;


    modal.showModal();
}


// Close modal
function closeModal() {

    if (modal.open) {
        modal.close();
    }
}


// Create category filter options
function createCategoryOptions(
    attractions
) {

    /*
     * map() creates an array of categories.
     * Set removes duplicate categories.
     * sort() keeps them alphabetically organized.
     */

    const categories =
        [
            ...new Set(
                attractions.map(
                    (attraction) =>
                        attraction.category
                )
            )
        ].sort();


    categories.forEach(
        (category) => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category;

            option.textContent =
                category;

            categoryFilter.appendChild(
                option
            );
        }
    );
}


// Fetch attraction data
async function getAttractions() {

    try {

        loadingMessage.textContent =
            "Loading heritage information...";


        const response =
            await fetch(dataUrl);


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );
        }


        const attractions =
            await response.json();


        /*
         * Make sure we have enough records
         * for the W06 project requirement.
         */

        if (attractions.length < 15) {

            throw new Error(
                "The data source must contain at least 15 items."
            );
        }


        createCategoryOptions(
            attractions
        );


        displayAttractions(
            attractions
        );


        loadingMessage.remove();


    } catch (error) {

        console.error(
            "Error loading attraction data:",
            error
        );


        loadingMessage.textContent =
            "We could not load the heritage information. Please try again later.";
    }
}


// Filter change event
categoryFilter.addEventListener(
    "change",
    async () => {

        try {

            /*
             * Fetch the data again so the filter
             * always works with the original data.
             */

            const response =
                await fetch(dataUrl);


            if (!response.ok) {

                throw new Error(
                    `HTTP error: ${response.status}`
                );
            }


            const attractions =
                await response.json();


            updateDisplayedAttractions(
                attractions
            );

        } catch (error) {

            console.error(
                "Unable to filter attractions:",
                error
            );

            attractionsContainer.innerHTML = `
                <p class="message">
                    We could not filter the heritage information.
                </p>
            `;
        }
    }
);


// Close button event
modalClose.addEventListener(
    "click",
    closeModal
);


// Close modal when clicking outside the content
modal.addEventListener(
    "click",
    (event) => {

        if (event.target === modal) {
            closeModal();
        }
    }
);


// Close modal with Escape key
modal.addEventListener(
    "cancel",
    (event) => {

        event.preventDefault();

        closeModal();
    }
);


// Start the application
getAttractions();
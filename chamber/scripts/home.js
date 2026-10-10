
"use strict";

/* =========================================
   OPENWEATHERMAP CONFIGURATION
   ========================================= */

const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

const LATITUDE = 5.2;
const LONGITUDE = -3.74;

const currentWeatherURL =
    `https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&units=metric&appid=${API_KEY}`;

const forecastURL =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${LATITUDE}&lon=${LONGITUDE}&units=metric&appid=${API_KEY}`;


/* =========================================
   FOOTER INFORMATION
   ========================================= */

function setFooterInformation() {
    const yearElement = document.querySelector("#current-year");
    const modifiedElement = document.querySelector("#last-modified");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    if (modifiedElement) {
        const modifiedDate = new Date(document.lastModified);

        modifiedElement.dateTime = modifiedDate.toISOString();
        modifiedElement.textContent =
            modifiedDate.toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
    }
}


/* =========================================
   RESPONSIVE NAVIGATION
   ========================================= */

function setupNavigation() {
    const menuButton = document.querySelector("#menu-button");
    const navigation = document.querySelector("#main-nav");

    if (!menuButton || !navigation) {
        return;
    }

    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");

        menuButton.setAttribute("aria-expanded", String(isOpen));

        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    // Close the mobile menu after a navigation link is selected.
    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navigation.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
        });
    });

    // Reset the menu when moving to the desktop layout.
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 640) {
            navigation.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
        }
    });
}


/* =========================================
   WEATHER ICONS
   ========================================= */

function getWeatherIcon(iconCode) {
    const icons = {
        "01d": "☀️",
        "01n": "🌙",
        "02d": "⛅",
        "02n": "☁️",
        "03d": "☁️",
        "03n": "☁️",
        "04d": "☁️",
        "04n": "☁️",
        "09d": "🌧️",
        "09n": "🌧️",
        "10d": "🌦️",
        "10n": "🌧️",
        "11d": "⛈️",
        "11n": "⛈️",
        "13d": "❄️",
        "13n": "❄️",
        "50d": "🌫️",
        "50n": "🌫️"
    };

    return icons[iconCode] || "🌤️";
}


/* =========================================
   WEATHER DATE HELPERS
   ========================================= */

function getLocalDateKey(timestamp, timezoneOffset) {
    // OpenWeatherMap supplies the location's UTC offset in seconds.
    const localTime = new Date(
        (timestamp + timezoneOffset) * 1000
    );

    return localTime.toISOString().slice(0, 10);
}

function formatForecastDay(dateKey) {
    // Use noon to avoid timezone shifts around midnight.
    const date = new Date(`${dateKey}T12:00:00Z`);

    return new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
        timeZone: "UTC"
    }).format(date);
}

function formatDescription(description) {
    if (!description) {
        return "Weather information unavailable";
    }

    return description.charAt(0).toUpperCase() + description.slice(1);
}


/* =========================================
   DISPLAY CURRENT WEATHER
   ========================================= */

function displayCurrentWeather(data) {
    const temperatureElement =
        document.querySelector("#current-temperature");

    const descriptionElement =
        document.querySelector("#weather-description");

    const iconElement =
        document.querySelector("#weather-icon");

    const feelsLikeElement =
        document.querySelector("#feels-like");

    const updatedElement =
        document.querySelector("#weather-updated");

    if (
        !temperatureElement ||
        !descriptionElement ||
        !iconElement
    ) {
        return;
    }

    const conditions = data.weather?.[0];

    if (!conditions || !data.main) {
        throw new Error("The current weather response is incomplete.");
    }

    temperatureElement.textContent =
        `${Math.round(data.main.temp)}°C`;

    descriptionElement.textContent =
        formatDescription(conditions.description);

    iconElement.textContent =
        getWeatherIcon(conditions.icon);

    if (feelsLikeElement) {
        feelsLikeElement.textContent =
            `Feels like ${Math.round(data.main.feels_like)}°C`;
    }

    if (updatedElement) {
        updatedElement.textContent =
            `Observed at ${new Intl.DateTimeFormat("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "UTC",
                timeZoneName: "short"
            }).format(new Date(data.dt * 1000))}`;
    }
}


/* =========================================
   DISPLAY THREE-DAY FORECAST
   ========================================= */

function displayForecast(data) {
    const forecastContainer =
        document.querySelector("#forecast-container");

    if (!forecastContainer) {
        return;
    }

    if (!Array.isArray(data.list) || data.list.length === 0) {
        throw new Error("The forecast response contains no data.");
    }

    const timezoneOffset = data.city?.timezone || 0;
    const todayKey = getLocalDateKey(
        Math.floor(Date.now() / 1000),
        timezoneOffset
    );

    const groupedForecasts = {};

    // Group forecast entries by local calendar date.
    data.list.forEach((forecast) => {
        const dateKey = getLocalDateKey(
            forecast.dt,
            timezoneOffset
        );

        if (dateKey === todayKey) {
            return;
        }

        if (!groupedForecasts[dateKey]) {
            groupedForecasts[dateKey] = [];
        }

        groupedForecasts[dateKey].push(forecast);
    });

    const forecastDates = Object.keys(groupedForecasts)
        .sort()
        .slice(0, 3);

    if (forecastDates.length < 3) {
        throw new Error("Three forecast days are not available.");
    }

    forecastContainer.replaceChildren();

    forecastDates.forEach((dateKey) => {
        const forecasts = groupedForecasts[dateKey];

        // Prefer a forecast close to midday for each date.
        const selectedForecast = forecasts.reduce((best, item) => {
            const itemHour = new Date(item.dt * 1000).getUTCHours();
            const bestHour = new Date(best.dt * 1000).getUTCHours();

            const itemDistance = Math.abs(itemHour - 12);
            const bestDistance = Math.abs(bestHour - 12);

            return itemDistance < bestDistance ? item : best;
        });

        const temperatures = forecasts.map(
            (item) => item.main.temp
        );

        const averageTemperature =
            temperatures.reduce((sum, temp) => sum + temp, 0) /
            temperatures.length;

        const conditions = selectedForecast.weather?.[0];

        const card = document.createElement("article");
        card.className = "forecast-card";

        const heading = document.createElement("h4");
        heading.textContent = formatForecastDay(dateKey);

        const icon = document.createElement("p");
        icon.className = "weather-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = getWeatherIcon(conditions?.icon);

        const temperature = document.createElement("p");
        temperature.className = "forecast-temperature";
        temperature.textContent =
            `${Math.round(averageTemperature)}°C`;

        const description = document.createElement("p");
        description.className = "forecast-description";
        description.textContent = formatDescription(
            conditions?.description
        );

        card.append(
            heading,
            icon,
            temperature,
            description
        );

        forecastContainer.appendChild(card);
    });
}


/* =========================================
   LOAD WEATHER DATA
   ========================================= */

async function loadWeather() {
    const errorElement = document.querySelector("#weather-error");

    if (API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
        console.warn(
            "Add your OpenWeatherMap API key to scripts/home.js."
        );

        if (errorElement) {
            errorElement.hidden = false;
        }

        return;
    }

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherURL),
            fetch(forecastURL)
        ]);

        if (!currentResponse.ok) {
            throw new Error(
                `Current weather request failed: ${currentResponse.status}`
            );
        }

        if (!forecastResponse.ok) {
            throw new Error(
                `Forecast request failed: ${forecastResponse.status}`
            );
        }

        const [currentData, forecastData] = await Promise.all([
            currentResponse.json(),
            forecastResponse.json()
        ]);

        displayCurrentWeather(currentData);
        displayForecast(forecastData);

        if (errorElement) {
            errorElement.hidden = true;
        }
    } catch (error) {
        console.error("Weather loading error:", error);

        const temperatureElement =
            document.querySelector("#current-temperature");

        const descriptionElement =
            document.querySelector("#weather-description");

        const forecastContainer =
            document.querySelector("#forecast-container");

        if (temperatureElement) {
            temperatureElement.textContent = "Unavailable";
        }

        if (descriptionElement) {
            descriptionElement.textContent =
                "Current weather could not be loaded.";
        }

        if (forecastContainer) {
            forecastContainer.replaceChildren();

            const message = document.createElement("p");
            message.textContent = "Forecast currently unavailable.";
            forecastContainer.appendChild(message);
        }

        if (errorElement) {
            errorElement.hidden = false;
        }
    }
}


/* =========================================
   MEMBERSHIP LEVEL
   ========================================= */

function getMembershipName(level) {
    if (level === 3) {
        return "Gold Member";
    }

    if (level === 2) {
        return "Silver Member";
    }

    return "Member";
}


/* =========================================
   RANDOMIZE MEMBERS
   ========================================= */

function shuffleArray(items) {
    const shuffled = [...items];

    // Fisher-Yates shuffle.
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] =
            [shuffled[j], shuffled[i]];
    }

    return shuffled;
}


/* =========================================
   LOAD BUSINESS SPOTLIGHTS
   ========================================= */

async function loadSpotlights() {
    const container =
        document.querySelector("#spotlight-container");

    const errorElement =
        document.querySelector("#spotlight-error");

    if (!container) {
        return;
    }

    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error(
                `Unable to load members: ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data.members)) {
            throw new Error("The members JSON file has an invalid format.");
        }

        // Keep only silver and gold members.
        const qualifiedMembers = data.members.filter(
            (member) =>
                member.membership === 2 ||
                member.membership === 3
        );

        if (qualifiedMembers.length === 0) {
            throw new Error("No silver or gold members were found.");
        }

        // Randomly select up to three qualified members.
        const selectedMembers = shuffleArray(
            qualifiedMembers
        ).slice(0, 3);

        container.replaceChildren();

        selectedMembers.forEach((member) => {
            const card = document.createElement("article");
            card.className = "spotlight-card";

            const image = document.createElement("img");
            image.className = "spotlight-image";
            image.src = `images/${member.image}`;
            image.alt = `${member.name} logo`;
            image.loading = "lazy";
            image.width = 600;
            image.height = 400;

            // Hide a missing image instead of showing a broken icon.
            image.addEventListener("error", () => {
                image.hidden = true;
            }, { once: true });

            const heading = document.createElement("h3");
            heading.textContent = member.name;

            const membership = document.createElement("span");
            const membershipClass =
                member.membership === 3 ? "gold" : "silver";

            membership.className =
                `spotlight-membership ${membershipClass}`;

            membership.textContent =
                getMembershipName(member.membership);

            const description = document.createElement("p");
            description.textContent = member.description;

            const address = document.createElement("address");
            address.textContent = member.address;

            const phoneParagraph = document.createElement("p");
            const phoneLabel = document.createElement("strong");
            phoneLabel.textContent = "Phone: ";

            const phoneLink = document.createElement("a");
            const phoneNumber = String(member.phone || "");

            phoneLink.href = `tel:${phoneNumber.replace(/[^\d+]/g, "")}`;
            phoneLink.textContent = phoneNumber;

            phoneParagraph.append(phoneLabel, phoneLink);

            const websiteParagraph = document.createElement("p");
            const websiteLink = document.createElement("a");

            websiteLink.className = "website-link";
            websiteLink.href = member.website;
            websiteLink.target = "_blank";
            websiteLink.rel = "noopener noreferrer";
            websiteLink.textContent = "Visit Website";

            websiteParagraph.appendChild(websiteLink);

            card.append(
                image,
                heading,
                membership,
                description,
                address,
                phoneParagraph,
                websiteParagraph
            );

            container.appendChild(card);
        });

        if (errorElement) {
            errorElement.hidden = true;
        }
    } catch (error) {
        console.error("Spotlight loading error:", error);

        container.replaceChildren();

        if (errorElement) {
            errorElement.hidden = false;
        }

        const message = document.createElement("p");
        message.textContent =
            "Business spotlights are currently unavailable.";

        container.appendChild(message);
    }
}


/* =========================================
   INITIALIZE HOME PAGE
   ========================================= */

function initializeHomePage() {
    setFooterInformation();
    setupNavigation();

    loadWeather();
    loadSpotlights();
}

initializeHomePage();
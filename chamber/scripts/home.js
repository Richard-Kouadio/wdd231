
"use strict";

// ============================================
// WDD 231 - Chamber Home Page
// Grand-Bassam, Côte d'Ivoire
// ============================================

// Weather configuration
const API_KEY = "";
const LATITUDE = 5.2;
const LONGITUDE = -3.74;
const UNITS = "metric";

// ============================================
// Footer information
// ============================================

function setFooterInformation() {
    const yearElement = document.querySelector("#current-year");
    const modifiedElement = document.querySelector("#last-modified");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    if (modifiedElement) {
        const modifiedDate = new Date(document.lastModified);

        if (!Number.isNaN(modifiedDate.getTime())) {
            modifiedElement.textContent =
                modifiedDate.toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                });

            modifiedElement.setAttribute(
                "datetime",
                modifiedDate.toISOString()
            );
        }
    }
}

// ============================================
// Mobile navigation
// ============================================

function toggleMenu() {
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

        menuButton.textContent = isOpen ? "✕" : "☰";
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navigation.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
            menuButton.textContent = "☰";
        });
    });
}

// ============================================
// Date helpers
// ============================================

function getLocalDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDay(dateString) {
    const date = new Date(`${dateString}T12:00:00`);

    return new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short"
    }).format(date);
}

// ============================================
// Display weather errors
// ============================================

function showWeatherError(message) {
    const temperatureElement =
        document.querySelector("#current-temperature");
    const descriptionElement =
        document.querySelector("#weather-description");
    const iconElement =
        document.querySelector("#weather-icon");
    const forecastContainer =
        document.querySelector("#forecast-container");
    const errorElement =
        document.querySelector("#weather-error");

    if (temperatureElement) {
        temperatureElement.textContent = "--";
    }

    if (descriptionElement) {
        descriptionElement.textContent =
            "Weather information is unavailable.";
    }

    if (iconElement) {
        iconElement.removeAttribute("src");
        iconElement.alt = "";
        iconElement.hidden = true;
    }

    if (forecastContainer) {
        forecastContainer.replaceChildren();
    }

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.hidden = false;
    }
}

// ============================================
// Display the current weather
// ============================================

function displayCurrentWeather(weatherData) {
    const temperatureElement =
        document.querySelector("#current-temperature");
    const descriptionElement =
        document.querySelector("#weather-description");
    const iconElement =
        document.querySelector("#weather-icon");
    const updatedElement =
        document.querySelector("#weather-updated");
    const errorElement =
        document.querySelector("#weather-error");

    if (
        !temperatureElement ||
        !descriptionElement ||
        !iconElement ||
        !weatherData.main ||
        !weatherData.weather?.[0]
    ) {
        throw new Error("Required weather information is missing.");
    }

    const weather = weatherData.weather[0];

    temperatureElement.textContent =
        `${Math.round(weatherData.main.temp)}°C`;

    descriptionElement.textContent = weather.description;

    // Use the icon code returned by OpenWeatherMap.
    iconElement.src =
        `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

    iconElement.alt = weather.description;
    iconElement.hidden = false;

    if (updatedElement) {
        updatedElement.textContent =
            `Updated at ${new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit"
            })}`;
    }

    if (errorElement) {
        errorElement.textContent = "";
        errorElement.hidden = true;
    }
}

// ============================================
// Display the three-day forecast
// ============================================

function displayForecast(forecastList) {
    const forecastContainer =
        document.querySelector("#forecast-container");

    if (!forecastContainer) {
        return;
    }

    const dailyForecasts = new Map();

    forecastList.forEach((forecast) => {
        const date = forecast.dt_txt.split(" ")[0];

        if (!dailyForecasts.has(date)) {
            dailyForecasts.set(date, []);
        }

        dailyForecasts.get(date).push(forecast);
    });

    const today = getLocalDateKey(new Date());

    const upcomingDays = [...dailyForecasts.entries()]
        .filter(([date]) => date !== today)
        .slice(0, 3);

    forecastContainer.replaceChildren();

    upcomingDays.forEach(([date, forecasts]) => {
        const temperatures = forecasts.map(
            (forecast) => forecast.main.temp
        );

        const minimum = Math.round(Math.min(...temperatures));
        const maximum = Math.round(Math.max(...temperatures));

        const middayForecast =
            forecasts.find((forecast) =>
                forecast.dt_txt.includes("12:00:00")
            ) || forecasts[0];

        const weather = middayForecast.weather[0];

        const card = document.createElement("article");
        card.className = "forecast-card";

        const heading = document.createElement("h3");
        heading.textContent = formatDay(date);

        const icon = document.createElement("img");
        icon.src =
            `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
        icon.alt = weather.description;
        icon.width = 80;
        icon.height = 80;
        icon.loading = "lazy";

        const temperature = document.createElement("p");
        temperature.className = "forecast-temperature";
        temperature.textContent = `${minimum}°C – ${maximum}°C`;

        const description = document.createElement("p");
        description.textContent = weather.description;

        card.append(heading, icon, temperature, description);
        forecastContainer.appendChild(card);
    });

    if (upcomingDays.length === 0) {
        forecastContainer.textContent =
            "No upcoming forecast is available.";
    }
}

// ============================================
// Load weather data from OpenWeatherMap
// ============================================

async function loadWeather() {
    if (!API_KEY) {
        showWeatherError(
            "Weather is unavailable because the API key has not been configured."
        );
        return;
    }

    const currentWeatherURL =
        `https://api.openweathermap.org/data/2.5/weather` +
        `?lat=${LATITUDE}&lon=${LONGITUDE}` +
        `&units=${UNITS}&appid=${API_KEY}`;

    const forecastURL =
        `https://api.openweathermap.org/data/2.5/forecast` +
        `?lat=${LATITUDE}&lon=${LONGITUDE}` +
        `&units=${UNITS}&appid=${API_KEY}`;

    try {
        const currentResponse = await fetch(currentWeatherURL);

        if (!currentResponse.ok) {
            throw new Error(
                `Current weather request failed: ${currentResponse.status}`
            );
        }

        const currentData = await currentResponse.json();
        displayCurrentWeather(currentData);

        const forecastResponse = await fetch(forecastURL);

        if (!forecastResponse.ok) {
            throw new Error(
                `Forecast request failed: ${forecastResponse.status}`
            );
        }

        const forecastData = await forecastResponse.json();

        if (!Array.isArray(forecastData.list)) {
            throw new Error("The forecast data is invalid.");
        }

        displayForecast(forecastData.list);
    } catch (error) {
        console.error("Weather error:", error);

        showWeatherError(
            "Unable to load weather information. Please try again later."
        );
    }
}

// ============================================
// Membership level
// ============================================

function getMembershipName(level) {
    if (level === 3) {
        return "Gold Member";
    }

    if (level === 2) {
        return "Silver Member";
    }

    return "Member";
}

// ============================================
// Load business spotlights
// ============================================

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
            throw new Error("Unable to load member data.");
        }

        const data = await response.json();

        if (!Array.isArray(data.members)) {
            throw new Error("Invalid member data.");
        }

        const eligibleMembers = data.members.filter(
            (member) =>
                member.membership === 2 ||
                member.membership === 3
        );

        // Shuffle the eligible members.
        const shuffledMembers = [...eligibleMembers];

        for (let index = shuffledMembers.length - 1; index > 0; index--) {
            const randomIndex =
                Math.floor(Math.random() * (index + 1));

            [
                shuffledMembers[index],
                shuffledMembers[randomIndex]
            ] = [
                    shuffledMembers[randomIndex],
                    shuffledMembers[index]
                ];
        }

        const selectedMembers = shuffledMembers.slice(0, 3);

        container.replaceChildren();

        selectedMembers.forEach((member) => {
            const card = document.createElement("article");
            card.className = "spotlight-card";

            const image = document.createElement("img");
            image.className = "spotlight-image";
            image.src = `images/${member.image}`;
            image.alt = `${member.name} logo`;
            image.loading = "lazy";
            image.width = 300;
            image.height = 200;

            const heading = document.createElement("h3");
            heading.textContent = member.name;

            const membership = document.createElement("p");
            membership.className = "spotlight-membership";
            membership.textContent =
                getMembershipName(member.membership);

            const description = document.createElement("p");
            description.textContent = member.description;

            const address = document.createElement("address");
            address.textContent = member.address;

            const phoneParagraph = document.createElement("p");
            const phoneLink = document.createElement("a");
            phoneLink.href =
                `tel:${String(member.phone).replace(/[^\d+]/g, "")}`;
            phoneLink.textContent = member.phone;
            phoneLink.setAttribute("aria-label", `Call ${member.name}`);

            phoneParagraph.append("Phone: ", phoneLink);

            const websiteLink = document.createElement("a");
            websiteLink.href = member.website;
            websiteLink.textContent = "Visit Website";
            websiteLink.target = "_blank";
            websiteLink.rel = "noopener noreferrer";

            card.append(
                image,
                heading,
                membership,
                description,
                address,
                phoneParagraph,
                websiteLink
            );

            container.appendChild(card);
        });

        if (selectedMembers.length === 0) {
            container.textContent =
                "No member spotlights are available yet.";
        }

        if (errorElement) {
            errorElement.textContent = "";
            errorElement.hidden = true;
        }
    } catch (error) {
        console.error("Spotlight error:", error);

        container.replaceChildren();

        if (errorElement) {
            errorElement.textContent =
                "Business spotlights are currently unavailable.";
            errorElement.hidden = false;
        }
    }
}

// ============================================
// Start the page
// ============================================

function initializeHomePage() {
    setFooterInformation();
    toggleMenu();
    loadWeather();
    loadSpotlights();
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeHomePage
    );
} else {
    initializeHomePage();
}

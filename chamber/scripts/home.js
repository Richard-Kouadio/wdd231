
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

const weatherURL =
    `https://api.openweathermap.org/data/2.5/forecast?lat=5.2&lon=-3.74&units=metric&appid=${API_KEY}`;


// Footer information

function setFooterInformation() {
    const yearElement = document.querySelector("#current-year");
    const modifiedElement = document.querySelector("#last-modified");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    if (modifiedElement) {
        const modifiedDate = new Date(document.lastModified);

        if (!Number.isNaN(modifiedDate.getTime())) {
            modifiedElement.setAttribute(
                "datetime",
                modifiedDate.toISOString()
            );

            modifiedElement.textContent =
                modifiedDate.toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "UTC",
                    timeZoneName: "short"
                });
        }
    }
}


// Mobile navigation

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


// Weather icons

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


// Date helpers

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


// Load weather

async function loadWeather() {
    const temperatureElement =
        document.querySelector("#current-temperature");

    const descriptionElement =
        document.querySelector("#weather-description");

    const iconElement =
        document.querySelector("#weather-icon");

    const updatedElement =
        document.querySelector("#weather-updated");

    const forecastContainer =
        document.querySelector("#forecast-container");

    const errorElement =
        document.querySelector("#weather-error");

    if (
        !temperatureElement ||
        !descriptionElement ||
        !iconElement ||
        !forecastContainer ||
        !errorElement
    ) {
        return;
    }

    if (
        !API_KEY ||
        API_KEY === "YOUR_OPENWEATHERMAP_API_KEY"
    ) {
        showWeatherError(
            temperatureElement,
            descriptionElement,
            forecastContainer,
            errorElement
        );
        return;
    }

    try {
        const response = await fetch(weatherURL);

        if (!response.ok) {
            throw new Error("Unable to retrieve weather data.");
        }

        const data = await response.json();

        if (!Array.isArray(data.list) || data.list.length === 0) {
            throw new Error("No forecast data was returned.");
        }

        const currentForecast = data.list[0];

        temperatureElement.textContent =
            `${Math.round(currentForecast.main.temp)}°C`;

        descriptionElement.textContent =
            currentForecast.weather[0].description;

        iconElement.textContent =
            getWeatherIcon(currentForecast.weather[0].icon);

        if (updatedElement) {
            updatedElement.textContent =
                `Forecast updated: ${new Date().toLocaleTimeString(
                    "en-GB",
                    { hour: "2-digit", minute: "2-digit" }
                )}`;
        }

        const dailyForecasts = {};

        data.list.forEach((forecast) => {
            const dateKey = forecast.dt_txt.split(" ")[0];

            if (!dailyForecasts[dateKey]) {
                dailyForecasts[dateKey] = [];
            }

            dailyForecasts[dateKey].push(forecast);
        });

        const today = getLocalDateKey(new Date());

        const forecastDates = Object.keys(dailyForecasts)
            .filter((date) => date !== today)
            .slice(0, 3);

        forecastContainer.replaceChildren();

        forecastDates.forEach((date) => {
            const forecasts = dailyForecasts[date];

            const temperatures = forecasts.map(
                (forecast) => forecast.main.temp
            );

            const averageTemperature =
                temperatures.reduce((sum, temp) => sum + temp, 0) /
                temperatures.length;

            const card = document.createElement("article");
            card.className = "forecast-card";

            const heading = document.createElement("h4");
            heading.textContent = formatDay(date);

            const temperature = document.createElement("p");
            temperature.className = "forecast-temperature";
            temperature.textContent =
                `${Math.round(averageTemperature)}°C`;

            card.append(heading, temperature);
            forecastContainer.appendChild(card);
        });

        if (forecastDates.length === 0) {
            forecastContainer.textContent =
                "No upcoming forecast is available.";
        }

        errorElement.hidden = true;
    } catch (error) {
        console.error("Weather error:", error);

        showWeatherError(
            temperatureElement,
            descriptionElement,
            forecastContainer,
            errorElement
        );
    }
}

function showWeatherError(
    temperatureElement,
    descriptionElement,
    forecastContainer,
    errorElement
) {
    temperatureElement.textContent = "Unavailable";
    descriptionElement.textContent =
        "Weather information is currently unavailable.";

    forecastContainer.replaceChildren();
    errorElement.hidden = false;
}


// Membership level

function getMembershipName(level) {
    if (level === 3) {
        return "Gold Member";
    }

    if (level === 2) {
        return "Silver Member";
    }

    return "Member";
}


// Load business spotlights

async function loadSpotlights() {
    const container =
        document.querySelector("#spotlight-container");

    const errorElement =
        document.querySelector("#spotlight-error");

    if (!container || !errorElement) {
        return;
    }

    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error("Unable to load member data.");
        }

        const data = await response.json();

        if (!Array.isArray(data.members)) {
            throw new Error("The member data is not in the expected format.");
        }

        const qualifiedMembers = data.members.filter(
            (member) =>
                member.membership === 2 ||
                member.membership === 3
        );

        // Randomly select up to three Silver and Gold members.
        const shuffledMembers = [...qualifiedMembers];

        for (let i = shuffledMembers.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));

            [shuffledMembers[i], shuffledMembers[randomIndex]] =
                [shuffledMembers[randomIndex], shuffledMembers[i]];
        }

        const selectedMembers = shuffledMembers.slice(0, 3);

        container.replaceChildren();

        selectedMembers.forEach((member) => {
            const card = document.createElement("article");
            card.className = "spotlight-card";

            const image = document.createElement("img");
            image.className = "spotlight-image";
            image.src = `images/${member.image}`;
            image.alt = `${member.name} business`;
            image.loading = "lazy";
            image.width = 600;
            image.height = 400;

            const heading = document.createElement("h3");
            heading.textContent = member.name;

            const membership = document.createElement("span");
            membership.className =
                `spotlight-membership ${member.membership === 3 ? "gold" : "silver"
                }`;
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
            phoneLink.href = `tel:${member.phone.replace(/[^\d+]/g, "")}`;
            phoneLink.textContent = member.phone;

            phoneParagraph.append(phoneLabel, phoneLink);

            const websiteLink = document.createElement("a");
            websiteLink.className = "website-link";
            websiteLink.href = member.website;
            websiteLink.target = "_blank";
            websiteLink.rel = "noopener noreferrer";
            websiteLink.textContent = "Visit Website";

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

        errorElement.hidden = true;
    } catch (error) {
        console.error("Spotlight error:", error);
        container.replaceChildren();
        errorElement.hidden = false;
    }
}


// Start the page

toggleMenu();
setFooterInformation();
loadWeather();
loadSpotlights();
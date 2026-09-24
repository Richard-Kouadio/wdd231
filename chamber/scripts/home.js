const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

const weatherURL =
    `https://api.openweathermap.org/data/2.5/forecast?lat=5.2&lon=-3.74&units=metric&appid=${API_KEY}`;


// ----------------------------------------
// Footer information
// ----------------------------------------

function setFooterInformation() {

    const year = document.querySelector("#current-year");
    const lastModified = document.querySelector("#last-modified");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    if (lastModified) {
        lastModified.textContent = document.lastModified;
    }
}


// ----------------------------------------
// Mobile navigation
// ----------------------------------------

function toggleMenu() {

    const menuButton = document.querySelector("#menu-button");
    const navigation = document.querySelector("#main-nav");

    if (!menuButton || !navigation) {
        return;
    }

    menuButton.addEventListener("click", () => {

        const isOpen = navigation.classList.toggle("open");

        menuButton.setAttribute(
            "aria-expanded",
            isOpen
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

    });
}


// ----------------------------------------
// Weather icons
// ----------------------------------------

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


// ----------------------------------------
// Date helpers
// ----------------------------------------

function getDateKey(date) {

    return date.toISOString().split("T")[0];

}


function formatDay(dateString) {

    const date =
        new Date(`${dateString}T12:00:00`);

    return new Intl.DateTimeFormat(
        "en-US",
        {
            weekday: "short"
        }
    ).format(date);
}


// ----------------------------------------
// Load weather
// ----------------------------------------

async function loadWeather() {

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


    try {

        const response =
            await fetch(weatherURL);


        if (!response.ok) {

            throw new Error(
                "Unable to retrieve weather data."
            );

        }


        const data =
            await response.json();


        // Current weather

        const currentForecast =
            data.list[0];


        temperatureElement.textContent =
            `${Math.round(currentForecast.main.temp)}°C`;


        descriptionElement.textContent =
            currentForecast.weather[0].description;


        iconElement.textContent =
            getWeatherIcon(
                currentForecast.weather[0].icon
            );


        // Group forecasts by date

        const dailyForecasts = {};


        data.list.forEach((forecast) => {

            const dateKey =
                forecast.dt_txt.split(" ")[0];


            if (!dailyForecasts[dateKey]) {

                dailyForecasts[dateKey] = [];

            }


            dailyForecasts[dateKey].push(forecast);

        });


        // Get the next three days

        const forecastDates =
            Object.keys(dailyForecasts)
                .filter(
                    (date) =>
                        date !== getDateKey(new Date())
                )
                .slice(0, 3);


        forecastContainer.innerHTML = "";


        forecastDates.forEach((date) => {

            const forecasts =
                dailyForecasts[date];


            const temperatures =
                forecasts.map(
                    (forecast) =>
                        forecast.main.temp
                );


            const averageTemperature =
                temperatures.reduce(
                    (sum, temp) =>
                        sum + temp,
                    0
                ) / temperatures.length;


            const card =
                document.createElement("article");


            card.className =
                "forecast-card";


            card.innerHTML = `

                <h4>
                    ${formatDay(date)}
                </h4>

                <p class="forecast-temperature">
                    ${Math.round(averageTemperature)}°C
                </p>

            `;


            forecastContainer.appendChild(card);

        });

    }

    catch (error) {

        console.error(
            "Weather error:",
            error
        );


        temperatureElement.textContent =
            "Unavailable";


        descriptionElement.textContent =
            "Weather information is currently unavailable.";


        forecastContainer.innerHTML = "";


        errorElement.hidden = false;

    }

}


// ----------------------------------------
// Membership level
// ----------------------------------------

function getMembershipName(level) {

    return level === 3
        ? "Gold Member"
        : "Silver Member";

}


// ----------------------------------------
// Load business spotlights
// ----------------------------------------

async function loadSpotlights() {

    const container =
        document.querySelector(
            "#spotlight-container"
        );


    const errorElement =
        document.querySelector(
            "#spotlight-error"
        );


    try {

        const response =
            await fetch("data/members.json");


        if (!response.ok) {

            throw new Error(
                "Unable to load member data."
            );

        }


        const data =
            await response.json();


        // Only Silver and Gold members

        const qualifiedMembers =
            data.members.filter(
                (member) =>
                    member.membership === 2 ||
                    member.membership === 3
            );


        // Randomize members

        const shuffledMembers =
            [...qualifiedMembers]
                .sort(
                    () =>
                        Math.random() - 0.5
                );


        // Select three members

        const selectedMembers =
            shuffledMembers.slice(0, 3);


        container.innerHTML = "";


        selectedMembers.forEach(
            (member) => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "spotlight-card";


                const membershipClass =
                    member.membership === 3
                        ? "gold"
                        : "silver";


                card.innerHTML = `

                    <img
                        class="spotlight-image"
                        src="images/${member.image}"
                        alt="${member.name} business image"
                        loading="lazy"
                        width="600"
                        height="400">

                    <h3>
                        ${member.name}
                    </h3>

                    <span
                        class="spotlight-membership ${membershipClass}">
                        ${getMembershipName(member.membership)}
                    </span>

                    <p>
                        ${member.description}
                    </p>

                    <address>
                        ${member.address}
                    </address>

                    <p>
                        <strong>Phone:</strong>
                        <a href="tel:${member.phone.replace(/\s/g, "")}">
                            ${member.phone}
                        </a>
                    </p>

                    <a
                        class="website-link"
                        href="${member.website}"
                        target="_blank"
                        rel="noopener noreferrer">
                        Visit Website
                    </a>

                `;


                container.appendChild(card);

            }
        );

    }

    catch (error) {

        console.error(
            "Spotlight error:",
            error
        );


        errorElement.hidden = false;

    }

}


// ----------------------------------------
// Start page
// ----------------------------------------

toggleMenu();

setFooterInformation();

loadWeather();

loadSpotlights();
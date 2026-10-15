const resultsContainer = document.querySelector("#form-results");
const parameters = new URLSearchParams(window.location.search);

const fields = [
    ["Name", "name"],
    ["Email", "email"],
    ["Main Interest", "interest"],
    ["Planned Visit Date", "visit-date"],
    ["Message", "message"]
];

const hasSubmission = fields.some(([, key]) => {
    return parameters.has(key) && parameters.get(key).trim() !== "";
});

resultsContainer.replaceChildren();

if (hasSubmission) {
    fields.forEach(([label, key]) => {
        const paragraph = document.createElement("p");
        const strong = document.createElement("strong");

        strong.textContent = `${label}: `;

        const value = parameters.get(key);
        paragraph.append(
            strong,
            document.createTextNode(
                value && value.trim() ? value : "Not provided"
            )
        );

        resultsContainer.append(paragraph);
    });
} else {
    const message = document.createElement("p");
    message.textContent = "No form information was submitted.";
    resultsContainer.append(message);
}
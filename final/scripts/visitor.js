const visitorForm = document.querySelector("#visitor-form");
const savedInterest = document.querySelector("#saved-interest");
const interestInput = document.querySelector("#interest");

const STORAGE_KEY = "grandBassamVisitorInterest";

function displaySavedInterest(interest) {
    if (!savedInterest) return;

    savedInterest.textContent = interest
        ? `Your saved interest is: ${interest}.`
        : "No visitor interest has been saved yet.";
}

function loadSavedInterest() {
    try {
        const storedInterest = localStorage.getItem(STORAGE_KEY);

        if (storedInterest && interestInput) {
            const matchingOption = Array.from(interestInput.options)
                .find((option) => option.value === storedInterest);

            if (matchingOption) {
                interestInput.value = storedInterest;
            }
        }

        displaySavedInterest(storedInterest);
    } catch (error) {
        console.error("Unable to read visitor preference:", error);
        displaySavedInterest("");
    }
}

if (interestInput) {
    interestInput.addEventListener("change", () => {
        const selectedInterest = interestInput.value;

        try {
            if (selectedInterest) {
                localStorage.setItem(STORAGE_KEY, selectedInterest);
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }

            displaySavedInterest(selectedInterest);
        } catch (error) {
            console.error("Unable to save visitor preference:", error);

            if (savedInterest) {
                savedInterest.textContent =
                    "Your browser could not save this preference.";
            }
        }
    });
}

if (visitorForm) {
    visitorForm.addEventListener("submit", (event) => {
        if (!visitorForm.reportValidity()) {
            event.preventDefault();
            return;
        }

        // The form submits to form-action.html using GET.
        // The selected interest is saved separately in localStorage.
        try {
            const selectedInterest = interestInput.value;

            if (selectedInterest) {
                localStorage.setItem(STORAGE_KEY, selectedInterest);
            }
        } catch (error) {
            // The form should still submit if storage is unavailable.
            console.error("Unable to save preference during submission:", error);
        }
    });
}

loadSavedInterest();
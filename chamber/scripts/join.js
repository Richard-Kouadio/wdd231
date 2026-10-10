"use strict";

// Set the current date and time in the hidden timestamp field
const timestamp = document.querySelector("#timestamp");

if (timestamp) {
    timestamp.value = new Date().toISOString();
}

// Membership modal functionality
const membershipButtons = document.querySelectorAll(".membership-link");

membershipButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const modalId = button.dataset.modal;
        const modal = document.getElementById(modalId);

        if (modal) {
            modal.showModal();
        }
    });
});

// Close buttons and outside-click functionality
const modals = document.querySelectorAll("dialog");

modals.forEach((modal) => {
    const closeButton = modal.querySelector(".close-modal");

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            modal.close();
        });
    }

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.close();
        }
    });
});

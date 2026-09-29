// Set the current date and time in the hidden timestamp field
const timestamp = document.querySelector("#timestamp");

if (timestamp) {
    timestamp.value = new Date().toISOString();
}

// Membership modal functionality
const membershipButtons = document.querySelectorAll(".membership-info");
const modals = document.querySelectorAll("dialog");

membershipButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const modalId = button.getAttribute("data-dialog");
        const modal = document.getElementById(modalId);

        if (modal) {
            modal.showModal();
        }
    });
});

// Close each modal
modals.forEach((modal) => {
    const closeButton = modal.querySelector(".close-modal");

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            modal.close();
        });
    }

    // Close the modal when clicking outside the dialog content
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.close();
        }
    });
});
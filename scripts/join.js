// =========================================
// WDD 231 - Chamber Join Page
// join.js
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    setTimestamp();
    setupMembershipModals();
});


// =========================================
// FORM TIMESTAMP
// =========================================

function setTimestamp() {
    const timestamp = document.querySelector("#timestamp");

    if (!timestamp) {
        return;
    }

    const currentDateTime = new Date();

    timestamp.value = currentDateTime.toISOString();
}


// =========================================
// MEMBERSHIP MODALS
// =========================================

function setupMembershipModals() {
    const modalButtons = document.querySelectorAll("[data-modal-target]");

    modalButtons.forEach((button) => {
        const modalId = button.dataset.modalTarget;
        const modal = document.getElementById(modalId);

        if (!modal) {
            return;
        }

        // Open the modal
        button.addEventListener("click", () => {
            modal.showModal();
        });

        // Find the close button
        const closeButton = modal.querySelector(".modal-close");

        if (closeButton) {
            closeButton.addEventListener("click", () => {
                modal.close();
            });
        }

        // Close when clicking outside the dialog
        modal.addEventListener("click", (event) => {
            const rectangle = modal.getBoundingClientRect();

            const clickedOutside =
                event.clientX < rectangle.left ||
                event.clientX > rectangle.right ||
                event.clientY < rectangle.top ||
                event.clientY > rectangle.bottom;

            if (clickedOutside) {
                modal.close();
            }
        });
    });
}

// =========================================
// W04 - CHAMBER JOIN PAGE
// join.js
// =========================================

// Wait until the HTML document is ready
document.addEventListener("DOMContentLoaded", () => {
    setFormTimestamp();
    setupMembershipModals();
});


// =========================================
// TIMESTAMP
// =========================================

/**
 * Stores the current date and time in the
 * hidden timestamp field when the page loads.
 */
function setFormTimestamp() {
    const timestampField = document.querySelector("#timestamp");

    if (!timestampField) {
        return;
    }

    const now = new Date();

    timestampField.value = now.toISOString();
}


// =========================================
// MEMBERSHIP MODALS
// =========================================

/**
 * Finds all membership information buttons
 * and connects them to their corresponding
 * dialog elements.
 */
function setupMembershipModals() {
    const membershipButtons = document.querySelectorAll(
        "[data-modal-target]"
    );

    membershipButtons.forEach((button) => {
        const modalId = button.getAttribute("data-modal-target");
        const modal = document.querySelector(`#${modalId}`);

        if (!modal) {
            return;
        }

        // Open modal
        button.addEventListener("click", () => {
            modal.showModal();
        });

        // Close buttons inside the modal
        const closeButton = modal.querySelector(".modal-close");

        if (closeButton) {
            closeButton.addEventListener("click", () => {
                modal.close();
            });
        }

        // Close modal when clicking outside the dialog content
        modal.addEventListener("click", (event) => {
            const dialogRectangle = modal.getBoundingClientRect();

            const clickedOutside =
                event.clientX < dialogRectangle.left ||
                event.clientX > dialogRectangle.right ||
                event.clientY < dialogRectangle.top ||
                event.clientY > dialogRectangle.bottom;

            if (clickedOutside) {
                modal.close();
            }
        });
    });
}
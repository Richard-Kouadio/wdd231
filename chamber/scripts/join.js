// Set the timestamp when the page loads
const timestampField = document.querySelector("#timestamp");

if (timestampField) {
    timestampField.value = new Date().toISOString();
}

// Membership modal functionality
const membershipButtons = document.querySelectorAll(".membership-info");
const dialogs = document.querySelectorAll("dialog");

membershipButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const dialogId = button.dataset.dialog;
        const dialog = document.getElementById(dialogId);

        if (dialog) {
            dialog.showModal();
        }
    });
});

dialogs.forEach((dialog) => {
    const closeButton = dialog.querySelector(".close-modal");

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            dialog.close();
        });
    }

    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
});

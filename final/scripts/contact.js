const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");

if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", (event) => {
        if (!contactForm.reportValidity()) {
            event.preventDefault();
            return;
        }

        const parameters = new URLSearchParams(
            new FormData(contactForm)
        );

        event.preventDefault();

        const name = parameters.get("name")?.trim() ?? "";

        contactStatus.textContent =
            `Thank you, ${name}. Your form information has been validated. ` +
            "This demonstration does not send messages to an email inbox.";

        contactForm.reset();
    });
}
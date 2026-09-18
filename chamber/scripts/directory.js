const membersContainer = document.querySelector("#members-container");
const memberCount = document.querySelector("#member-count");

const gridButton = document.querySelector("#grid-view");
const listButton = document.querySelector("#list-view");

const menuButton = document.querySelector("#menu-button");
const mainNav = document.querySelector("#main-nav");

const membershipNames = {
    1: "Member",
    2: "Silver Member",
    3: "Gold Member"
};

async function getMembers() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        displayMembers(data.members);
    } catch (error) {
        console.error("Unable to load member data:", error);

        membersContainer.innerHTML = `
            <p class="error-message">
                Sorry, the member directory could not be loaded.
                Please try again later.
            </p>
        `;

        memberCount.textContent = "Unable to load members.";
    }
}

function displayMembers(members) {
    membersContainer.innerHTML = "";

    memberCount.textContent =
        `${members.length} businesses are members of the chamber.`;

    members.forEach((member) => {
        const card = document.createElement("article");

        card.classList.add("member-card");

        const membershipName =
            membershipNames[member.membership] || "Member";

        card.innerHTML = `
            <div class="member-image-container">
                <img
                    src="images/${member.image}"
                    alt="${member.name}"
                    loading="lazy"
                >
            </div>

            <div class="member-information">
                <span class="membership-badge level-${member.membership}">
                    ${membershipName}
                </span>

                <h3>${member.name}</h3>

                <p class="member-description">
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
                    rel="noopener noreferrer"
                >
                    Visit Website
                </a>
            </div>
        `;

        membersContainer.appendChild(card);
    });
}

function setGridView() {
    membersContainer.classList.remove("members-list");
    membersContainer.classList.add("members-grid");

    gridButton.classList.add("active");
    listButton.classList.remove("active");

    gridButton.setAttribute("aria-pressed", "true");
    listButton.setAttribute("aria-pressed", "false");
}

function setListView() {
    membersContainer.classList.remove("members-grid");
    membersContainer.classList.add("members-list");

    listButton.classList.add("active");
    gridButton.classList.remove("active");

    listButton.setAttribute("aria-pressed", "true");
    gridButton.setAttribute("aria-pressed", "false");
}

gridButton.addEventListener("click", setGridView);
listButton.addEventListener("click", setListView);

menuButton.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});

document.querySelector("#current-year").textContent =
    new Date().getFullYear();

document.querySelector("#last-modified").textContent =
    document.lastModified;

getMembers();

document.addEventListener("DOMContentLoaded", function () {
    fetch("./projects.json")
        .then((response) => response.json())
        .then((data) => {
            const projects = data.projects;

            const portfolio = document.querySelector(".portfolio");

            projects.forEach((project) => {
                const card = document.createElement("div");
                card.className = "card";

                const cardTitle = document.createElement("h3");
                cardTitle.className = "card-title";
                cardTitle.textContent = project.title;
                card.appendChild(cardTitle);

                const hr = document.createElement("hr");
                hr.setAttribute("noshade", true);
                card.appendChild(hr);

                const description = document.createElement("p");
                description.textContent = project.description;
                card.appendChild(description);

                const cardLinks = document.createElement("div");
                cardLinks.className = "card-links";

                const websiteLink = document.createElement("a");
                websiteLink.href = project.website;
                websiteLink.className = "card-link";
                const websiteIcon = document.createElement("img");
                websiteIcon.src = "./assets/icons/link.svg";
                websiteIcon.alt = "Website";
                websiteLink.appendChild(websiteIcon);
                cardLinks.appendChild(websiteLink);

                const githubLink = document.createElement("a");
                githubLink.href = project.github;
                githubLink.className = "card-link";
                const githubIcon = document.createElement("img");
                githubIcon.src = "./assets/icons/github.svg";
                githubIcon.alt = "GitHub";
                githubLink.appendChild(githubIcon);
                cardLinks.appendChild(githubLink);

                card.appendChild(cardLinks);
                portfolio.appendChild(card);
            });
        })
        .catch((error) => console.error("Error loading projects:", error));
});

function aboutPage() {
    const portfolio = document.querySelector(".content");
    portfolio.innerHTML = "";

    const aboutTitle = document.createElement("h2");
    aboutTitle.textContent = "About Us";
    portfolio.appendChild(aboutTitle);

    const aboutParagraph = document.createElement("p");
    fetch("./about.txt")
        .then((response) => response.text())
        .then((text) => {
            aboutParagraph.textContent = text;
        })
        .catch((error) => console.error("Error loading about text:", error));
    portfolio.appendChild(aboutParagraph);
    portfolio.appendChild(aboutParagraph);
}

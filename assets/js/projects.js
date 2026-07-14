async function loadProjects() {
  const grid = document.querySelector("[data-project-grid]");
  if (!grid) return;

  try {
    const res = await fetch("data/projects.json");
    if (!res.ok) {
      throw new Error(`Projects request failed: ${res.status}`);
    }
    const projects = await res.json();

    grid.innerHTML = projects
      .map(
        (p) => `
      <article class="card reveal">
        <div class="card-kicker">${p.category}</div>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-body">${p.description}</p>
        <div class="card-meta">
          <span>${p.stack}</span>
          ${
            p.link
              ? `<a href="${p.link}" target="_blank" rel="noreferrer">View ↗</a>`
              : ""
          }
        </div>
      </article>
    `
      )
      .join("");

    document
      .querySelectorAll(".card.reveal")
      .forEach((el) => el.classList.add("reveal-delay-1"));
  } catch (err) {
    console.error("Failed to load projects", err);
  }
}

document.addEventListener("DOMContentLoaded", loadProjects);

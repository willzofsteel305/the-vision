const PROJECTS_DATA_URL = "data/projects.json";

const FALLBACK_PROJECTS = [
  {
    title: "IRON WILLZ Experience",
    category: "Signature Build",
    description:
      "A cinematic, high-contrast personal brand experience blending motion, music, and interactive storytelling.",
    stack: "HTML • CSS • JavaScript • GitHub Pages",
    liveUrl: "https://willzofsteel305.github.io/the-vision/",
    sourceUrl: "https://github.com/willzofsteel305/the-vision",
  },
  {
    title: "Clinical Simulator UI",
    category: "Product Design",
    description:
      "A focused, distraction-free interface for complex clinical decision-making with clear hierarchy and feedback.",
    stack: "TypeScript • Product UI",
    sourceUrl: "https://github.com/willzofsteel305/church-social-app",
  },
  {
    title: "Hooks Music Visual Hub",
    category: "Music & Visuals",
    description:
      "A visual-first hub for releases, playlists, and live sets with motion-reactive accents.",
    stack: "Web • Music • Visuals",
    sourceUrl: "https://github.com/willzofsteel305/iron-willz",
  },
];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toSafeHttpUrl(value) {
  if (typeof value !== "string" || value.trim() === "") return null;

  try {
    const parsedUrl = new URL(value, window.location.href);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
      ? parsedUrl.href
      : null;
  } catch {
    return null;
  }
}

function setStatus(statusNode, message, type = "info") {
  if (!statusNode) return;

  statusNode.textContent = message;
  statusNode.className = "status-message";

  if (type === "error") {
    statusNode.classList.add("status-message--error");
  }

  if (type === "success") {
    statusNode.classList.add("status-message--success");
  }
}

function renderProjectCard(project) {
  const category = escapeHtml(project.category || "Featured project");
  const title = escapeHtml(project.title || "Untitled project");
  const description = escapeHtml(project.description || "Details coming soon.");
  const stack = escapeHtml(project.stack || "Stack details coming soon.");

  const liveUrl = toSafeHttpUrl(project.liveUrl);
  const sourceUrl = toSafeHttpUrl(project.sourceUrl);

  const links = [];
  if (liveUrl) {
    links.push(
      `<a href="${liveUrl}" target="_blank" rel="noopener noreferrer">Live ↗</a>`
    );
  }
  if (sourceUrl) {
    links.push(
      `<a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">Source ↗</a>`
    );
  }

  return `
    <article class="card reveal reveal--visible">
      <div class="card-kicker">${category}</div>
      <h3 class="card-title">${title}</h3>
      <p class="card-body">${description}</p>
      <div class="card-meta">
        <span>${stack}</span>
        ${links.length ? `<div class="card-links">${links.join("")}</div>` : ""}
      </div>
    </article>
  `;
}

function renderProjects(projects, gridNode) {
  if (!Array.isArray(projects) || projects.length === 0) {
    gridNode.innerHTML = `
      <article class="card card-empty reveal reveal--visible">
        <div class="card-kicker">No projects yet</div>
        <h3 class="card-title">Fresh work is on the way.</h3>
        <p class="card-body">Check back soon for new case studies and live builds.</p>
      </article>
    `;
    return 0;
  }

  gridNode.innerHTML = projects.map(renderProjectCard).join("");
  return projects.length;
}

async function loadProjects() {
  const grid = document.querySelector("[data-project-grid]");
  const status = document.querySelector("[data-project-status]");

  if (!grid) return;

  setStatus(status, "Loading projects…");

  try {
    const response = await fetch(PROJECTS_DATA_URL, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const projects = await response.json();

    if (!Array.isArray(projects)) {
      throw new Error("Projects data must be an array.");
    }

    const count = renderProjects(projects, grid);
    setStatus(
      status,
      count > 0 ? `Loaded ${count} project${count === 1 ? "" : "s"}.` : "",
      "success"
    );
  } catch (error) {
    console.error("Failed to load projects from data/projects.json", error);

    const fallbackCount = renderProjects(FALLBACK_PROJECTS, grid);
    setStatus(
      status,
      `Could not load live project data. Showing ${fallbackCount} fallback project${
        fallbackCount === 1 ? "" : "s"
      } instead.`,
      "error"
    );
  }
}

document.addEventListener("DOMContentLoaded", loadProjects);

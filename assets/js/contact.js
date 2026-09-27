const CONTACT_EMAIL = "willzofsteel305@gmail.com";
const MIN_HUMAN_TIME_MS = 2500;

function setFormStatus(statusNode, message, type = "info") {
  if (!statusNode) return;

  statusNode.textContent = message;
  statusNode.className = "form-status";

  if (type === "error") {
    statusNode.classList.add("form-status--error");
  }

  if (type === "success") {
    statusNode.classList.add("form-status--success");
  }
}

function buildEmailBody(fields) {
  const lines = [];

  if (fields.project && fields.project.trim()) {
    lines.push(`Project type: ${fields.project.trim()}`);
  }

  lines.push("");
  lines.push("Project details:");
  lines.push(fields.message ? fields.message.trim() : "");

  return lines.join("\n");
}

function buildGmailUrl(fields) {
  const subject = fields.project
    ? `New project enquiry: ${fields.project}`
    : "New project enquiry";

  const body = buildEmailBody(fields);

  // Note: the browser embeds the draft content into the URL query string when
  // opening Gmail. That means the project details may appear in browser history,
  // logs, or URL inspection tooling. This is a static-site limitation.
  const gmailBase = "https://mail.google.com/mail/?view=cm&fs=1";
  const params = new URLSearchParams({
    to: CONTACT_EMAIL,
    su: subject,
    body,
  });

  return `${gmailBase}&${params.toString()}`;
}

function buildMailtoUrl(fields) {
  const subject = fields.project
    ? `New project enquiry: ${fields.project}`
    : "New project enquiry";

  const body = buildEmailBody(fields);
  const params = new URLSearchParams({
    subject,
    body,
  });

  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}

function setDirectEmailLink(linkNode, fields) {
  if (!linkNode) return;

  const url = buildMailtoUrl(fields);
  linkNode.href = url;
  linkNode.setAttribute("aria-label", "Open a direct email draft for this enquiry");
}

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const directEmailLink = document.querySelector("[data-direct-email-link]");
  let createdAt = Date.now();

  form.addEventListener("input", () => {
    if (Date.now() - createdAt > MIN_HUMAN_TIME_MS) {
      setFormStatus(status, "", "info");
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const websiteTrap = form.elements.website?.value?.trim();
    if (websiteTrap) {
      setFormStatus(
        status,
        "Thanks — your message has been received.",
        "success"
      );
      form.reset();
      createdAt = Date.now();
      return;
    }

    if (Date.now() - createdAt < MIN_HUMAN_TIME_MS) {
      setFormStatus(
        status,
        "Please wait 2.5 seconds before submitting again.",
        "error"
      );
      return;
    }

    if (!form.checkValidity()) {
      setFormStatus(
        status,
        "Please complete the required fields before sending.",
        "error"
      );
      form.reportValidity();
      return;
    }

    const fields = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      project: form.elements.project.value.trim(),
      message: form.elements.message.value.trim(),
    };

    if (directEmailLink) {
      setDirectEmailLink(directEmailLink, fields);
    }

    try {
      const gmailUrl = buildGmailUrl(fields);
      const directMailtoUrl = buildMailtoUrl(fields);
      const popup = window.open(gmailUrl, "_blank", "noopener,noreferrer");

      if (popup) {
        popup.opener = null;
        setFormStatus(
          status,
          "A Gmail draft is ready. Review it and click Send. If Gmail did not open, use the direct email option below.",
          "success"
        );
        return;
      }

      window.location.href = directMailtoUrl;
      setFormStatus(
        status,
        "A direct email draft is opening. Review it and click Send.",
        "success"
      );
    } catch (error) {
      console.error("Failed to open email client", error);
      setFormStatus(
        status,
        "Could not open a draft automatically. Please use the direct email link above.",
        "error"
      );
    }
  });
}

document.addEventListener("DOMContentLoaded", initContactForm);

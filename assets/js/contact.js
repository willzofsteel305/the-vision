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

function buildEmailDraft(fields) {
  const subject = fields.project
    ? `New project enquiry: ${fields.project}`
    : "New project enquiry";

  const body = [
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    fields.project ? `Project type: ${fields.project}` : null,
    "",
    "Project details:",
    fields.message,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, body };
}

function buildGmailComposeUrl({ subject, body }) {
  // Privacy note: this static-site workflow embeds subject/body in URL query
  // parameters, so project details may appear in browser history or URL logs.
  // A backend is required to avoid this exposure.
  const gmailUrl = new URL("https://mail.google.com/mail/u/0/");
  gmailUrl.searchParams.set("view", "cm");
  gmailUrl.searchParams.set("fs", "1");
  gmailUrl.searchParams.set("tf", "1");
  gmailUrl.searchParams.set("to", CONTACT_EMAIL);
  gmailUrl.searchParams.set("su", subject);
  gmailUrl.searchParams.set("body", body);
  return gmailUrl.toString();
}

function buildMailtoUrl({ subject, body }) {
  const params = new URLSearchParams({
    subject,
    body,
  });
  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const fallbackLink = form.querySelector("[data-mailto-fallback]");
  let lastMeaningfulInteractionAt = 0;

  form.addEventListener("input", (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    if (event.target.getAttribute("name") === "website") return;
    lastMeaningfulInteractionAt = Date.now();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const websiteTrap = form.elements.website?.value?.trim();
    if (websiteTrap) {
      setFormStatus(status, "Thanks. Please use the direct email option below.");
      return;
    }

    if (!lastMeaningfulInteractionAt) {
      lastMeaningfulInteractionAt = Date.now();
    }

    if (Date.now() - lastMeaningfulInteractionAt < MIN_HUMAN_TIME_MS) {
      setFormStatus(
        status,
        "Please wait at least 2.5 seconds after your last update before opening a draft.",
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

    const emailDraft = buildEmailDraft(fields);
    const gmailComposeUrl = buildGmailComposeUrl(emailDraft);
    const mailtoFallbackUrl = buildMailtoUrl(emailDraft);

    if (fallbackLink) {
      fallbackLink.href = mailtoFallbackUrl;
    }

    try {
      const composeWindow = window.open(gmailComposeUrl, "_blank");

      if (!composeWindow) {
        setFormStatus(
          status,
          "A new tab was blocked, so Gmail will open in this tab. If Gmail is unavailable, use the prefilled email fallback link below.",
          "info"
        );
        window.location.href = gmailComposeUrl;
        return;
      }
      composeWindow.opener = null;

      setFormStatus(
        status,
        "A Gmail draft was prepared in a new tab. Please review it and click Send. If needed, use the prefilled email fallback link below.",
        "success"
      );
    } catch (error) {
      console.error("Failed to open email client", error);
      setFormStatus(
        status,
        "Could not open Gmail. Use the prefilled email fallback link below.",
        "error"
      );
    }
  });
}

document.addEventListener("DOMContentLoaded", initContactForm);

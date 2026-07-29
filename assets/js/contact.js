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

function buildMailtoUrl(fields) {
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

  return `mailto:${encodeURIComponent(CONTACT_EMAIL)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  let createdAt = Date.now();

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
      setFormStatus(status, "Please wait a second before submitting.", "error");
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

    try {
      window.location.href = buildMailtoUrl(fields);
      setFormStatus(
        status,
        "Your email app should open now. If it does not, use the direct mail link above.",
        "success"
      );
      form.reset();
      createdAt = Date.now();
    } catch (error) {
      console.error("Failed to open email client", error);
      setFormStatus(
        status,
        "Could not open your email app. Please use the direct mail link above.",
        "error"
      );
    }
  });
}

document.addEventListener("DOMContentLoaded", initContactForm);

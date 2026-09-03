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

  // Gmail web compose URL — opens Gmail's compose with to/subject/body prefilled.
  // Uses URLSearchParams to ensure proper encoding.
  const gmailBase = "https://mail.google.com/mail/?view=cm&fs=1";
  const params = new URLSearchParams({
    to: CONTACT_EMAIL,
    su: subject,
    body: body,
  });
  return `${gmailBase}&${params.toString()}`;
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
      // Navigate to Gmail compose (or the user's webmail compose). If the user
      // isn't signed in to Gmail this will redirect them to Gmail's sign-in page.
      window.location.href = buildMailtoUrl(fields);
      setFormStatus(
        status,
        "A Gmail compose window should open. If it doesn't, use the direct mail link above.",
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

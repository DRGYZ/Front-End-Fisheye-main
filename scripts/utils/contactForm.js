// Contact Modal Handler

// DOMContentLoaded ensures everything's loaded before we try to attach events
document.addEventListener("DOMContentLoaded", () => {
  const contactBtn = document.getElementById("contact-btn");
  if (contactBtn) {
    contactBtn.addEventListener("click", showModal);
  }

  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }
});

function showModal() {
  const modal = document.getElementById("contact_modal");
  if (!modal) return;

  modal.classList.remove("hidden");
  modal.classList.add("active");

  // Focus first input for accessibility
  const firstInput = modal.querySelector("input, textarea, select");
  if (firstInput) firstInput.focus();
}

function closeModal() {
  const modal = document.getElementById("contact_modal");
  if (!modal) return;

  modal.classList.add("hidden");
  modal.classList.remove("active");
}

function handleFormSubmit(e) {
  e.preventDefault();

  const data = {
    firstName: document.getElementById("firstName")?.value,
    email: document.getElementById("email")?.value,
    message: document.getElementById("message")?.value,
  };

  console.log("Form submitted:", data);

  e.target.reset();
  closeModal();
}

// Escape key closes modal
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;

  const modal = document.getElementById("contact_modal");
  if (modal && modal.classList.contains("active")) {
    closeModal();
  }
});

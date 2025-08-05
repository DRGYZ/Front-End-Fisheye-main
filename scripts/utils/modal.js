
// ===== Modal Controller =====

let removeFocusTrap = null;
let lastFocusedElement = null;
let escapeHandler = null;

const createFocusTrap = (modal) => {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusableElements.length) return null;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeydown = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };

  modal.addEventListener('keydown', handleKeydown);
  return () => modal.removeEventListener('keydown', handleKeydown);
};

// Create modal dynamically
export function createContactModal(photographerName) {
  const modal = document.createElement('div');
  modal.id = 'contact_modal';
  modal.className = 'modal hidden';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'contact_modal_title');

  modal.innerHTML = `
    <div class="modal-content">
      <header class="modal-header">
        <h2 id="contact_modal_title">Contactez-moi<br><span>${photographerName}</span></h2>
        <img src="assets/icons/close.svg" alt="Fermer la fenêtre de contact"
          class="close-modal-icon" role="button" tabindex="0" aria-label="Fermer la fenêtre de contact" />
      </header>
      <form id="contact-form" novalidate>
        <div class="form-group">
          <label for="firstName">Prénom</label>
          <input type="text" id="firstName" name="firstName" required />
        </div>
        <div class="form-group">
          <label for="lastName">Nom</label>
          <input type="text" id="lastName" name="lastName" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div class="form-group">
          <label for="message">Votre message</label>
          <textarea id="message" name="message" required></textarea>
        </div>
        <button type="submit" class="contact_button">Envoyer</button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Close button event
  modal.querySelector('.close-modal-icon').addEventListener('click', () => closeModal(modal));

  // Form validation
  const form = modal.querySelector('#contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { firstName, lastName, email, message } = form;
    const errors = [];

    if (!firstName.value.trim()) errors.push("Le prénom est requis.");
    if (!lastName.value.trim()) errors.push("Le nom est requis.");
    if (!email.value.trim()) errors.push("L'email est requis.");
    if (!message.value.trim()) errors.push("Le message est requis.");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailRegex.test(email.value)) {
      errors.push("L'email n'est pas valide.");
    }

    if (errors.length) {
      alert(errors.join('\n'));
      return;
    }

    console.log("✅ Form submitted with:", {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      message: message.value.trim()
    });

    form.reset();
    closeModal(modal);
  });
}

export const openModal = (modal) => {
  lastFocusedElement = document.activeElement;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  removeFocusTrap = createFocusTrap(modal);

  escapeHandler = (e) => {
    if (e.key === 'Escape') closeModal(modal);
  };
  document.addEventListener('keydown', escapeHandler);

  setTimeout(() => {
    const firstFocusable = modal.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) firstFocusable.focus();
  }, 100);
};

export const closeModal = (modal) => {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');

  if (removeFocusTrap) {
    removeFocusTrap();
    removeFocusTrap = null;
  }
  if (escapeHandler) {
    document.removeEventListener('keydown', escapeHandler);
    escapeHandler = null;
  }
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
};

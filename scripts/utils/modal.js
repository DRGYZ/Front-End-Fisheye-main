// ===== Focus Trap Modal Logic =====

let removeFocusTrap = null;
let lastFocusedElement = null;
let escapeHandler = null;

const createFocusTrap = (modal) => {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return null;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeydown = (e) => {
    if (e.key !== 'Tab') return;

    // Shift + Tab on first element => loop to last
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }
    // Tab on last element => loop to first
    else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };

  modal.addEventListener('keydown', handleKeydown);

  return () => {
    modal.removeEventListener('keydown', handleKeydown);
  };
};
export function createContactModal(photographerName) {
  const modal = document.createElement('div');
  modal.id = 'contact_modal';
  modal.className = 'modal hidden';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'contact_modal_title');

  modal.innerHTML = `
    <div class="modal-content">
      <header class="photograph-header">
        <h2 id="contact_modal_title">Contactez-moi<br><span>${photographerName}</span></h2>
        <img
          src="assets/icons/close.svg"
          alt="Fermer la fenêtre de contact"
          class="close-modal-icon"
          role="button"
          tabindex="0"
          aria-label="Fermer la fenêtre de contact"
        />
      </header>
      <form id="contactForm">
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
}


export const openModal = (modal) => {
  lastFocusedElement = document.activeElement;

  modal.style.display = 'block';
modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');

  removeFocusTrap = createFocusTrap(modal);

  escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal(modal);
    }
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
  modal.style.display = 'none';
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

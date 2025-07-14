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

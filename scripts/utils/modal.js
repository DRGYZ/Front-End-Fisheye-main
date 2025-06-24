// Focus trap management
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
    
    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  };
  
  modal.addEventListener('keydown', handleKeydown);
  return () => {
    modal.removeEventListener('keydown', handleKeydown);
  };
};

export const openModal = (modal) => {
  // Store last focused element
  lastFocusedElement = document.activeElement;
  
  // Show modal
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  
  // Set up focus trap
  removeFocusTrap = createFocusTrap(modal);
  
  // Add escape key handler
  escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal(modal);
    }
  };
  document.addEventListener('keydown', escapeHandler);
  
  // Focus first element
  setTimeout(() => {
    const firstFocusable = modal.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) firstFocusable.focus();
  }, 100);
};

export const closeModal = (modal) => {
  // Hide modal
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  
  // Cleanup focus trap
  if (removeFocusTrap) {
    removeFocusTrap();
    removeFocusTrap = null;
  }
  
  // Remove escape handler
  if (escapeHandler) {
    document.removeEventListener('keydown', escapeHandler);
    escapeHandler = null;
  }
  
  // Restore focus
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
};
// Focus trap for accessibility
const trapFocus = (element) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  });
};

// Manage modal open/close focus
let lastFocusedElement;

export const openModal = (modal) => {
  lastFocusedElement = document.activeElement;
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  
  // Focus first element
  const firstInput = modal.querySelector('input');
  firstInput.focus();
  
  trapFocus(modal);
  document.body.classList.add('no-scroll');
};

export const closeModal = (modal) => {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  
  // Return focus to trigger element
  if (lastFocusedElement) lastFocusedElement.focus();
  document.body.classList.remove('no-scroll');
};
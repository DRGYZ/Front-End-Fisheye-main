const modalId = 'contact_modal';
const formId = 'contact-form';

let hasBoundSubmit = false;
let hasBoundClose = false;
let hasBoundTrap = false;
let lastFocusedElement = null;

export function openContactModal() {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  // On mémorise le focus pour le restaurer à la fermeture de la modale (accessibilité clavier).
  lastFocusedElement = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null;

  modal.classList.remove('hidden');
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');

  if (!hasBoundSubmit) {
    const form = modal.querySelector(`#${formId}`);
    if (form) {
      form.addEventListener('submit', onSubmit, { once: false });
      hasBoundSubmit = true;
    }
  }

  if (!hasBoundClose) {
    const closeButton = modal.querySelector('.close-modal-icon');
    if (closeButton) {
      closeButton.addEventListener('click', closeContactModal);
      hasBoundClose = true;
    }
  }

  if (!hasBoundTrap) {
    modal.addEventListener('keydown', trapModalFocus);
    hasBoundTrap = true;
  }

  const firstInput = modal.querySelector('input, textarea, select, button');
  if (firstInput) firstInput.focus();
}

export function closeContactModal() {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add('hidden');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');

  if (lastFocusedElement && document.contains(lastFocusedElement)) {
    lastFocusedElement.focus();
  }
}

function onSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());

  console.log('Contact form:', data);

  form.reset();
  closeContactModal();
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const modal = document.getElementById(modalId);
  if (modal && modal.classList.contains('active')) closeContactModal();
});

document.addEventListener('click', (e) => {
  const modal = document.getElementById(modalId);
  if (!modal || !modal.classList.contains('active')) return;
  if (e.target === modal) closeContactModal();
});

function trapModalFocus(e) {
  if (e.key !== 'Tab') return;

  const modal = document.getElementById(modalId);
  if (!modal || !modal.classList.contains('active')) return;

  const focusable = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
    return;
  }

  if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

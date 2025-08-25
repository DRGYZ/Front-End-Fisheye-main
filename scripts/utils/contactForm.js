// Contact Modal: open/close + submit handling

const modalId = 'contact_modal';
const formId = 'contact-form';

let hasBoundSubmit = false;

export function openContactModal() {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  // show
  modal.classList.remove('hidden');
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');

  // bind submit exactly once
  if (!hasBoundSubmit) {
    const form = modal.querySelector(`#${formId}`);
    if (form) {
      form.addEventListener('submit', onSubmit, { once: false });
      hasBoundSubmit = true;
    }
  }

  // focus first field for a11y
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
}

function onSubmit(e) {
  e.preventDefault(); // <— stop the page navigation

  const form = e.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());

  // Your “send” – spec only needs a log
  console.log('Contact form:', data);

  form.reset();
  closeContactModal();
}

// Optional: close on ESC and outside click
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

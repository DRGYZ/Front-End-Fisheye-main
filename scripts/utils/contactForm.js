import { closeOnBackdrop } from './dialog.js';

const dialog = document.getElementById('contact-modal');
const title = document.getElementById('contact-title');
const form = document.getElementById('contact-form');
const status = document.getElementById('contact-status');
let opener;
let currentRecipient = '';

export function openContactModal(name, trigger) {
  opener = trigger;
  currentRecipient = name;
  title.textContent = 'Contacter ' + name;
  status.textContent = '';
  dialog.showModal();
}

document.getElementById('contact-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => opener?.focus());
closeOnBackdrop(dialog);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const firstName = new FormData(form).get('firstName') || '';
  form.reset();
  status.textContent =
    'Merci ' +
    String(firstName).trim() +
    ', message prêt pour ' +
    (currentRecipient || 'cet artiste') +
    ' (démonstration locale).';
});

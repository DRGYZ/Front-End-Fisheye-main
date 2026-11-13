import { closeOnBackdrop } from './dialog.js';

const dialog = document.getElementById('contact-modal');
const title = document.getElementById('contact-title');
const form = document.getElementById('contact-form');
const status = document.getElementById('contact-status');
let opener;

export function openContactModal(name, trigger) {
  opener = trigger;
  title.textContent = 'Contacter ' + name;
  status.textContent = '';
  dialog.showModal();
}

document.getElementById('contact-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => opener?.focus());
closeOnBackdrop(dialog);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  form.reset();
  status.textContent = 'Formulaire validé. Aucun message n’a été envoyé.';
});

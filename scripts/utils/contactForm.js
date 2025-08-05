const contactModal = document.getElementById('contact_modal');

const openContactModal = () => {
  if (contactModal) {
    contactModal.classList.remove('hidden');
  }
};

const closeContactModal = () => {
  if (contactModal) {
    contactModal.classList.add('hidden');
  }
};

// Attach close button event only if the element exists
const closeButton = document.querySelector('#contact_modal .close-modal-icon');
if (closeButton) {
  closeButton.addEventListener('click', closeContactModal);
}

export { openContactModal, closeContactModal };

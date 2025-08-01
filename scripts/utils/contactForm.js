const contactModal = document.getElementById('contact_modal');
const closeButton = document.querySelector('#contact_modal .close');


const openContactModal = () => {
  contactModal.classList.remove('hidden');
};

const closeContactModal = () => {
  contactModal.classList.add('hidden');
};

closeButton.addEventListener('click', closeContactModal);

export { openContactModal, closeContactModal };
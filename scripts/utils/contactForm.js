
console.log("Chargement du script!");
function displayModal() {
  const modal = document.getElementById('contact_modal');
  modal.classList.remove('hidden');
  modal.querySelector('input').focus();
}

function closeModal() {
  const modal = document.getElementById('contact_modal');
  modal.classList.add('hidden');
}

document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData(this);
  const data = {
    firstName: formData.get('firstName'),
    email: formData.get('email'),
    message: formData.get('message')
  };
  console.log('Form Data:', data);
  this.reset();
  closeModal();
});


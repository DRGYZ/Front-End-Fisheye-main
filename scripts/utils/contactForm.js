// Function to show the modal
function displayModal() {
  const modal = document.getElementById('contact_modal');
  modal.classList.remove('hidden');
  modal.classList.add('active');
  document.getElementById('firstName').focus();
}

// Function to hide the modal
function closeModal() {
  console.log('closeModal called');
  const modal = document.getElementById('contact_modal');
  modal.classList.add('hidden');
  modal.classList.remove('active');
}

// Handle form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const data = {
    firstName: document.getElementById('firstName').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value
  };
  console.log('Form submitted:', data);
  this.reset();
  closeModal();
});

// Close modal on Escape key press
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('contact_modal');
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

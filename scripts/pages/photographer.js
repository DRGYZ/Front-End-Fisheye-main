// scripts/pages/photographer.js
function displayModal() {
  const modal = document.getElementById('contact_modal');
  openModal(modal);
  
  // Escape key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal(modal);
  });
  
  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });
}

// Update form submission
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get form data
  const formData = {
    firstname: document.getElementById('firstname').value,
    lastname: document.getElementById('lastname').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value
  };
  
  console.log('Contact Form Data:', formData);
  closeModal(document.getElementById('contact_modal'));
});
function displayLightbox(index, mediaArray) {
  currentMediaIndex = index;
  mediaItems = mediaArray;
  const modal = document.getElementById('lightbox');
  modal.classList.add('active');
  modal.style.display = 'flex';
  updateLightbox();
}

// Load photographer data and media
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));

  // Fetch all data
  const response = await fetch('../data/photographers.json');
  const data = await response.json();

  // Find the current photographer
  const photographer = data.photographers.find(p => p.id === id);
  if (!photographer) {
    document.getElementById('main').innerHTML = '<p>Photographer not found.</p>';
    return;
  }

  // Display profile info
  const mainContainer = document.getElementById('main');

  mainContainer.innerHTML = '';

  // Display photographer's name
  const title = document.createElement('h1');
  title.textContent = photographer.name;
  mainContainer.appendChild(title);

  // Display location
  const location = document.createElement('p');
  location.textContent = `${photographer.city}, ${photographer.country}`;
  mainContainer.appendChild(location);

  // Display portrait
  const portrait = document.createElement('img');
  portrait.src = photographer.portrait; // Path must be correct
  portrait.alt = `Portrait of ${photographer.name}`;
  mainContainer.appendChild(portrait);

  // Filter media for selected photographer
  const mediaItems = data.media.filter(m => m.photographerId === id);

  // Create gallery container
  const gallery = document.createElement('div');
  gallery.id = 'media-gallery';
  gallery.className = 'media-grid'; // Your CSS for grid layout
  mainContainer.appendChild(gallery);

  // Generate media items
  mediaItems.forEach((media, index) => {
    let mediaEl;

    if (media.image) {
      mediaEl = document.createElement('img');
      mediaEl.src = media.image;
      mediaEl.alt = media.title;

    } else if (media.video) {
      mediaEl = document.createElement('video');
      mediaEl.src = media.video;
      mediaEl.controls = true;
      mediaEl.setAttribute('aria-label', media.title);
    }

    // Add event to open in lightbox
    mediaEl.addEventListener('click', () => displayLightbox(index, mediaItems));

    // Append media element
    gallery.appendChild(mediaEl);
  });
});

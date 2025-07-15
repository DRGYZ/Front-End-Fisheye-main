import { openModal, closeModal } from '../utils/modal.js';
import { displayLightbox } from '../utils/lightbox.js';

// Global variables
let currentMediaIndex = 0;
let mediaItems = [];
let photographerID = null;

// Init modal
function initContactModal() {
  const contactModal = document.getElementById('contact_modal');
  const contactButton = document.querySelector('.contact_button');
  const closeButton = contactModal.querySelector('.close-modal-icon');
  const contactForm = document.getElementById('contact-form');

  contactButton.addEventListener('click', () => openModal(contactModal));
  contactButton.addEventListener('keydown', (e) => e.key === 'Enter' && openModal(contactModal));

  closeButton.addEventListener('click', () => closeModal(contactModal));
  closeButton.addEventListener('keydown', (e) => e.key === 'Enter' && closeModal(contactModal));

  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) closeModal(contactModal);
  });
console.log("Trying to find button:", document.getElementById("contact-btn"));
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form submitted:', {
      firstname: contactForm.firstname.value,
      lastname: contactForm.lastname.value,
      email: contactForm.email.value,
      message: contactForm.message.value
    });
    closeModal(contactModal);
  });
}

// Display photographer profile
function displayPhotographerProfile(photographer) {
  const mainContainer = document.getElementById('main');
  mainContainer.innerHTML = '';

  const profileHeader = document.createElement('div');
  profileHeader.className = 'photograph-header';

  const infoContainer = document.createElement('div');
  infoContainer.className = 'photographer-info';

  const title = document.createElement('h1');
  title.textContent = photographer.name;
  title.className = 'photographer-name';

  const location = document.createElement('p');
  location.className = 'location';
  location.textContent = `${photographer.city}, ${photographer.country}`;

  const tagline = document.createElement('p');
  tagline.className = 'tagline';
  tagline.textContent = photographer.tagline;

  infoContainer.appendChild(title);
  infoContainer.appendChild(location);
  infoContainer.appendChild(tagline);

  const contactBtn = document.createElement('button');
  contactBtn.textContent = 'Contactez-moi';
  contactBtn.className = 'contact_button';
  contactBtn.id = 'contact-btn';
  contactBtn.addEventListener('click', () => openModal(document.getElementById('contact_modal')));
  
  contactBtn.setAttribute('aria-label', 'Contactez le photographe');

  const portraitContainer = document.createElement('div');
  portraitContainer.className = 'portrait-container';

  const portrait = document.createElement('img');
  portrait.src = `assets/photographers/Photographers-List/${photographer.portrait}`;
  portrait.alt = `Portrait de ${photographer.name}`;
  portrait.className = 'photographer-portrait';

  portraitContainer.appendChild(portrait);

  profileHeader.appendChild(infoContainer);
  profileHeader.appendChild(contactBtn);
  profileHeader.appendChild(portraitContainer);

  mainContainer.appendChild(profileHeader);
}

// Display media
function displayMediaGallery(id, items) {
  photographerID = id; // set globally for sorting
  const gallery = document.createElement('div');
  gallery.id = 'media-gallery';
  gallery.className = 'media-grid';

  items.forEach((media, index) => {
    const mediaCard = document.createElement('article');
    mediaCard.className = 'media-card';

    let mediaElement;
    if (media.image) {
      mediaElement = document.createElement('img');
      mediaElement.src = `assets/photographers/${id}/${media.image}`;
      mediaElement.alt = media.title;
    } else if (media.video) {
      mediaElement = document.createElement('video');
      mediaElement.src = `assets/photographers/${id}/${media.video}`;
      mediaElement.controls = true;
      mediaElement.setAttribute('aria-label', media.title);
    }

    const infoDiv = document.createElement('div');
    infoDiv.className = 'media-info';

    const title = document.createElement('h2');
    title.textContent = media.title;

    const likes = document.createElement('p');
    likes.className = 'likes';
    likes.innerHTML = `${media.likes} <span aria-label="likes">❤️</span>`;

    infoDiv.appendChild(title);
    infoDiv.appendChild(likes);

    mediaCard.appendChild(mediaElement);
    mediaCard.appendChild(infoDiv);
    gallery.appendChild(mediaCard);

    mediaElement.addEventListener('click', () => {
      currentMediaIndex = index;
      displayLightbox(index, mediaItems, photographerID);
    });
  });

  document.getElementById('main').appendChild(gallery);
}

// Daily rate footer
function displayDailyRate(price) {
  const totalLikes = mediaItems.reduce((sum, media) => sum + media.likes, 0);

  const footer = document.createElement('footer');
  footer.className = 'daily-rate-footer';

  const rateContainer = document.createElement('div');
  rateContainer.className = 'rate-container';

  const likesTotal = document.createElement('span');
  likesTotal.className = 'total-likes';
  likesTotal.innerHTML = `${totalLikes} <span aria-label="likes">❤️</span>`;

  const dailyRate = document.createElement('span');
  dailyRate.className = 'daily-rate';
  dailyRate.textContent = `${price}€ / jour`;

  rateContainer.appendChild(likesTotal);
  rateContainer.appendChild(dailyRate);
  footer.appendChild(rateContainer);

  document.body.appendChild(footer);
}

// Sorting dropdown
function displaySortingControls() {
  const main = document.getElementById('main');
  const sortContainer = document.createElement('div');
  sortContainer.className = 'sorting-container';

  const sortLabel = document.createElement('label');
  sortLabel.textContent = 'Trier par';
  sortLabel.htmlFor = 'sort-select';

  const sortSelect = document.createElement('select');
  sortSelect.id = 'sort-select';
  sortSelect.className = 'sort-select';

  const options = [
    { value: 'popularity', text: 'Popularité' },
    { value: 'date', text: 'Date' },
    { value: 'title', text: 'Titre' }
  ];

  options.forEach(({ value, text }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    sortSelect.appendChild(option);
  });

  sortContainer.appendChild(sortLabel);
  sortContainer.appendChild(sortSelect);
  main.appendChild(sortContainer);

  sortSelect.addEventListener('change', (e) => {
    sortMedia(e.target.value);
  });
}

// Sort media
function sortMedia(criteria) {
  switch (criteria) {
    case 'popularity':
      mediaItems.sort((a, b) => b.likes - a.likes);
      break;
    case 'date':
      mediaItems.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'title':
      mediaItems.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  const gallery = document.getElementById('media-gallery');
  if (gallery) gallery.remove();
  displayMediaGallery(photographerID, mediaItems);
}

// Lightbox navigation
function nextMedia() {
  currentMediaIndex = (currentMediaIndex + 1) % mediaItems.length;
  displayLightbox(currentMediaIndex, mediaItems, photographerID);
}

function prevMedia() {
  currentMediaIndex = (currentMediaIndex - 1 + mediaItems.length) % mediaItems.length;
  displayLightbox(currentMediaIndex, mediaItems, photographerID);
}

function initLightboxControls() {
  document.getElementById('lightbox-close').addEventListener('click', () => closeLightbox());
  document.getElementById('lightbox-next').addEventListener('click', nextMedia);
  document.getElementById('lightbox-prev').addEventListener('click', prevMedia);

  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('lightbox').classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextMedia();
    if (e.key === 'ArrowLeft') prevMedia();
  });
}

// Init page
async function initPhotographerPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));

  if (!id) {
    document.getElementById('main').innerHTML = '<p>Photographer ID not provided.</p>';
    return;
  }

  try {
    const response = await fetch('../data/photographers.json');
    const data = await response.json();

    const photographer = data.photographers.find(p => p.id === id);
    if (!photographer) throw new Error('Photographer not found');

    mediaItems = data.media.filter(m => m.photographerId === id);

    displayPhotographerProfile(photographer);
    displaySortingControls();
    displayMediaGallery(photographer.id, mediaItems);
    displayDailyRate(photographer.price);

    setTimeout(initContactModal, 100);
  } catch (err) {
    console.error('Error loading photographer data:', err);
    document.getElementById('main').innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

// Boot it up
document.addEventListener('DOMContentLoaded', () => {
  initPhotographerPage();
  initLightboxControls();
});

import { openModal, closeModal } from '../utils/modal.js';

// Lightbox variables
let currentMediaIndex = 0;
let mediaItems = [];

// DOM Elements
let contactModal;
let contactButton;
let closeButton;
let contactForm;

// Initialize modal functionality
function initContactModal() {
  contactModal = document.getElementById('contact_modal');
  contactButton = document.querySelector('.contact_button');
  closeButton = contactModal.querySelector('.close-modal-icon');
  contactForm = document.getElementById('contact-form');

  // Event listeners
  contactButton.addEventListener('click', () => openModal(contactModal));
  contactButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') openModal(contactModal);
  });

  closeButton.addEventListener('click', () => closeModal(contactModal));
  closeButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') closeModal(contactModal);
  });

  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) closeModal(contactModal);
  });

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

  // Create profile header
  const profileHeader = document.createElement('header');
  profileHeader.className = 'photographer-header';
  
  const title = document.createElement('h1');
  title.textContent = photographer.name;
  
  const location = document.createElement('p');
  location.className = 'location';
  location.textContent = `${photographer.city}, ${photographer.country}`;
  
  const tagline = document.createElement('p');
  tagline.className = 'tagline';
  tagline.textContent = photographer.tagline;
  
  profileHeader.appendChild(title);
  profileHeader.appendChild(location);
  profileHeader.appendChild(tagline);
  mainContainer.appendChild(profileHeader);

  // Display portrait
  const portraitContainer = document.createElement('div');
  portraitContainer.className = 'portrait-container';
  
  const portrait = document.createElement('img');
  portrait.src = `assets/photographers/${photographer.portrait}`;
  portrait.alt = `Portrait of ${photographer.name}`;
  portrait.className = 'photographer-portrait';
  
  portraitContainer.appendChild(portrait);
  mainContainer.appendChild(portraitContainer);
}

// Display media gallery
function displayMediaGallery(mediaItems) {
  const gallery = document.createElement('div');
  gallery.id = 'media-gallery';
  gallery.className = 'media-grid';
  
  mediaItems.forEach((media, index) => {
    const mediaCard = document.createElement('article');
    mediaCard.className = 'media-card';
    
    let mediaElement;
    if (media.image) {
      mediaElement = document.createElement('img');
      mediaElement.src = `assets/images/${media.image}`;
      mediaElement.alt = media.title;
    } else if (media.video) {
      mediaElement = document.createElement('video');
      mediaElement.src = `assets/videos/${media.video}`;
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
    
    // Lightbox functionality
    mediaElement.addEventListener('click', () => {
      console.log('Opening lightbox for media index:', index);
      displayLightbox(index, mediaItems);
    });
  });
  
  document.getElementById('main').appendChild(gallery);
}

// Display daily rate footer
function displayDailyRate(price) {
  const footer = document.createElement('footer');
  footer.className = 'daily-rate-footer';
  
  const rateContainer = document.createElement('div');
  rateContainer.className = 'rate-container';
  
  const likesTotal = document.createElement('span');
  likesTotal.className = 'total-likes';
  likesTotal.textContent = '0 likes total';
  
  const dailyRate = document.createElement('span');
  dailyRate.className = 'daily-rate';
  dailyRate.textContent = `${price}€ / jour`;
  
  rateContainer.appendChild(likesTotal);
  rateContainer.appendChild(dailyRate);
  footer.appendChild(rateContainer);
  
  document.body.appendChild(footer);
}

// Lightbox functions
function displayLightbox(index, mediaArray) {
  currentMediaIndex = index;
  mediaItems = mediaArray;
  const modal = document.getElementById('lightbox');
  modal.classList.add('active');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  updateLightbox();
}

function closeLightbox() {
  const modal = document.getElementById('lightbox');
  modal.classList.remove('active');
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}

function updateLightbox() {
  const lightboxMedia = document.getElementById('lightbox-media');
  const lightboxTitle = document.getElementById('lightbox-title');
  const currentMedia = mediaItems[currentMediaIndex];
  
  lightboxMedia.innerHTML = '';
  let mediaElement;
  
  if (currentMedia.image) {
    mediaElement = document.createElement('img');
    mediaElement.src = `assets/images/${currentMedia.image}`;
    mediaElement.alt = currentMedia.title;
  } else if (currentMedia.video) {
    mediaElement = document.createElement('video');
    mediaElement.src = `assets/videos/${currentMedia.video}`;
    mediaElement.controls = true;
    mediaElement.setAttribute('aria-label', currentMedia.title);
  }
  
  lightboxMedia.appendChild(mediaElement);
  lightboxTitle.textContent = currentMedia.title;
}

// Navigation in lightbox
function nextMedia() {
  currentMediaIndex = (currentMediaIndex + 1) % mediaItems.length;
  updateLightbox();
}

function prevMedia() {
  currentMediaIndex = (currentMediaIndex - 1 + mediaItems.length) % mediaItems.length;
  updateLightbox();
}

// Main initialization function
async function initPhotographerPage() {
  // Get photographer ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));
  
  if (!id) {
    document.getElementById('main').innerHTML = '<p>Photographer ID not provided.</p>';
    return;
  }

  // Fetch photographer data
  try {
    const response = await fetch('../data/photographers.json');
    const data = await response.json();
    
    // Find current photographer
    const photographer = data.photographers.find(p => p.id === id);
    if (!photographer) {
      throw new Error('Photographer not found');
    }
    
    // Filter photographer's media
    const photographerMedia = data.media.filter(m => m.photographerId === id);
    
    // Display content
    displayPhotographerProfile(photographer);
    displayMediaGallery(photographerMedia);
    displayDailyRate(photographer.price);
    
    // Initialize modal after short delay
    setTimeout(initContactModal, 100);
    
  } catch (error) {
    console.error('Error loading photographer data:', error);
    document.getElementById('main').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Initialize lightbox controls
function initLightboxControls() {
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-next').addEventListener('click', nextMedia);
  document.getElementById('lightbox-prev').addEventListener('click', prevMedia);
  
  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (document.getElementById('lightbox').classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextMedia();
      if (e.key === 'ArrowLeft') prevMedia();
    }
  });
}

// Start everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initPhotographerPage();
  initLightboxControls();
});
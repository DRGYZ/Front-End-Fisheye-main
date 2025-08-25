import { displayLightbox, closeLightbox } from '../utils/lightbox.js';
import { openContactModal } from '../utils/contactForm.js';


// Global variables
let currentMediaIndex = 0;
let mediaItems = [];
let photographerID = null;

// Display photographer profile

function displayPhotographerProfile(photographer) {
  const profileHeader = document.querySelector('.photograph-header');
  profileHeader.innerHTML = ''; // clear only the header section

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
  contactBtn.addEventListener('click', openContactModal);
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
}

function addLikeFunctionality(likeElement, media) {
  let liked = false;

  likeElement.addEventListener('click', () => {
    if (!liked) {
      media.likes += 1;
      liked = true;
    } else {
      media.likes -= 1;
      liked = false;
    }

    // Update individual like display
    likeElement.querySelector('.like-count').textContent = media.likes;

    // Update total likes in footer dynamically
    const totalLikesEl = document.querySelector('.likes-price-footer .total-likes');
    if (totalLikesEl) {
      const currentTotal = mediaItems.reduce((sum, m) => sum + m.likes, 0);
      totalLikesEl.innerHTML = `${currentTotal} <span aria-label="likes">❤️</span>`;
    }
  });
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
    likes.innerHTML = `<span class="like-count">${media.likes}</span> ❤️`;

    // Make the likes interactive
    addLikeFunctionality(likes, media);

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

  const footer = document.createElement('div');
  footer.className = 'likes-price-footer';

  const likesTotal = document.createElement('span');
  likesTotal.className = 'total-likes';
  likesTotal.innerHTML = `${totalLikes} <span aria-label="likes">❤️</span>`;

  const dailyRate = document.createElement('span');
  dailyRate.className = 'daily-rate';
  dailyRate.textContent = `${price}€ / jour`;

  footer.appendChild(likesTotal);
  footer.appendChild(dailyRate);

  document.getElementById('main').appendChild(footer);
}


// Sorting dropdown
function displaySortingControls() {
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

  // Insert directly after the header
  const header = document.querySelector('.photograph-header');
  header.insertAdjacentElement('afterend', sortContainer);

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

    
  } catch (err) {
    console.error('Error loading photographer data:', err);
    document.getElementById('main').innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

// Boot it up
document.addEventListener('DOMContentLoaded', async () => {
  await initPhotographerPage();
  initLightboxControls(); // lightbox as usual
});

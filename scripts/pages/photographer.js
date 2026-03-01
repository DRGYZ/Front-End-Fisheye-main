import { displayLightbox } from '../utils/lightbox.js';
import { openContactModal } from '../utils/contactForm.js';
import { mediaFactory } from '../factories/media.js';

let mediaItems = [];
let photographerID = null;

function displayPhotographerProfile(photographer) {
  const profileHeader = document.querySelector('.photograph-header');
  profileHeader.innerHTML = '';

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

function addLikeFunctionality(likeButton, media) {
  // L'état est porté par l'objet media pour rester stable après un re-render (ex: tri).
  likeButton.setAttribute('aria-pressed', media.userLiked ? 'true' : 'false');
  likeButton.disabled = Boolean(media.userLiked);

  likeButton.addEventListener('click', () => {
    if (media.userLiked) return;

    media.likes += 1;
    media.userLiked = true;

    likeButton.querySelector('.like-count').textContent = media.likes;
    likeButton.setAttribute('aria-pressed', 'true');
    likeButton.disabled = true;

    const totalLikesEl = document.querySelector('.likes-price-footer .total-likes');
    if (totalLikesEl) {
      const currentTotal = mediaItems.reduce((sum, m) => sum + m.likes, 0);
      totalLikesEl.innerHTML = `${currentTotal} <span aria-label="likes">❤️</span>`;
    }
  });
}

function displayMediaGallery(id, items) {
  photographerID = id;
  let gallery;
  if (document.querySelector('.media-grid')) {
    gallery = document.querySelector('.media-grid');
    gallery.innerHTML = '';
  } else {
    gallery = document.createElement('div');
    gallery.id = 'media-gallery';
    gallery.className = 'media-grid';
  }

  items.forEach((media, index) => {
    const mediaCard = document.createElement('article');
    mediaCard.className = 'media-card';
    const mediaButton = mediaFactory(media, id).getCardDOM();

    const infoDiv = document.createElement('div');
    infoDiv.className = 'media-info';

    const title = document.createElement('h2');
    title.textContent = media.title;

    const likes = document.createElement('button');
    likes.type = 'button';
    likes.className = 'like-button';
    likes.setAttribute('aria-label', `Like ${media.title}`);
    likes.setAttribute('aria-pressed', 'false');
    likes.innerHTML = `<span class="like-count">${media.likes}</span> <span aria-hidden="true">❤️</span>`;

    addLikeFunctionality(likes, media);

    infoDiv.appendChild(title);
    infoDiv.appendChild(likes);

    mediaCard.appendChild(mediaButton);
    mediaCard.appendChild(infoDiv);
    gallery.appendChild(mediaCard);

    mediaButton.addEventListener('click', () => {
      displayLightbox(index, mediaItems, photographerID);
    });
  });

  document.getElementById('main').appendChild(gallery);
}

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

  const header = document.querySelector('.photograph-header');
  header.insertAdjacentElement('afterend', sortContainer);

  sortSelect.addEventListener('change', (e) => {
    sortMedia(e.target.value);
  });
}

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

async function initPhotographerPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));

  if (!id) {
    document.getElementById('main').innerHTML = '<p>Photographer ID not provided.</p>';
    return;
  }

  try {
    const url = new URL('../../data/photographers.json', import.meta.url);
    const data = await (await fetch(url)).json();

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

document.addEventListener('DOMContentLoaded', async () => {
  await initPhotographerPage();
});

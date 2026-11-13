import { dailyRate, loadCatalogue, portraitSources } from '../catalogue.js';
import { mediaFactory } from '../factories/media.js';
import { openContactModal } from '../utils/contactForm.js';
import { openLightbox } from '../utils/lightbox.js';

const profile = document.getElementById('photographer-info');
const status = document.getElementById('profile-status');
const portfolio = document.getElementById('portfolio');
const gallery = document.getElementById('media-gallery');
const likesTotal = document.getElementById('total-likes');
const sort = document.getElementById('sort-select');
const collator = new Intl.Collator('fr', { sensitivity: 'base' });

const sortBy = {
  popularity: (a, b) => b.likes - a.likes,
  date: (a, b) => b.date.localeCompare(a.date),
  title: (a, b) => collator.compare(a.title, b.title),
};

function textElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function renderProfile(person) {
  const copy = document.createElement('div');
  copy.className = 'profile-copy';
  copy.append(
    textElement('h1', 'profile-title', person.name),
    textElement('p', 'profile-location', person.city + ', ' + person.country),
    textElement('p', 'profile-tagline', person.tagline),
  );

  const actions = document.createElement('div');
  actions.className = 'profile-actions';
  const contact = textElement('button', 'primary-button', 'Contacter');
  contact.type = 'button';
  contact.setAttribute('aria-haspopup', 'dialog');
  contact.addEventListener('click', () => openContactModal(person.name, contact));
  actions.append(contact, textElement('p', 'profile-rate', dailyRate(person.price)));
  copy.append(actions);

  const frame = document.createElement('div');
  frame.className = 'profile-portrait';
  const portrait = document.createElement('img');
  portrait.src = portraitSources(person).preview;
  portrait.alt = 'Portrait de ' + person.name;
  portrait.decoding = 'async';
  frame.append(portrait);

  profile.append(copy, frame);
  profile.hidden = false;
  document.title = person.name + ' | FishEye';
  document.querySelector('meta[name="description"]').content = 'Portfolio de ' + person.name + ' sur FishEye.';
}

function updateLikesTotal(items) {
  const total = items.reduce((sum, item) => sum + item.likes, 0);
  likesTotal.textContent = total + ' mentions J’aime';
}

function createLikeButton(media, items) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'like-button';
  button.setAttribute('aria-label', 'Aimer : ' + media.title);

  const count = textElement('span', 'like-count', media.likes);
  const icon = textElement('span', 'like-icon', '♥');
  icon.setAttribute('aria-hidden', 'true');
  button.append(icon, count);

  function sync() {
    count.textContent = media.likes;
    button.setAttribute('aria-pressed', String(Boolean(media.userLiked)));
    button.setAttribute('aria-disabled', String(Boolean(media.userLiked)));
  }

  button.addEventListener('click', () => {
    if (media.userLiked) return;
    media.likes += 1;
    media.userLiked = true;
    sync();
    updateLikesTotal(items);
  });

  sync();
  return button;
}

function renderGallery(items) {
  const cards = items.map((media, index) => {
    const card = document.createElement('article');
    card.className = 'media-card';
    const preview = mediaFactory(media, index < 3).getCardDOM();
    preview.addEventListener('click', () => openLightbox(index, items, preview));

    const title = textElement('h3', 'media-title', media.title);
    title.lang = 'en';

    const caption = document.createElement('div');
    caption.className = 'media-caption';
    const details = document.createElement('div');
    details.append(title);
    if (media.video) details.append(textElement('p', 'media-type', 'Vidéo'));
    caption.append(details, createLikeButton(media, items));
    card.append(preview, caption);
    return card;
  });
  gallery.replaceChildren(...cards);
}

async function init() {
  const id = Number(new URLSearchParams(window.location.search).get('id'));
  if (!Number.isSafeInteger(id) || id <= 0) {
    status.textContent = 'Ce portfolio est introuvable.';
    return;
  }

  try {
    const { photographers, media } = await loadCatalogue();
    const person = photographers.find((photographer) => photographer.id === id);
    if (!person) {
      status.textContent = 'Ce portfolio est introuvable.';
      return;
    }

    const items = media.filter((item) => item.photographerId === id);
    renderProfile(person);
    status.hidden = true;
    portfolio.hidden = false;
    document.getElementById('media-count').textContent =
      items.length + (items.length === 1 ? ' média' : ' médias');

    if (!items.length) {
      sort.disabled = true;
      gallery.append(textElement('p', 'page-status', 'Aucun média dans ce portfolio.'));
      return;
    }

    function applySort() {
      items.sort(sortBy[sort.value] ?? sortBy.popularity);
      renderGallery(items);
    }

    sort.addEventListener('change', applySort);
    applySort();
    updateLikesTotal(items);
  } catch {
    status.textContent = 'Impossible de charger le portfolio. Actualisez la page pour réessayer.';
    status.hidden = false;
  }
}

await init();

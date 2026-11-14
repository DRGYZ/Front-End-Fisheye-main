import {
  dailyRate,
  loadCatalogue,
  photographerSpecialty,
  portraitSources,
} from '../catalogue.js';
import { mediaFactory } from '../factories/media.js';
import { openContactModal } from '../utils/contactForm.js';
import { openLightbox } from '../utils/lightbox.js';

const switcher = document.getElementById('artist-switcher');
const profile = document.getElementById('photographer-info');
const status = document.getElementById('profile-status');
const portfolio = document.getElementById('portfolio');
const gallery = document.getElementById('media-gallery');
const mediaFilters = document.getElementById('media-filters');
const densityToggle = document.getElementById('density-toggle');
const likesTotalHero = () => document.getElementById('hero-total-likes');
const likesSummary = document.getElementById('total-likes');
const summaryRate = document.getElementById('summary-rate');
const headerMeta = document.getElementById('header-meta');
const sort = document.getElementById('sort-select');
const collator = new Intl.Collator('fr', { sensitivity: 'base' });
const euroFmt = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

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

function renderArtistSwitcher(photographers, activeId) {
  switcher.replaceChildren(
    ...photographers.map((artist) => {
      const link = document.createElement('a');
      link.className = 'artist-chip';
      link.href = 'photographer.html?id=' + artist.id;
      if (artist.id === activeId) {
        link.setAttribute('aria-current', 'page');
      }

      const avatar = document.createElement('img');
      avatar.src = portraitSources(artist).thumbnail;
      avatar.alt = '';
      avatar.width = 24;
      avatar.height = 24;
      avatar.decoding = 'async';

      const label = document.createElement('span');
      label.textContent = artist.name;
      link.append(avatar, label);
      return link;
    }),
  );
  switcher.hidden = false;
}

function renderProfile(person, items) {
  const specialty = photographerSpecialty(person.id);
  const copy = document.createElement('div');
  copy.className = 'profile-copy';

  const loc = textElement(
    'p',
    'profile-location',
    person.city + ', ' + person.country + ' · ' + specialty,
  );
  const name = textElement('h1', 'profile-title', person.name);
  const tagline = textElement('p', 'profile-tagline', person.tagline);

  const actions = document.createElement('div');
  actions.className = 'profile-actions';

  const contact = textElement('button', 'primary-button', 'Confier un projet');
  contact.type = 'button';
  contact.setAttribute('aria-haspopup', 'dialog');
  contact.addEventListener('click', () => openContactModal(person.name, contact));

  const metrics = document.createElement('div');
  metrics.className = 'profile-metrics';
  const countSpan = textElement(
    'span',
    '',
    items.length + (items.length === 1 ? ' œuvre' : ' œuvres'),
  );
  const sep1 = textElement('span', '', '·');
  const heroLikes = document.createElement('span');
  heroLikes.id = 'hero-total-likes';
  const sep2 = textElement('span', '', '·');
  const rateSpan = textElement('span', 'profile-rate', dailyRate(person.price));
  metrics.append(countSpan, sep1, heroLikes, sep2, rateSpan);

  actions.append(contact, metrics);
  copy.append(loc, name, tagline, actions);

  const frame = document.createElement('div');
  frame.className = 'profile-portrait';
  const portraitSrc = portraitSources(person);
  const portrait = document.createElement('img');
  portrait.src = portraitSrc.full;
  portrait.srcset = portraitSrc.preview + ' 480w, ' + portraitSrc.full + ' 1000w';
  portrait.sizes = '(max-width: 760px) 104px, 168px';
  portrait.alt = 'Portrait de ' + person.name;
  portrait.decoding = 'async';
  frame.append(portrait);

  profile.append(copy, frame);
  profile.hidden = false;

  if (headerMeta) {
    headerMeta.textContent = person.name + ' · ' + dailyRate(person.price);
  }
  if (summaryRate) {
    summaryRate.textContent = dailyRate(person.price);
  }

  document.title = person.name + ' | FishEye';
  document.querySelector('meta[name="description"]').content =
    'Portfolio de ' + person.name + ' sur FishEye.';
}

function updateLikesTotal(items) {
  const total = items.reduce((sum, item) => sum + item.likes, 0);
  const hero = likesTotalHero();
  if (hero) hero.textContent = total + ' mentions J’aime';
  if (likesSummary) likesSummary.textContent = total + ' ♥';
}

function createLikeButton(media, allItems) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'like-button';

  const icon = textElement('span', 'like-icon', '♥');
  icon.setAttribute('aria-hidden', 'true');
  const count = textElement('span', 'like-count', String(media.likes));
  button.append(icon, count);

  function sync() {
    const liked = Boolean(media.userLiked);
    count.textContent = String(media.likes);
    button.setAttribute('aria-pressed', String(liked));
    button.setAttribute('aria-label', 'Aimer ' + media.title + ', ' + media.likes + ' mentions');
  }

  button.addEventListener('click', () => {
    if (media.userLiked) {
      media.likes -= 1;
      media.userLiked = false;
    } else {
      media.likes += 1;
      media.userLiked = true;
    }
    sync();
    updateLikesTotal(allItems);
  });

  sync();
  return button;
}

function renderGallery(visibleItems, allItems, animateFlip = false) {
  const prevBoxes = new Map();
  if (animateFlip && !reducedMotion.matches) {
    for (const card of gallery.querySelectorAll('.media-card')) {
      prevBoxes.set(card.dataset.mediaId, card.getBoundingClientRect());
    }
  }

  const cards = visibleItems.map((media, index) => {
    const card = document.createElement('article');
    card.className = 'media-card';
    card.dataset.mediaId = String(media.id);

    const preview = mediaFactory(media, index < 3, index + 1).getCardDOM();
    preview.addEventListener('click', () => openLightbox(index, visibleItems, preview));

    const caption = document.createElement('div');
    caption.className = 'media-caption';

    const titleBtn = document.createElement('button');
    titleBtn.type = 'button';
    titleBtn.className = 'media-title-btn';
    titleBtn.addEventListener('click', () => openLightbox(index, visibleItems, titleBtn));

    const title = textElement('span', 'media-title', media.title);
    title.lang = 'en';
    const sub = textElement(
      'span',
      'media-sub',
      (media.date ? media.date.slice(0, 4) : '') + ' · ' + euroFmt.format(media.price),
    );
    titleBtn.append(title, sub);

    caption.append(titleBtn, createLikeButton(media, allItems));
    card.append(preview, caption);
    return card;
  });

  gallery.replaceChildren(...cards);

  if (animateFlip && !reducedMotion.matches && prevBoxes.size) {
    for (const card of gallery.querySelectorAll('.media-card')) {
      const prev = prevBoxes.get(card.dataset.mediaId);
      if (!prev) continue;
      const next = card.getBoundingClientRect();
      const dx = prev.left - next.left;
      const dy = prev.top - next.top;
      if (dx || dy) {
        card.animate(
          [{ transform: 'translate(' + dx + 'px, ' + dy + 'px)' }, { transform: 'none' }],
          { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        );
      }
    }
  }
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
    renderArtistSwitcher(photographers, person.id);
    renderProfile(person, items);
    status.hidden = true;
    portfolio.hidden = false;

    if (!items.length) {
      sort.disabled = true;
      gallery.append(textElement('p', 'page-status', 'Aucun média dans ce portfolio.'));
      updateLikesTotal(items);
      return;
    }

    let activeType = 'all';

    function renderMediaFilters() {
      const types = [
        { id: 'all', label: 'Tout (' + items.length + ')' },
        { id: 'image', label: 'Photos (' + items.filter((item) => item.image).length + ')' },
        { id: 'video', label: 'Vidéos (' + items.filter((item) => item.video).length + ')' },
      ];
      mediaFilters.replaceChildren(
        ...types.map((t) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'filter-pill';
          btn.setAttribute('aria-pressed', String(activeType === t.id));
          btn.textContent = t.label;
          btn.addEventListener('click', () => {
            if (activeType === t.id) return;
            activeType = t.id;
            renderMediaFilters();
            applySort(false);
          });
          return btn;
        }),
      );
    }

    function applySort(animateFlip = false) {
      const visible = items.filter((item) => {
        if (activeType === 'image') return Boolean(item.image);
        if (activeType === 'video') return Boolean(item.video);
        return true;
      });
      visible.sort(sortBy[sort.value] ?? sortBy.popularity);
      renderGallery(visible, items, animateFlip);
    }

    if (densityToggle) {
      densityToggle.querySelectorAll('[data-density]').forEach((btn) => {
        btn.addEventListener('click', () => {
          gallery.dataset.density = btn.dataset.density;
          densityToggle.querySelectorAll('[data-density]').forEach((other) => {
            other.setAttribute('aria-pressed', String(other === btn));
          });
        });
      });
    }

    renderMediaFilters();
    sort.addEventListener('change', () => applySort(true));
    applySort(false);
    updateLikesTotal(items);
  } catch {
    status.textContent = 'Impossible de charger le portfolio. Actualisez la page pour réessayer.';
    status.hidden = false;
  }
}

await init();

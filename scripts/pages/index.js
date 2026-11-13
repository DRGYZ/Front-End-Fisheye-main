import {
  CATEGORIES,
  loadCatalogue,
  photographerTags,
} from '../catalogue.js';
import { photographerFactory } from '../factories/photographer.js';

const status = document.getElementById('directory-status');
const browser = document.getElementById('directory-browser');
const filtersBar = document.getElementById('directory-filters');
const roster = document.getElementById('photographer-roster');
const countLabel = document.getElementById('directory-count');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

let activeCategory = 'all';
let entries = [];

function renderFilterPills() {
  filtersBar.replaceChildren(
    ...CATEGORIES.map((category) => {
      const count =
        category.id === 'all'
          ? entries.length
          : entries.filter((entry) => entry.tags.includes(category.id)).length;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'filter-pill';
      button.dataset.category = category.id;
      button.setAttribute('aria-pressed', String(activeCategory === category.id));
      button.textContent = category.label + ' · ' + count;

      button.addEventListener('click', () => {
        if (activeCategory === category.id) return;
        activeCategory = category.id;
        renderFilterPills();
        renderRoster(true);
      });
      return button;
    }),
  );
}

function renderRoster(animate = false) {
  const visible =
    activeCategory === 'all'
      ? entries
      : entries.filter((entry) => entry.tags.includes(activeCategory));

  countLabel.textContent =
    String(visible.length).padStart(2, '0') +
    (visible.length === 1 ? ' photographe' : ' photographes') +
    ' · ' +
    visible.reduce((sum, entry) => sum + entry.mediaCount, 0) +
    ' œuvres';

  roster.replaceChildren(...visible.map((entry) => entry.card));

  if (animate && !reducedMotion.matches) {
    for (const [index, entry] of visible.entries()) {
      entry.card.animate(
        [
          { opacity: 0, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'none' },
        ],
        {
          duration: 240,
          delay: Math.min(index * 35, 140),
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'backwards',
        },
      );
    }
  }
}

try {
  const { photographers, media } = await loadCatalogue();
  entries = photographers.map((person) => {
    const items = media.filter((item) => item.photographerId === person.id);
    const card = photographerFactory(person, items).getCardDOM();
    return {
      person,
      tags: photographerTags(person.id),
      mediaCount: items.length,
      card,
    };
  });

  if (entries.length) {
    renderFilterPills();
    renderRoster(false);
    browser.hidden = false;
    status.hidden = true;
  } else {
    status.textContent = 'Aucun portfolio disponible.';
  }
} catch {
  status.textContent = 'Impossible de charger les portfolios. Actualisez la page pour réessayer.';
}

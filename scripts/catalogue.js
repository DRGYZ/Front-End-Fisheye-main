const catalogueURL = new URL('../data/photographers.json', import.meta.url);

export const CATEGORIES = [
  { id: 'all', label: 'Tous' },
  { id: 'portrait-mode', label: 'Portrait & Mode' },
  { id: 'voyage-arch', label: 'Voyage & Architecture' },
  { id: 'sport-evenement', label: 'Sport & Événement' },
];

const SPECIALTIES = {
  243: ['voyage-arch', 'portrait-mode', 'sport-evenement'],
  930: ['sport-evenement', 'voyage-arch'],
  82: ['portrait-mode', 'sport-evenement'],
  527: ['voyage-arch', 'portrait-mode'],
  925: ['portrait-mode', 'sport-evenement'],
  195: ['voyage-arch'],
};

const SPECIALTY_LABELS = {
  243: 'Portrait & Reportage',
  930: 'Sport & Architecture',
  82: 'Mode & Scènes artistiques',
  527: 'Voyage & Portrait',
  925: 'Événementiel & Mode',
  195: 'Architecture & Voyage',
};

export async function loadCatalogue() {
  const response = await fetch(catalogueURL, { cache: 'no-cache' });
  if (!response.ok) throw new Error('Catalogue indisponible');
  return response.json();
}

export function portraitSources({ portrait }) {
  return {
    full: 'assets/photographers/Photographers-List/' + encodeURIComponent(portrait),
    preview: 'assets/previews/portraits/' + encodeURIComponent(webpName(portrait)),
    thumbnail: 'assets/thumbs/portraits/' + encodeURIComponent(webpName(portrait)),
  };
}

export function mediaSources({ photographerId, image, video }) {
  const filename = image ?? video;
  return {
    full: 'assets/photographers/' + photographerId + '/' + encodeURIComponent(filename),
    preview: 'assets/previews/' + photographerId + '/' + encodeURIComponent(webpName(filename)),
    thumbnail: 'assets/thumbs/' + photographerId + '/' + encodeURIComponent(webpName(filename)),
  };
}

function webpName(filename) {
  return filename.replace(/\.[^.]+$/, '.webp');
}

const euro = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

export function dailyRate(price) {
  return euro.format(price) + ' / jour';
}

export function photographerTags(id) {
  return SPECIALTIES[id] ?? [];
}

export function photographerSpecialty(id) {
  return SPECIALTY_LABELS[id] ?? 'Photographie';
}

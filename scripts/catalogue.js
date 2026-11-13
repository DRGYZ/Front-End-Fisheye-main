const catalogueURL = new URL('../data/photographers.json', import.meta.url);

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
  style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
});

export function dailyRate(price) {
  return euro.format(price) + ' / jour';
}

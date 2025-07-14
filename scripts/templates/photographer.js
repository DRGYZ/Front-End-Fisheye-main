/**
 * Creates a DOM element representing a photographer card.
 * @param {Object} photographer - The photographer data object.
 * @returns {HTMLElement} The complete card element.
 */
function createPhotographerCard(photographer) {
  const { name, portrait, tagline, city, country, price, id } = photographer;
  const pictureSrc = `assets/photographers/Photographers-List/${portrait}`;
  const profileLink = `photographer.html?id=${id}`;

  // Create main article
  const article = document.createElement('article');
  article.className = 'photographer-card';

  // Wrap image in link
  const link = document.createElement('a');
  link.href = profileLink;
  link.setAttribute('aria-label', `View profile of ${name}`);

  const img = document.createElement('img');
  img.src = pictureSrc;
  img.alt = `Portrait de ${name}`;
  img.className = 'photographer-thumb';

  const h2 = document.createElement('h2');
  h2.textContent = name;

  link.appendChild(img);
  link.appendChild(h2);

  // Info below the image
  const location = document.createElement('p');
  location.className = 'photographer-location';
  location.textContent = `${city}, ${country}`;

  const taglineElem = document.createElement('p');
  taglineElem.className = 'photographer-tagline';
  taglineElem.textContent = tagline;

  const priceElem = document.createElement('p');
  priceElem.className = 'photographer-price';
  priceElem.textContent = `${price}€/jour`;

  // Assemble card
  article.appendChild(link);
  article.appendChild(location);
  article.appendChild(taglineElem);
  article.appendChild(priceElem);

  return article;
}

console.log('Photographer card factory loaded! 🎞️');

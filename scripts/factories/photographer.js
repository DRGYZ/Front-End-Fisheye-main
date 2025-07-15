export function photographerFactory(data) {
  const { id, name, portrait, tagline, city, country, price } = data;

  function getUserCardDOM() {
    const article = document.createElement('article');
    article.classList.add('photographer-card');
    article.setAttribute('aria-label', `Photographer: ${name}`);

    // Link to photographer page
    const link = document.createElement('a');
    link.href = `photographer.html?id=${id}`;
    link.setAttribute('aria-label', `View page of ${name}`);

    // Portrait
    const img = document.createElement('img');
    img.src = `assets/photographers/Photographers-List/${portrait}`;
    img.alt = `Portrait de ${name}`;
    link.appendChild(img);

    // Name
    const h2 = document.createElement('h2');
    h2.textContent = name;
    link.appendChild(h2);

    // Location
    const location = document.createElement('div');
    location.classList.add('location');
    location.textContent = `${city}, ${country}`;

    // Tagline
    const tag = document.createElement('div');
    tag.classList.add('tagline');
    tag.textContent = tagline;

    // Price
    const rate = document.createElement('div');
    rate.classList.add('price');
    rate.textContent = `${price}€/jour`;

    // Combine all
    article.appendChild(link);
    article.appendChild(location);
    article.appendChild(tag);
    article.appendChild(rate);

    return article;
  }

  return { getUserCardDOM };
}

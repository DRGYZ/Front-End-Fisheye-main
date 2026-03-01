export function photographerFactory(data) {
  const { id, name, portrait, tagline, city, country, price } = data;

  function getUserCardDOM() {
    const article = document.createElement('article');
    article.classList.add('photographer-card');
    article.setAttribute('aria-label', `Photographer: ${name}`);

    const link = document.createElement('a');
    link.href = `photographer.html?id=${id}`;
    link.setAttribute('aria-label', `View page of ${name}`);

    const img = document.createElement('img');
    img.src = `assets/photographers/Photographers-List/${portrait}`;
    img.alt = `Portrait de ${name}`;
    link.appendChild(img);

    const h2 = document.createElement('h2');
    h2.textContent = name;
    link.appendChild(h2);

    const location = document.createElement('div');
    location.classList.add('location');
    location.textContent = `${city}, ${country}`;

    const tag = document.createElement('div');
    tag.classList.add('tagline');
    tag.textContent = tagline;

    const rate = document.createElement('div');
    rate.classList.add('price');
    rate.textContent = `${price}€/jour`;

    article.appendChild(link);
    article.appendChild(location);
    article.appendChild(tag);
    article.appendChild(rate);

    return article;
  }

  return { getUserCardDOM };
}


export function photographerFactory(data) {
  const { id, name, portrait, tagline, city, country } = data;

  function getUserCardDOM() {
    const article = document.createElement('article');
    article.setAttribute('aria-label', `Photographer: ${name}`);

    // Create image with alt text
    const img = document.createElement('img');
    img.src = "assets/photographers/Photographers-List/" + portrait; // full path to Photographers-Listportrait; // relative path
    console.log(portrait);
    img.alt = `Portrait of ${name}`;

    // Create h2 for name
    const h2 = document.createElement('h2');
    h2.textContent = name;

    // Create tagline paragraph
    const pTagline = document.createElement('p');
    pTagline.textContent = tagline;

    // Wrap everything
    article.appendChild(img);
    article.appendChild(h2);
    article.appendChild(pTagline);

    return article;
  }

  return { getUserCardDOM };
}

/*function photographerTemplate(data) {
    const { name, portrait } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        const h2 = document.createElement( 'h2' );
        h2.textContent = name;
        article.appendChild(img);
        article.appendChild(h2);
        return (article);
    }
    return { name, picture, getUserCardDOM }
    
}*/

function createPhotographerCard(photographer) {
  // Example: create elements and set attributes
  const card = document.createElement('div');
  card.className = 'photographer-card';

  const img = document.createElement('img');
  img.src = `assets/${photographer.portrait}`; // or full path
  img.alt = `Portrait of ${photographer.name}`;

  const name = document.createElement('h2');
  name.textContent = photographer.name;

  const tagline = document.createElement('p');
  tagline.textContent = photographer.tagline;

  // Append elements
  card.appendChild(img);
  card.appendChild(name);
  card.appendChild(tagline);

  return card;
}

console.log("Chargement du script!");

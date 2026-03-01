import { photographerFactory } from '../factories/photographer.js';

async function getPhotographers() {
  const url = new URL('../../data/photographers.json', import.meta.url);
  const data = await (await fetch(url)).json();
  return data;
}

async function displayPhotographers(photographers) {
  const section = document.querySelector('.photographer_section');
  section.innerHTML = '';

  photographers.forEach((photographer) => {
    const card = photographerFactory(photographer).getUserCardDOM();
    const link = card.querySelector('a');

    if (link) {
      // On précise le libellé ici pour garder un intitulé cohérent avec le contexte de la page d'accueil.
      link.setAttribute('aria-label', `View portfolio of ${photographer.name}`);
    }

    section.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await getPhotographers();
  await displayPhotographers(data.photographers);
});

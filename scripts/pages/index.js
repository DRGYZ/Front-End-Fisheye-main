import { photographerFactory } from '../factories/photographer.js';

async function getPhotographers() {
  const response = await fetch('../data/photographers.json');
  const data = await response.json();
  console.log("Photographers data:", data);
  return data;
}

async function displayPhotographers(photographers) {
  const section = document.querySelector('.photographer_section');
  section.innerHTML = ''; // clear previous content

  photographers.forEach((photographer) => {
    // Create the DOM for the photographer card
    const card = photographerFactory(photographer).getUserCardDOM();
    const link = document.createElement('a');
    link.href = `photographer.html?id=${photographer.id}`;
    link.setAttribute('aria-label', `View details for ${photographer.name}`);
    link.tabIndex = 0;
    link.appendChild(card); // Wrap the card inside the link

    // Append the link (containing the card) to the section
    section.appendChild(link);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await getPhotographers();
  await displayPhotographers(data.photographers);
});

console.log('Script loaded!');

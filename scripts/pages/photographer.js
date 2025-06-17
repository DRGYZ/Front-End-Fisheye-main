// scripts/pages/photographer.js

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));

  // Fetch all photographers data
  const response = await fetch('../data/photographers.json');
  const data = await response.json();

  // Find the specific photographer by ID
  const photographer = data.photographers.find(p => p.id === id);

  if (!photographer) {
    document.getElementById('main').innerHTML = '<p>Photographer not found.</p>';
    return;
  }

  // Display the photographer's name in the header
  const title = document.createElement('h1');
  title.textContent = photographer.name;

  document.getElementById('main').prepend(title);

  // Example of adding location or tagline
  const location = document.createElement('p');
  location.textContent = `${photographer.city}, ${photographer.country}`;
  document.getElementById('main').appendChild(location);

  // You can add more details like portrait image, bio, etc.
  const img = document.createElement('img');
  img.src = photographer.portrait; // Make sure path is correct
  img.alt = `Portrait of ${photographer.name}`;

  document.getElementById('main').appendChild(img);

  // TODO: Load and display the media related to this photographer from your data
});

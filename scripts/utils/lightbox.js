let currentMediaIndex = 0;
let mediaItems = [];
let photographerID = '';

// Core: Update the lightbox display with current media
function updateLightbox() {
  const media = mediaItems[currentMediaIndex];
  const container = document.getElementById('lightboxMedia');
  container.innerHTML = '';

  let mediaElement;

  if (media.image) {
    mediaElement = document.createElement('img');
    mediaElement.src = `assets/photographers/${photographerID}/${media.image}`;
    mediaElement.alt = media.title;
  } else if (media.video) {
    mediaElement = document.createElement('video');
    mediaElement.src = `assets/photographers/${photographerID}/${media.video}`;
    mediaElement.controls = true;
    mediaElement.setAttribute('aria-label', media.title);
  }

  container.appendChild(mediaElement);

  // Set media title
  const titleElement = document.getElementById('lightboxTitle');
  if (titleElement) {
    titleElement.textContent = media.title;
  }
}

// Open and initialize lightbox
export function displayLightbox(index, items, id) {
  console.log('Displaying lightbox for media index:', index, items);
  currentMediaIndex = index;
  mediaItems = items;
  photographerID = id;

  const modal = document.getElementById('lightbox');
  modal.classList.add('active');
  modal.style.display = 'flex';

  updateLightbox();
}

// Close lightbox
function closeLightbox() {
  const modal = document.getElementById('lightbox');
  modal.classList.remove('active');
  modal.style.display = 'none';
}

// Show next media item
function showNext() {
  currentMediaIndex = (currentMediaIndex + 1) % mediaItems.length;
  updateLightbox();
}

// Show previous media item
function showPrevious() {
  currentMediaIndex = (currentMediaIndex - 1 + mediaItems.length) % mediaItems.length;
  updateLightbox();
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('lightbox');
  if (!modal.classList.contains('active')) return;

  switch (e.key) {
    case 'Escape':
      closeLightbox();
      break;
    case 'ArrowRight':
      showNext();
      break;
    case 'ArrowLeft':
      showPrevious();
      break;
  }
});

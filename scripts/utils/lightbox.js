
// ===== Lightbox Controller (Figma full-white design) =====

let currentMediaIndex = 0;
let mediaItems = [];
let photographerID = '';

// Core: Update the lightbox display with current media
function updateLightbox() {
  const media = mediaItems[currentMediaIndex];
  const mediaContainer = document.getElementById('lightboxMedia');
  const titleElement = document.getElementById('lightboxTitle');

  mediaContainer.innerHTML = '';

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

  mediaContainer.appendChild(mediaElement);
  titleElement.textContent = media.title;
}

// Open and initialize lightbox
export function displayLightbox(index, items, id) {
  currentMediaIndex = index;
  mediaItems = items;
  photographerID = id;

  const modal = document.getElementById('lightbox');
  modal.classList.remove('hidden');
  modal.classList.add('active');

  updateLightbox();
}

// Close lightbox
function closeLightbox() {
  const modal = document.getElementById('lightbox');
  modal.classList.add('hidden');
  modal.classList.remove('active');
}

// Navigation
function showNext() {
  currentMediaIndex = (currentMediaIndex + 1) % mediaItems.length;
  updateLightbox();
}

function showPrevious() {
  currentMediaIndex = (currentMediaIndex - 1 + mediaItems.length) % mediaItems.length;
  updateLightbox();
}

// Event Listeners
document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
document.getElementById('lightbox-next')?.addEventListener('click', showNext);
document.getElementById('lightbox-prev')?.addEventListener('click', showPrevious);

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

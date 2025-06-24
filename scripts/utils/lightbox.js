let currentMediaIndex = 0;
let mediaItems = [];

function displayLightbox(index, items) {
  currentMediaIndex = index;
  mediaItems = items;
  const modal = document.getElementById('lightbox');
  modal.classList.add('active');
  modal.style.display = 'flex'; // or toggle class if preferred
  updateLightbox();
}

function updateLightbox() {
  const media = mediaItems[currentMediaIndex];
  const container = document.getElementById('lightboxMedia');
  container.innerHTML = '';

  if (media.image) {
    const img = document.createElement('img');
    img.src = media.image;
    img.alt = media.title;
    container.appendChild(img);
  } else if (media.video) {
    const video = document.createElement('video');
    video.src = media.video;
    video.controls = true;
    container.appendChild(video);
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightbox');
  modal.classList.remove('active');
  modal.style.display = 'none';
}

function showNext() {
  currentMediaIndex = (currentMediaIndex + 1) % mediaItems.length;
  updateLightbox();
}

function showPrevious() {
  currentMediaIndex = (currentMediaIndex - 1 + mediaItems.length) % mediaItems.length;
  updateLightbox();
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('lightbox');
  if (!modal.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrevious();
});

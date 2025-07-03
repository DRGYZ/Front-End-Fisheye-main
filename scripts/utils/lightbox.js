let currentMediaIndex = 0;
let mediaItems = [];
let photographerID = '';

export function displayLightbox(index, items, id) {
  console.log('Displaying lightbox for media index:', index, items);
  currentMediaIndex = index;
  mediaItems = items;
  photographerID = id;
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
    img.src = `assets/photographers/${photographerID}/${media.image}`;
    img.alt = media.title;
    container.appendChild(img);
  } else if (media.video) {
    const video = document.createElement('video');
    video.src = `assets/photographers/${photographerID}/${media.video}`;
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
  if(currentMediaIndex === mediaItems.length - 1) {
    currentMediaIndex = 0;
  } else {
    currentMediaIndex++;
  }
  updateLightbox();
}

function showPrevious() {
  if(currentMediaIndex === 0) {
    currentMediaIndex = mediaItems.length - 1;
  } else {
    currentMediaIndex--;
  }
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
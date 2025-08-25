let _index = 0;
let _items = [];
let _pid = null;
let _wired = false;

function els() {
  return {
    lb: document.getElementById('lightbox'),
    media: document.getElementById('lightboxMedia'),
    title: document.getElementById('lightboxTitle'),
    btnClose: document.getElementById('lightbox-close'),
    btnNext: document.getElementById('lightbox-next'),
    btnPrev: document.getElementById('lightbox-prev'),
  };
}

function render() {
  const { media, title } = els();
  if (!_items.length || !media) return;

  const m = _items[_index];
  media.innerHTML = '';

  let node;
  if (m.image) {
    node = document.createElement('img');
    node.src = `assets/photographers/${_pid}/${m.image}`;
    node.alt = m.title;
  } else {
    node = document.createElement('video');
    node.src = `assets/photographers/${_pid}/${m.video}`;
    node.controls = true;
    node.setAttribute('aria-label', m.title);
  }

  media.appendChild(node);
  if (title) title.textContent = m.title;
}

export function displayLightbox(index, items, photographerId) {
  _index = index;
  _items = items || [];
  _pid = photographerId;

  const { lb } = els();
  if (!lb) return;

  // show
  lb.classList.remove('hidden');
  lb.classList.add('active');
  lb.setAttribute('aria-hidden', 'false');

  wireControlsOnce();
  render();
}

export function closeLightbox() {
  const { lb, media } = els();
  if (!lb) return;

  lb.classList.add('hidden');
  lb.classList.remove('active');
  lb.setAttribute('aria-hidden', 'true');

  if (media) media.innerHTML = '';
}

export function next() {
  if (!_items.length) return;
  _index = (_index + 1) % _items.length;
  render();
}

export function prev() {
  if (!_items.length) return;
  _index = (_index - 1 + _items.length) % _items.length;
  render();
}

function wireControlsOnce() {
  if (_wired) return;
  const { btnClose, btnNext, btnPrev } = els();

  btnClose?.addEventListener('click', closeLightbox);
  btnNext?.addEventListener('click', next);
  btnPrev?.addEventListener('click', prev);

  document.addEventListener('keydown', (e) => {
    const { lb } = els();
    if (!lb || !lb.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  _wired = true;
}
import { dailyRate, loadCatalogue, mediaSources, portraitSources } from '../catalogue.js';
import { photographerFactory } from '../factories/photographer.js';

const list = document.getElementById('photographer-list');
const status = document.getElementById('directory-status');
const browser = document.getElementById('directory-browser');
const stage = document.getElementById('directory-stage');
const caption = document.querySelector('.directory-caption');
const name = document.getElementById('feature-name');
const location = document.getElementById('feature-location');
const tagline = document.getElementById('feature-tagline');
const rate = document.getElementById('feature-rate');
const link = document.getElementById('feature-link');
const sheet = document.getElementById('feature-frames');
const frameLabel = document.getElementById('feature-frame-label');
const previous = document.getElementById('feature-prev');
const next = document.getElementById('feature-next');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

let options = [];
let selection;
let shown;
let shownIndex;
let pending;
let gesture;
let dragFrame;

function loadImage(image, source, fallback, person) {
  image.src = source;
  return image.decode().catch(() => {
    image.srcset = '';
    image.src = fallback;
    image.alt = 'Portrait de ' + person.name;
    image.removeAttribute('lang');
    return image.decode();
  });
}

function prepareImage(option, frame) {
  const { person } = option;
  const portrait = portraitSources(person).preview;
  const image = new Image();
  image.className = 'directory-stage__image';
  image.alt = frame?.title ?? 'Portrait de ' + person.name;
  if (frame) image.lang = 'en';
  image.decoding = 'async';
  image.draggable = false;
  const source = frame ? mediaSources(frame).preview : portrait;

  if (frame?.image === person.cover) {
    image.sizes = '(max-width: 760px) 100vw, 70vw';
    image.srcset = source + ' 760w, assets/covers/' + person.id + '.webp 1280w';
  }

  return loadImage(image, source, portrait, person).then(() => image);
}

function animateImage(image, outgoing, direction, startTransform) {
  if (!outgoing) return;
  if (!direction || reducedMotion.matches) {
    outgoing.remove();
    return;
  }

  const enter = image.animate(
    [
      { opacity: 0.25, transform: 'translate3d(' + direction * 7 + '%, 0, 0)' },
      { opacity: 1, transform: 'none' },
    ],
    { duration: 260, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
  );
  outgoing.animate(
    [
      { opacity: 1, transform: startTransform },
      { opacity: 0, transform: 'translate3d(' + direction * -6 + '%, 0, 0)' },
    ],
    { duration: 260, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
  );
  enter.finished.then(() => outgoing.remove(), () => outgoing.remove());
}

function syncFrameControls() {
  const length = shown.frames.length;
  frameLabel.textContent = length ? (shownIndex + 1) + ' / ' + length : 'Portrait';
  previous.disabled = next.disabled = length < 2;
  for (const [index, button] of Array.from(sheet.children).entries()) {
    button.setAttribute('aria-pressed', String(index === shownIndex));
  }
}

function renderContactSheet(option) {
  sheet.replaceChildren(...option.frames.map((frame, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'directory-frame';
    button.setAttribute('aria-label', 'Afficher : ' + frame.title);
    button.setAttribute('aria-pressed', 'false');
    const image = new Image();
    image.src = mediaSources(frame).thumbnail;
    image.alt = '';
    image.width = 192;
    image.height = 128;
    image.decoding = 'async';
    button.append(image);
    button.addEventListener('click', (event) => {
      const current = selection?.option === option ? selection.index : shownIndex;
      show(option, index, event.detail ? Math.sign(index - current) : 0);
    });
    return button;
  }));
}

function renderCaption(option) {
  const { person } = option;
  name.textContent = person.name;
  location.textContent = person.city + ', ' + person.country;
  tagline.textContent = person.tagline;
  rate.textContent = dailyRate(person.price);
  link.href = 'photographer.html?id=' + person.id;
  link.setAttribute('aria-label', 'Voir le portfolio de ' + person.name);
}

async function show(option, index = 0, direction = 0) {
  if (option === selection?.option && index === selection.index) return;
  selection = { option, index };
  const request = selection;
  for (const item of options) {
    item.button.tabIndex = item === option ? 0 : -1;
  }

  stage.setAttribute('aria-busy', 'true');
  const outgoing = stage.querySelector('.is-current');
  try {
    const image = await prepareImage(option, option.frames[index]);
    if (selection !== request) return;

    const startTransform = outgoing ? getComputedStyle(outgoing).transform : 'none';
    outgoing?.classList.remove('is-current');
    outgoing?.setAttribute('aria-hidden', 'true');
    if (outgoing) outgoing.style.transform = '';
    for (const layer of stage.children) {
      if (layer !== outgoing) layer.remove();
    }
    image.classList.add('is-current');
    stage.append(image);
    animateImage(image, outgoing, direction, startTransform);

    if (shown !== option) {
      renderCaption(option);
      renderContactSheet(option);
      if (direction && !reducedMotion.matches) {
        pending?.cancel();
        pending = caption.animate(
          [{ opacity: 0.45, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }],
          { duration: 180, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
        );
      }
    }
    shown = option;
    shownIndex = index;
    for (const item of options) item.button.setAttribute('aria-pressed', String(item === shown));
    syncFrameControls();
    status.hidden = true;
  } catch {
    if (selection !== request) return;
    if (outgoing) outgoing.style.transform = '';
    selection = shown && { option: shown, index: shownIndex };
    for (const item of options) item.button.tabIndex = item === (shown ?? options[0]) ? 0 : -1;
    status.textContent = 'Cette photo est indisponible. Choisissez une autre photo.';
    status.hidden = false;
  } finally {
    if (selection === request || !selection || selection.option === shown && selection.index === shownIndex) {
      stage.setAttribute('aria-busy', 'false');
    }
  }
}

function moveFrame(offset, motion) {
  const { option, index } = selection ?? {};
  if (!option || option.frames.length < 2) return;
  const target = (index + offset + option.frames.length) % option.frames.length;
  show(option, target, motion ? offset : 0);
}

sheet.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  const buttons = Array.from(sheet.children);
  const index = buttons.indexOf(event.target);
  if (index < 0) return;
  event.preventDefault();
  const target = (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
  show(shown, target);
  buttons[target].focus();
});

function addSwipe() {
  stage.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch' || !event.isPrimary || stage.getAttribute('aria-busy') === 'true') return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, image: stage.querySelector('.is-current') };
  });
  stage.addEventListener('pointermove', (event) => {
    if (gesture?.id !== event.pointerId || reducedMotion.matches || !gesture.image) return;
    const x = event.clientX - gesture.x;
    const y = event.clientY - gesture.y;
    if (Math.abs(x) < 8 || Math.abs(x) < Math.abs(y)) return;
    cancelAnimationFrame(dragFrame);
    const image = gesture.image;
    dragFrame = requestAnimationFrame(() => { image.style.transform = 'translate3d(' + x * .3 + 'px, 0, 0)'; });
  });

  function endSwipe(event, cancelled) {
    if (gesture?.id !== event.pointerId) return;
    cancelAnimationFrame(dragFrame);
    const { x: startX, y: startY, image } = gesture;
    gesture = undefined;
    const x = event.clientX - startX;
    const y = event.clientY - startY;
    if (!cancelled && Math.abs(x) >= 40 && Math.abs(x) > Math.abs(y)) {
      moveFrame(x < 0 ? 1 : -1, true);
      return;
    }
    if (image?.style.transform) {
      image.animate(
        [{ transform: image.style.transform }, { transform: 'none' }],
        { duration: 180, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
      );
      image.style.transform = '';
    }
  }
  stage.addEventListener('pointerup', (event) => endSwipe(event, false));
  stage.addEventListener('pointercancel', (event) => endSwipe(event, true));
}

try {
  const { photographers, media } = await loadCatalogue();
  options = photographers.map((person) => {
    const photos = media.filter((item) => item.photographerId === person.id && item.image);
    const cover = photos.find((item) => item.image === person.cover);
    const frames = cover ? [cover, ...photos.filter((item) => item !== cover)] : photos;
    const button = photographerFactory(person).getPreviewButton();
    return { person, frames: frames.slice(0, 5), button };
  });

  if (options.length) {
    list.replaceChildren(...options.map((option, index) => {
      option.button.addEventListener('click', (event) => {
        const current = options.indexOf(selection?.option);
        show(option, 0, event.detail ? Math.sign(index - current) : 0);
      });
      return option.button;
    }));
    list.addEventListener('keydown', (event) => {
      const offset = { ArrowUp: -1, ArrowLeft: -1, ArrowDown: 1, ArrowRight: 1 }[event.key];
      const index = options.findIndex(({ button }) => button === event.target);
      if (!offset || index === -1) return;
      event.preventDefault();
      const option = options[(index + offset + options.length) % options.length];
      show(option);
      option.button.focus();
    });
    previous.addEventListener('click', (event) => moveFrame(-1, event.detail > 0));
    next.addEventListener('click', (event) => moveFrame(1, event.detail > 0));
    addSwipe();

    document.getElementById('directory-count').textContent = options.length + (options.length === 1 ? ' portfolio' : ' portfolios');
    browser.hidden = false;
    await show(options[0]);
  } else {
    status.textContent = 'Aucun portfolio disponible.';
  }
} catch {
  status.textContent = 'Impossible de charger les portfolios. Actualisez la page pour réessayer.';
}

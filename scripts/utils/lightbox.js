import { mediaSources } from '../catalogue.js';
import { mediaFactory } from '../factories/media.js';
import { closeOnBackdrop } from './dialog.js';

const dialog = document.getElementById('lightbox');
const mediaContainer = document.getElementById('lightbox-media');
const title = document.getElementById('lightbox-title');
const position = document.getElementById('lightbox-position');
const strip = document.getElementById('lightbox-strip');
const previous = document.getElementById('lightbox-prev');
const next = document.getElementById('lightbox-next');

let activeIndex = 0;
let mediaItems = [];
let opener;

function render(direction = 0) {
  const media = mediaItems[activeIndex];
  const asset = mediaFactory(media).getLightboxDOM();
  mediaContainer.replaceChildren(asset);
  const year = media.date ? media.date.slice(0, 4) : '';
  title.textContent = year ? media.title + ' (' + year + ')' : media.title;
  position.textContent = (activeIndex + 1) + ' / ' + mediaItems.length;
  previous.disabled = next.disabled = mediaItems.length < 2;

  for (const [index, button] of Array.from(strip.children).entries()) {
    button.setAttribute('aria-pressed', String(index === activeIndex));
  }
  const activeFrame = strip.children[activeIndex];
  if (activeFrame) {
    strip.scrollLeft +=
      activeFrame.getBoundingClientRect().left -
      strip.getBoundingClientRect().left -
      (strip.clientWidth - activeFrame.offsetWidth) / 2;
  }

  if (direction && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    asset.animate(
      [{ opacity: 0.45, transform: 'translateX(' + direction * 16 + 'px)' }, { opacity: 1, transform: 'none' }],
      { duration: 200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    );
  }
}

function move(offset, animate) {
  activeIndex = (activeIndex + offset + mediaItems.length) % mediaItems.length;
  render(animate ? offset : 0);
}

export function openLightbox(index, items, trigger) {
  activeIndex = index;
  mediaItems = items;
  opener = trigger;
  strip.replaceChildren(
    ...items.map((item, idx) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'lightbox-frame';
      button.setAttribute('aria-label', item.title);
      button.setAttribute('aria-pressed', 'false');

      const frame = document.createElement('img');
      frame.src = mediaSources(item).preview;
      frame.alt = '';
      frame.loading = 'lazy';
      frame.decoding = 'async';
      button.append(frame);

      button.addEventListener('click', (event) => {
        if (activeIndex === idx) return;
        const direction = Math.sign(idx - activeIndex);
        activeIndex = idx;
        render(event.detail ? direction : 0);
      });
      return button;
    }),
  );
  dialog.showModal();
  render();
}

previous.addEventListener('click', (event) => move(-1, event.detail > 0));
next.addEventListener('click', (event) => move(1, event.detail > 0));
document.getElementById('lightbox-close').addEventListener('click', () => dialog.close());
closeOnBackdrop(dialog);

dialog.addEventListener('close', () => {
  mediaContainer.replaceChildren();
  strip.replaceChildren();
  opener?.focus();
});

dialog.addEventListener('keydown', (event) => {
  if (mediaItems.length < 2 || event.target instanceof HTMLVideoElement || event.altKey) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1, false);
    if (strip.contains(event.target)) {
      strip.children[activeIndex]?.focus({ preventScroll: true });
    }
  }
});

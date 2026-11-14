import { mediaSources } from '../catalogue.js';

export function mediaFactory(media, aboveFold = false, plateNumber = null) {
  const sources = mediaSources(media);

  function getCardDOM() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'media-button';
    button.setAttribute('aria-label', 'Ouvrir : ' + media.title);
    button.setAttribute('aria-haspopup', 'dialog');

    const img = document.createElement('img');
    img.src = media.image ? sources.full : sources.preview;
    if (media.image) {
      img.srcset = sources.preview + ' 760w, ' + sources.full + ' 1600w';
      img.sizes = '(max-width: 760px) 100vw, (max-width: 1024px) 50vw, 440px';
    }
    img.alt = '';
    img.loading = aboveFold ? 'eager' : 'lazy';
    img.decoding = 'async';
    button.append(img);

    if (plateNumber !== null) {
      const plate = document.createElement('span');
      plate.className = 'media-plate';
      plate.textContent = 'N° ' + String(plateNumber).padStart(2, '0');
      button.append(plate);
    }

    if (media.video) {
      const badge = document.createElement('span');
      badge.className = 'media-type-badge';
      badge.textContent = 'VIDÉO MP4';

      const play = document.createElement('span');
      play.className = 'media-play';
      play.textContent = '▶';
      play.setAttribute('aria-hidden', 'true');
      button.append(badge, play);
    }

    return button;
  }

  function getLightboxDOM() {
    if (media.video) {
      const video = document.createElement('video');
      video.src = sources.full;
      video.poster = sources.preview;
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.setAttribute('aria-label', media.title);
      return video;
    }

    const photo = document.createElement('img');
    photo.src = sources.full;
    photo.alt = media.title;
    photo.decoding = 'async';
    photo.addEventListener(
      'error',
      () => {
        if (photo.src !== sources.preview) {
          photo.src = sources.preview;
        }
      },
      { once: true },
    );
    return photo;
  }

  return { getCardDOM, getLightboxDOM };
}

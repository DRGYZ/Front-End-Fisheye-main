import { mediaSources } from '../catalogue.js';

export function mediaFactory(media, aboveFold = false) {
  const sources = mediaSources(media);

  function getCardDOM() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'media-button';
    button.setAttribute('aria-label', 'Ouvrir : ' + media.title);
    button.setAttribute('aria-haspopup', 'dialog');

    const preview = document.createElement('img');
    preview.src = sources.preview;
    preview.alt = '';
    preview.loading = aboveFold ? 'eager' : 'lazy';
    preview.decoding = 'async';
    button.append(preview);
    if (media.video) {
      const play = document.createElement('span');
      play.className = 'media-play';
      play.textContent = '▶';
      play.setAttribute('aria-hidden', 'true');
      button.append(play);
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
    photo.src = sources.preview;
    photo.alt = media.title;
    const full = new Image();
    full.src = sources.full;
    full.decode().then(() => {
      if (photo.isConnected) photo.src = full.src;
    }, () => {});
    return photo;
  }

  return { getCardDOM, getLightboxDOM };
}

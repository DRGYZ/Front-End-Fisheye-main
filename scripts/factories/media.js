function PhotoMedia(media, photographerId) {
  function getCardDOM() {
    const mediaButton = document.createElement('button');
    mediaButton.type = 'button';
    mediaButton.className = 'media-button';
    mediaButton.setAttribute('aria-label', `Open media ${media.title} in lightbox`);

    const mediaElement = document.createElement('img');
    mediaElement.src = `assets/photographers/${photographerId}/${media.image}`;
    mediaElement.alt = media.title;

    mediaButton.appendChild(mediaElement);
    return mediaButton;
  }

  function getLightboxDOM() {
    const node = document.createElement('img');
    node.src = `assets/photographers/${photographerId}/${media.image}`;
    node.alt = media.title;
    return node;
  }

  return { getCardDOM, getLightboxDOM };
}

function VideoMedia(media, photographerId) {
  function getCardDOM() {
    const mediaButton = document.createElement('button');
    mediaButton.type = 'button';
    mediaButton.className = 'media-button';
    mediaButton.setAttribute('aria-label', `Open media ${media.title} in lightbox`);

    const mediaElement = document.createElement('video');
    mediaElement.src = `assets/photographers/${photographerId}/${media.video}`;
    mediaElement.controls = false;
    mediaElement.setAttribute('aria-label', media.title);

    mediaButton.appendChild(mediaElement);
    return mediaButton;
  }

  function getLightboxDOM() {
    const node = document.createElement('video');
    node.src = `assets/photographers/${photographerId}/${media.video}`;
    node.controls = true;
    node.setAttribute('aria-label', media.title);
    return node;
  }

  return { getCardDOM, getLightboxDOM };
}

export function mediaFactory(media, photographerId) {
  if (media.image) return PhotoMedia(media, photographerId);
  if (media.video) return VideoMedia(media, photographerId);
  throw new Error(`Unsupported media type for "${media.title}"`);
}

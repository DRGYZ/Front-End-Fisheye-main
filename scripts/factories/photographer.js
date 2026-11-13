import { portraitSources } from '../catalogue.js';

export function photographerFactory(person) {
  const { name, city, country } = person;

  function getPreviewButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'photographer-option';
    button.setAttribute('aria-pressed', 'false');

    const portrait = document.createElement('img');
    portrait.src = portraitSources(person).thumbnail;
    portrait.alt = '';
    portrait.width = 56;
    portrait.height = 56;
    portrait.decoding = 'async';

    const details = document.createElement('span');
    details.className = 'photographer-option__details';
    const title = document.createElement('strong');
    title.textContent = name;
    const location = document.createElement('span');
    location.className = 'photographer-option__location';
    location.textContent = city + ', ' + country;
    details.append(title, location);

    button.append(portrait, details);
    return button;
  }

  return { getPreviewButton };
}

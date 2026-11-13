import {
  dailyRate,
  mediaSources,
  photographerSpecialty,
  portraitSources,
} from '../catalogue.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

export function photographerFactory(person, mediaItems = []) {
  const { id, name, city, country, tagline, price, cover } = person;
  const specialty = photographerSpecialty(id);
  const portfolioHref = 'photographer.html?id=' + id;

  // Put the artist's cover photograph first in the 3-frame contact-sheet triptych
  const sorted = [...mediaItems];
  const coverIndex = sorted.findIndex((item) => (item.image ?? item.video) === cover);
  if (coverIndex > 0) {
    const [coverItem] = sorted.splice(coverIndex, 1);
    sorted.unshift(coverItem);
  }
  const previewFrames = sorted.slice(0, 3);
  const totalLikes = mediaItems.reduce((sum, item) => sum + item.likes, 0);

  function getCardDOM() {
    const card = document.createElement('article');
    card.className = 'folio-card';
    card.dataset.photographerId = String(id);

    // Header: avatar + location + name + daily tariff badge
    const head = document.createElement('div');
    head.className = 'folio-head';

    const artist = document.createElement('div');
    artist.className = 'folio-artist';

    const portraitSrc = portraitSources(person);
    const avatar = document.createElement('img');
    avatar.className = 'folio-avatar';
    avatar.src = portraitSrc.full;
    avatar.srcset = portraitSrc.preview + ' 480w, ' + portraitSrc.full + ' 1000w';
    avatar.sizes = '56px';
    avatar.alt = 'Portrait de ' + name;
    avatar.decoding = 'async';

    const meta = document.createElement('div');
    meta.className = 'folio-meta';
    const loc = document.createElement('p');
    loc.className = 'folio-loc';
    loc.textContent = city + ', ' + country;

    const title = document.createElement('h2');
    title.className = 'folio-name';
    const titleLink = document.createElement('a');
    titleLink.href = portfolioHref;
    titleLink.textContent = name;
    title.append(titleLink);
    meta.append(loc, title);
    artist.append(avatar, meta);

    const rate = document.createElement('span');
    rate.className = 'folio-rate';
    rate.textContent = dailyRate(price);

    head.append(artist, rate);

    const quote = document.createElement('p');
    quote.className = 'folio-tagline';
    quote.textContent = tagline;

    // 3-frame interactive triptych using full/preview resolution (no low-res thumbs)
    const triptych = document.createElement('div');
    triptych.className = 'triptych';

    const leadLink = document.createElement('a');
    leadLink.className = 'triptych-lead';
    leadLink.href = portfolioHref;

    const leadImg = document.createElement('img');
    leadImg.decoding = 'async';
    const leadLabel = document.createElement('span');
    leadLabel.className = 'triptych-lead-label';
    leadImg.lang = 'en';
    leadLabel.lang = 'en';
    leadLink.append(leadImg, leadLabel);

    const side = document.createElement('div');
    side.className = 'triptych-side';

    let focusIdx = 0;

    function syncTriptych(animate) {
      const lead = previewFrames[focusIdx];
      if (!lead) return;

      const leadSources = mediaSources(lead);
      leadImg.src = lead.image ? leadSources.full : leadSources.preview;
      leadImg.alt = lead.title;
      leadLabel.textContent = lead.title;
      leadLink.setAttribute('aria-label', 'Ouvrir le portfolio de ' + name + ' : ' + lead.title);

      if (animate && !reducedMotion.matches) {
        leadImg.animate(
          [{ opacity: 0.45, transform: 'scale(1.03)' }, { opacity: 1, transform: 'scale(1)' }],
          { duration: 240, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        );
      }

      const secondaryIndices = previewFrames
        .map((_, idx) => idx)
        .filter((idx) => idx !== focusIdx)
        .slice(0, 2);

      side.replaceChildren(
        ...secondaryIndices.map((idx) => {
          const frame = previewFrames[idx];
          const frameSrc = mediaSources(frame);
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'triptych-thumb';
          btn.setAttribute('aria-label', 'Aperçu : ' + frame.title);

          const img = document.createElement('img');
          img.src = frame.image ? frameSrc.full : frameSrc.preview;
          img.srcset = frame.image
            ? frameSrc.preview + ' 760w, ' + frameSrc.full + ' 1600w'
            : '';
          img.sizes = '(max-width: 760px) 32vw, 180px';
          img.alt = '';
          img.decoding = 'async';
          btn.append(img);

          btn.addEventListener('click', () => {
            focusIdx = idx;
            syncTriptych(true);
          });
          return btn;
        }),
      );
    }

    syncTriptych(false);
    triptych.append(leadLink, side);

    // Card Footer
    const foot = document.createElement('div');
    foot.className = 'folio-foot';

    const stats = document.createElement('span');
    stats.className = 'folio-stats';
    stats.textContent = mediaItems.length + ' œuvres · ' + totalLikes + ' ♥ · ' + specialty;

    const cta = document.createElement('a');
    cta.className = 'open-portfolio-btn';
    cta.href = portfolioHref;
    cta.textContent = 'Voir le portfolio ';
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';
    cta.append(arrow);

    foot.append(stats, cta);
    card.append(head, quote, triptych, foot);
    return card;
  }

  return { getCardDOM };
}

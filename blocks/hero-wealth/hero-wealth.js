/**
 * Full-bleed hero with left text overlay (matches sjpa image-background-text-left hero).
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const imageRow = rows[0];
  const textRow = rows[1];

  const img = imageRow.querySelector('img');
  if (!img) {
    block.classList.add('no-image');
    return;
  }

  const imageContainer = document.createElement('div');
  imageContainer.classList.add('hero-wealth-image');
  img.loading = 'eager';
  imageContainer.append(img);

  const textOverlay = document.createElement('div');
  textOverlay.classList.add('hero-wealth-overlay');

  [...textRow.children].forEach((col) => {
    textOverlay.append(...col.children);
  });

  const h1 = textOverlay.querySelector('h1');
  if (h1 && h1.textContent && /\bharder\b/i.test(h1.textContent) && !h1.querySelector('.hero-h1-harder')) {
    const raw = h1.innerHTML || h1.textContent;
    h1.innerHTML = raw.replace(/\b(harder)\b/gi, '<span class="hero-h1-harder">$1</span>');
  }

  textOverlay.querySelectorAll('p.button-wrapper').forEach((p) => {
    p.classList.add('button-container', 'cta-button');
  });

  block.textContent = '';
  block.append(imageContainer, textOverlay);
}

/**
 * Hero block: layout/CTA options from authoring rows + SJP “harder” styling.
 * @param {Element} block
 */
export default function decorate(block) {
  const enableUnderline = block.querySelector(':scope div:nth-child(3) > div')?.textContent?.trim() || 'true';

  let layoutStyle = block.querySelector(':scope div:nth-child(4) > div')?.textContent?.trim() || 'overlay';
  const path = (typeof window !== 'undefined' && window.location?.pathname?.replace(/\/$/, '')) || '';
  const isHome = path === '' || path === '/en' || path === '/';
  if (isHome && layoutStyle === 'overlay') {
    layoutStyle = 'image-background-text-left';
  }

  const ctaStyle = block.querySelector(':scope div:nth-child(5) > div')?.textContent?.trim() || 'default';
  const backgroundStyle = block.querySelector(':scope div:nth-child(6) > div')?.textContent?.trim() || 'default';

  if (layoutStyle) {
    block.classList.add(layoutStyle);
  }
  if (backgroundStyle) {
    block.classList.add(backgroundStyle);
  }

  if (enableUnderline.toLowerCase() === 'false') {
    block.classList.add('removeunderline');
  }

  block.querySelectorAll('p.button-container, p.button-wrapper').forEach((el) => {
    el.classList.add('button-container');
    el.classList.add(`cta-${ctaStyle}`);
  });

  const ctaStyleParagraph = block.querySelector('p[data-aue-prop="ctastyle"]');
  if (ctaStyleParagraph) {
    ctaStyleParagraph.style.display = 'none';
  }

  [3, 4, 5, 6].forEach((n) => {
    const div = block.querySelector(`:scope div:nth-child(${n})`);
    if (div) div.style.display = 'none';
  });

  let titleEl = block.querySelector('h1');
  if (!titleEl) {
    const firstRow = block.querySelector(':scope > div:first-child');
    const firstCell = firstRow?.querySelector(':scope > div');
    const firstP = firstCell?.querySelector('p:not(.button-container)');
    if (firstP?.textContent?.trim()) {
      titleEl = document.createElement('h1');
      titleEl.innerHTML = firstP.innerHTML;
      firstP.replaceWith(titleEl);
    }
  }
  if (!titleEl) {
    const anyP = block.querySelector('p:not(.button-container)');
    if (anyP?.textContent?.trim()) {
      titleEl = document.createElement('h1');
      titleEl.innerHTML = anyP.innerHTML;
      anyP.replaceWith(titleEl);
    }
  }

  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    if (heading.textContent && /\bharder\b/i.test(heading.textContent) && !heading.querySelector('.hero-h1-harder')) {
      const raw = heading.innerHTML || heading.textContent;
      heading.innerHTML = raw.replace(/\b(harder)\b/gi, '<span class="hero-h1-harder">$1</span>');
    }
  });

  block.querySelectorAll('p:not(.button-container)').forEach((p) => {
    if (p.textContent && /\bharder\b/i.test(p.textContent) && !p.querySelector('.hero-h1-harder')) {
      const raw = p.innerHTML || p.textContent;
      p.innerHTML = raw.replace(/\b(harder)\b/gi, '<span class="hero-h1-harder">$1</span>');
    }
  });
}

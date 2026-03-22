import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Split "Category | N minute read" into two spans (matches sjp.co.uk news-top row).
 * @param {HTMLParagraphElement} p
 */
function splitNewsMetaLine(p) {
  const raw = p.textContent.trim();
  if (!raw.includes('|')) return;
  const segs = raw.split('|').map((s) => s.trim());
  if (segs.length < 2) return;
  const read = segs.pop();
  const cat = segs.join(' | ');
  p.textContent = '';
  const catSpan = document.createElement('span');
  catSpan.className = 'cards-news-meta-cat';
  catSpan.textContent = cat;
  const readSpan = document.createElement('span');
  readSpan.className = 'cards-news-meta-read';
  readSpan.textContent = read;
  p.append(catSpan, readSpan);
  p.classList.add('cards-news-top');
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('cards-news-item');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-news-card-image';
      else div.className = 'cards-news-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  ul.querySelectorAll(':scope > li .cards-news-card-body').forEach((body) => {
    const firstP = body.querySelector('p:first-of-type');
    if (firstP && firstP.textContent.includes('|')) {
      splitNewsMetaLine(firstP);
    }
  });

  block.textContent = '';
  block.append(ul);
}

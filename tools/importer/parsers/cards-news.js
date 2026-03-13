/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-news
 * Base block: cards
 * Source: https://www.sjp.co.uk
 * Selector: .news-data-wrapper .latest-news--wrapper
 *
 * Cards block structure (from block library):
 * 2 columns per row: [image] | [heading + description + CTA]
 * Each matched element is one news card with image, category, read time, title, and date.
 */
export default function parse(element, { document }) {
  // Extract news image
  const img = element.querySelector('.news-img img, .left-image-data img');

  // Extract category text
  const catDiv = element.querySelector('.news-cat');
  const category = catDiv ? catDiv.textContent.trim() : '';

  // Extract read time
  const readDiv = element.querySelector('.news-read');
  const readTime = readDiv ? readDiv.textContent.trim() : '';

  // Extract title link
  const titleLink = element.querySelector('.news-title a, .news-title');

  // Extract date
  const dateDiv = element.querySelector('.news-date');
  const dateText = dateDiv ? dateDiv.textContent.trim() : '';

  // Build cells: 2 columns [image | content]
  const cells = [];

  // Column 1: Image
  const imageCell = img ? img : '';

  // Column 2: Content (category + read time + title + date)
  const contentCell = [];

  // Create category + read time line
  if (category || readTime) {
    const metaP = document.createElement('p');
    const parts = [];
    if (category) parts.push(category);
    if (readTime) parts.push(readTime);
    metaP.textContent = parts.join(' | ');
    contentCell.push(metaP);
  }

  // Title as heading
  if (titleLink) {
    const h3 = document.createElement('h3');
    if (titleLink.tagName === 'A') {
      h3.append(titleLink);
    } else {
      const link = titleLink.querySelector('a');
      if (link) {
        h3.append(link);
      } else {
        h3.textContent = titleLink.textContent.trim();
      }
    }
    contentCell.push(h3);
  }

  // Date
  if (dateText) {
    const dateP = document.createElement('p');
    dateP.textContent = dateText;
    contentCell.push(dateP);
  }

  cells.push([imageCell, contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}

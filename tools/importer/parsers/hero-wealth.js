/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-wealth
 * Base block: hero
 * Source: https://www.sjp.co.uk
 * Selector: .component-type--banner-video.banner-home-page
 *
 * Hero block structure (from block library):
 * Row 1: Background image
 * Row 2: Heading + description + CTA
 */
export default function parse(element, { document }) {
  // Extract background image from desktop banner
  const bgImg = element.querySelector('.banner-dskt img, .banner_img img');

  // Extract heading (h1)
  const heading = element.querySelector('h1, .text-size-h1-large');

  // Extract description paragraph
  const introDiv = element.querySelector('.banner-intro');
  const description = introDiv ? introDiv.querySelector('p') : null;

  // Extract CTA button
  const cta = element.querySelector('.banner-cta a, a.button');

  // Build cells matching hero block structure
  const cells = [];

  // Row 1: Background image (optional)
  if (bgImg) {
    cells.push([bgImg]);
  }

  // Row 2: Content (heading + description + CTA)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-wealth', cells });
  element.replaceWith(block);
}

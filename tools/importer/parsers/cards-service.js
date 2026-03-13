/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-service
 * Base block: cards
 * Source: https://www.sjp.co.uk
 * Selector: .organism.card.card--v1.signpost-x2-bespoke
 *
 * Cards block structure (from block library):
 * 2 columns per row: [image] | [heading + description + CTA]
 * Each matched element is one service card.
 */
export default function parse(element, { document }) {
  // Extract image from media section
  const img = element.querySelector('.media img, .image img, picture img');

  // Extract heading
  const heading = element.querySelector('h2.heading, h2, h3');

  // Extract description text (first paragraph in .text that isn't a link paragraph)
  const textDiv = element.querySelector('.text, .description');
  let description = null;
  if (textDiv) {
    const firstP = textDiv.querySelector('p:not(.paragraph-small-font)');
    if (firstP) description = firstP;
  }

  // Extract CTA button
  const cta = element.querySelector('a.button, a.btn, .button a');

  // Build cells: 2 columns [image | content]
  const cells = [];

  // Column 1: Image
  const imageCell = img ? img : '';

  // Column 2: Content (heading + description + CTA)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);

  cells.push([imageCell, contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-service', cells });
  element.replaceWith(block);
}

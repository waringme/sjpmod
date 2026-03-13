/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-links
 * Base block: cards (no images)
 * Source: https://www.sjp.co.uk
 * Selector: .banner-bottom-content .banner-config-text
 *
 * Cards (no images) block structure (from block library):
 * 1 column per row, each row = one card with text content
 * Each link becomes a card row with heading (link text) as content
 */
export default function parse(element, { document }) {
  // Extract heading (e.g., "Client links")
  const heading = element.querySelector('p.paragraph-bold, .paragraph-bold');

  // Extract all link paragraphs
  const linkParagraphs = element.querySelectorAll('p.paragraph-small-font a, .paragraph-small-font a');

  // Build cells: Cards (no images) = 1 column, each row = one card
  const cells = [];

  // Each link becomes its own card row
  linkParagraphs.forEach((link) => {
    cells.push([link]);
  });

  // If no links found, try generic anchor extraction
  if (cells.length === 0) {
    const allLinks = element.querySelectorAll('a[href]');
    allLinks.forEach((link) => {
      cells.push([link]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-links', cells });
  element.replaceWith(block);
}

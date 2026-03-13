/* eslint-disable */
/* global WebImporter */

// Browser polyfill: fix helix-importer bundling bug where path.resolve
// creates {env:{},version:"v20.19.5"}.cwd() — a temp object without cwd.
// Adding cwd to Object.prototype ensures any object can respond to .cwd()
if (!Object.prototype.cwd) {
  Object.defineProperty(Object.prototype, 'cwd', {
    value() { return '/'; },
    writable: true,
    configurable: true,
    enumerable: false,
  });
}

// PARSER IMPORTS
import heroWealthParser from './parsers/hero-wealth.js';
import cardsLinksParser from './parsers/cards-links.js';
import cardsServiceParser from './parsers/cards-service.js';
import cardsNewsParser from './parsers/cards-news.js';

// TRANSFORMER IMPORTS
import sjpCleanupTransformer from './transformers/sjp-cleanup.js';
import sjpSectionsTransformer from './transformers/sjp-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-wealth': heroWealthParser,
  'cards-links': cardsLinksParser,
  'cards-service': cardsServiceParser,
  'cards-news': cardsNewsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'SJP homepage - main landing page for St. James\'s Place wealth management',
  urls: [
    'https://www.sjp.co.uk'
  ],
  blocks: [
    {
      name: 'hero-wealth',
      instances: ['.component-type--banner-video.banner-home-page']
    },
    {
      name: 'cards-links',
      instances: ['.banner-bottom-content .banner-config-text']
    },
    {
      name: 'cards-service',
      instances: ['.organism.card.card--v1.signpost-x2-bespoke']
    },
    {
      name: 'cards-news',
      instances: ['.news-data-wrapper .latest-news--wrapper']
    },
    {
      name: 'section-metadata',
      instances: ['.fullwidth-signpost.signpost-full-width']
    }
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Section',
      selector: '.layout-content-top',
      style: 'dark',
      blocks: ['hero-wealth', 'cards-links'],
      defaultContent: []
    },
    {
      id: 'section-2-services',
      name: 'Services Cards Section',
      selector: '.layout-content article',
      style: null,
      blocks: ['cards-service'],
      defaultContent: []
    },
    {
      id: 'section-3-news',
      name: 'Latest News Section',
      selector: '.component-type--sjp-news',
      style: null,
      blocks: ['cards-news'],
      defaultContent: ['.news__display-header']
    },
    {
      id: 'section-4-cta',
      name: 'CTA Banner Section',
      selector: '.fullwidth-signpost.signpost-full-width',
      style: 'dark',
      blocks: [],
      defaultContent: ['.fullwidth-signpost .text-size-h4', '.fullwidth-signpost .text-size-medium', '.fullwidth-signpost .button']
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  sjpCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sjpSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    // Skip section-metadata — handled by section transformer
    if (blockDef.name === 'section-metadata') return;

    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};

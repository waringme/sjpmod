var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-wealth.js
  function parse(element, { document }) {
    const bgImg = element.querySelector(".banner-dskt img, .banner_img img");
    const heading = element.querySelector("h1, .text-size-h1-large");
    const introDiv = element.querySelector(".banner-intro");
    const description = introDiv ? introDiv.querySelector("p") : null;
    const cta = element.querySelector(".banner-cta a, a.button");
    const cells = [];
    if (bgImg) {
      cells.push([bgImg]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-wealth", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-links.js
  function parse2(element, { document }) {
    const heading = element.querySelector("p.paragraph-bold, .paragraph-bold");
    const linkParagraphs = element.querySelectorAll("p.paragraph-small-font a, .paragraph-small-font a");
    const cells = [];
    linkParagraphs.forEach((link) => {
      cells.push([link]);
    });
    if (cells.length === 0) {
      const allLinks = element.querySelectorAll("a[href]");
      allLinks.forEach((link) => {
        cells.push([link]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-links", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-service.js
  function parse3(element, { document }) {
    const img = element.querySelector(".media img, .image img, picture img");
    const heading = element.querySelector("h2.heading, h2, h3");
    const textDiv = element.querySelector(".text, .description");
    let description = null;
    if (textDiv) {
      const firstP = textDiv.querySelector("p:not(.paragraph-small-font)");
      if (firstP) description = firstP;
    }
    const cta = element.querySelector("a.button, a.btn, .button a");
    const cells = [];
    const imageCell = img ? img : "";
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);
    cells.push([imageCell, contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-service", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse4(element, { document }) {
    const img = element.querySelector(".news-img img, .left-image-data img");
    const catDiv = element.querySelector(".news-cat");
    const category = catDiv ? catDiv.textContent.trim() : "";
    const readDiv = element.querySelector(".news-read");
    const readTime = readDiv ? readDiv.textContent.trim() : "";
    const titleLink = element.querySelector(".news-title a, .news-title");
    const dateDiv = element.querySelector(".news-date");
    const dateText = dateDiv ? dateDiv.textContent.trim() : "";
    const cells = [];
    const imageCell = img ? img : "";
    const contentCell = [];
    if (category || readTime) {
      const metaP = document.createElement("p");
      const parts = [];
      if (category) parts.push(category);
      if (readTime) parts.push(readTime);
      metaP.textContent = parts.join(" | ");
      contentCell.push(metaP);
    }
    if (titleLink) {
      const h3 = document.createElement("h3");
      if (titleLink.tagName === "A") {
        h3.append(titleLink);
      } else {
        const link = titleLink.querySelector("a");
        if (link) {
          h3.append(link);
        } else {
          h3.textContent = titleLink.textContent.trim();
        }
      }
      contentCell.push(h3);
    }
    if (dateText) {
      const dateP = document.createElement("p");
      dateP.textContent = dateText;
      contentCell.push(dateP);
    }
    cells.push([imageCell, contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/sjp-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        '[class*="cookie"]',
        "#drift-widget",
        "#block-qualtricswebsitefeedbacksnippet-2",
        ".external-login-wrapper"
      ]);
      WebImporter.DOMUtils.remove(element, [".texture"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        ".breadcrumb",
        "aside",
        ".approval-date",
        "iframe",
        "link",
        "noscript",
        ".hidden"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-once");
        el.removeAttribute("data-drupal-messages-fallback");
        el.removeAttribute("data-entity-type");
        el.removeAttribute("data-entity-uuid");
        el.removeAttribute("data-entity-substitution");
        el.removeAttribute("typeof");
        el.removeAttribute("tabindex");
        el.removeAttribute("role");
      });
    }
  }

  // tools/importer/transformers/sjp-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectorList) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  if (!Object.prototype.cwd) {
    Object.defineProperty(Object.prototype, "cwd", {
      value() {
        return "/";
      },
      writable: true,
      configurable: true,
      enumerable: false
    });
  }
  var parsers = {
    "hero-wealth": parse,
    "cards-links": parse2,
    "cards-service": parse3,
    "cards-news": parse4
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "SJP homepage - main landing page for St. James's Place wealth management",
    urls: [
      "https://www.sjp.co.uk"
    ],
    blocks: [
      {
        name: "hero-wealth",
        instances: [".component-type--banner-video.banner-home-page"]
      },
      {
        name: "cards-links",
        instances: [".banner-bottom-content .banner-config-text"]
      },
      {
        name: "cards-service",
        instances: [".organism.card.card--v1.signpost-x2-bespoke"]
      },
      {
        name: "cards-news",
        instances: [".news-data-wrapper .latest-news--wrapper"]
      },
      {
        name: "section-metadata",
        instances: [".fullwidth-signpost.signpost-full-width"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Section",
        selector: ".layout-content-top",
        style: "dark",
        blocks: ["hero-wealth", "cards-links"],
        defaultContent: []
      },
      {
        id: "section-2-services",
        name: "Services Cards Section",
        selector: ".layout-content article",
        style: null,
        blocks: ["cards-service"],
        defaultContent: []
      },
      {
        id: "section-3-news",
        name: "Latest News Section",
        selector: ".component-type--sjp-news",
        style: null,
        blocks: ["cards-news"],
        defaultContent: [".news__display-header"]
      },
      {
        id: "section-4-cta",
        name: "CTA Banner Section",
        selector: ".fullwidth-signpost.signpost-full-width",
        style: "dark",
        blocks: [],
        defaultContent: [".fullwidth-signpost .text-size-h4", ".fullwidth-signpost .text-size-medium", ".fullwidth-signpost .button"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      if (blockDef.name === "section-metadata") return;
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();

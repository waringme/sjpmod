/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: SJP site cleanup.
 * Selectors from captured DOM of https://www.sjp.co.uk
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent, overlays, and widgets (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="cookie"]',
      '#drift-widget',
      '#block-qualtricswebsitefeedbacksnippet-2',
      '.external-login-wrapper',
    ]);

    // Remove texture/decoration divs that interfere with parsing
    WebImporter.DOMUtils.remove(element, ['.texture']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable content: header, footer, nav, sidebar, breadcrumbs
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      '.breadcrumb',
      'aside',
      '.approval-date',
      'iframe',
      'link',
      'noscript',
      '.hidden',
    ]);

    // Clean up data attributes and tracking
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-once');
      el.removeAttribute('data-drupal-messages-fallback');
      el.removeAttribute('data-entity-type');
      el.removeAttribute('data-entity-uuid');
      el.removeAttribute('data-entity-substitution');
      el.removeAttribute('typeof');
      el.removeAttribute('tabindex');
      el.removeAttribute('role');
    });
  }
}

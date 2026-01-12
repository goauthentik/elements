`<ak-skip-to-content>` provides an accessibility feature that allows keyboard users to quickly
navigate to the main content of a page, bypassing navigation and other non-essential elements.

This component should be placed as near to the top of a web page's hierarchy as possible and must
the first focusable element on a page. When a user presses Tab on page load, the skip link becomes
visible and can be activated to scroll to the designated target element.

### Usage

Due to the way browsers work, you must set the `targetElement` property after the target element
becomes available. This could come quite late, as the entire page may need to be parsed before this
is possible. The usual way to do this is in your routing code or as a JavaScript expression run
after the page is fully loaded and parsed.

### Attributes

- **label**: Custom label for the skip link (defaults to localized "Skip to content")

### Slots

- (default slot) Alternative text for the visible button. Defaults to the content of `label`,
  described above.

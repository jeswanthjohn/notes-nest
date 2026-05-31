
/**
 * Trims leading/trailing whitespace and collapses
 * multiple spaces into a single space.
 *
 * @param {string} text
 * @returns {string}
 */
export function normalizeInput(text) {
  return text.trim().replace(/\s+/g, " ");
}

/**
 * Restricts text to the configured maximum length.
 *
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function enforceMaxLength(text, maxLength) {
  return text.slice(0, maxLength);
}

/**
 * Formats a timestamp for display.
 *
 * @param {number} timestamp
 * @returns {string}
 */
export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString();
}

/**
 * Escapes HTML to prevent script injection
 * and unsafe markup rendering.
 *
 * @param {string} str
 * @returns {string}
 */
export function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

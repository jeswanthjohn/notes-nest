export function normalizeInput(text) {
  return text.trim().replace(/\s+/g, " ");
}

export function enforceMaxLength(text, maxLength) {
  return text.slice(0, maxLength);
}

export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString();
}

export function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
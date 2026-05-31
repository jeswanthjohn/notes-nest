
/**
 * Validates the shape of a note object.
 *
 * @param {Object} note
 * @returns {boolean}
 */
export function isValidNote(note) {
  return (
    typeof note === "object" &&
    note !== null &&
    typeof note.id === "string" &&
    typeof note.content === "string" &&
    typeof note.createdAt === "number" &&
    typeof note.updatedAt === "number"
  );
}

/**
 * Filters a collection and returns only valid notes.
 *
 * @param {*} input
 * @returns {Array<Object>}
 */
export function sanitizeNotes(input) {
  if (!Array.isArray(input)) return [];

  return input.filter(isValidNote);
}

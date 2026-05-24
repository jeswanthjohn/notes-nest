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

export function sanitizeNotes(input) {
  if (!Array.isArray(input)) return [];

  return input.filter(isValidNote);
}
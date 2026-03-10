/* -------------------- STORAGE MODULE -------------------- */

const STORAGE_KEY = "notes-app-data";

/* -------------------- VALIDATION -------------------- */

function isValidNote(note) {
  return (
    typeof note === "object" &&
    typeof note.id === "string" &&
    typeof note.content === "string" &&
    typeof note.createdAt === "number" &&
    typeof note.updatedAt === "number"
  );
}

/* -------------------- LOAD -------------------- */

export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) throw new Error("Invalid notes structure");

    return parsed.filter(isValidNote);
  } catch (err) {
    console.warn("Corrupted notes storage detected. Resetting storage.");
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

/* -------------------- SAVE -------------------- */

export function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error("Failed to save notes:", err);
  }
}
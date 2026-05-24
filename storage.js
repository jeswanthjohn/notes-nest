import { STORAGE_KEY } from "./config.js";
import { isValidNote } from "./validation.js";

/* -------------------- LOAD -------------------- */

export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return [];

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      console.warn("Invalid JSON in storage. Resetting notes.");
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    if (!Array.isArray(parsed)) {
      console.warn("Unexpected storage format. Resetting notes.");
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    const validNotes = parsed.filter(isValidNote);

    if (validNotes.length !== parsed.length) {
      console.warn("Invalid note entries detected. Cleaning storage.");

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(validNotes)
      );
    }

    return validNotes;
  } catch (err) {
    console.error("Failed to access localStorage:", err);
    return [];
  }
}

/* -------------------- SAVE -------------------- */

export function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error("Failed to save notes:", err);

    alert(
      "Unable to save notes. Storage may be full or restricted."
    );
  }
}
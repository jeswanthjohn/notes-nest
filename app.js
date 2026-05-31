
import { loadNotes, saveNotes } from "./storage.js";
import { renderNote } from "./noteRenderer.js";
import { renderNotes as renderNotesView } from "./render.js";

import {
  normalizeInput,
  enforceMaxLength,
  formatDate,
  escapeHTML
} from "./utils.js";

import { MAX_NOTE_LENGTH } from "./config.js";

import { sanitizeNotes } from "./validation.js";

/* -------------------- STATE -------------------- */

let notes = [];
let editingNoteId = null;
let searchQuery = "";

/* -------------------- DOM -------------------- */

const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addBtn");
const cancelBtn = document.getElementById("cancelBtn");
const notesContainer = document.getElementById("notesContainer");
const emptyState = document.getElementById("emptyState");
const charCount = document.getElementById("charCount");
const searchInput = document.getElementById("searchInput");

/* -------------------- STATE API -------------------- */

/**
 * Updates application state, persists notes,
 * and triggers a UI refresh.
 *
 * @param {Array<Object>} newNotes
 */
function setNotes(newNotes) {
  notes = sanitizeNotes(newNotes);

  saveNotes(notes);

  renderNotes();
}

/* -------------------- CRUD OPERATIONS -------------------- */

/**
 * Creates and stores a new note.
 *
 * @param {string} content
 */
function addNote(content) {
  const normalized = normalizeInput(content);

  if (!normalized) return;

  const isDuplicate = notes.some(
    n => n.content === normalized
  );

  if (isDuplicate) {
    alert(
      "Duplicate note detected. Please enter unique content."
    );

    return;
  }

  const now = Date.now();

  const note = {
    id: crypto.randomUUID(),
    content: normalized,
    createdAt: now,
    updatedAt: now
  };

  setNotes([note, ...notes]);
}

/**
 * Updates an existing note.
 *
 * @param {string} id
 * @param {string} content
 */
function updateNote(id, content) {
  const normalized = normalizeInput(content);

  if (!normalized) return;

  const exists = notes.some(n => n.id === id);

  if (!exists) return;

  const isDuplicate = notes.some(
    n => n.content === normalized && n.id !== id
  );

  if (isDuplicate) {
    alert(
      "Duplicate note detected. Please enter unique content."
    );

    return;
  }

  const updated = notes.map(note =>
    note.id === id
      ? {
          ...note,
          content: normalized,
          updatedAt: Date.now()
        }
      : note
  );

  setNotes(updated);
}

/**
 * Removes a note by id.
 *
 * @param {string} id
 */
function deleteNote(id) {
  const exists = notes.some(n => n.id === id);

  if (!exists) return;

  setNotes(notes.filter(note => note.id !== id));

  if (editingNoteId === id) {
    exitEditMode();
  }
}

/* -------------------- SEARCH -------------------- */

/**
 * Returns notes filtered by the active search query.
 *
 * @returns {Array<Object>}
 */
function getFilteredNotes() {
  if (!searchQuery) return notes;

  const query = searchQuery.toLowerCase();

  return notes.filter(note =>
    note.content.toLowerCase().includes(query)
  );
}

/* -------------------- UI -------------------- */

/**
 * Renders the current note collection.
 */
function renderNotes() {
  renderNotesView({
    notes: getFilteredNotes(),
    notesContainer,
    emptyState,
    renderNote,
    formatDate,
    escapeHTML,
    editingNoteId
  });
}

/**
 * Updates the visible character counter.
 */
function updateCharacterCounter() {
  const length = noteInput.value.length;

  charCount.textContent = length;
}

/* -------------------- EVENTS -------------------- */

addBtn.addEventListener("click", () => {
  const text = noteInput.value;

  if (editingNoteId) {
    updateNote(editingNoteId, text);

    exitEditMode();
  } else {
    addNote(text);

    noteInput.value = "";

    updateCharacterCounter();
    updateAddButtonState();
  }
});

cancelBtn.addEventListener("click", exitEditMode);

noteInput.addEventListener("input", () => {
  noteInput.value = enforceMaxLength(
    noteInput.value,
    MAX_NOTE_LENGTH
  );

  updateCharacterCounter();

  updateAddButtonState();
});

/* -------------------- SEARCH EVENTS -------------------- */

if (searchInput) {
  searchInput.addEventListener("input", e => {
    searchQuery = e.target.value.trim();

    renderNotes();
  });
}

/* -------------------- EVENT DELEGATION -------------------- */

notesContainer.addEventListener("click", e => {
  const actionButton = e.target.closest(
    "button[data-action]"
  );

  if (!actionButton) return;

  const action = actionButton.dataset.action;
  const id = actionButton.dataset.id;

  if (!action || !id) return;

  if (action === "delete") {
    const confirmed = confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    deleteNote(id);
  }

  if (action === "edit") {
    const note = notes.find(n => n.id === id);

    if (!note) return;

    if (editingNoteId && editingNoteId !== id) {
      const confirmSwitch = confirm(
        "You have an unsaved edit. Discard and edit another note?"
      );

      if (!confirmSwitch) return;
    }

    enterEditMode(note);
  }
});

/* -------------------- STORAGE SYNC -------------------- */

window.addEventListener("storage", event => {
  if (event.key !== "notes-app-data") return;

  try {
    const updatedNotes = sanitizeNotes(loadNotes());

    if (
      JSON.stringify(updatedNotes) ===
      JSON.stringify(notes)
    ) {
      return;
    }

    notes = updatedNotes;

    if (editingNoteId) {
      exitEditMode();
    } else {
      renderNotes();
    }
  } catch (err) {
    console.error(
      "Failed to sync notes across tabs:",
      err
    );
  }
});

/* -------------------- HELPERS -------------------- */

/**
 * Enables or disables the primary action button
 * based on the current input value.
 */
function updateAddButtonState() {
  addBtn.disabled =
    normalizeInput(noteInput.value) === "";
}

/**
 * Activates edit mode for the selected note.
 *
 * @param {Object} note
 */
function enterEditMode(note) {
  editingNoteId = note.id;

  noteInput.value = note.content;

  addBtn.textContent = "Save";

  cancelBtn.classList.remove("hidden");

  updateCharacterCounter();
  updateAddButtonState();

  renderNotes();
}

/**
 * Resets the editor and exits edit mode.
 */
function exitEditMode() {
  editingNoteId = null;

  noteInput.value = "";

  addBtn.textContent = "Add Note";

  cancelBtn.classList.add("hidden");

  updateCharacterCounter();
  updateAddButtonState();

  renderNotes();
}

/* -------------------- INIT -------------------- */

try {
  notes = sanitizeNotes(loadNotes());
} catch (err) {
  console.error("Failed to initialize notes:", err);

  notes = [];
}

renderNotes();
updateAddButtonState();
updateCharacterCounter();

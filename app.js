import { loadNotes, saveNotes } from "./storage.js";
import { renderNote } from "./noteRenderer.js";

/* -------------------- STATE -------------------- */

let notes = [];
let editingNoteId = null;

const MAX_NOTE_LENGTH = 500;

/* -------------------- DOM -------------------- */

const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addBtn");
const cancelBtn = document.getElementById("cancelBtn");
const notesContainer = document.getElementById("notesContainer");
const emptyState = document.getElementById("emptyState");
const charCount = document.getElementById("charCount");

/* -------------------- STATE API -------------------- */

function setNotes(newNotes) {
  notes = sanitizeNotes(newNotes);
  saveNotes(notes);
  renderNotes();
}

/* -------------------- VALIDATION -------------------- */

function sanitizeNotes(input) {
  if (!Array.isArray(input)) return [];

  return input.filter(
    n =>
      n &&
      typeof n.id === "string" &&
      typeof n.content === "string" &&
      typeof n.createdAt === "number" &&
      typeof n.updatedAt === "number"
  );
}

/* -------------------- INPUT VALIDATION -------------------- */

function normalizeInput(text) {
  return text.trim().replace(/\s+/g, " ");
}

function enforceMaxLength(text) {
  return text.slice(0, MAX_NOTE_LENGTH);
}

/* -------------------- CRUD OPERATIONS -------------------- */

function addNote(content) {
  const normalized = normalizeInput(content);
  if (!normalized) return;

  const now = Date.now();

  const note = {
    id: crypto.randomUUID(),
    content: normalized,
    createdAt: now,
    updatedAt: now
  };

  setNotes([note, ...notes]);
}

function updateNote(id, content) {
  const normalized = normalizeInput(content);
  if (!normalized) return;

  const exists = notes.some(n => n.id === id);
  if (!exists) return;

  const updated = notes.map(note =>
    note.id === id
      ? { ...note, content: normalized, updatedAt: Date.now() }
      : note
  );

  setNotes(updated);
}

function deleteNote(id) {
  const exists = notes.some(n => n.id === id);
  if (!exists) return;

  setNotes(notes.filter(note => note.id !== id));

  if (editingNoteId === id) {
    exitEditMode();
  }
}

/* -------------------- UI -------------------- */

function renderNotes() {
  notesContainer.querySelectorAll(".note").forEach(n => n.remove());

  if (notes.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  const fragment = document.createDocumentFragment();

  notes.forEach(note => {
    const noteElement = renderNote(
      note,
      formatDate,
      escapeHTML,
      note.id === editingNoteId // ✅ pass edit state
    );
    fragment.appendChild(noteElement);
  });

  notesContainer.appendChild(fragment);
}

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
  noteInput.value = enforceMaxLength(noteInput.value);
  updateCharacterCounter();
  updateAddButtonState();
});

/* Event Delegation */

notesContainer.addEventListener("click", e => {
  const actionButton = e.target.closest("button[data-action]");
  if (!actionButton) return;

  const action = actionButton.dataset.action;
  const id = actionButton.dataset.id;

  if (!action || !id) return;

  if (action === "delete") {
    const confirmed = confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;

    deleteNote(id);
  }

  if (action === "edit") {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    // ✅ Prevent switching mid-edit
    if (editingNoteId && editingNoteId !== id) {
      const confirmSwitch = confirm(
        "You have an unsaved edit. Discard and edit another note?"
      );
      if (!confirmSwitch) return;
    }

    enterEditMode(note);
  }
});

/* -------------------- HELPERS -------------------- */

function updateAddButtonState() {
  addBtn.disabled = normalizeInput(noteInput.value) === "";
}

function enterEditMode(note) {
  editingNoteId = note.id;

  noteInput.value = note.content;
  addBtn.textContent = "Save";
  cancelBtn.classList.remove("hidden");

  updateCharacterCounter();
  updateAddButtonState();
  renderNotes(); // ✅ reflect UI state
}

function exitEditMode() {
  editingNoteId = null;

  noteInput.value = "";
  addBtn.textContent = "Add Note";
  cancelBtn.classList.add("hidden");

  updateCharacterCounter();
  updateAddButtonState();
  renderNotes(); // ✅ remove highlight
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString();
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
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
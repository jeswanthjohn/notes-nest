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
  notes = newNotes;
  saveNotes(notes);
  renderNotes();
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

  const updated = notes.map(note =>
    note.id === id
      ? { ...note, content: normalized, updatedAt: Date.now() }
      : note
  );

  setNotes(updated);
}

function deleteNote(id) {
  setNotes(notes.filter(note => note.id !== id));
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
    const noteElement = renderNote(note, formatDate, escapeHTML);
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

/* Event Delegation for Note Actions */

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
    if (note) enterEditMode(note);
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
  updateAddButtonState();
}

function exitEditMode() {
  editingNoteId = null;
  noteInput.value = "";
  addBtn.textContent = "Add Note";
  cancelBtn.classList.add("hidden");
  updateCharacterCounter();
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
  notes = loadNotes();
} catch (err) {
  console.error("Failed to initialize notes:", err);
  notes = [];
}

renderNotes();
updateAddButtonState();
updateCharacterCounter();
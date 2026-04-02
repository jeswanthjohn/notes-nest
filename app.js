import { loadNotes, saveNotes } from "./storage.js";
import { renderNote } from "./noteRenderer.js";

/* -------------------- STATE -------------------- */

let notes = [];
let editingNoteId = null;
let searchQuery = ""; //  search state

const MAX_NOTE_LENGTH = 500;

/* -------------------- DOM -------------------- */

const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addBtn");
const cancelBtn = document.getElementById("cancelBtn");
const notesContainer = document.getElementById("notesContainer");
const emptyState = document.getElementById("emptyState");
const charCount = document.getElementById("charCount");
const searchInput = document.getElementById("searchInput"); 

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

  const isDuplicate = notes.some(n => n.content === normalized);
  if (isDuplicate) {
    alert("Duplicate note detected. Please enter unique content.");
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

function updateNote(id, content) {
  const normalized = normalizeInput(content);
  if (!normalized) return;

  const exists = notes.some(n => n.id === id);
  if (!exists) return;

  const isDuplicate = notes.some(
    n => n.content === normalized && n.id !== id
  );
  if (isDuplicate) {
    alert("Duplicate note detected. Please enter unique content.");
    return;
  }

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

/* -------------------- SEARCH  -------------------- */

function getFilteredNotes() {
  if (!searchQuery) return notes;

  const query = searchQuery.toLowerCase();

  return notes.filter(note =>
    note.content.toLowerCase().includes(query)
  );
}

/* -------------------- UI -------------------- */

function renderNotes() {
  notesContainer.querySelectorAll(".note").forEach(n => n.remove());

  const filteredNotes = getFilteredNotes(); 

  if (filteredNotes.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  const fragment = document.createDocumentFragment();

  filteredNotes.forEach(note => {
    const noteElement = renderNote(
      note,
      formatDate,
      escapeHTML,
      note.id === editingNoteId
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

/*  Search input event */

if (searchInput) {
  searchInput.addEventListener("input", e => {
    searchQuery = e.target.value.trim();
    renderNotes();
  });
}

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

    if (JSON.stringify(updatedNotes) === JSON.stringify(notes)) return;

    notes = updatedNotes;

    if (editingNoteId) {
      exitEditMode();
    } else {
      renderNotes();
    }

  } catch (err) {
    console.error("Failed to sync notes across tabs:", err);
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
  renderNotes();
}

function exitEditMode() {
  editingNoteId = null;

  noteInput.value = "";
  addBtn.textContent = "Add Note";
  cancelBtn.classList.add("hidden");

  updateCharacterCounter();
  updateAddButtonState();
  renderNotes();
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
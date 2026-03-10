import { loadNotes, saveNotes } from "./storage.js";

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
    const div = document.createElement("div");
    div.className = "note";
    div.setAttribute("role", "listitem");

    div.innerHTML = `
      <p>${escapeHTML(note.content)}</p>
      <div class="note-footer">
        <small aria-label="Last updated ${formatDate(note.updatedAt)}">
          ${formatDate(note.updatedAt)}
        </small>
        <div class="note-actions">
          <button data-action="edit" data-id="${note.id}">
            Edit
          </button>
          <button data-action="delete" data-id="${note.id}" class="delete">
            Delete
          </button>
        </div>
      </div>
    `;

    fragment.appendChild(div);
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

/* -------------------- HELPERS -------------------- */

function updateAddButtonState() {
  addBtn.disabled = normalizeInput(noteInput.value) === "";
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

notes = loadNotes();
renderNotes();
updateAddButtonState();
updateCharacterCounter();
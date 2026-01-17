/* -------------------- STATE -------------------- */

let notes = [];
let editingNoteId = null;

const STORAGE_KEY = "notes-app-data";

/* -------------------- DOM -------------------- */

const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addBtn");
const cancelBtn = document.getElementById("cancelBtn");
const notesContainer = document.getElementById("notesContainer");
const emptyState = document.getElementById("emptyState");

/* -------------------- STORAGE -------------------- */

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Invalid data");

    return parsed.filter(isValidNote);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function saveNotes(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function isValidNote(note) {
  return (
    typeof note === "object" &&
    typeof note.id === "string" &&
    typeof note.content === "string" &&
    typeof note.createdAt === "number" &&
    typeof note.updatedAt === "number"
  );
}

/* -------------------- STATE API -------------------- */

function setNotes(newNotes) {
  notes = newNotes;
  saveNotes(notes);
  renderNotes();
}

/* -------------------- CRUD OPERATIONS -------------------- */

function addNote(content) {
  const now = Date.now();

  const note = {
    id: crypto.randomUUID(),
    content,
    createdAt: now,
    updatedAt: now
  };

  setNotes([note, ...notes]);
}

function updateNote(id, content) {
  const updated = notes.map(note =>
    note.id === id
      ? { ...note, content, updatedAt: Date.now() }
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

    div.innerHTML = `
      <p>${escapeHTML(note.content)}</p>
      <div class="note-footer">
        <small>${formatDate(note.updatedAt)}</small>
        <div class="note-actions">
          <button data-action="edit" data-id="${note.id}">Edit</button>
          <button data-action="delete" data-id="${note.id}" class="delete">Delete</button>
        </div>
      </div>
    `;

    fragment.appendChild(div);
  });

  notesContainer.appendChild(fragment);
}

function enterEditMode(note) {
  editingNoteId = note.id;
  noteInput.value = note.content;
  addBtn.textContent = "Save";
  cancelBtn.classList.remove("hidden");
}

function exitEditMode() {
  editingNoteId = null;
  noteInput.value = "";
  addBtn.textContent = "Add Note";
  cancelBtn.classList.add("hidden");
}

/* -------------------- EVENTS -------------------- */

addBtn.addEventListener("click", () => {
  const text = noteInput.value.trim();
  if (!text) return;

  if (editingNoteId) {
    updateNote(editingNoteId, text);
    exitEditMode();
  } else {
    addNote(text);
    noteInput.value = "";
  }
});

cancelBtn.addEventListener("click", exitEditMode);

notesContainer.addEventListener("click", e => {
  const action = e.target.dataset.action;
  const id = e.target.dataset.id;

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

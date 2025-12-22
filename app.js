
//let notes = JSON.parse(localStorage.getItem("notes")) || [];

// STEP 2: DOM elements
const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addBtn");
const notesContainer = document.getElementById("notesContainer");


//function saveNotes() {
//  localStorage.setItem("notes", JSON.stringify(notes));
//}

// STEP 4: Add note
function addNote() {
  const text = noteInput.value.trim();
  if (text === "") return;

  const note = {
    id: Date.now(),
    content: text,
    createdAt: new Date().toLocaleString()
  };

  notes.push(note);
  //saveNotes();
  renderNotes();
  noteInput.value = "";
}

// STEP 5: Delete note
function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  //saveNotes();
  renderNotes();
}

// STEP 6: Render notes
function renderNotes() {
  notesContainer.innerHTML = "";

  notes.forEach(note => {
    const div = document.createElement("div");
    div.className = "note";

    div.innerHTML = `
      <p>${note.content}</p>
      <small>${note.createdAt}</small>
      <button onclick="deleteNote(${note.id})">Delete</button>
    `;

    notesContainer.appendChild(div);
  });
}

// STEP 7: Event listener
addBtn.addEventListener("click", addNote);

// STEP 8: Initial render
renderNotes();

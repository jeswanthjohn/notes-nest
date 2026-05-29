export function renderNotes({
  notes,
  notesContainer,
  emptyState,
  renderNote,
  formatDate,
  escapeHTML,
  editingNoteId
}) {
  notesContainer
    .querySelectorAll(".note")
    .forEach(note => note.remove());

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
      note.id === editingNoteId
    );

    fragment.appendChild(noteElement);
  });

  notesContainer.appendChild(fragment);
}
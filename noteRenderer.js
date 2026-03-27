export function renderNote(note, formatDate, escapeHTML, isEditing = false) {
  const div = document.createElement("div");
  div.className = "note";
  div.setAttribute("role", "listitem");

  if (isEditing) {
    div.classList.add("editing"); // ✅ visual indicator
  }

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

  return div;
}
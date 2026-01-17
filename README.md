# 📝 Notes App

A lightweight, client-side Notes application built with **Vanilla JavaScript** that demonstrates clean state management, DOM manipulation, and persistent storage using the browser’s localStorage.

🔗 **Live Demo:** https://notes-nest-jeswanth.netlify.app

---

## 🚀 Overview

This project is a **frontend CRUD application** designed to practice real-world JavaScript fundamentals without relying on frameworks.  
The focus is on **predictable state updates, separation of concerns, and defensive coding**, rather than feature bloat.

---

## ✨ Features

- Create, edit, and delete notes (full CRUD)
- Persistent storage using `localStorage`
- Explicit edit mode with save and cancel flow
- Timestamps for creation and last update
- Defensive handling of corrupted storage data
- Accessible, semantic HTML structure
- Responsive and clean UI
- Event delegation for dynamic elements

---
## ✨ Key UX Decisions

- Implemented a clear empty state to guide users when no notes are present, improving first-use experience.
- Added confirmation before deleting notes to prevent accidental data loss.

---

## 🧠 Engineering Decisions

### 1. State Management
- Notes are managed via a **single source of truth**
- All mutations go through a centralized `setNotes()` function
- Prevents inconsistent UI and scattered state changes

### 2. Event Delegation
- Dynamic actions (edit/delete) are handled using event delegation
- Avoids inline event handlers and improves scalability

### 3. Data Modeling
Each note follows a predictable schema:
```js
{
  id: string,
  content: string,
  createdAt: number,
  updatedAt: number
}
Timestamps are stored as numbers, not formatted strings

Formatting is handled only at render time

### 4. Persistence Strategy

localStorage is used to keep the app fully client-side

Stored data is validated before use

Corrupted data is safely discarded to avoid runtime errors

🛠️ Tech Stack

HTML5 (semantic markup)

CSS3 (responsive layout, interaction states)

Vanilla JavaScript (ES6+)

Browser localStorage API

Git & GitHub

Netlify (deployment)

📂 Project Structure
/
├── index.html     # Semantic, accessible markup
├── styles.css     # Responsive styling
├── app.js         # State, logic, and UI handling
└── README.md

⚠️ Known Limitations

No authentication or cloud sync (intentionally out of scope)

Data is browser-specific

Designed for learning and demonstration, not production use

🎯 Learning Outcomes

Managing application state without frameworks

Implementing CRUD patterns in vanilla JavaScript

Using event delegation for dynamic DOM elements

Persisting and validating client-side data

Writing defensive, readable frontend code

- Supporting keyboard-first interactions (Enter to add/save, Esc to cancel edits)

- Providing clear interaction feedback by disabling actions when input is invalid


📌 Status

✅ Feature complete
✅ Refactored for clarity and maintainability
✅ Deployed and production-ready (frontend scope)

📬 Feedback

Suggestions and improvements are welcome.
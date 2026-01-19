# 📝 Notes App

A lightweight, client-side Notes application built with **Vanilla JavaScript**, focused on clean state management, predictable UI behavior, and defensive handling of browser storage.

🔗 **Live Demo:** [https://notes-nest-jeswanth.netlify.app](https://notes-nest-jeswanth.netlify.app)

---

## 🚀 Overview

This project is a **frontend CRUD application** built without frameworks to practice core JavaScript fundamentals as they are applied in real-world interfaces.

The emphasis is on **clarity of state flow, separation of concerns, accessibility, and correctness**, rather than feature quantity or visual complexity.

---

## ✨ Features

* Create, edit, and delete notes (full CRUD lifecycle)
* Persistent storage using the browser’s `localStorage`
* Explicit edit mode with save and cancel flow
* Timestamps for creation and last update
* Defensive handling of corrupted or invalid stored data
* Keyboard-first interactions (Enter to add/save, Esc to cancel edit)
* Accessible, semantic HTML structure
* Responsive, distraction-free UI
* Event delegation for dynamic note actions

---

## ✨ Key UX Decisions

* A **clear empty state** is shown when no notes exist to guide first-time users
* **Deletion confirmation** is required to prevent accidental data loss
* Primary actions are disabled when input is invalid to provide immediate feedback
* Edit mode is explicit and reversible to avoid unintended overwrites

---

## 🧠 Engineering Decisions

### State Management

* Notes are managed through a **single source of truth**
* All state mutations flow through a centralized `setNotes()` function
* Ensures consistent rendering and avoids scattered side effects

### Event Delegation

* Edit and delete actions are handled via event delegation on the notes container
* Prevents unnecessary re-binding of listeners during re-renders
* Keeps DOM interaction logic predictable and scalable

### Data Modeling

Each note follows a strict, predictable schema:

```js
{
  id: string,
  content: string,
  createdAt: number,
  updatedAt: number
}
```

* Timestamps are stored as numeric values
* Formatting is handled only at render time, not in state

### Persistence Strategy

* The app is fully client-side using `localStorage`
* Stored data is validated before being loaded into state
* Invalid or corrupted data is discarded safely to avoid runtime failures

---

## 🚫 Non-goals

The following were intentionally excluded to keep the project focused:

* User authentication or accounts
* Server-side persistence or APIs
* Cloud sync or cross-device storage
* Rich text formatting or markdown support

---

## 🛠️ Tech Stack

* HTML5 (semantic, accessible markup)
* CSS3 (responsive layout and interaction states)
* Vanilla JavaScript (ES6+)
* Browser `localStorage` API
* Git & GitHub
* Netlify (deployment)

---

## 📂 Project Structure

```text
/
├── index.html     # Semantic, accessible markup
├── styles.css     # Responsive styling and visual feedback
├── app.js         # State management, logic, and UI behavior
└── README.md
```

---

## ⚠️ Known Limitations

* Data is browser-specific and tied to local storage
* No synchronization across devices or browsers
* Designed for learning and demonstration, not production scale

---

## 🎯 Learning Outcomes

* Managing application state without frameworks
* Implementing CRUD patterns in vanilla JavaScript
* Applying event delegation for dynamic DOM elements
* Persisting and validating client-side data safely
* Writing defensive, readable frontend code
* Supporting keyboard-accessible interaction flows
* Designing UI behavior that prevents invalid user actions

---

## 📌 Status

* ✅ Feature complete
* ✅ Refactored for clarity and maintainability
* ✅ Deployed and stable (frontend scope)

---

## 👤 Author

**Jeswanth Reddy**
Full Stack Developer (JavaScript, React, Node.js)
GitHub: [https://github.com/jeswanthjohn](https://github.com/jeswanthjohn)

---

## 📬 Feedback

Suggestions and discussion are welcome.

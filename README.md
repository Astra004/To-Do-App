# To-Do-App
Drag &amp; Drop To-Do Lis

# Do. — Drag & Drop To-Do List

A clean, minimal to-do list app built with **vanilla HTML, CSS, and JavaScript** — no frameworks, no dependencies.

![Do. To-Do App](https://img.shields.io/badge/Built%20With-Vanilla%20JS-f7df1e?style=flat-square&logo=javascript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square)

---

## 🔗 Live Demo

👉 **[View Live App](https://Astra004.github.io/To-Do-App)**

---

## ✨ Features

- ✅ **Add tasks** with a priority level — High, Medium, or Low
- 🖱️ **Drag & drop** to reorder tasks in your preferred priority
- ☑️ **Checkbox** to mark tasks as complete — moves to a "Completed" section
- 🗑️ **Delete button** appears on hover with a smooth animation
- 🔍 **Filter bar** — view All, Active, Done, or filter by priority
- 📊 **Progress bar** tracks your completion percentage
- 💾 **localStorage** — tasks persist across page refreshes
- 🕐 **Live timestamps** — shows how long ago each task was added
- 🔔 **Toast notifications** for every action

---

## 📁 Project Structure

```
To-Do-App/
├── index.html      # App structure & layout
├── style.css       # All styling & animations
└── app.js          # All logic, drag/drop, localStorage
```

---

## 🚀 Getting Started

### Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Astra004/To-Do-App.git
   ```

2. Navigate into the folder:
   ```bash
   cd To-Do-App
   ```

3. Open `index.html` in your browser — that's it, no setup needed!

---

## 🧠 JavaScript Concepts Used

This project is great for learning and covers these core JS concepts:

| Concept | Where It's Used |
|---|---|
| `Array.push / unshift` | Adding new tasks |
| `Array.filter / find` | Filter bar & task lookup |
| `Array.splice` | Deleting & reordering tasks |
| `localStorage` | Persisting tasks across sessions |
| `HTML5 Drag API` | Drag & drop reordering |
| `getBoundingClientRect()` | Detecting drop position |
| `DOM manipulation` | Rendering tasks dynamically |
| `Event listeners` | Handling all user interactions |

---

## 🎨 Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, animations, transitions
- **Vanilla JavaScript** — Zero dependencies, pure JS
- **Google Fonts** — Instrument Serif, Epilogue, JetBrains Mono

---

## 📸 How to Use

1. **Type** a task in the input field and select a priority
2. **Press Enter** or click **Add** to add it to the list
3. **Drag** any task up or down to reorder
4. **Click the checkbox** to mark it as done
5. **Hover** over a task and click **×** to delete it
6. Use the **filter buttons** to view specific tasks

---

## 🌐 Deploying to GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Under Source, select **Deploy from a branch**
3. Choose **`main`** branch → **`/ (root)`** → click **Save**
4. Your app will be live at `https://Astra004.github.io/To-Do-App`

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> Built as a beginner JavaScript learning project — covering DOM manipulation, drag & drop, and localStorage.

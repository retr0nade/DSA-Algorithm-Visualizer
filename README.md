# 🧠 DSA Playground – Algorithm Visualizer

An interactive and responsive web app to **visualize sorting algorithms** step-by-step, built using **Javascript**, **HTML**, and used **localStorage** for session persistence. This tool helps users understand the inner workings of key sorting techniques with colorful animations, real-time pseudocode, and complexity breakdowns.


## 🎯 Features

✅ **Sorting Algorithms Implemented:**

- Bubble Sort
- Merge Sort
- Quick Sort
- (More to be added soon!)

🎨 **Interactive UI Includes:**

- Dynamic bar chart animation for arrays
- Array size & speed controls
- Color-coded visualization:
  - 🔵 Default
  - 🟡 Comparing
  - 🔴 Swapping
  - 🟢 Sorted
- Custom array input (comma-separated)
- Random array generator
- Sorting controls: Start / Pause / Reset

📚 **Educational Tools:**

- Real-time **pseudocode display** with line highlighting
- Time and space complexity info panel
- Comparison and swap count tracker

🌃 **UX Additions:**

- Fully **responsive layout** (desktop, tablet, mobile)
- Smooth transitions with Tailwind animations and Framer Motion

📀 **Session Persistence:**

- Auto-save and load last used settings and array via **localStorage**

---

## 💠 Tech Stack

- **Frontend:** React, Tailwind CSS, Framer Motion
- **State Management:** useState, useEffect
- **Data Persistence:** localStorage
- **Utilities:** Custom delay (`sleep`) function for animation control

---

## 📂 Folder Structure (Simplified)

```
dsa-visualizer/
🗄️ public/
🗄️ src/
🗄️ components/
🔸 SortingVisualizer.jsx
🔸 ControlPanel.jsx
🔸 BarChart.jsx
🔸 PseudocodeCard.jsx
🗄️ utils/
🔸 sortingAlgorithms.js
🔸 sleep.js
🔸 App.jsx
🔸 index.js
tailwind.config.js
package.json
README.md
```

---

## 🧪 Getting Started

### 1. Clone the repository:

```bash
git clone https://github.com/retr0nade/dsa-algorithm-visualizer.git
cd dsa-visualizer
```

### 2. Install dependencies:

```bash
npm install
# or
yarn install
```

### 3. Run the app locally:

```bash
npm run dev
# or
yarn dev
```

---

## 🧠 Future Improvements

- Add more algorithms: Insertion Sort, Heap Sort, etc.
- Add backend (FastAPI) support for saving sessions/user configs
- Export GIF of sorting animation
- User login and leaderboard for gamified challenges

---

## 🙌 Acknowledgements

This project was built with ❤️ as a way to make learning Data Structures and Algorithms more visual, intuitive, and fun.

---

## 📜 License

MIT License — Feel free to use, fork, and improve!

---


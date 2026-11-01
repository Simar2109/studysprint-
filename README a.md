# StudySprint — Student Productivity Dashboard

> **Web Design Challenge Edition**  
> A competition-ready, responsive student productivity web application engineered to reduce cognitive overload and encourage steady academic momentum through structured tasks and Pomodoro sprint focus sessions.

---

## ✦ Project Overview
- **Project Title:** StudySprint
- **Target Audience:** College and high school students seeking an aesthetic, distraction-free planning dashboard.
- **Core Philosophy:** *Single-Tasking & Incremental Momentum.* Capture priorities quickly, focus deeply for 25 minutes, and celebrate every win.
- **Tech Stack:** HTML5, CSS3, Modern Vanilla JavaScript (ES6+). Zero build tools, zero external dependencies, zero trackers.

---

## ✦ Key Features

### 1. Task Management with Due Dates & Priorities
- **Priority Categorization:** Choose between `High ✦`, `Normal`, and `Low` priority levels with distinct pastel badges.
- **Task Due Dates:** Native date picker with quick-select shortcuts (**"Today"** and **"Tomorrow"**).
- **Smart Date Badges:** Automatically identifies `📅 Today` (amber), `📅 Tomorrow` (blue), `⚠️ Overdue` (rose), and future dates.
- **Full CRUD & Batch Actions:** Add, check complete, delete individual tasks, and batch clear all completed tasks.

### 2. Real-Time Search & Contextual Filtering
- **Live Search Bar:** Instant client-side search filtering across task titles as you type.
- **Keyboard Shortcut:** Press `/` anywhere to immediately focus the search bar.
- **Smart Filter Pills:** Filter by **All**, **In progress**, and **Completed** with live task counts.
- **Adaptive Empty States:** Context-aware illustrations and messages (e.g., when all tasks are complete, no search matches, or list is brand new).

### 3. Integrated Pomodoro Focus Room
- **Customizable Intervals:** Preset modes for **25m Focus Sprint**, **5m Short Break**, and **15m Long Rest**.
- **Smooth SVG Progress Ring:** Circular animated timer ring illustrating elapsed time with `stroke-dashoffset`.
- **Dynamic Browser Title:** Countdown shows in browser tab (e.g. `(24:18) StudySprint`) so students can check time while researching in another tab.
- **Daily Focus Log:** Automatically logs completed sprint sessions and total minutes into local productivity stats.

### 4. Micro-Delight & Positive Reinforcement
- **Celebratory Confetti:** Pure vanilla JS canvas confetti particle burst upon checking off a task or completing a focus sprint.
- **Audio Feedback:** Gentle dual-tone chime generated via Web Audio API (with an audio mute/unmute toggle in the top bar).
- **Toast Notifications with Undo:** Erroneous clicks can be instantly reverted via non-intrusive floating toasts.

### 5. Personalized Motivation & Daily Insights
- **Time-of-Day Dynamic Greeting:** Adapts to "Good morning", "Good afternoon", "Good evening", or "Late-night sprint".
- **Custom Student Profile:** Clickable profile card to personalize the student's name and avatar letter.
- **Curated Study Tips & Mindset Quotes:** Interactive refresh buttons for evidence-based study methods (Active Recall, 2-Minute Rule) and motivating quotes.
- **Productivity Statistics Bar:**
  - Tasks completed & completion rate percentage badge.
  - Tasks remaining with high-priority urgency indicator.
  - Total focus minutes and completed sprint sessions logged today.
  - Animated visual progress bar.

### 6. Design & Accessibility
- **Modern Lavender SaaS Aesthetic:** Refined purple palette (`#7058e6`) with subtle pastel highlights.
- **Light & Dark Mode:** Fluid theme toggle with persistent state saved in `localStorage`.
- **Fully Responsive:** Adapts seamlessly to 4K monitors, laptops, tablets, and mobile devices (includes a slide-in mobile navigation drawer).
- **WCAG 2.1 AA Compliant:** High-contrast color ratios, `:focus-visible` outlines, ARIA attributes, and semantic landmarks.

---

## ✦ File Structure

```
studysprint/
├── index.html            # Semantic HTML5 markup, ARIA landmarks, modal dialogs
├── style.css             # Modular CSS variables, dark mode styles, fluid layouts, animations
├── script.js             # State management, local storage, timer, audio, confetti, search
├── DESIGN_RATIONALE.md   # UX/UI research, design choices, and accessibility breakdown
└── README.md             # Project documentation and presentation guide
```

---

## ✦ How to Run Locally

1. Clone or download the repository files.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).
3. **No server, installation, or Node.js environment is required.**
   *(Optional)* If using VS Code, right-click `index.html` and select **Open with Live Server**.

---

## ✦ Competition Walkthrough Guide (2 Minutes)

When presenting StudySprint to judges:

1. **Introduction (15 sec):** Highlight the design goal—eliminating student cognitive overload using a focused, single-tasking workflow.
2. **Dynamic Greeting & Personalization (15 sec):** Show how the greeting changes with the time of day, and click the student profile avatar to personalize the name.
3. **Task Creation with Due Dates (30 sec):** Add a task (e.g. *"Revise Organic Chemistry"*), set priority to *High*, click the *"Tomorrow"* shortcut, and add it. Show the smart due date badge.
4. **Live Search & Filter (20 sec):** Press `/` on the keyboard to focus search, type a keyword to show real-time filtering, and test the status filter buttons.
5. **Interactive Win & Confetti (15 sec):** Check off a task. Demonstrate the satisfying checkmark bounce, canvas confetti burst, gentle audio chime, and the undo toast notification.
6. **Focus Room Sprint (15 sec):** Switch to the Focus Room, start the 25-minute timer, show the animated SVG progress ring and browser title countdown.
7. **Dark Mode & Responsive Drawer (10 sec):** Toggle dark mode to show the deep indigo night palette, and shrink the window to show the mobile navigation drawer.

---

## ✦ Privacy & Security
StudySprint does not track users, set cookies, or communicate with remote servers. All task records, student preferences, and focus statistics reside securely inside the browser's sandboxed `localStorage`.

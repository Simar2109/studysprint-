# StudySprint — Design Rationale & UX Architecture

## 1. Product Vision & Problem Statement
Students frequently face cognitive fatigue caused by fragmented study tools, overwhelming multi-level project management systems, and distraction-heavy interfaces. **StudySprint** was created to counter academic burnout through low-friction, high-clarity intentional planning.

Rather than forcing users through complex Gantt charts or multi-layered kanban boards, StudySprint adheres to the psychological principle of **"Single-Tasking & Incremental Momentum"**:
1. **Capture priorities instantly** with clear priority tags and due dates.
2. **Eliminate visual noise** through a structured, balanced dashboard with accessible typography.
3. **Trigger deep cognitive work** with an integrated Pomodoro Focus Room.
4. **Reward progress with delightful, positive reinforcement** (confetti bursts, dual-tone chimes, and undo-capable toasts).

---

## 2. Design System & Visual Language

### 2.1 Color Palette & Emotional Resonance
- **Primary Indigo / Purple Accent (`#7058e6` / `#9583ff`)**: Symbolizes focus, wisdom, and cognitive calm. Unlike aggressive reds or cold corporate blues, soft purple instills confidence without anxiety.
- **Subtle Lavender Surfaces (`#f8f7fc` light / `#0e0d18` dark)**: Minimizes glare during extended screen sessions.
- **Functional Pastel System**:
  - **Rose / Coral (`#fff1f2` / `#be123c`)**: High priority & overdue indicators that draw urgency without alarmism.
  - **Amber / Warm Sun (`#fffbeb` / `#b45309`)**: "Due Today" tasks requiring active attention.
  - **Mint / Emerald (`#eafaf1` / `#1d7c4d`)**: Completed wins, daily progress, and momentum feedback.
  - **Sky Blue (`#eff6ff` / `#2563eb`)**: Focus sprint sessions and "Due Tomorrow" indicators.

### 2.2 Typography Hierarchy
- **Manrope**: Geometric, modern heading font for brand identity, key numeric statistics, and card headlines. Provides punchy, energetic legibility.
- **Plus Jakarta Sans**: Highly legible neo-grotesque sans-serif for UI labels, task names, descriptions, and interactive controls.
- Carefully calibrated font scaling prevents the cramped "tiny text" look common in early drafts, maintaining readability from desktop (1440px+) down to handheld devices (360px).

### 2.3 Glassmorphism, Micro-Borders, & Elevation
- Multi-tier box shadows provide depth while maintaining a flat, clean aesthetic.
- Subtle `1px` translucent borders create crisp card boundaries in both light and dark modes.
- Hover states employ subtle lift physics (`translateY(-2px)`) to signal interactivity.

---

## 3. Core Interaction & Behavioral UX

### 3.1 Real-Time Search & Status Filtering
Students can search their task backlog instantly (`Ctrl+/` or `/` shortcut) or toggle between **All**, **In progress**, and **Completed** filters. Contextual empty states adapt to the current state (e.g., search results vs. all caught up), ensuring the interface is never blank or confusing.

### 3.2 Task Due Dates & Urgency Cues
Tasks support structured due dates with quick "Today" and "Tomorrow" shortcuts. Smart badge logic automatically highlights:
- **📅 Today** in warm amber
- **📅 Tomorrow** in calm blue
- **⚠️ Overdue** in high-contrast rose
- **📅 Formatted dates** for upcoming milestones

### 3.3 Micro-Delight & Positive Reinforcement
Academic work can feel like an endless treadmill. StudySprint celebrates micro-wins:
- **Confetti Physics**: A lightweight, zero-dependency canvas particle burst triggers when a task is completed.
- **Audio Chimes**: Subtle, synthetic dual-tone sine-wave chimes via the Web Audio API (with an instant mute toggle).
- **Undoable Toasts**: Erroneous clicks can be instantly reverted via the floating toast action.

### 3.4 25-Minute Focus Room (Pomodoro Method)
The focus timer sits directly beside the task list:
- Animated SVG progress ring smoothly illustrates elapsed time.
- Browser title updates dynamically (`(24:15) StudySprint`) so students keeping the dashboard in a background tab can monitor time remaining.
- Tracks daily completed sprints and logged minutes in real time.

---

## 4. Accessibility & Inclusive Design (WCAG 2.1 AA)
- **High Contrast**: Meets WCAG 2.1 AA contrast requirements for both light and dark themes.
- **Full Keyboard Navigation**: Every interactive element is reachable and actionable with full `:focus-visible` styling.
- **Screen Reader Support**: Semantic landmarks (`<aside>`, `<main>`, `<header>`, `<article>`), ARIA labels on all icon buttons, live status regions (`aria-live="polite"`), and progress bars (`role="progressbar"`).

---

## 5. Privacy & Zero-Dependency Reliability
- **100% Client-Side**: Operates entirely in the browser using `localStorage`. No external trackers, cookies, or remote server dependencies.
- **Zero Framework Bloat**: Built purely with semantic HTML5, modern CSS3, and vanilla JavaScript for blazing fast load times under 100ms.

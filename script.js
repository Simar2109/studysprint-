/**
 * StudySprint — Student Productivity Dashboard
 * Features: Tasks with Due Dates, Real-time Search, Pomodoro Timer,
 * LocalStorage Persistence, Audio Chimes, Confetti, Themes, & Stats.
 */

// --- Utility Selector ---
const $ = (id) => document.getElementById(id);

// --- LocalStorage Keys ---
const STORAGE_KEYS = {
  TASKS: "studysprint_tasks_v1",
  DARK_MODE: "studysprint_dark",
  STUDENT_NAME: "studysprint_student_name",
  FOCUS_STATS: "studysprint_focus_stats_v1",
  SOUND_ENABLED: "studysprint_sound_enabled"
};

// --- Helper Date Formatting Functions ---
function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getFormattedDateOffset(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDueDateBadge(dateString, isDone) {
  if (!dateString) return null;

  const todayStr = getTodayDateString();
  const tomorrowStr = getFormattedDateOffset(1);

  if (dateString === todayStr) {
    return { text: "📅 Today", className: "due-today" };
  } else if (dateString === tomorrowStr) {
    return { text: "📅 Tomorrow", className: "due-tomorrow" };
  } else if (dateString < todayStr && !isDone) {
    return { text: "⚠️ Overdue", className: "overdue" };
  } else {
    try {
      const parts = dateString.split("-");
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        const formatted = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(d);
        return { text: `📅 ${formatted}`, className: "due-future" };
      }
    } catch (e) {}
    return { text: `📅 ${dateString}`, className: "due-future" };
  }
}

// --- Initial Starter Data ---
const STARTER_TASKS = [
  {
    id: 1,
    name: "Review today’s lecture slides & key terms",
    priority: "Normal",
    dueDate: getFormattedDateOffset(0),
    done: false,
    createdAt: Date.now() - 3600000
  },
  {
    id: 2,
    name: "Finish assignment draft & citation checks",
    priority: "High",
    dueDate: getFormattedDateOffset(1),
    done: false,
    createdAt: Date.now() - 7200000
  },
  {
    id: 3,
    name: "Take a proper 15-minute screen break",
    priority: "Low",
    dueDate: getFormattedDateOffset(0),
    done: true,
    createdAt: Date.now() - 10800000
  }
];

// --- Curated Motivational Quotes & Tips ---
const MOTIVATIONAL_QUOTES = [
  { text: "Small steps repeated every single day lead to remarkable changes.", author: "James Clear" },
  { text: "You don't have to be extreme, just consistent.", author: "Productivity Principle" },
  { text: "Focus is a muscle. The more you protect your attention, the stronger it gets.", author: "Cal Newport" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Action creates clarity. Don't wait for motivation to strike.", author: "StudySprint Mindset" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" }
];

const STUDY_TIPS = [
  { title: "A little progress adds up.", body: "Choose one small task and begin. Momentum builds naturally once you take action." },
  { title: "The 2-Minute Rule", body: "If a task takes less than 2 minutes to complete, tackle it right away to free up mental clarity." },
  { title: "Single-Tasking Power", body: "Multitasking splits your cognitive bandwidth. Dedicate 25 minutes to one priority at a time." },
  { title: "Active Recall", body: "Testing yourself on concepts yields 50% better long-term retention than passive re-reading." },
  { title: "Hydrate & Recharge", body: "A short 5-minute break away from screens resets your focus for the next sprint." }
];

// --- Application State ---
let tasks = [];
try {
  const loaded = localStorage.getItem(STORAGE_KEYS.TASKS);
  tasks = loaded ? JSON.parse(loaded) : STARTER_TASKS;
} catch (e) {
  tasks = STARTER_TASKS;
}

let currentFilter = "all";
let searchQuery = "";
let studentName = localStorage.getItem(STORAGE_KEYS.STUDENT_NAME) || "Alex";
let soundEnabled = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED) !== "false";

// Focus Timer State
let timerTotalSeconds = 25 * 60;
let timerSeconds = 25 * 60;
let timerInterval = null;
let isTimerRunning = false;
let currentTimerMode = "pomodoro"; // 'pomodoro' | 'shortBreak' | 'longBreak'

// Productivity Focus Stats State
let focusStats = {
  date: getTodayDateString(),
  sessionsToday: 0,
  minutesToday: 0
};

try {
  const loadedStats = JSON.parse(localStorage.getItem(STORAGE_KEYS.FOCUS_STATS) || "{}");
  if (loadedStats.date === getTodayDateString()) {
    focusStats = loadedStats;
  }
} catch (e) {
  // fallback to defaults
}

// Quote & Tip Indices
let currentQuoteIndex = 0;
let currentTipIndex = 0;

// --- Persistence Helpers ---
function saveTasks() {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

function saveFocusStats() {
  localStorage.setItem(STORAGE_KEYS.FOCUS_STATS, JSON.stringify(focusStats));
}

// --- Web Audio API Synthetic Chimes ---
function playChime(type = "success") {
  if (!soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === "success") {
      // Pleasant dual-tone chime
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      osc2.frequency.setValueAtTime(880, now + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.12);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } else if (type === "complete") {
      // Triumph chord for timer complete
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime + idx * 0.08;
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.75);
      });
    }
  } catch (err) {
    // AudioContext blocked or not supported
  }
}

// --- Pure Vanilla JS Lightweight Confetti Burst ---
function triggerConfetti() {
  const canvas = $("confettiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ["#7058e6", "#9987f6", "#fcd0ba", "#6ee7b7", "#93c5fd", "#fda4af"];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 300,
      y: window.innerHeight * 0.4 + (Math.random() - 0.5) * 150,
      w: Math.random() * 8 + 5,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * -6 - 3,
      gravity: 0.22,
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let animationFrame;
  function renderFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeParticles = 0;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vRotation;
      p.opacity -= 0.015;

      if (p.opacity > 0) {
        activeParticles++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    });

    if (activeParticles > 0) {
      animationFrame = requestAnimationFrame(renderFrame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  renderFrame();
}

// --- Toast Feedback Notification System ---
function showToast(message, options = {}) {
  const container = $("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "alert");

  const icon = document.createElement("span");
  icon.className = "toast-icon";
  icon.textContent = options.icon || "✨";

  const msgSpan = document.createElement("span");
  msgSpan.className = "toast-message";
  msgSpan.textContent = message;

  toast.append(icon, msgSpan);

  if (options.undoCallback) {
    const undoBtn = document.createElement("button");
    undoBtn.className = "toast-undo-btn";
    undoBtn.textContent = "Undo";
    undoBtn.addEventListener("click", () => {
      options.undoCallback();
      removeToast(toast);
    });
    toast.appendChild(undoBtn);
  }

  container.appendChild(toast);

  const timeoutId = setTimeout(() => {
    removeToast(toast);
  }, options.duration || 4000);

  function removeToast(elem) {
    clearTimeout(timeoutId);
    elem.classList.add("hiding");
    elem.addEventListener("transitionend", () => {
      if (elem.parentNode) elem.parentNode.removeChild(elem);
    });
  }
}

// --- Dynamic Greeting System ---
function updateGreeting() {
  const hour = new Date().getHours();
  let greetingTime = "Good morning";
  let timePill = "MORNING FOCUS";

  if (hour >= 12 && hour < 17) {
    greetingTime = "Good afternoon";
    timePill = "AFTERNOON PRODUCTIVITY";
  } else if (hour >= 17 && hour < 22) {
    greetingTime = "Good evening";
    timePill = "EVENING WRAP-UP";
  } else if (hour >= 22 || hour < 5) {
    greetingTime = "Late-night sprint";
    timePill = "NIGHT OWL FOCUS";
  }

  const dynamicGreeting = $("dynamicGreeting");
  if (dynamicGreeting) {
    dynamicGreeting.textContent = `${greetingTime},`;
  }

  const welcomeHeading = $("welcomeHeading");
  if (welcomeHeading) {
    welcomeHeading.innerHTML = `<span>${greetingTime},</span> <span class="highlight">${escapeHtml(studentName)} ✦</span>`;
  }

  const greetingTimePill = $("greetingTimePill");
  if (greetingTimePill) {
    greetingTimePill.textContent = timePill;
  }

  // Update profile card in sidebar
  const studentNameDisplay = $("studentNameDisplay");
  if (studentNameDisplay) {
    studentNameDisplay.textContent = studentName;
  }
  const avatarLetter = $("avatarLetter");
  if (avatarLetter) {
    avatarLetter.textContent = (studentName.charAt(0) || "S").toUpperCase();
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// --- Render Tasks & Statistics ---
function render() {
  const query = searchQuery.trim().toLowerCase();

  // 1. Filter logic
  const filteredByStatus = tasks.filter(task => {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "done") return task.done;
    return true; // 'all'
  });

  const visibleTasks = filteredByStatus.filter(task => {
    if (!query) return true;
    return task.name.toLowerCase().includes(query);
  });

  // 2. Render task items
  const taskListEl = $("taskList");
  taskListEl.innerHTML = "";

  visibleTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task-item ${task.done ? "completed" : ""}`;
    li.dataset.taskId = task.id;

    // Checkbox wrapper
    const checkWrap = document.createElement("div");
    checkWrap.className = "task-check-wrap";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "task-check";
    check.checked = task.done;
    check.setAttribute("aria-label", `Mark task "${task.name}" as ${task.done ? "incomplete" : "complete"}`);

    check.addEventListener("change", () => {
      task.done = check.checked;
      saveTasks();
      render();

      if (task.done) {
        playChime("success");
        triggerConfetti();
        showToast(`Sprint win! "${task.name.slice(0, 30)}${task.name.length > 30 ? "…" : ""}" completed.`, {
          icon: "🎉",
          undoCallback: () => {
            task.done = false;
            saveTasks();
            render();
          }
        });
      }
    });
    checkWrap.appendChild(check);

    // Task content wrapper
    const content = document.createElement("div");
    content.className = "task-content";

    const name = document.createElement("span");
    name.className = "task-name";
    name.textContent = task.name;

    const metaRow = document.createElement("div");
    metaRow.className = "task-meta-row";

    // Priority badge
    const priority = document.createElement("span");
    priority.className = `priority ${task.priority}`;
    priority.textContent = task.priority;
    metaRow.appendChild(priority);

    // Due date badge (if present)
    const dueInfo = formatDueDateBadge(task.dueDate, task.done);
    if (dueInfo) {
      const dueBadge = document.createElement("span");
      dueBadge.className = `due-badge ${dueInfo.className}`;
      dueBadge.textContent = dueInfo.text;
      metaRow.appendChild(dueBadge);
    }

    content.append(name, metaRow);

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.className = "delete-task";
    delBtn.setAttribute("aria-label", `Delete task "${task.name}"`);
    delBtn.innerHTML = "&times;";
    delBtn.addEventListener("click", () => {
      const deletedTask = task;
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      render();
      showToast("Task deleted.", {
        icon: "🗑️",
        undoCallback: () => {
          tasks.unshift(deletedTask);
          saveTasks();
          render();
        }
      });
    });

    li.append(checkWrap, content, delBtn);
    taskListEl.appendChild(li);
  });

  // 3. Contextual Empty State Handling
  const emptyStateEl = $("emptyState");
  const emptyIconEl = $("emptyIcon");
  const emptyTitleEl = $("emptyTitle");
  const emptyDescEl = $("emptyDescription");
  const emptyActionBtn = $("emptyActionBtn");

  if (visibleTasks.length === 0) {
    emptyStateEl.style.display = "block";

    if (query) {
      emptyIconEl.textContent = "🔍";
      emptyTitleEl.textContent = "No tasks match your search";
      emptyDescEl.textContent = `No task names contain "${query}". Try searching another keyword.`;
      emptyActionBtn.style.display = "inline-block";
      emptyActionBtn.textContent = "Clear search";
      emptyActionBtn.onclick = () => {
        searchQuery = "";
        $("taskSearchInput").value = "";
        $("searchClearBtn").style.display = "none";
        render();
      };
    } else if (currentFilter === "active") {
      emptyIconEl.textContent = "✓";
      emptyTitleEl.textContent = "All caught up!";
      emptyDescEl.textContent = "You’ve completed all pending tasks. Enjoy your break or create a new goal.";
      emptyActionBtn.style.display = "none";
    } else if (currentFilter === "done") {
      emptyIconEl.textContent = "◎";
      emptyTitleEl.textContent = "No completed tasks yet";
      emptyDescEl.textContent = "Complete a task from your list to celebrate your first win here.";
      emptyActionBtn.style.display = "none";
    } else {
      emptyIconEl.textContent = "✧";
      emptyTitleEl.textContent = "Your list is clear.";
      emptyDescEl.textContent = "Add a task above and take your first step toward today’s goals.";
      emptyActionBtn.style.display = "none";
    }
  } else {
    emptyStateEl.style.display = "none";
  }

  // 4. Update Productivity Statistics & Counts
  const totalCount = tasks.length;
  const doneCount = tasks.filter(t => t.done).length;
  const remainingCount = totalCount - doneCount;
  const highPriorityPending = tasks.filter(t => !t.done && t.priority === "High").length;
  const percent = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  // Stat Cards
  $("completedCount").textContent = doneCount;
  $("remainingCount").textContent = remainingCount;
  $("progressPercent").textContent = `${percent}%`;
  $("progressBar").style.width = `${percent}%`;

  const progressBarContainer = $("progressBarContainer");
  if (progressBarContainer) {
    progressBarContainer.setAttribute("aria-valuenow", percent);
  }

  const completionRateBadge = $("completionRateBadge");
  if (completionRateBadge) {
    completionRateBadge.textContent = `${percent}% done`;
  }

  const highPriorityChip = $("highPriorityPendingChip");
  if (highPriorityChip) {
    highPriorityChip.textContent = `${highPriorityPending} high priority`;
    highPriorityChip.style.display = highPriorityPending > 0 ? "inline-block" : "none";
  }

  // Progress caption message
  const progressCaptionEl = $("progressCaption");
  if (progressCaptionEl) {
    if (percent === 100 && totalCount > 0) {
      progressCaptionEl.textContent = "All goals crushed! Outstanding job.";
    } else if (percent >= 75) {
      progressCaptionEl.textContent = "Almost there — finish strong!";
    } else if (percent >= 40) {
      progressCaptionEl.textContent = "Steady progress — keep the pace";
    } else if (doneCount > 0) {
      progressCaptionEl.textContent = "Great start — momentum is building";
    } else {
      progressCaptionEl.textContent = "Let’s get started";
    }
  }

  // Filter Counts
  const countAll = $("countAll");
  const countActive = $("countActive");
  const countDone = $("countDone");
  if (countAll) countAll.textContent = totalCount;
  if (countActive) countActive.textContent = remainingCount;
  if (countDone) countDone.textContent = doneCount;

  // Task Total in filter row
  $("taskTotal").textContent = query
    ? `${visibleTasks.length} of ${totalCount} task${totalCount === 1 ? "" : "s"}`
    : `${totalCount} task${totalCount === 1 ? "" : "s"}`;

  // Nav badges
  const navBadge = $("navPendingBadge");
  if (navBadge) navBadge.textContent = remainingCount;

  // Hero Snippets
  const heroDoneSnippet = $("heroTasksDoneSnippet");
  if (heroDoneSnippet) heroDoneSnippet.textContent = `${doneCount} Done`;

  // Focus Stats Display
  const focusTimeCount = $("focusTimeCount");
  if (focusTimeCount) focusTimeCount.textContent = `${focusStats.minutesToday}m`;

  const focusSessionBadge = $("focusSessionBadge");
  if (focusSessionBadge) focusSessionBadge.textContent = `${focusStats.sessionsToday} session${focusStats.sessionsToday === 1 ? "" : "s"}`;

  const panelSprintsCount = $("panelSprintsCount");
  if (panelSprintsCount) panelSprintsCount.textContent = focusStats.sessionsToday;

  const panelFocusMinutes = $("panelFocusMinutes");
  if (panelFocusMinutes) panelFocusMinutes.textContent = `${focusStats.minutesToday} mins`;
}

// --- Event Listeners: Add Task Form ---
$("taskForm").addEventListener("submit", e => {
  e.preventDefault();
  const input = $("taskInput");
  const name = input.value.trim();
  if (!name) return;

  const priorityVal = $("priorityInput").value;
  const dueDateVal = $("dueDateInput").value || null;

  const newTask = {
    id: Date.now(),
    name,
    priority: priorityVal,
    dueDate: dueDateVal,
    done: false,
    createdAt: Date.now()
  };

  tasks.unshift(newTask);
  input.value = "";
  $("dueDateInput").value = "";
  saveTasks();

  // Reset to 'all' filter and clear search so new task is immediately visible
  currentFilter = "all";
  searchQuery = "";
  $("taskSearchInput").value = "";
  $("searchClearBtn").style.display = "none";
  document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b.dataset.filter === "all"));

  render();
  input.focus();
  showToast("Task added to your sprint!", { icon: "✦" });
});

// Quick Due Date buttons ("Today" & "Tomorrow")
const setTodayBtn = $("setTodayBtn");
if (setTodayBtn) {
  setTodayBtn.addEventListener("click", () => {
    $("dueDateInput").value = getTodayDateString();
  });
}

const setTomorrowBtn = $("setTomorrowBtn");
if (setTomorrowBtn) {
  setTomorrowBtn.addEventListener("click", () => {
    $("dueDateInput").value = getFormattedDateOffset(1);
  });
}

// --- Event Listeners: Search & Filters ---
const taskSearchInput = $("taskSearchInput");
const searchClearBtn = $("searchClearBtn");

if (taskSearchInput) {
  taskSearchInput.addEventListener("input", e => {
    searchQuery = e.target.value;
    searchClearBtn.style.display = searchQuery ? "block" : "none";
    render();
  });
}

if (searchClearBtn) {
  searchClearBtn.addEventListener("click", () => {
    searchQuery = "";
    taskSearchInput.value = "";
    searchClearBtn.style.display = "none";
    render();
    taskSearchInput.focus();
  });
}

// Keyboard shortcut: Pressing '/' focuses search input
document.addEventListener("keydown", e => {
  if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
    e.preventDefault();
    if (taskSearchInput) taskSearchInput.focus();
  }
});

// Status filter buttons
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b === btn));
    render();
  });
});

// Clear Completed button
$("clearDone").addEventListener("click", () => {
  const completedCount = tasks.filter(t => t.done).length;
  if (!completedCount) {
    showToast("No completed tasks to clear.", { icon: "ℹ️" });
    return;
  }

  const prevTasks = [...tasks];
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  render();

  showToast(`Cleared ${completedCount} completed task${completedCount === 1 ? "" : "s"}.`, {
    icon: "✓",
    undoCallback: () => {
      tasks = prevTasks;
      saveTasks();
      render();
    }
  });
});

// --- Theme Toggle (Light / Dark) ---
const themeToggle = $("themeToggle");
const themeIcon = $("themeIcon");

function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  if (themeIcon) themeIcon.textContent = isDark ? "☼" : "◐";
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDark ? "1" : "0");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark");
    applyTheme(isDark);
    showToast(`Switched to ${isDark ? "Dark" : "Light"} theme.`, { icon: isDark ? "🌙" : "☀️" });
  });
}

// Initial theme setup
if (localStorage.getItem(STORAGE_KEYS.DARK_MODE) === "1") {
  applyTheme(true);
} else {
  applyTheme(false);
}

// --- Sound Feedback Toggle ---
const soundToggle = $("soundToggle");
const soundIcon = $("soundIcon");

function applySoundSetting(enabled) {
  soundEnabled = enabled;
  if (soundIcon) soundIcon.textContent = enabled ? "🔔" : "🔕";
  localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, enabled ? "true" : "false");
}

if (soundToggle) {
  applySoundSetting(soundEnabled);
  soundToggle.addEventListener("click", () => {
    applySoundSetting(!soundEnabled);
    showToast(`Audio feedback ${soundEnabled ? "enabled" : "muted"}.`, { icon: soundEnabled ? "🔔" : "🔕" });
  });
}

// Current date label in header
$("todayLabel").textContent = new Intl.DateTimeFormat("en", {
  weekday: "short",
  month: "short",
  day: "numeric"
}).format(new Date());

// --- Pomodoro Focus Timer ---
function updateTimerDisplay() {
  const mins = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;
  const timeString = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  $("timerDisplay").textContent = timeString;

  // Title bar update for tabbed-out multitasking students
  if (isTimerRunning) {
    document.title = `(${timeString}) StudySprint`;
  } else {
    document.title = "StudySprint — Make progress, one sprint at a time";
  }

  // Update SVG Progress Ring (drains smoothly as time runs down)
  const svgCircle = $("timerSvgProgress");
  if (svgCircle) {
    const circumference = 2 * Math.PI * 70; // radius = 70 => ~439.82
    const progress = timerTotalSeconds > 0 ? timerSeconds / timerTotalSeconds : 0;
    const offset = circumference * (1 - progress);
    svgCircle.style.strokeDashoffset = offset;
  }

  // Hero snippet
  const heroTimerSnippet = $("heroTimerSnippet");
  if (heroTimerSnippet) {
    heroTimerSnippet.textContent = `${timeString} sprint`;
  }
}

function setTimerMode(mode, minutes, label) {
  if (isTimerRunning) {
    clearInterval(timerInterval);
    isTimerRunning = false;
  }
  currentTimerMode = mode;
  timerTotalSeconds = minutes * 60;
  timerSeconds = timerTotalSeconds;

  const modeLabel = $("timerModeLabel");
  if (modeLabel) modeLabel.textContent = label;

  $("timerStart").textContent = "Start focus";
  $("timerStatus").textContent = `A fresh ${minutes}-minute session is ready.`;

  document.querySelectorAll(".mode-chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.minutes == minutes);
  });

  updateTimerDisplay();
}

// Mode chip clicks
const modePomodoro = $("modePomodoro");
const modeShortBreak = $("modeShortBreak");
const modeLongBreak = $("modeLongBreak");

if (modePomodoro) modePomodoro.addEventListener("click", () => setTimerMode("pomodoro", 25, "FOCUS SPRINT"));
if (modeShortBreak) modeShortBreak.addEventListener("click", () => setTimerMode("shortBreak", 5, "SHORT BREAK"));
if (modeLongBreak) modeLongBreak.addEventListener("click", () => setTimerMode("longBreak", 15, "LONG REST"));

// Start / Pause Timer
$("timerStart").addEventListener("click", () => {
  if (isTimerRunning) {
    clearInterval(timerInterval);
    isTimerRunning = false;
    $("timerStart").textContent = "Resume focus";
    $("timerStatus").textContent = "Paused. Catch your breath and resume when ready.";
    return;
  }

  if (timerSeconds === 0) {
    timerSeconds = timerTotalSeconds;
  }

  isTimerRunning = true;
  $("timerStart").textContent = "Pause";
  $("timerStatus").textContent = "You’re in a focus session. Keep distractions away.";

  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();

    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      $("timerStart").textContent = "Start again";
      $("timerStatus").textContent = "Session complete — brilliant focus!";

      // Log stats if it was a Pomodoro focus sprint
      if (currentTimerMode === "pomodoro") {
        focusStats.sessionsToday++;
        focusStats.minutesToday += 25;
        saveFocusStats();
        render();
      }

      playChime("complete");
      triggerConfetti();
      showToast("🎉 Focus sprint complete! Time to take a well-deserved break.", { duration: 6000 });
      document.title = "✦ Focus Sprint Finished! — StudySprint";
    }
  }, 1000);
});

// Reset Timer
$("timerReset").addEventListener("click", () => {
  clearInterval(timerInterval);
  isTimerRunning = false;
  timerSeconds = timerTotalSeconds;
  updateTimerDisplay();
  $("timerStart").textContent = "Start focus";
  $("timerStatus").textContent = `A fresh ${Math.round(timerTotalSeconds / 60)}-minute session is ready.`;
});

// --- Rotating Quotes & Tips ---
function displayQuote(index) {
  const quote = MOTIVATIONAL_QUOTES[index];
  const quoteText = $("quoteText");
  const quoteAuthor = $("quoteAuthor");
  if (quoteText && quote) quoteText.textContent = quote.text;
  if (quoteAuthor && quote) quoteAuthor.textContent = `— ${quote.author}`;
}

function displayTip(index) {
  const tip = STUDY_TIPS[index];
  const tipTitle = $("tipTitle");
  const tipBody = $("tipBody");
  if (tipTitle && tip) tipTitle.textContent = tip.title;
  if (tipBody && tip) tipBody.textContent = tip.body;
}

const refreshQuoteBtn = $("refreshQuoteBtn");
if (refreshQuoteBtn) {
  refreshQuoteBtn.addEventListener("click", () => {
    currentQuoteIndex = (currentQuoteIndex + 1) % MOTIVATIONAL_QUOTES.length;
    displayQuote(currentQuoteIndex);
  });
}

const newTipBtn = $("newTipBtn");
if (newTipBtn) {
  newTipBtn.addEventListener("click", () => {
    currentTipIndex = (currentTipIndex + 1) % STUDY_TIPS.length;
    displayTip(currentTipIndex);
  });
}

// --- Student Profile & Name Modal ---
const profileCard = $("profileCard");
const nameModalBackdrop = $("nameModalBackdrop");
const cancelNameBtn = $("cancelNameBtn");
const nameForm = $("nameForm");
const nameInput = $("nameInput");

if (profileCard && nameModalBackdrop) {
  function openNameModal() {
    nameInput.value = studentName;
    nameModalBackdrop.style.display = "grid";
    nameModalBackdrop.setAttribute("aria-hidden", "false");
    nameInput.focus();
  }

  function closeNameModal() {
    nameModalBackdrop.style.display = "none";
    nameModalBackdrop.setAttribute("aria-hidden", "true");
  }

  profileCard.addEventListener("click", openNameModal);

  profileCard.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openNameModal();
    }
  });

  cancelNameBtn.addEventListener("click", closeNameModal);

  nameModalBackdrop.addEventListener("click", e => {
    if (e.target === nameModalBackdrop) {
      closeNameModal();
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && nameModalBackdrop.style.display !== "none") {
      closeNameModal();
    }
  });

  nameForm.addEventListener("submit", e => {
    e.preventDefault();
    const newName = nameInput.value.trim();
    if (newName) {
      studentName = newName;
      localStorage.setItem(STORAGE_KEYS.STUDENT_NAME, studentName);
      updateGreeting();
      showToast(`Welcome, ${studentName}!`, { icon: "👋" });
    }
    closeNameModal();
  });
}

// --- Mobile Navigation Drawer ---
const menuToggleBtn = $("menuToggleBtn");
const sidebar = $("sidebar");
const sidebarCloseBtn = $("sidebarCloseBtn");
const sidebarBackdrop = $("sidebarBackdrop");

function openSidebar() {
  if (sidebar) sidebar.classList.add("open");
  if (sidebarBackdrop) sidebarBackdrop.classList.add("active");
}

function closeSidebar() {
  if (sidebar) sidebar.classList.remove("open");
  if (sidebarBackdrop) sidebarBackdrop.classList.remove("active");
}

if (menuToggleBtn) menuToggleBtn.addEventListener("click", openSidebar);
if (sidebarCloseBtn) sidebarCloseBtn.addEventListener("click", closeSidebar);
if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", closeSidebar);

// --- Sidebar Navigation & Section Scrolling ---
const navLinks = document.querySelectorAll(".nav-link");

function setActiveNav(targetHref) {
  navLinks.forEach(link => {
    const isTarget = link.getAttribute("href") === targetHref;
    link.classList.toggle("active", isTarget);
    if (isTarget) {
      const label = link.querySelector(".nav-label");
      if (label && $("activeBreadcrumb")) {
        $("activeBreadcrumb").textContent = label.textContent;
      }
    }
  });
}

function navigateToSection(targetHref) {
  closeSidebar();
  setActiveNav(targetHref);

  if (targetHref === "#overview") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (history.replaceState) history.replaceState(null, "", "#overview");
  } else {
    const targetElement = document.querySelector(targetHref);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      if (history.replaceState) history.replaceState(null, "", targetHref);
    }
  }
}

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    const targetHref = link.getAttribute("href");
    if (targetHref && targetHref.startsWith("#")) {
      e.preventDefault();
      navigateToSection(targetHref);
    }
  });
});

// Brand Logo link to Overview
const brandLink = document.querySelector(".brand");
if (brandLink) {
  brandLink.addEventListener("click", (e) => {
    e.preventDefault();
    navigateToSection("#overview");
  });
}

// Quick action buttons in hero
const heroTaskBtn = document.querySelector('.welcome-quick-actions a[href="#tasks"]');
if (heroTaskBtn) {
  heroTaskBtn.addEventListener("click", (e) => {
    e.preventDefault();
    navigateToSection("#tasks");
    setTimeout(() => {
      const input = $("taskInput");
      if (input) input.focus();
    }, 300);
  });
}

const heroFocusBtn = document.querySelector('.welcome-quick-actions a[href="#focus"]');
if (heroFocusBtn) {
  heroFocusBtn.addEventListener("click", (e) => {
    e.preventDefault();
    navigateToSection("#focus");
  });
}

// Scrollspy: update active nav link as student scrolls through dashboard
window.addEventListener("scroll", () => {
  const scrollPos = window.scrollY;
  const tasksElem = $("tasks");
  const focusElem = $("focus");
  const insightsElem = $("insights");

  if (scrollPos < 180) {
    setActiveNav("#overview");
  } else if (focusElem && scrollPos >= focusElem.offsetTop - 140) {
    setActiveNav("#focus");
  } else if (tasksElem && scrollPos >= tasksElem.offsetTop - 140) {
    setActiveNav("#tasks");
  } else if (insightsElem && scrollPos >= insightsElem.offsetTop - 140) {
    setActiveNav("#insights");
  }
}, { passive: true });

// --- Initial Startup Execution ---
const dueDateInput = $("dueDateInput");
if (dueDateInput) {
  dueDateInput.min = getTodayDateString();
}

updateGreeting();
displayQuote(0);
displayTip(0);
render();
updateTimerDisplay();

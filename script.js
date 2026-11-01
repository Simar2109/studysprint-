const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "studysprint_tasks_v1";
let tasks = [];
try { tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { tasks = []; }
let currentFilter = "all";
let timerSeconds = 25 * 60;
let timerInterval = null;
let running = false;

const starterTasks = [
  {id: 1, name: "Review today’s class notes", priority: "Normal", done: false},
  {id: 2, name: "Finish one pending assignment", priority: "High", done: false},
  {id: 3, name: "Take a proper screen break", priority: "Low", done: true}
];
if (!tasks.length) tasks = starterTasks;
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
function render(){
  const visible = tasks.filter(t => currentFilter === "all" || (currentFilter === "active" && !t.done) || (currentFilter === "done" && t.done));
  $("taskList").innerHTML = "";
  visible.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.done ? " completed" : "");
    const check = document.createElement("input"); check.type = "checkbox"; check.className = "task-check"; check.checked = task.done; check.setAttribute("aria-label", "Mark task complete");
    check.addEventListener("change", () => { task.done = check.checked; save(); render(); });
    const name = document.createElement("span"); name.className = "task-name"; name.textContent = task.name;
    const priority = document.createElement("span"); priority.className = "priority " + task.priority; priority.textContent = task.priority;
    const del = document.createElement("button"); del.className = "delete-task"; del.textContent = "×"; del.setAttribute("aria-label", "Delete task"); del.addEventListener("click", () => { tasks = tasks.filter(t => t.id !== task.id); save(); render(); });
    li.append(check, name, priority, del); $("taskList").append(li);
  });
  $("emptyState").style.display = visible.length ? "none" : "block";
  const done = tasks.filter(t => t.done).length, remaining = tasks.length - done;
  const percent = tasks.length ? Math.round(done / tasks.length * 100) : 0;
  $("completedCount").textContent = done; $("remainingCount").textContent = remaining;
  $("progressPercent").textContent = percent + "%"; $("progressBar").style.width = percent + "%";
  $("progressCaption").textContent = percent === 100 ? "Everything checked off!" : percent ? "Nice work — keep going" : "Let’s get started";
  $("taskTotal").textContent = tasks.length + (tasks.length === 1 ? " task" : " tasks");
}
$("taskForm").addEventListener("submit", e => {
  e.preventDefault(); const input = $("taskInput"), name = input.value.trim(); if (!name) return;
  tasks.unshift({id: Date.now(), name, priority: $("priorityInput").value, done: false}); input.value = ""; save(); currentFilter = "all";
  document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b.dataset.filter === "all")); render(); input.focus();
});
document.querySelectorAll(".filter").forEach(btn => btn.addEventListener("click", () => {
  currentFilter = btn.dataset.filter; document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b === btn)); render();
}));
$("clearDone").addEventListener("click", () => { tasks = tasks.filter(t => !t.done); save(); render(); });
$("themeToggle").addEventListener("click", () => { document.body.classList.toggle("dark"); localStorage.setItem("studysprint_dark", document.body.classList.contains("dark") ? "1" : "0"); });
if (localStorage.getItem("studysprint_dark") === "1") document.body.classList.add("dark");
$("todayLabel").textContent = new Intl.DateTimeFormat("en", {weekday:"short", month:"short", day:"numeric"}).format(new Date());

function updateTimer(){
  const mins = Math.floor(timerSeconds / 60), secs = timerSeconds % 60;
  $("timerDisplay").textContent = String(mins).padStart(2,"0") + ":" + String(secs).padStart(2,"0");
  const progress = (25 * 60 - timerSeconds) / (25 * 60);
  document.querySelector(".timer-ring").style.background = `conic-gradient(var(--purple) ${progress * 360}deg, #dcd7f4 0deg)`;
}
$("timerStart").addEventListener("click", () => {
  if (running) { clearInterval(timerInterval); running = false; $("timerStart").textContent = "Resume focus"; $("timerStatus").textContent = "Paused. Take your time."; return; }
  if (timerSeconds === 0) timerSeconds = 25 * 60;
  running = true; $("timerStart").textContent = "Pause";
  $("timerStatus").textContent = "You’re in a focus session. Keep it simple.";
  timerInterval = setInterval(() => {
    timerSeconds--; updateTimer();
    if (timerSeconds <= 0) { clearInterval(timerInterval); running = false; $("timerStart").textContent = "Start again"; $("timerStatus").textContent = "Session complete — well done!"; }
  }, 1000);
});
$("timerReset").addEventListener("click", () => {
  clearInterval(timerInterval); running = false; timerSeconds = 25 * 60; updateTimer();
  $("timerStart").textContent = "Start focus"; $("timerStatus").textContent = "A fresh 25-minute session is ready.";
});
render(); updateTimer();

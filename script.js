const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const themeBtn = document.getElementById("themeBtn");
const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const clearAll = document.getElementById("clearAll");
const filters = document.querySelectorAll(".filter");

let currentFilter = "all";

// Initialize on page load 
document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  refreshUI();
});

// Event listeners
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const icon = themeBtn.querySelector("i");

  if (document.body.classList.contains("dark")) {
    icon.classList.replace("ri-moon-fill", "ri-sun-fill");
    localStorage.setItem("theme", "dark");
  } else {
    icon.classList.replace("ri-sun-fill", "ri-moon-fill");
    localStorage.setItem("theme", "light");
  }
});

clearAll.addEventListener("click", () => {
  localStorage.removeItem("tasks");
  refreshUI();
});

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.type.toLowerCase();
    refreshUI();
  });
});

//Functions

// Add new task
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const task = { id: Date.now(), text, completed: false };
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);

  taskInput.value = "";
  refreshUI();
}

// Create & render a task element
function createTaskElement(task) {
  const li = document.createElement("li");
  if (task.completed) li.classList.add("completed");

  li.innerHTML = `
     <span>${task.text}</span>
     <div class="actions">
        <button class="complete" onclick="toggleTask(${task.id})">✔</button>
        <button class="edit" onclick="editTask(${task.id})">✏️</button>
        <button class="delete" onclick="deleteTask(${task.id})">🗑️</button>
     </div>
  `;
  taskList.appendChild(li);
}

// Toggle completed
function toggleTask(id) {
  const tasks = getTasks().map((task) => {
    if (task.id === id) task.completed = !task.completed;
    return task;
  });
  saveTasks(tasks);
  refreshUI();
}

// Delete a task
function deleteTask(id) {
  const tasks = getTasks().filter((task) => task.id !== id);
  saveTasks(tasks);
  refreshUI();
}

// Edit a task
function editTask(id) {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);

  const newText = prompt("Edit task:", task.text);
  if (newText && newText.trim() !== "") {
    task.text = newText.trim();
    saveTasks(tasks);
    refreshUI();
  }
}

// Get tasks from localStorage
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// Save tasks to localStorage
function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Refresh screen
function refreshUI() {
  taskList.innerHTML = "";
  let tasks = getTasks();

  if (currentFilter === "completed") {
    tasks = tasks.filter((t) => t.completed);
  } else if (currentFilter === "pending") {
    tasks = tasks.filter((t) => !t.completed);
  }

  tasks.forEach((task) => createTaskElement(task));
  updateStats();
}

// Update stats (total + completed)
function updateStats() {
  const tasks = getTasks();
  totalCount.textContent = tasks.length;
  completedCount.textContent = tasks.filter((t) => t.completed).length;
}

// Load theme from localStorage
function loadTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.querySelector("i").classList.replace("ri-moon-fill", "ri-sun-fill");
  }
}
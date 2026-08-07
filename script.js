const form = document.getElementById("todoForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const count = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");
const clearCompleted = document.getElementById("clearCompleted");

let tasks = JSON.parse(localStorage.getItem("crixsoftTasks")) || [];

function saveTasks() {
  localStorage.setItem("crixsoftTasks", JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.append(checkbox, text, deleteButton);
    list.appendChild(li);
  });

  const remaining = tasks.filter(t => !t.completed).length;
  count.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} remaining`;
  emptyMessage.style.display = tasks.length ? "none" : "block";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) {
    input.focus();
    return;
  }

  tasks.push({
    id: Date.now(),
    text,
    completed: false
  });

  input.value = "";
  saveTasks();
  renderTasks();
  input.focus();
});

clearCompleted.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();

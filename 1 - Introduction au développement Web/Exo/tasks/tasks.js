// Nom de la clé dans LocalStorage
const TASKS_KEY = "tasks";
// Récupérer les tâches depuis LocalStorage, ou retourner un tableau vide si aucune
function getTasks() {
  return JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
}

function addTask(title) {
  const tasks = getTasks();
  const newTask = {
    id: Date.now(),   // id unique utilisant le timestamp
    title: title,
    done: false
  };
  tasks.push(newTask);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  const tasks = getTasks();
  const list = document.getElementById("taskList");
  list.innerHTML = ""; 

  tasks.forEach(task => {
    const li = document.createElement("li");

    // Case à cocher
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      updateTask(task.id, { done: checkbox.checked });
      renderTasks();
    });

    // Texte de la tâche
    const span = document.createElement("span");
    span.textContent = task.title;
    span.style.margin = "0 10px";

    // Rendre le texte éditable au double clic
    span.addEventListener("dblclick", () => {
      const newTitle = prompt("Modifier la tâche :", task.title);
      if (newTitle && newTitle.trim()) {
        updateTask(task.id, { title: newTitle.trim() });
        renderTasks();
      }
    });

    // Bouton supprimer
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.addEventListener("click", () => {
      deleteTask(task.id);
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

function updateTask(id, newData) {
  let tasks = getTasks();
  tasks = tasks.map(task =>
    task.id === id ? { ...task, ...newData } : task
  );
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function deleteTask(id) {
  let tasks = getTasks();
  tasks = tasks.filter(task => task.id !== id);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// Gérer la soumission du formulaire
document.getElementById("taskForm").addEventListener("submit", e => {
  e.preventDefault();
  const input = document.getElementById("taskInput");
  const title = input.value.trim();
  if (title) {
    addTask(title);
    input.value = "";
    renderTasks();
  }
});

// Gérer le clic sur les tâches (basculer done ou supprimer)
document.getElementById("taskList").addEventListener("click", e => {
  const tasks = getTasks();
  const index = Array.from(e.currentTarget.children).indexOf(e.target);
  if (index >= 0) {
    const task = tasks[index];
    if (e.ctrlKey) {
      deleteTask(task.id);
    } else {
      updateTask(task.id, { done: !task.done });
    }
    renderTasks();
  }
});
// Rendu initial
renderTasks();
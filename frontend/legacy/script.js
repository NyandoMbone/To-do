// DEPRECATED legacy script. Replaced by React app.
// No runtime behavior.
console.log('legacy script deprecated');
const API_URL = "http://localhost:5000/api";

/* =========================
   HELPERS
========================= */
const getToken = () => localStorage.getItem("token");

/* =========================
   PAGE LOAD LOGIC
========================= */
document.addEventListener("DOMContentLoaded", () => {
    const token = getToken();

    if (token) {
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("tasksSection").style.display = "block";
        loadTasks();
    } else {
        document.getElementById("loginSection").style.display = "block";
        document.getElementById("tasksSection").style.display = "none";
    }
});

/* =========================
   LOGIN
========================= */
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("loginMessage");

    if (!username || !password) {
        message.textContent = "Username and password required";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            message.textContent = data.message || "Login failed";
            message.style.color = "red";
            return;
        }

        localStorage.setItem("token", data.token);

        document.getElementById("loginSection").style.display = "none";
        document.getElementById("tasksSection").style.display = "block";

        loadTasks();
    } catch (err) {
        message.textContent = "Server error";
        message.style.color = "red";
    }
});

/* =========================
   ADD TASK (ENTER KEY WORKS)
========================= */
document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();
    addTask();
});

async function addTask() {
    const input = document.getElementById("taskInput");
    const task_name = input.value.trim();

    if (!task_name) return;

    try {
        const res = await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify({ task_name })
        });

        if (!res.ok) {
            alert("Failed to add task");
            return;
        }

        input.value = "";
        loadTasks();
    } catch (err) {
        console.error("Add task error:", err);
    }
}

/* =========================
   LOAD TASKS
========================= */
async function loadTasks() {
    try {
        const res = await fetch(`${API_URL}/tasks`, {
            headers: { "Authorization": `Bearer ${getToken()}` }
        });

        if (!res.ok) {
            logout();
            return;
        }

        const tasks = await res.json();
        const list = document.getElementById("taskList");

        if (!tasks.length) {
            list.innerHTML = `<p class="empty-state">No tasks yet</p>`;
            return;
        }

        list.innerHTML = tasks.map(task => `
            <li class="task-item">
                <div class="task-checkbox-container">
                    <input type="checkbox"
                        class="task-checkbox"
                        ${task.is_completed ? "checked" : ""}
                        onchange="toggleTask(${task.id}, this.checked)">
                </div>

                <div class="task-content ${task.is_completed ? "completed" : ""}">
                    <span class="task-text">${task.task_name}</span>
                </div>

                <div class="task-actions">
                    <button class="delete-btn" onclick="deleteTask(${task.id})">
                        Delete
                    </button>
                </div>
            </li>
        `).join("");
    } catch (err) {
        console.error("Load tasks error:", err);
    }
}

/* =========================
   UPDATE TASK
========================= */
async function toggleTask(id, is_completed) {
    try {
        await fetch(`${API_URL}/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify({ is_completed })
        });
    } catch (err) {
        console.error("Toggle error:", err);
    }
}

/* =========================
   DELETE TASK
========================= */
async function deleteTask(id) {
    if (!confirm("Delete this task?")) return;

    try {
        await fetch(`${API_URL}/tasks/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        });
        loadTasks();
    } catch (err) {
        console.error("Delete error:", err);
    }
}

/* =========================
   LOGOUT
========================= */
function logout() {
    localStorage.removeItem("token");
    location.reload();
}

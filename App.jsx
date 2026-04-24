import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [error, setError] = useState("");

  const API = "http://localhost:3001/api/tasks";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setTasks(data);
    } catch {
      setError("Backend is not running. Start server.js first.");
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Type a task before creating one.");
      return;
    }

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          dueDate,
          priority
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Task could not be created.");
        return;
      }

      setTasks([data, ...tasks]);
      setTitle("");
      setDueDate("");
      setPriority("Medium");
    } catch {
      setError("Could not connect to backend.");
    }
  };

  const toggleTask = async (task) => {
    await fetch(`${API}/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        completed: !task.completed
      })
    });

    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    fetchTasks();
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.length - completedCount;

  return (
    <div className="page">
      <div className="dashboard">
        <div className="hero">
          <div>
            <p className="eyebrow">Full-Stack React + Express Project</p>
            <h1>TaskFlow</h1>
            <p className="hero-text">
              A clean task manager with due dates, priorities, and persistent storage.
            </p>
          </div>

          <div className="stats">
            <div>
              <span>{tasks.length}</span>
              <p>Total</p>
            </div>
            <div>
              <span>{activeCount}</span>
              <p>Active</p>
            </div>
            <div>
              <span>{completedCount}</span>
              <p>Done</p>
            </div>
          </div>
        </div>

        <form onSubmit={addTask} className="task-form">
          <div className="input-group large">
            <label>Task Name</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Finish resume project"
            />
          </div>

          <div className="input-group">
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <button type="submit" className="create-btn">
            Create Task
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        <div className="section-title">
          <h2>Your Tasks</h2>
          <p>Click complete when you finish something.</p>
        </div>

        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty">
              <h3>No tasks yet</h3>
              <p>Add your first task above.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className={`task-card ${task.completed ? "completed" : ""}`}>
                <div className="task-main">
                  <div className={`priority-dot ${task.priority?.toLowerCase()}`}></div>

                  <div>
                    <h3>{task.title}</h3>
                    <p>
                      Due: {task.dueDate ? task.dueDate : "No due date"} • Priority:{" "}
                      {task.priority || "Medium"}
                    </p>
                  </div>
                </div>

                <div className="task-buttons">
                  <button onClick={() => toggleTask(task)} className="done-btn">
                    {task.completed ? "Undo" : "Complete"}
                  </button>

                  <button onClick={() => deleteTask(task.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
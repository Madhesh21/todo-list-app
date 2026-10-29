import { useEffect, useState } from "react";
import "./App.css";

const filters = ["all", "active", "completed"];

function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const savedTodos = localStorage.getItem("little-list-todos");
      return savedTodos ? JSON.parse(savedTodos) : [];
    } catch {
      return [];
    }
  });
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("little-list-todos", JSON.stringify(todos));
  }, [todos]);

  const remaining = todos.filter((todo) => !todo.completed).length;
  const completed = todos.length - remaining;
  const visibleTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  function addTodo(event) {
    event.preventDefault();
    const text = newTodo.trim();
    if (!text) return;

    setTodos((currentTodos) => [
      ...currentTodos,
      { id: crypto.randomUUID(), text, completed: false },
    ]);
    setNewTodo("");
  }

  function toggleTodo(id) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Little List home">
          <span className="wordmark-mark" aria-hidden="true">
            l.
          </span>
          <span>little list</span>
        </a>
        <span className="topbar-note">A softer place for your to-dos</span>
      </header>

      <section className="todo-app" id="top" aria-labelledby="page-title">
        <div className="intro">
          <p className="eyebrow">YOUR EVERYDAY, UNCLUTTERED</p>
          <h1 id="page-title">
            Make room
            <br />
            for what matters.
          </h1>
          <p className="intro-copy">
            One thing at a time is still getting there.
          </p>
        </div>

        <section className="list-panel" aria-label="Todo list">
          <div className="list-heading">
            <div>
              <p className="eyebrow">THE LIST</p>
              <h2>Today</h2>
            </div>
            <div className="progress-copy" aria-live="polite">
              <span className="progress-count">{remaining}</span>
              <span>{remaining === 1 ? "thing left" : "things left"}</span>
            </div>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-label="Tasks completed"
            aria-valuemin={0}
            aria-valuemax={todos.length || 1}
            aria-valuenow={completed}
          >
            <span
              style={{
                width: `${todos.length ? (completed / todos.length) * 100 : 0}%`,
              }}
            />
          </div>

          <form className="add-form" onSubmit={addTodo}>
            <label className="sr-only" htmlFor="new-todo">
              Add a task
            </label>
            <input
              id="new-todo"
              value={newTodo}
              onChange={(event) => setNewTodo(event.target.value)}
              placeholder="What would you like to get done?"
              maxLength={140}
            />
            <button type="submit" disabled={!newTodo.trim()}>
              Add task <span aria-hidden="true">+</span>
            </button>
          </form>

          <div className="list-toolbar">
            <div className="filter-tabs" role="group" aria-label="Filter tasks">
              {filters.map((option) => (
                <button
                  className={
                    filter === option ? "filter-tab is-selected" : "filter-tab"
                  }
                  key={option}
                  type="button"
                  aria-pressed={filter === option}
                  onClick={() => setFilter(option)}
                >
                  {option[0].toUpperCase() + option.slice(1)}
                  {option === "all" && (
                    <span className="filter-count">{todos.length}</span>
                  )}
                </button>
              ))}
            </div>
            {completed > 0 && (
              <button
                className="clear-button"
                type="button"
                onClick={() =>
                  setTodos((currentTodos) =>
                    currentTodos.filter((todo) => !todo.completed),
                  )
                }
              >
                Clear done
              </button>
            )}
          </div>

          {visibleTodos.length > 0 ? (
            <ul className="todo-list">
              {visibleTodos.map((todo) => (
                <li
                  className={
                    todo.completed ? "todo-item is-completed" : "todo-item"
                  }
                  key={todo.id}
                >
                  <label className="todo-label">
                    <input
                      className="todo-checkbox"
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    <span className="checkbox-visual" aria-hidden="true" />
                    <span className="todo-text">{todo.text}</span>
                  </label>
                  <button
                    className="remove-button"
                    type="button"
                    aria-label={`Remove ${todo.text}`}
                    onClick={() =>
                      setTodos((currentTodos) =>
                        currentTodos.filter((item) => item.id !== todo.id),
                      )
                    }
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state" aria-live="polite">
              <span className="empty-mark" aria-hidden="true">
                {filter === "completed" ? "✓" : "·"}
              </span>
              <p>
                {filter === "completed"
                  ? "Nothing checked off just yet."
                  : filter === "active"
                    ? "You’re all caught up."
                    : "A little space to start."}
              </p>
              <span>
                {filter === "all"
                  ? "Add a task above and take it from there."
                  : "Try another filter or add a new task."}
              </span>
            </div>
          )}

          <footer className="list-footer">
            <span>
              {todos.length === 0
                ? "A fresh page, whenever you need it."
                : `${completed} of ${todos.length} completed`}
            </span>
            <span className="footer-spark" aria-hidden="true">
              ✳
            </span>
          </footer>
        </section>
      </section>
      <footer className="page-footer">
        Small steps count. Take yours at your own pace.
      </footer>
    </main>
  );
}

export default App;

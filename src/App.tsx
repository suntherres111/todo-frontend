import React, { useState, useEffect } from "react";
import { getTodos, addTodo, toggleTodo, deleteTodo } from "./api";
import type { Todo } from "./types/types";

type Filter = "all" | "active" | "completed";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [filter, setFilter] = useState<Filter>("all");

  // Fetch todos from API on load
  useEffect(() => {
    (async () => {
      const data = await getTodos();
      setTodos(data);
    })();
  }, []);

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    const todo = await addTodo(newTask);
    setTodos([todo, ...todos]);
    setNewTask("");
  };

  const handleToggle = async (t: Todo) => {
    const updated = await toggleTodo(t);
    setTodos(todos.map((x) => (x.id === updated.id ? updated : x)));
  };

  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    setTodos(todos.filter((t) => t.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAdd();
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.isCompleted;
    if (filter === "completed") return t.isCompleted;
    return true;
  });

  const sortedTodos = [...filteredTodos].sort(
    (a, b) => Number(a.isCompleted) - Number(b.isCompleted)
  );

  const activeCount = todos.filter((t) => !t.isCompleted).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-peacock-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <h1 className="text-3xl font-extrabold text-center text-orange-600 mb-6">
          ✅ Todo List
        </h1>

        {/* Input */}
        <div className="flex mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Add a new task..."
            className="flex-1 border border-gray-300 rounded-l-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            onClick={handleAdd}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r-xl transition"
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <ul className="space-y-2">
          {sortedTodos.map((todo) => (
            <li
              key={todo.id}
              className={`flex justify-between items-center p-3 rounded-xl transition shadow-sm ${
                todo.isCompleted
                  ? "line-through text-gray-400 bg-gray-100"
                  : "bg-orange-50 hover:bg-orange-100"
              }`}
            >
              <span
                onClick={() => handleToggle(todo)}
                className="cursor-pointer flex-1"
              >
                {todo.title}
              </span>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-red-500 hover:text-red-700 ml-3"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>

        {/* Footer controls */}
        {todos.length > 0 && (
          <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
            <span>{activeCount} tasks left</span>

            <div className="space-x-2">
              {(["all", "active", "completed"] as Filter[]).map((f) => (
                <button
                  key={f}
                  className={`px-3 py-1 rounded-full transition ${
                    filter === f
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Clear Completed button */}
            <button
              onClick={async () => {
                const completed = todos.filter((t) => t.isCompleted);
                for (const c of completed) {
                  await deleteTodo(c.id);
                }
                setTodos(todos.filter((t) => !t.isCompleted));
              }}
              disabled={!todos.some((t) => t.isCompleted)}
              className="px-3 py-1 rounded-full transition
                 bg-red-500 text-white hover:bg-red-600
                 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              Clear Completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

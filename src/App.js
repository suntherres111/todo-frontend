import React, { useEffect, useState } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./api";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | completed

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await getTodos();
    setTodos(res.data);
  };

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    await createTodo({ title: newTitle, isCompleted: false });
    setNewTitle("");
    fetchTodos();
  };

  const handleToggle = async (todo) => {
    await updateTodo(todo.id, { ...todo, isCompleted: !todo.isCompleted });
    fetchTodos();
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    fetchTodos();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter((t) => t.isCompleted);
    for (let todo of completed) {
      await deleteTodo(todo.id);
    }
    fetchTodos();
  };

  // 🔹 Sorting: uncompleted first, completed later
  const sortedTodos = [...todos].sort((a, b) => a.isCompleted - b.isCompleted);

  // 🔹 Filter logic
  const filteredTodos = sortedTodos.filter((todo) => {
    if (filter === "active") return !todo.isCompleted;
    if (filter === "completed") return todo.isCompleted;
    return true; // all
  });

  // 🔹 Counter
  const activeCount = todos.filter((t) => !t.isCompleted).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          📝 To-Do List App
        </h1>

        {/* Input box */}
        <div className="flex mb-4">
          <input
            type="text"
            value={newTitle}
            placeholder="Enter new task..."
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition"
          >
            Add
          </button>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1 rounded-lg ${
              filter === "active"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 rounded-lg ${
              filter === "completed"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Completed
          </button>
        </div>

        {/* To-do list */}
        <ul className="space-y-3">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
            >
              <span
                onClick={() => handleToggle(todo)}
                className={`cursor-pointer flex-1 ${
                  todo.isCompleted
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }`}
              >
                {todo.title}
              </span>
              <button
                onClick={() => handleDelete(todo.id)}
                className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {/* Empty state */}
        {filteredTodos.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            {filter === "all"
              ? "🎉 All tasks done! Add a new one above."
              : "😅 No tasks in this filter."}
          </p>
        )}

        {/* Footer with counter + clear */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-gray-600 text-sm">
            {activeCount} {activeCount === 1 ? "task" : "tasks"} left
          </p>
          {todos.some((t) => t.isCompleted) && (
            <button
              onClick={handleClearCompleted}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition"
            >
              Clear Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

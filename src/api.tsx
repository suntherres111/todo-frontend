import axios from "axios";
import type { Todo } from "./types/types";

// const API_URL = "https://localhost:44360/api/todo"; //For CRUD API
const API_URL = "https://localhost:44392/api/todo"; //For CQRS API

export async function getTodos(): Promise<Todo[]> {
  const res = await fetch(API_URL);
  return res.json();
}

export async function addTodo(title: string): Promise<Todo> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return res.json();
}

export async function toggleTodo(todo: Todo): Promise<Todo> {
  const res = await fetch(`${API_URL}/${todo.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...todo, isCompleted: !todo.isCompleted }),
  });
  return res.json();
}

export async function deleteTodo(id: number): Promise<void> {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}

export async function clearCompleted(): Promise<void> {
  await fetch(`${API_URL}/clear-completed`, { method: "DELETE" });
  // 👆 optional extra endpoint, or handle in frontend
}

//import { Component } from '@angular/core';
import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { NgClass, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TodoModel } from '../model/todoModel';

const BASE_API = 'https://json-server-vercel-for-tutorials.vercel.app';

@Component({
  selector: 'app-todo',
  imports: [NgClass, JsonPipe],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo {
  http = inject(HttpClient);
  todos = signal<TodoModel[]>([]);
  error = signal(false);

  totalCompleted = computed(
    () => this.todos().filter((t) => t.completed).length
  );

  totalTodos = computed(() => this.todos().filter((t) => !t.completed).length);

  ngOnInit() {
    this.http.get<TodoModel[]>(`${BASE_API}/todos`).subscribe({
      next: (res) => {
        this.todos.set(res);
      },
      error: (err) => {
        console.log('here', err);
        this.error.set(true);
      },
    });
  }

  addTodo(input: HTMLInputElement) {
    this.error.set(false);
    this.http
      .post<TodoModel>(`${BASE_API}/todos`, {
        title: input.value,
        completed: false,
      })
      .subscribe({
        next: (newTodo) => {
          this.todos.update((todos) => [...todos, newTodo]);
          input.value = '';
        },
        error: () => {
          this.error.set(true);
        },
      });
  }

  removeTodo(todoToRemove: TodoModel) {
    this.error.set(false);
    this.http.delete(`${BASE_API}/todos/${todoToRemove.id}`).subscribe({
      next: () => {
        this.todos.update((todos) =>
          todos.filter((todo) => todo.id !== todoToRemove.id)
        );
      },
      error: () => {
        this.error.set(true);
      },
    });
  }

  toggleTodo(todoToToggle: TodoModel) {
    this.error.set(false);
    this.http
      .patch<TodoModel>(`${BASE_API}/todos/${todoToToggle.id}`, {
        completed: !todoToToggle.completed,
      })
      .subscribe({
        next: (res) => {
          this.todos.update((todos) => {
            return todos.map((t) => (t.id === todoToToggle.id ? res : t));
          });
        },
        error: () => {
          this.error.set(true);
        },
      });
  }
}


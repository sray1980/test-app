import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { NgClass, JsonPipe } from '@angular/common';
import { TodoModel } from '../model/todoModel';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo',
  imports: [NgClass, JsonPipe],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo {
  todoService = inject(TodoService);
  todos = signal<TodoModel[]>([]);
  error = signal(false);

  totalCompleted = computed(
    () => this.todos().filter((t) => t.completed).length
  );

  totalTodos = computed(() => this.todos().filter((t) => !t.completed).length);

  ngOnInit() {
    this.todoService.getTodos().subscribe({
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

    let todoObj: TodoModel = {
      id: -1,
      title: input.value,
      completed: false
    };

    this.todoService.addTodo(todoObj)
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
    this.todoService.removeTodo(todoToRemove).subscribe({
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
    this.todoService
      .toggleTodo(todoToToggle)
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


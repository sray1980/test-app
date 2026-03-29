import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TodoModel } from '../model/todoModel';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private http = inject(HttpClient);
  private apiUrl = 'https://json-server-vercel-for-tutorials.vercel.app'; // Example API URL

  getTodos(): Observable<TodoModel[]> {
    return this.http.get<TodoModel[]>(`${this.apiUrl}/todos`);
  }

  addTodo(todo: TodoModel): Observable<TodoModel> {
    return this.http
      .post<TodoModel>(`${this.apiUrl}/todos`, {
        title: todo.title,
        completed: todo.completed,
      });
  }
  
  removeTodo(todoToRemove: TodoModel): Observable<object> {
    return this.http.delete(`${this.apiUrl}/todos/${todoToRemove.id}`);
  }

  toggleTodo(todoToToggle: TodoModel): Observable<TodoModel> {
    return this.http
      .patch<TodoModel>(`${this.apiUrl}/todos/${todoToToggle.id}`, {
        completed: !todoToToggle.completed,
      });
  }
}

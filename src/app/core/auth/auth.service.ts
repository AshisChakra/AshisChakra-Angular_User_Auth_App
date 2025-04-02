import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User, LoginCredentials, AuthResponse } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // json-server URL
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {
    // Initialize from localStorage if available
    const storedUser = localStorage.getItem('current_user');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginCredentials): Observable<User> {
    // In a real app, this would be a POST request to an authentication endpoint
    // For demo purposes, we'll use a mock implementation
    return this.mockLogin(credentials);
  }

  logout(): void {
    // Remove user from local storage and set current user to null
    localStorage.removeItem('current_user');
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    // In a real app, you would check if the token is valid and not expired
    return !!token;
  }

  // Mock implementation for demo purposes
  private mockLogin(credentials: LoginCredentials): Observable<User> {
    // Check if credentials match our mock user
    if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
      const user: User = {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'Admin'
      };
      
      const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
      
      // Store user details and token in local storage
      localStorage.setItem('current_user', JSON.stringify(user));
      localStorage.setItem(this.tokenKey, token);
      
      // Update the current user subject
      this.currentUserSubject.next(user);
      
      return of(user);
    } else {
      // Return an error for invalid credentials
      return of(null).pipe(
        map(() => {
          throw new Error('Invalid email or password');
        })
      );
    }
  }
}

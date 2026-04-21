import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessKey = 'access';
  private refreshKey = 'refresh';
  private usernameKey = 'username';

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedInSubject.asObservable();

  hasToken(): boolean {
    return !!localStorage.getItem(this.accessKey);
  }

  setSession(access: string, refresh: string, username: string): void {
    localStorage.setItem(this.accessKey, access);
    localStorage.setItem(this.refreshKey, refresh);
    localStorage.setItem(this.usernameKey, username);
    this.loggedInSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
    localStorage.removeItem(this.usernameKey);
    this.loggedInSubject.next(false);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }

  getUsername(): string {
    return localStorage.getItem(this.usernameKey) || '';
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }
}
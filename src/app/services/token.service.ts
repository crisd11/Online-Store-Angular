import { Injectable } from '@angular/core';

const TOKEN_KEY = 'online_store_token';
const USER_KEY = 'online_store_user';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  saveUser(user: any) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  getUser(): any | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
  removeUser() {
    localStorage.removeItem(USER_KEY);
  }

  signOut() {
    this.removeToken();
    this.removeUser();
  }

  getTokenPayload(): any | null {
  const token = this.getToken();
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

isTokenExpired(): boolean {
  const token = this.getToken();
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload?.exp) return false;
    return payload.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
}

}

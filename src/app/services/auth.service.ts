import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';
import { TokenService } from './token.service';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string;
  private loginSuccessSubject = new Subject<void>();
  loginSuccess$ = this.loginSuccessSubject.asObservable();
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private tokenService: TokenService, private envService: EnvService) {
    this.baseUrl = this.envService.apiUrl + '/api/auth';
    const token = this.tokenService?.getToken();
    this.loggedIn.next(!!token);
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload)
      .pipe(
        tap(res => {
          if (res?.token) {
            this.tokenService.saveToken(res.token);
            // si el backend devuelve user info o role, guardalo también
            this.tokenService.saveUser({ role: res.role });
            this.loginSuccessSubject.next();
            this.loggedIn.next(true);
          }
        })
      );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, payload)
      .pipe(
        tap(res => {
          if (res?.token) {
            this.tokenService.saveToken(res.token);
            this.tokenService.saveUser({ role: res.role });
          }
        })
      );
  }

  logout() {
    this.tokenService.signOut();
    this.loggedIn.next(false);
  }

  isLoggedIn(): boolean {
    try {
      return !!this.tokenService?.getToken();
    } catch {
        return false;
      }
  }

  getUserRole(): string | null {
    const user = this.tokenService.getUser();
    return user?.role ?? null;
  }

  recoverPassword(email: string) {
    return this.http.post(`${this.baseUrl}/recover-password`, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.baseUrl}/reset-password`, { token, newPassword });
  }

}

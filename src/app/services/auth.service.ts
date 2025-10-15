import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Ajustá la base URL a tu API .NET en desarrollo (ej: https://localhost:7234/api)
  private baseUrl = '/api/auth';
  private loginSuccessSubject = new Subject<void>();
  loginSuccess$ = this.loginSuccessSubject.asObservable();

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload)
      .pipe(
        tap(res => {
          if (res?.token) {
            this.tokenService.saveToken(res.token);
            // si el backend devuelve user info o role, guardalo también
            this.tokenService.saveUser({ role: res.role });
            this.loginSuccessSubject.next();
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
  }

  isLoggedIn(): boolean {
    return !!this.tokenService.getToken();
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

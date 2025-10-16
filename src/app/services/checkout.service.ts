import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private baseUrl = '/api/checkout';

  constructor(private http: HttpClient) {}

  createCheckoutSession(): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.baseUrl}/create-checkout-session`, {});
  }
}
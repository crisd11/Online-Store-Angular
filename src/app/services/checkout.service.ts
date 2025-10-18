import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl: string;
  
  constructor(private http: HttpClient, private envService: EnvService) {
    this.baseUrl = this.envService.apiUrl + '/api/checkout';
  }

  createCheckoutSession(): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.baseUrl}/create-checkout-session`, {});
  }
}
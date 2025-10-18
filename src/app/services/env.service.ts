import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  public apiUrl: string;

  constructor() {
    this.apiUrl = isDevMode() ? 'https://localhost:7120' : (window as any).__env?.apiUrl || ''; 
    //✅ Producción uses env.js
  }
}

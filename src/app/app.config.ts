import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter([
      { 
        path: 'login', 
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) 
      },
      { 
        path: 'register', 
        loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) 
      },/*
      { 
        path: 'catalog', 
        loadComponent: () => import('./pages/product-list/product-list.component').then(m => m.ProductListComponent), 
        canActivate: [authGuard]  // 👤 solo usuarios logueados
      },
      { 
        path: 'admin', 
        loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent), 
        canActivate: [adminGuard] // 👑 solo administradores
      },*/
      { path: '', redirectTo: 'catalog', pathMatch: 'full' }
    ])
  ]
};

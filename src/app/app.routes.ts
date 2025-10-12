import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { CartComponent } from './pages/cart/cart.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'catalog', component: CatalogComponent, canActivate: [authGuard] },
      { path: 'cart', component: CartComponent, canActivate: [authGuard] },
      /*
      {
        path: 'admin',
        loadComponent: () =>
          import('./pages/admin-dashboard/admin-dashboard.component').then(
            m => m.AdminDashboardComponent
          ),
        canActivate: [adminGuard]
      },
      */
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

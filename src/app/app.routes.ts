import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { CartComponent } from './pages/cart/cart.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'reset-password', component: ResetPasswordComponent},
      { path: 'catalog', component: CatalogComponent },
      { path: 'cart', component: CartComponent, canActivate: [authGuard] },
      { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [adminGuard]},
      { path: '', redirectTo: 'catalog', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

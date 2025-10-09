import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// ✅ Guard específico: asegura que el usuario sea Admin
export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService) as AuthService;
  const router = inject(Router) as Router;

  if (auth.isLoggedIn() && auth.getUserRole() === 'Admin') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

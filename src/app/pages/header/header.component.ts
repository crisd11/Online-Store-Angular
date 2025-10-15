import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  cartCount = 0;
  isLogged = false;
  role: string | null = null;
  showAccountMenu = false;

  constructor(private cartService: CartService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
  this.cartService.cartCount$.subscribe(count => {
    this.cartCount = count;
    });
    this.isLogged = this.authService.isLoggedIn();
    this.role = this.authService.getUserRole();

    this.authService.loggedIn$.subscribe(status => {
      this.isLogged = status;
      this.role = this.authService.getUserRole();
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleAccountMenu() {
  this.showAccountMenu = !this.showAccountMenu;
  }

  logout() {
    this.authService.logout();
    this.showAccountMenu = false;
    this.isLogged = false;
    this.router.navigate(['/login']);
  }
}
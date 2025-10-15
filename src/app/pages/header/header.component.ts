import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';

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

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
  this.cartService.cartCount$.subscribe(count => {
    this.cartCount = count;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
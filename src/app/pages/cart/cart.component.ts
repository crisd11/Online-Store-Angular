import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule, MatSnackBarModule]
})
export class CartComponent {
  items: CartItem[] = [];

  constructor(private cartService: CartService, private snackBar: MatSnackBar) {
    this.items = this.cartService.getItems();
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
    this.items = this.cartService.getItems();
  }

  changeQuantity(id: number, quantity: number) {
  if (quantity <= 0) {
    this.snackBar.open(
      'Para eliminar un producto, usá el botón correspondiente.',
      'OK',
      { duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    );
    return;
  }
    this.cartService.updateQuantity(id, quantity);
    this.items = this.cartService.getItems();
  }

  getTotal() {
    return this.cartService.getTotal();
  }

  clearCart() {
    this.cartService.clearCart();
    this.items = [];
  }
}
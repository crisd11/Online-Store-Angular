import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';

const CART_KEY = 'online_store_cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  constructor() {
  const stored = localStorage.getItem(CART_KEY);
  this.items = stored ? JSON.parse(stored) : [];
  this.updateCartCount();
}

  private updateLocalStorage() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.items));
  }

  getItems(): CartItem[] {
    return this.items;
  }

  addToCart(product: Product, quantity: number = 1) {
    const existing = this.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
    this.updateLocalStorage();
    this.updateCartCount();
  }

  removeFromCart(productId: number) {
    this.items = this.items.filter(i => i.product.id !== productId);
    this.updateLocalStorage();
    this.updateCartCount();
  }

  updateQuantity(productId: number, quantity: number) {
    const item = this.items.find(i => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.updateLocalStorage();
        this.updateCartCount();
      }
    }
  }

  clearCart() {
    this.items = [];
    this.updateLocalStorage();
    this.updateCartCount();
  }

  getTotal(): number {
    return this.items.reduce((acc, item) => acc + (item.quantity * item.product.price), 0);
  }

  private updateCartCount() {
  const total = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.cartCount.next(total);
}

}
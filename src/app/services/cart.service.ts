import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

const CART_KEY = 'online_store_cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.items);
  items$ = this.itemsSubject.asObservable();
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  private baseUrl = '/api/cart';

  constructor(private http: HttpClient, private auth: AuthService) 
  {
    const stored = localStorage.getItem(CART_KEY);
    this.items = stored ? JSON.parse(stored) : [];
    this.updateCartCount();

    if (this.auth.isLoggedIn()) {
      this.syncWithBackend();
    }
    this.auth.loginSuccess$.subscribe(() => {
      this.syncWithBackend();
    });
  }

  private syncWithBackend() {
    this.http.get<CartItem[]>(this.baseUrl).subscribe({
      next: (cart) => {
        this.items = cart;
        this.updateLocalStorage();
        this.updateCartCount();
        this.itemsSubject.next(this.items);
      },
      error: () => {
        console.warn('Cant sinchronize the cart with backend.');
      }
    });
  }

  private updateLocalStorage() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.items));
  }

  getItems(): CartItem[] {
    return this.items;
  }

  addToCart(product: Product, quantity: number = 1) {
    if (this.auth.isLoggedIn()) {
      this.http.post(this.baseUrl + '/add', {
        productId: product.id,
        quantity
      }).subscribe({
        next: () => {
          const existing = this.items.find(i => i.product.id === product.id);
          if (existing) {
            existing.quantity += quantity;
          } else {
            this.items.push({ product, quantity });
          }
          this.updateLocalStorage();
          this.updateCartCount();
          this.itemsSubject.next(this.items);
        }
      });
    } else {
      const existing = this.items.find(i => i.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({ product, quantity });
      }
      this.updateLocalStorage();
      this.updateCartCount();
      this.itemsSubject.next(this.items);
    }
  }

  removeFromCart(productId: number) {
    if (this.auth.isLoggedIn()) {
      this.http.delete(this.baseUrl + `/${productId}`).subscribe({
        next: () => {
          this.items = this.items.filter(i => i.product.id !== productId);
          this.updateLocalStorage();
          this.updateCartCount();
          this.itemsSubject.next(this.items);
        }
      });
    } else {
      this.items = this.items.filter(i => i.product.id !== productId);
      this.updateLocalStorage();
      this.updateCartCount();
      this.itemsSubject.next(this.items);
    }
  }

  updateQuantity(productId: number, quantity: number) {
    if (this.auth.isLoggedIn()) {
      this.http.put(this.baseUrl + '/update', {
        productId,
        quantity
      }).subscribe({
        next: () => {
          const item = this.items.find(i => i.product.id === productId);
          if (item) {
            item.quantity = quantity;
          }
          this.updateLocalStorage();
          this.updateCartCount();
          this.itemsSubject.next(this.items);
        }
      });
    } else {
      const item = this.items.find(i => i.product.id === productId);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          this.removeFromCart(productId);
        } else {
          this.updateLocalStorage();
          this.updateCartCount();
          this.itemsSubject.next(this.items);
        }
      }
    }
  }

  clearCart() {
    if (this.auth.isLoggedIn()) {
      this.http.delete(this.baseUrl + '/clear').subscribe({
        next: () => {
          this.items = [];
          this.updateLocalStorage();
          this.updateCartCount();
          this.itemsSubject.next(this.items);
        }
      });
    } else {
      this.items = [];
      this.updateLocalStorage();
      this.updateCartCount();
      this.itemsSubject.next(this.items);
    }
  }

  getTotal(): number {
    return this.items.reduce((acc, item) => acc + (item.quantity * item.product.price), 0);
  }

  private updateCartCount() {
    const total = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCount.next(total);
  }
}
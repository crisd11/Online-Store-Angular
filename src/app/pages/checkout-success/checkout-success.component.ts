import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  standalone: true,
  selector: 'app-checkout-success',
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss']
})
export class CheckoutSuccessComponent implements OnInit {

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.clearCart();
  }

  goToCatalog() {
    this.router.navigate(['/catalog']);
  }
}

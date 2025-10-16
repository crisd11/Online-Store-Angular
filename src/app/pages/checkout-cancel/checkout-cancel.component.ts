// checkout-cancel.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  template: `
    <div class="center">
      <h2>❌ Pago cancelado</h2>
      <p>Tu pago no fue procesado. Podés intentarlo de nuevo.</p>
    </div>
  `,
  styles: [`.center { text-align:center; margin-top:2rem; }`]
})
export class CheckoutCancelComponent {}
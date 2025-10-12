import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-confirm-add-dialog',
  templateUrl: './confirm-add-dialog.component.html',
  styleUrls: ['./confirm-add-dialog.component.scss'],
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule]
})
export class ConfirmAddDialogComponent {
  quantity: number = 1;

  constructor(
    public dialogRef: MatDialogRef<ConfirmAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirm() {
    this.dialogRef.close(this.quantity);
  }

  cancel() {
    this.dialogRef.close(null);
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
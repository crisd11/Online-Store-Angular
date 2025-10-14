import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ]
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required]]
    });
  }

  submit(): void {
    if (this.form.invalid) 
      return;

    const { password, confirm } = this.form.value;
    if (password !== confirm) {
      this.showMessage('Las contraseñas no coinciden', true);
      return;
    }

    this.auth.resetPassword(this.token, password!).subscribe({
      next: () => {
        this.showMessage('Contraseña actualizada correctamente.');
        this.router.navigate(['/login']);
      },
      error: err => {
        this.showMessage(
          err?.error?.message ?? 'No se pudo actualizar la contraseña',
          true
        );
      }
    });
  }

    private showMessage(message: string, isError = false): void {
    this.snackBar.open(message, 'Cerrar', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: isError ? ['snackbar-error'] : ['snackbar-success']
    });
  }
}
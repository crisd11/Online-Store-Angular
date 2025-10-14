import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { RecoverPasswordDialogComponent } from '../recover-password-dialog/recover-password-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatProgressSpinnerModule
  ]
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  error: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private resetPassDialog: MatDialog,
    private snackBar: MatSnackBar 
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid)
      return;

    this.loading = true;
    this.auth.login(this.form.value).subscribe({
      next: () => {
        const role = this.auth.getUserRole();
        // ✅ Si venís redirigido por authGuard, tomamos el returnUrl
        const returnUrl =
          this.route.snapshot.queryParamMap.get('returnUrl') ||
          (role === 'Admin' ? '/admin' : '/catalog');

        this.router.navigateByUrl(returnUrl);
      },
      error: err => {
        this.error = err?.error?.message ?? 'Error al iniciar sesión';
        this.loading = false;
      }
    });
  }

openRecoverDialog() {
  const dialogRef = this.resetPassDialog.open(RecoverPasswordDialogComponent, {
    width: '400px'
  });

  dialogRef.afterClosed().subscribe(email => {
    if (email) {
      this.loading = true;
      this.auth.recoverPassword(email).subscribe({
        next: (res: any) => {
          this.loading = false;
          // ✅ Mostrar mensaje correcto desde backend o uno por defecto
          this.showSnack(
            res?.message || 'Se envió un correo con las instrucciones para recuperar tu contraseña.'
          );
        },
        error: err => {
          this.loading = false;
          this.showSnack(
            err?.error?.message || 'No se pudo procesar el pedido.'
          );
        }
      });
    }
  });
}

private showSnack(message: string) {
  this.snackBar.open(message, 'OK', {
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ['custom-snackbar']
  });
}


}
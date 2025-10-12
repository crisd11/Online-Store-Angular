import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
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
    private route: ActivatedRoute
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
}
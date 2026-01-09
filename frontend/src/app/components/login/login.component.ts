import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <div class="auth-wrapper fade-in">
      <div class="auth-container">
        <mat-card class="auth-card">
          <div class="auth-header">
            <div class="icon-circle">
              <mat-icon>lock_open</mat-icon>
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to connect with your neighbors</p>
          </div>
          
          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email Address</mat-label>
                <input matInput formControlName="email" type="email" placeholder="name@example.com">
                <mat-icon matPrefix>mail_outline</mat-icon>
                <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Please enter a valid email</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'">
                <mat-icon matPrefix>lock_outline</mat-icon>
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
              </mat-form-field>

              <button mat-flat-button class="submit-btn" type="submit" [disabled]="loginForm.invalid || isLoading">
                <span *ngIf="!isLoading">Sign In</span>
                <span *ngIf="isLoading">Authenticating...</span>
              </button>
              
              <div class="auth-footer">
                  New here? <a routerLink="/register">Join the community</a>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: calc(100vh - 72px);
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, var(--pastel-blue) 0%, var(--pastel-lavender) 100%);
      padding: 24px;
    }
    .auth-container { width: 100%; max-width: 440px; }
    .auth-card { padding: 32px 16px; border-radius: 24px !important; }
    
    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-header h1 { margin: 16px 0 8px; font-weight: 700; color: var(--text-main); }
    .auth-header p { color: var(--text-muted); margin: 0; }
    
    .icon-circle {
      width: 64px;
      height: 64px;
      background: var(--pastel-blue);
      color: #0369a1;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }
    .icon-circle mat-icon { font-size: 32px; width: 32px; height: 32px; }

    .full-width { width: 100%; margin-bottom: 12px; }
    
    .submit-btn {
      width: 100%;
      height: 52px;
      background: var(--pastel-blue-dark) !important;
      color: #0369a1 !important;
      border-radius: 12px !important;
      font-size: 1rem;
      font-weight: 600 !important;
      margin-top: 12px;
    }

    .auth-footer { margin-top: 24px; text-align: center; color: var(--text-muted); }
    .auth-footer a { color: #0369a1; text-decoration: none; font-weight: 600; }
    .auth-footer a:hover { text-decoration: underline; }
    
    mat-form-field mat-icon[matPrefix] { margin-right: 8px; color: var(--text-muted); }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Welcome back!', 'Close', { duration: 2000 });
          this.router.navigate(['/requests']);
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open(err.error?.message || 'Login failed', 'Close', { duration: 3000 });
        }
      });
    }
  }
}

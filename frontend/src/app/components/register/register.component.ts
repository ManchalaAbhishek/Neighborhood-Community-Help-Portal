import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <div class="auth-wrapper fade-in">
      <div class="auth-container">
        <mat-card class="auth-card">
          <div class="auth-header">
            <div class="icon-circle">
              <mat-icon>person_add_alt</mat-icon>
            </div>
            <h1>Join Neighborly</h1>
            <p>Help or get help from people nearby</p>
          </div>
          
          <mat-card-content>
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
              
              <div class="form-grid">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Full Name</mat-label>
                  <input matInput formControlName="name" placeholder="John Doe">
                  <mat-icon matPrefix>person_outline</mat-icon>
                  <mat-error *ngIf="registerForm.get('name')?.hasError('required')">Name is required</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email Address</mat-label>
                  <input matInput formControlName="email" type="email" placeholder="john@example.com">
                  <mat-icon matPrefix>mail_outline</mat-icon>
                </mat-form-field>
              </div>

              <div class="form-grid">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Password</mat-label>
                  <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'">
                  <mat-icon matPrefix>lock_outline</mat-icon>
                  <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                    <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                  </button>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Phone Number</mat-label>
                  <input matInput formControlName="contact_info" placeholder="123-456-7890">
                  <mat-icon matPrefix>phone</mat-icon>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Address / Location</mat-label>
                <input matInput formControlName="location" placeholder="Downtown, City">
                <mat-icon matPrefix>location_on</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>I want to...</mat-label>
                <mat-select formControlName="role">
                  <mat-option value="Resident">Get Help (Resident)</mat-option>
                  <mat-option value="Helper">Provide Help (Helper)</mat-option>
                </mat-select>
                <mat-icon matPrefix>volunteer_activism</mat-icon>
              </mat-form-field>

              <button mat-flat-button class="submit-btn" type="submit" [disabled]="registerForm.invalid || isLoading">
                <span *ngIf="!isLoading">Create Account</span>
                <span *ngIf="isLoading">Joining...</span>
              </button>
              
              <div class="auth-footer">
                  Already have an account? <a routerLink="/login">Sign in</a>
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
      padding: 40px 24px;
    }
    .auth-container { width: 100%; max-width: 500px; }
    .auth-card { padding: 32px 16px; border-radius: 24px !important; }
    
    .auth-header { text-align: center; margin-bottom: 24px; }
    .auth-header h1 { margin: 16px 0 8px; font-weight: 700; color: var(--text-main); }
    .auth-header p { color: var(--text-muted); margin: 0; }
    
    .icon-circle {
      width: 64px;
      height: 64px;
      background: var(--pastel-lavender);
      color: #7e22ce;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }
    .icon-circle mat-icon { font-size: 32px; width: 32px; height: 32px; }

    .full-width { width: 100%; margin-bottom: 8px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 480px) { .form-grid { grid-template-columns: 1fr; gap: 0; } }
    
    .submit-btn {
      width: 100%;
      height: 52px;
      background: var(--pastel-lavender-dark) !important;
      color: #7e22ce !important;
      border-radius: 12px !important;
      font-size: 1rem;
      font-weight: 600 !important;
      margin-top: 12px;
    }

    .auth-footer { margin-top: 24px; text-align: center; color: var(--text-muted); }
    .auth-footer a { color: #7e22ce; text-decoration: none; font-weight: 600; }
    .auth-footer a:hover { text-decoration: underline; }
    
    mat-form-field mat-icon[matPrefix] { margin-right: 8px; color: var(--text-muted); }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      contact_info: ['', Validators.required],
      location: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Welcome to the neighborhood! Please login.', 'Close', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open(err.error?.message || 'Registration failed', 'Close', { duration: 3000 });
        }
      });
    }
  }
}

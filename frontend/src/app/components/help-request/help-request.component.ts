import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-help-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="form-wrapper fade-in">
      <div class="form-container">
        <mat-card class="request-form-card">
          <div class="form-header">
            <div class="icon-box">
              <mat-icon>add_task</mat-icon>
            </div>
            <h1>How can we help?</h1>
            <p>Share your request with the community helpers</p>
          </div>
          
          <mat-card-content>
            <form [formGroup]="requestForm" (ngSubmit)="onSubmit()" class="styled-form">
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Give it a clear title</mat-label>
                <input matInput formControlName="title" placeholder="e.g. Help with morning groceries">
                <mat-icon matSuffix>title</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Select a Category</mat-label>
                <mat-select formControlName="category">
                  <mat-option value="General"><mat-icon>apps</mat-icon> General Help</mat-option>
                  <mat-option value="Transport"><mat-icon>directions_car</mat-icon> Transport / Ride</mat-option>
                  <mat-option value="Supplies"><mat-icon>shopping_basket</mat-icon> Supplies / Groceries</mat-option>
                  <mat-option value="Labor"><mat-icon>handyman</mat-icon> Physical Labor</mat-option>
                  <mat-option value="Emergency"><mat-icon>priority_high</mat-icon> Urgent Help</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Tell us more details</mat-label>
                <textarea matInput formControlName="description" rows="6" placeholder="Be as descriptive as possible so helpers know what to expect..."></textarea>
              </mat-form-field>

              <div class="form-actions">
                <button mat-flat-button class="submit-btn" type="submit" [disabled]="requestForm.invalid || isLoading">
                  <mat-icon>send</mat-icon>
                  <span>{{ isLoading ? 'Posting...' : 'Post Request' }}</span>
                </button>
                <button mat-button class="cancel-btn" type="button" (click)="cancel()">Discard</button>
              </div>

            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .form-wrapper {
      min-height: calc(100vh - 72px);
      padding: 48px 24px;
      background: var(--bg-main);
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    .form-container { width: 100%; max-width: 640px; }
    .request-form-card { padding: 40px; border-radius: 32px !important; }
    
    .form-header { text-align: center; margin-bottom: 40px; }
    .form-header h1 { font-size: 2rem; font-weight: 800; margin: 16px 0 8px; }
    .form-header p { color: var(--text-muted); font-size: 1.1rem; }
    
    .icon-box {
      width: 64px; height: 64px; background: var(--pastel-blue); color: #0369a1;
      border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto;
    }
    
    .full-width { width: 100%; margin-bottom: 20px; }
    
    .form-actions { display: flex; flex-direction: column; gap: 12px; margin-top: 12px; }
    
    .submit-btn {
      height: 56px; background: var(--pastel-blue-dark) !important; color: #0369a1 !important;
      border-radius: 16px !important; font-size: 1.1rem; font-weight: 700 !important;
    }
    
    .cancel-btn { height: 48px; border-radius: 16px !important; color: var(--text-muted) !important; font-weight: 600 !important; }

    mat-select { display: flex; align-items: center; }
    mat-option mat-icon { margin-right: 8px; font-size: 20px; width: 20px; height: 20px; }
  `]
})
export class HelpRequestComponent {
  private fb = inject(FormBuilder);
  private requestService = inject(RequestService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = false;

  requestForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required]
  });

  onSubmit() {
    if (this.requestForm.valid) {
      this.isLoading = true;
      this.requestService.createRequest(this.requestForm.value as any).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Your request is live on the board!', 'Great', { duration: 3000 });
          this.router.navigate(['/requests']);
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Failed to create request', 'Close', { duration: 3000 });
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/requests']);
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestService, HelpRequest } from '../../services/request.service';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatTooltipModule,
    RouterModule
  ],
  template: `
    <div class="dashboard-wrapper fade-in">
      <div class="dashboard-header">
        <div class="title-section">
          <h1>Community Board</h1>
          <p>Lend a hand or ask for support from neighbors</p>
        </div>
        <div class="action-section">
          <button mat-flat-button class="new-req-btn" routerLink="/requests/new" *ngIf="isResident">
            <mat-icon>add_circle_outline</mat-icon>
            Post a New Request
          </button>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-card pastel-blue-bg">
          <div class="stat-icon"><mat-icon>volunteer_activism</mat-icon></div>
          <div class="stat-info">
            <span class="stat-value">{{ requests.length }}</span>
            <span class="stat-label">Active Requests</span>
          </div>
        </div>
        <div class="stat-card pastel-lavender-bg">
          <div class="stat-icon"><mat-icon>diversity_3</mat-icon></div>
          <div class="stat-info">
            <span class="stat-value">{{ getCountByStatus('Accepted') }}</span>
            <span class="stat-label">In Progress</span>
          </div>
        </div>
      </div>

      <div class="request-grid">
        <mat-card *ngFor="let req of requests" class="request-card">
          <div class="card-status-bar" [ngClass]="'status-' + req.status.toLowerCase()"></div>
          
          <mat-card-header>
            <div mat-card-avatar class="user-avatar" [ngStyle]="{'background-color': getAvatarColor(req.resident_id)}">
              {{ req.resident_name?.substring(0,1) || 'R' }}
            </div>
            <mat-card-title>{{ req.title }}</mat-card-title>
            <mat-card-subtitle>
              <mat-icon>history</mat-icon> {{ req.created_at | date:'mediumDate' }}
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <p class="description">{{ req.description }}</p>
            <div class="badge-row">
              <span class="category-badge">{{ req.category }}</span>
              <span class="status-badge" [ngClass]="'status-' + req.status.toLowerCase()">
                {{ req.status }}
              </span>
            </div>


          </mat-card-content>
          
          <mat-card-actions class="card-footer">
            <div class="requester-info">
               <mat-icon>location_on</mat-icon>
               <span>By {{ req.resident_name }}</span>
            </div>
            <span class="spacer"></span>
            <button mat-flat-button class="help-btn" *ngIf="canHelp(req)" (click)="acceptRequest(req)">
               I can help
            </button>
            <button mat-stroked-button color="primary" *ngIf="isMyRequest(req)" [routerLink]="['/chat', req.helper_id]" [disabled]="!req.helper_id" matTooltip="Chat with helper">
               <mat-icon>chat_bubble_outline</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>

        <div *ngIf="requests.length === 0" class="empty-state">
            <div class="empty-illustration">
              <mat-icon>spa</mat-icon>
            </div>
            <h2>Peaceful Neighborhood</h2>
            <p>No help requests at the moment. Check back later!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper { padding: 40px 24px; max-width: 1240px; margin: 0 auto; }
    
    .dashboard-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
    .title-section h1 { font-size: 2.2rem; font-weight: 800; margin: 0; color: var(--text-main); letter-spacing: -0.5px; }
    .title-section p { color: var(--text-muted); margin: 4px 0 0; font-size: 1.1rem; }

    .new-req-btn {
      background: var(--pastel-blue-dark) !important;
      color: #0369a1 !important;
      border-radius: 50px !important;
      font-weight: 600 !important;
      padding: 8px 24px !important;
      display: flex; align-items: center; gap: 8px;
    }

    .stats-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 40px; }
    .stat-card {
      padding: 24px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 20px;
      transition: transform 0.2s ease;
    }
    .stat-card:hover { transform: translateY(-4px); }
    .stat-icon { width: 56px; height: 56px; border-radius: 16px; background: white; display: flex; align-items: center; justify-content: center; }
    .stat-icon mat-icon { font-size: 28px; width: 28px; height: 28px; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.8rem; font-weight: 800; line-height: 1; }
    .stat-label { font-size: 0.9rem; color: var(--text-muted); font-weight: 500; }

    .pastel-blue-bg { background-color: var(--pastel-blue); color: #0369a1; }
    .pastel-mint-bg { background-color: var(--pastel-mint); color: #15803d; }
    .pastel-lavender-bg { background-color: var(--pastel-lavender); color: #7e22ce; }

    .request-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 32px; }
    
    .request-card { position: relative; overflow: hidden; padding-top: 10px; }
    .card-status-bar { position: absolute; top: 0; left: 0; width: 100%; height: 6px; }
    .status-pending { background-color: var(--pastel-peach-dark); }
    .status-accepted { background-color: var(--pastel-blue-dark); }
    .status-completed { background-color: var(--pastel-mint-dark); }

    .user-avatar { display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.2rem; }
    
    mat-card-title { font-weight: 700 !important; font-size: 1.25rem !important; margin-bottom: 4px !important; }
    mat-card-subtitle { display: flex; align-items: center; gap: 4px; font-size: 0.85rem !important; margin-bottom: 16px !important; }
    mat-card-subtitle mat-icon { font-size: 16px; width: 16px; height: 16px; }
    
    .description { color: var(--text-main); line-height: 1.6; margin: 0 0 20px; min-height: 4.8em; }
    
    .badge-row { display: flex; gap: 8px; margin-bottom: 20px; }
    .category-badge { background: #f1f5f9; color: var(--text-muted); padding: 4px 12px; border-radius: 50px; font-size: 0.8rem; font-weight: 600; }
    
    .progress-section { margin-top: 16px; }
    .progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600; margin-bottom: 6px; color: var(--text-muted); }
    
    .card-footer { padding: 16px !important; border-top: 1px solid #f1f5f9; background: #fcfcfc; }
    .requester-info { display: flex; align-items: center; gap: 4px; font-size: 0.85rem; color: var(--text-muted); }
    .requester-info mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .spacer { flex: 1; }
    
    .help-btn { background: var(--pastel-mint-dark) !important; color: #15803d !important; border-radius: 50px !important; font-weight: 600 !important; }

    .empty-state { grid-column: 1 / -1; text-align: center; padding: 80px 0; }
    .empty-illustration { width: 100px; height: 100px; background: var(--pastel-mint); color: #15803d; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
    .empty-illustration mat-icon { font-size: 50px; width: 50px; height: 50px; }
    .empty-state h2 { font-weight: 700; margin: 0; }
    .empty-state p { color: var(--text-muted); }

    @media (max-width: 768px) {
      .stats-row { grid-template-columns: 1fr; }
      .dashboard-header { flex-direction: column; align-items: flex-start; gap: 20px; }
    }
  `]
})
export class RequestListComponent implements OnInit {
  requests: HelpRequest[] = [];
  currentUser: any;

  private requestService = inject(RequestService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadRequests();
  }

  loadRequests() {
    this.requestService.getAllRequests().subscribe({
      next: (data) => this.requests = data,
      error: (err) => console.error(err)
    });
  }

  get isResident() {
    return this.currentUser?.role === 'Resident';
  }

  isMyRequest(req: HelpRequest) {
    return this.currentUser?.id === req.resident_id;
  }

  canHelp(req: HelpRequest) {
    return this.currentUser?.role === 'Helper' && req.status === 'Pending';
  }

  getCountByStatus(status: string) {
    return this.requests.filter(r => r.status === status).length;
  }

  getAvatarColor(id: any) {
    const colors = ['#7dd3fc', '#d8b4fe', '#86efac', '#fdba74', '#94a3b8'];
    return colors[id % colors.length];
  }

  acceptRequest(req: HelpRequest) {
    if (req.id) {
      this.requestService.updateStatus(req.id, 'Accepted').subscribe({
        next: () => {
          this.snackBar.open('Thank you for helping!', 'OK', { duration: 3000 });
          this.loadRequests();
        },
        error: () => this.snackBar.open('Failed to accept request', 'Close', { duration: 3000 })
      });
    }
  }
}

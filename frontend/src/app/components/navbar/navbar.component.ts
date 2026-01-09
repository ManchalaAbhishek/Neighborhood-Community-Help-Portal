import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar class="navbar">
      <div class="nav-container">
        <div class="logo-area" routerLink="/">
          <div class="logo-icon">
            <mat-icon>volunteer_activism</mat-icon>
          </div>
          <span class="logo-text">Neighborly</span>
        </div>
        
        <span class="spacer"></span>
        
        <div class="nav-links">
          <ng-container *ngIf="authService.currentUser$ | async as user; else guestLinks">
            <button mat-button routerLink="/requests" routerLinkActive="active-link">Community Board</button>
            
            <div class="user-profile" [matMenuTriggerFor]="userMenu">
              <span class="user-init">Hi, {{ user.name.split(' ')[0] }}</span>
              <mat-icon iconPositionEnd>expand_more</mat-icon>
            </div>

            <mat-menu #userMenu="matMenu" class="custom-menu">
              <div class="menu-header">
                <p class="menu-name">{{ user.name }}</p>
                <p class="menu-role">{{ user.role }}</p>
              </div>
              <button mat-menu-item routerLink="/requests">
                <mat-icon>assignment</mat-icon> My Requests
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon> Logout
              </button>
            </mat-menu>
          </ng-container>

          <ng-template #guestLinks>
            <button mat-button routerLink="/login">Sign In</button>
            <button mat-flat-button class="cta-button" routerLink="/register">Join Community</button>
          </ng-template>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      background: rgba(255, 255, 255, 0.8) !important;
      backdrop-filter: blur(8px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: 1000;
      height: 72px;
      color: var(--text-main) !important;
    }
    .nav-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      padding: 0 16px;
    }
    .logo-area {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
    .logo-icon {
      background: var(--pastel-blue);
      color: #0369a1;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-text {
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #0369a1, #7e22ce);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .spacer { flex: 1; }
    .nav-links { display: flex; align-items: center; gap: 8px; }
    
    .cta-button {
      background-color: var(--pastel-blue-dark) !important;
      color: #0369a1 !important;
      border-radius: 50px !important;
      font-weight: 600 !important;
      padding: 0 24px !important;
    }
    
    .user-profile {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      background: var(--pastel-lavender);
      border-radius: 50px;
      cursor: pointer;
      margin-left: 12px;
      transition: all 0.2s ease;
    }
    .user-profile:hover { background: var(--pastel-lavender-dark); }
    .user-init { font-weight: 500; font-size: 0.95rem; }

    .menu-header { padding: 16px; min-width: 180px; }
    .menu-name { font-weight: 600; margin: 0; }
    .menu-role { font-size: 0.8rem; color: var(--text-muted); margin: 0; }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

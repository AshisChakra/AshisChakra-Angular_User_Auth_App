import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { User } from '../core/models/models';
import { NotificationService } from '../shared/components/notification/notification.service';

@Component({
  selector: 'app-layout',
  template: `
    <div class="app-container" [class.is-mobile]="mobileQuery">
      <!-- Header -->
      <mat-toolbar color="primary" class="app-header">
        <button mat-icon-button (click)="snav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <h1 class="app-name">Cloud App</h1>
        <span class="spacer"></span>
        
        <!-- User menu -->
        <div *ngIf="currentUser" class="user-menu">
          <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
            <div class="user-avatar" [style.background-image]="'url(' + (currentUser.avatar || 'assets/default-avatar.png') + ')'"></div>
            <span class="user-name">{{ currentUser.name }}</span>
            <mat-icon>arrow_drop_down</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item [routerLink]="['/profile']">
              <mat-icon>person</mat-icon>
              <span>Profile</span>
            </button>
            <button mat-menu-item [routerLink]="['/settings']">
              <mat-icon>settings</mat-icon>
              <span>Settings</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </div>
        
        <!-- Login button if not logged in -->
        <button *ngIf="!currentUser" mat-button [routerLink]="['/auth/login']">
          <mat-icon>login</mat-icon>
          <span>Login</span>
        </button>
      </mat-toolbar>
      
      <!-- Sidenav container -->
      <mat-sidenav-container class="app-sidenav-container"
                            [style.marginTop.px]="mobileQuery ? 56 : 0">
        <!-- Sidenav -->
        <mat-sidenav #snav [mode]="mobileQuery ? 'over' : 'side'"
                    [fixedInViewport]="mobileQuery" fixedTopGap="56"
                    [opened]="!mobileQuery">
          <mat-nav-list>
            <a mat-list-item [routerLink]="['/']" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            <a mat-list-item [routerLink]="['/']" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
              <mat-icon matListItemIcon>home</mat-icon>
              <span matListItemTitle>Home</span>
            </a>
            <a mat-list-item [routerLink]="['/notifications']" routerLinkActive="active-link">
              <mat-icon matListItemIcon>notifications</mat-icon>
              <span matListItemTitle>Notifications</span>
            </a>
            <a mat-list-item [routerLink]="['/profile']" routerLinkActive="active-link">
              <mat-icon matListItemIcon>person</mat-icon>
              <span matListItemTitle>Profile</span>
            </a>
            <a mat-list-item [routerLink]="['/settings']" routerLinkActive="active-link">
              <mat-icon matListItemIcon>settings</mat-icon>
              <span matListItemTitle>Settings</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>
        
        <!-- Main content -->
        <mat-sidenav-content>
          <div class="app-content">
            <!-- Router outlet for page content -->
            <router-outlet></router-outlet>
          </div>
          
          <!-- Footer -->
          <footer class="app-footer">
            <div class="footer-content">
              <p>&copy; 2025 Cloud App. All rights reserved.</p>
            </div>
          </footer>
        </mat-sidenav-content>
      </mat-sidenav-container>
      
      <!-- Notification component removed to avoid duplicate notifications -->
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    
    .app-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 2;
    }
    
    .app-name {
      margin-left: 8px;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .user-menu {
      display: flex;
      align-items: center;
    }
    
    .user-button {
      display: flex;
      align-items: center;
    }
    
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      margin-right: 8px;
    }
    
    .user-name {
      margin-right: 4px;
    }
    
    .app-sidenav-container {
      flex: 1;
    }
    
    .app-content {
      min-height: calc(100vh - 120px);
      padding: 20px;
      padding-top: 76px;
    }
    
    .app-footer {
      background-color: #f5f5f5;
      padding: 16px;
      text-align: center;
      color: #666;
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .active-link {
      background-color: rgba(0, 0, 0, 0.04);
    }
    
    /* Component Showcase Styles */
    .nav-divider {
      margin: 16px 0;
    }
    
    .nav-section-title {
      padding: 16px 16px 8px;
      color: rgba(0, 0, 0, 0.6);
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .notification-panel {
      padding: 16px;
      background-color: #f5f5f5;
      border-top: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .notification-panel h3 {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.87);
    }
    
    .notification-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .notification-buttons button {
      justify-content: flex-start;
    }
    
    .notification-buttons mat-icon {
      margin-right: 8px;
    }
    
    /* Mobile styles */
    .is-mobile .app-header {
      position: fixed;
    }
    
    .is-mobile .app-content {
      padding-top: 56px;
    }
    
    @media (max-width: 600px) {
      .user-name {
        display: none;
      }
    }
  `]
})
export class LayoutComponent implements OnInit {
  mobileQuery: boolean = false;
  currentUser: User | null = null;
  showNotificationPanel: boolean = false;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    // Check if screen width is less than 768px for mobile view
    this.mobileQuery = window.innerWidth < 768;
    
    // Listen for window resize events
    window.addEventListener('resize', () => {
      this.mobileQuery = window.innerWidth < 768;
    });
  }

  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
  
  toggleNotificationPanel(): void {
    this.showNotificationPanel = !this.showNotificationPanel;
  }
  
  showSuccessNotification(): void {
    this.notificationService.success('This is a success notification');
  }
  
  showErrorNotification(): void {
    this.notificationService.error('This is an error notification');
  }
  
  showInfoNotification(): void {
    this.notificationService.info('This is an info notification');
  }
}

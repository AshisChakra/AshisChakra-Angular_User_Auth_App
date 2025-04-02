import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { User, Profile } from '../../core/models/models';
import { NotificationService } from '../../shared/components/notification/notification.service';

@Component({
  selector: 'app-profile',
  template: `
    <div class="container">
      <h1 class="page-title">User Profile</h1>
      
      <div class="profile-page">
        <app-user-profile 
          [userId]="currentUserId" 
          [editable]="true"
          (profileUpdated)="onProfileUpdated($event)">
        </app-user-profile>
        
        <div class="profile-info-card">
          <mat-card>
            <mat-card-header>
              <mat-icon mat-card-avatar>info</mat-icon>
              <mat-card-title>About User Profiles</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>
                This page demonstrates the User Profile component, which allows viewing and editing user information.
              </p>
              <p>
                The component supports:
              </p>
              <ul>
                <li>Displaying user data (name, email, avatar)</li>
                <li>Editing profile information</li>
                <li>Form validation</li>
                <li>Responsive design</li>
              </ul>
              <p>
                In a real application, changes would be saved to a backend API.
                For this demo, changes are stored in memory only.
              </p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="mt-3">
            <mat-card-header>
              <mat-icon mat-card-avatar>security</mat-icon>
              <mat-card-title>Protected Route</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>
                This page is protected by the AuthGuard and requires authentication to access.
                If you're seeing this page, you're successfully logged in.
              </p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="warn" (click)="logout()">LOGOUT</button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-title {
      margin-bottom: 24px;
      color: #333;
    }
    
    .profile-page {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }
    
    .profile-info-card {
      display: flex;
      flex-direction: column;
    }
    
    .mt-3 {
      margin-top: 24px;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .profile-page {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  currentUserId: number = 1; // Default to user ID 1 for demo
  
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // In a real app, you would get the current user ID from the auth service
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.currentUserId = currentUser.id;
    }
  }

  onProfileUpdated(data: {user: User, profile: Profile}): void {
    this.notificationService.success('Profile updated successfully');
    console.log('Profile updated:', data);
  }

  logout(): void {
    this.authService.logout();
    this.notificationService.info('You have been logged out');
    // Navigate to login page is handled by the auth guard
  }
}

import { Component } from '@angular/core';
import { NotificationService } from '../../../shared/components/notification/notification.service';

@Component({
  selector: 'app-notifications',
  template: `
    <div class="container">
      <h1 class="page-title">Notifications</h1>
      
      <div class="notification-demo">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Notification Types</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>
              The notification component displays success, error, and info messages.
              It supports auto-dismissal and can be triggered from anywhere in the application.
            </p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="showSuccessNotification()">
              <mat-icon>check_circle</mat-icon> Success
            </button>
            <button mat-raised-button color="warn" (click)="showErrorNotification()">
              <mat-icon>error</mat-icon> Error
            </button>
            <button mat-raised-button (click)="showInfoNotification()">
              <mat-icon>info</mat-icon> Info
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .page-title {
      margin-bottom: 24px;
      color: #333;
    }
    
    .notification-demo {
      margin-top: 20px;
    }
    
    mat-card-actions {
      display: flex;
      gap: 10px;
      padding: 16px;
    }
    
    button mat-icon {
      margin-right: 8px;
    }
  `]
})
export class NotificationsComponent {
  constructor(private notificationService: NotificationService) {}
  
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

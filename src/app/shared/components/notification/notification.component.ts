import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NotificationService } from './notification.service';
import { Notification } from '../../../core/models/models';

@Component({
  selector: 'app-notification',
  template: `
    <div class="notification-container">
      <div *ngFor="let notification of notifications"
           [@notificationAnimation]="notification.state"
           class="notification"
           [ngClass]="'notification-' + notification.type">
        <div class="notification-content">
          <mat-icon *ngIf="notification.type === 'success'">check_circle</mat-icon>
          <mat-icon *ngIf="notification.type === 'error'">error</mat-icon>
          <mat-icon *ngIf="notification.type === 'info'">info</mat-icon>
          <span class="notification-message">{{ notification.message }}</span>
        </div>
        <button *ngIf="notification.dismissible" 
                mat-icon-button 
                class="notification-close"
                (click)="dismiss(notification)">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    }
    
    .notification {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      color: white;
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .notification-message {
      font-size: 14px;
    }
    
    .notification-success {
      background-color: #4caf50;
    }
    
    .notification-error {
      background-color: #f44336;
    }
    
    .notification-info {
      background-color: #2196f3;
    }
    
    .notification-close {
      color: white;
    }
    
    @media (max-width: 480px) {
      .notification-container {
        left: 20px;
        right: 20px;
      }
    }
  `],
  animations: [
    trigger('notificationAnimation', [
      state('visible', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      state('hidden', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      transition('hidden => visible', [
        animate('300ms ease-out')
      ]),
      transition('visible => hidden', [
        animate('300ms ease-in')
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Array<Notification & { state: string }> = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.notificationService.notifications$.subscribe(notification => {
        this.addNotification(notification);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addNotification(notification: Notification): void {
    // Add state property for animation
    const newNotification = { ...notification, state: 'hidden' };
    this.notifications.push(newNotification);
    
    // Trigger animation
    setTimeout(() => {
      const index = this.notifications.findIndex(n => n.id === notification.id);
      if (index !== -1) {
        this.notifications[index].state = 'visible';
      }
    }, 10);
    
    // Auto-dismiss after duration if specified
    if (notification.duration) {
      setTimeout(() => {
        this.dismiss(newNotification);
      }, notification.duration);
    }
  }

  dismiss(notification: Notification & { state: string }): void {
    const index = this.notifications.findIndex(n => n.id === notification.id);
    if (index !== -1) {
      // Trigger exit animation
      this.notifications[index].state = 'hidden';
      
      // Remove from array after animation completes
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
      }, 300);
    }
  }
}

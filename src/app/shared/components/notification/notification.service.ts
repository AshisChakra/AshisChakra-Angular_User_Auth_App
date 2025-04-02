import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { Notification } from '../../../core/models/models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();

  constructor(private snackBar: MatSnackBar) { }

  // Show a success notification
  success(message: string, duration: number = 3000): void {
    this.showNotification({
      id: Date.now(),
      type: 'success',
      message,
      duration,
      dismissible: true
    });
  }

  // Show an error notification
  error(message: string, duration: number = 5000): void {
    this.showNotification({
      id: Date.now(),
      type: 'error',
      message,
      duration,
      dismissible: true
    });
  }

  // Show an info notification
  info(message: string, duration: number = 3000): void {
    this.showNotification({
      id: Date.now(),
      type: 'info',
      message,
      duration,
      dismissible: true
    });
  }

  // Show a notification using MatSnackBar
  private showNotification(notification: Notification): void {
    // Only show a snackbar for immediate feedback (removed the subject emission)
    let panelClass: string[] = [];
    
    // Set panel class based on notification type
    switch(notification.type) {
      case 'success':
        panelClass = ['mat-snackbar-success'];
        break;
      case 'error':
        panelClass = ['mat-snackbar-error'];
        break;
      case 'info':
        panelClass = ['mat-snackbar-info'];
        break;
      default:
        panelClass = [];
    }
    
    this.snackBar.open(notification.message, 'Close', {
      duration: notification.duration,
      panelClass: panelClass,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  // Clear all notifications
  clear(): void {
    this.snackBar.dismiss();
  }
}

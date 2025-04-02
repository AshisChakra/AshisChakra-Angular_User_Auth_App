import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../shared/components/notification/notification.service';

@Component({
  selector: 'app-settings',
  template: `
    <div class="container">
      <h1 class="page-title">Settings</h1>
      
      <div class="settings-container">
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>notifications</mat-icon>
            <mat-card-title>Notification Settings</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="notificationForm">
              <h3>Email Notifications</h3>
              <div class="settings-section">
                <mat-slide-toggle formControlName="emailNotifications" color="primary">
                  Enable email notifications
                </mat-slide-toggle>
                
                <div *ngIf="notificationForm.get('emailNotifications')?.value" class="settings-subsection">
                  <mat-checkbox formControlName="emailUpdates" color="primary">
                    Product updates
                  </mat-checkbox>
                  
                  <mat-checkbox formControlName="emailNews" color="primary">
                    News and announcements
                  </mat-checkbox>
                  
                  <mat-checkbox formControlName="emailSecurity" color="primary">
                    Security alerts
                  </mat-checkbox>
                </div>
              </div>
              
              <h3>Push Notifications</h3>
              <div class="settings-section">
                <mat-slide-toggle formControlName="pushNotifications" color="primary">
                  Enable push notifications
                </mat-slide-toggle>
                
                <div *ngIf="notificationForm.get('pushNotifications')?.value" class="settings-subsection">
                  <mat-checkbox formControlName="pushUpdates" color="primary">
                    Product updates
                  </mat-checkbox>
                  
                  <mat-checkbox formControlName="pushNews" color="primary">
                    News and announcements
                  </mat-checkbox>
                  
                  <mat-checkbox formControlName="pushSecurity" color="primary">
                    Security alerts
                  </mat-checkbox>
                </div>
              </div>
            </form>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-button (click)="resetNotificationSettings()">RESET</button>
            <button mat-raised-button color="primary" (click)="saveNotificationSettings()">SAVE</button>
          </mat-card-actions>
        </mat-card>
        
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>palette</mat-icon>
            <mat-card-title>Display Settings</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="displayForm">
              <h3>Theme</h3>
              <div class="settings-section">
                <mat-radio-group formControlName="theme" class="theme-radio-group">
                  <mat-radio-button value="light" color="primary">Light</mat-radio-button>
                  <mat-radio-button value="dark" color="primary">Dark</mat-radio-button>
                  <mat-radio-button value="system" color="primary">System default</mat-radio-button>
                </mat-radio-group>
              </div>
              
              <h3>Font Size</h3>
              <div class="settings-section">
                <mat-form-field appearance="outline" class="font-size-select">
                  <mat-label>Font Size</mat-label>
                  <mat-select formControlName="fontSize">
                    <mat-option value="small">Small</mat-option>
                    <mat-option value="medium">Medium</mat-option>
                    <mat-option value="large">Large</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
              
              <h3>Animations</h3>
              <div class="settings-section">
                <mat-slide-toggle formControlName="animations" color="primary">
                  Enable animations
                </mat-slide-toggle>
              </div>
            </form>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-button (click)="resetDisplaySettings()">RESET</button>
            <button mat-raised-button color="primary" (click)="saveDisplaySettings()">SAVE</button>
          </mat-card-actions>
        </mat-card>
        
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>security</mat-icon>
            <mat-card-title>Security Settings</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="securityForm">
              <h3>Two-Factor Authentication</h3>
              <div class="settings-section">
                <mat-slide-toggle formControlName="twoFactorAuth" color="primary">
                  Enable two-factor authentication
                </mat-slide-toggle>
                
                <div *ngIf="securityForm.get('twoFactorAuth')?.value" class="settings-subsection">
                  <p>Two-factor authentication is enabled. You'll receive a verification code when signing in.</p>
                </div>
              </div>
              
              <h3>Session Management</h3>
              <div class="settings-section">
                <mat-form-field appearance="outline" class="session-timeout-select">
                  <mat-label>Session Timeout</mat-label>
                  <mat-select formControlName="sessionTimeout">
                    <mat-option value="15">15 minutes</mat-option>
                    <mat-option value="30">30 minutes</mat-option>
                    <mat-option value="60">1 hour</mat-option>
                    <mat-option value="120">2 hours</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </form>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-button (click)="resetSecuritySettings()">RESET</button>
            <button mat-raised-button color="primary" (click)="saveSecuritySettings()">SAVE</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page-title {
      margin-bottom: 24px;
      color: #333;
    }
    
    .settings-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      max-width: 800px;
    }
    
    .settings-card {
      margin-bottom: 16px;
    }
    
    .settings-section {
      margin-bottom: 24px;
    }
    
    .settings-subsection {
      margin-top: 16px;
      margin-left: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    h3 {
      margin-bottom: 16px;
      color: #555;
      font-weight: 500;
    }
    
    .theme-radio-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .font-size-select, .session-timeout-select {
      width: 100%;
      max-width: 300px;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .settings-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  notificationForm!: FormGroup;
  displayForm!: FormGroup;
  securityForm!: FormGroup;
  
  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    // Notification settings form
    this.notificationForm = this.formBuilder.group({
      emailNotifications: [true],
      emailUpdates: [true],
      emailNews: [false],
      emailSecurity: [true],
      pushNotifications: [true],
      pushUpdates: [true],
      pushNews: [true],
      pushSecurity: [true]
    });
    
    // Display settings form
    this.displayForm = this.formBuilder.group({
      theme: ['light'],
      fontSize: ['medium'],
      animations: [true]
    });
    
    // Security settings form
    this.securityForm = this.formBuilder.group({
      twoFactorAuth: [false],
      sessionTimeout: ['30']
    });
  }

  saveNotificationSettings(): void {
    if (this.notificationForm.valid) {
      // In a real app, you would save these settings to a backend
      console.log('Notification settings:', this.notificationForm.value);
      this.notificationService.success('Notification settings saved');
    }
  }

  resetNotificationSettings(): void {
    this.notificationForm.patchValue({
      emailNotifications: true,
      emailUpdates: true,
      emailNews: false,
      emailSecurity: true,
      pushNotifications: true,
      pushUpdates: true,
      pushNews: true,
      pushSecurity: true
    });
    this.notificationService.info('Notification settings reset to defaults');
  }

  saveDisplaySettings(): void {
    if (this.displayForm.valid) {
      // In a real app, you would save these settings to a backend
      console.log('Display settings:', this.displayForm.value);
      this.notificationService.success('Display settings saved');
      
      // Apply theme changes (in a real app)
      const theme = this.displayForm.get('theme')?.value;
      console.log(`Applying ${theme} theme`);
    }
  }

  resetDisplaySettings(): void {
    this.displayForm.patchValue({
      theme: 'light',
      fontSize: 'medium',
      animations: true
    });
    this.notificationService.info('Display settings reset to defaults');
  }

  saveSecuritySettings(): void {
    if (this.securityForm.valid) {
      // In a real app, you would save these settings to a backend
      console.log('Security settings:', this.securityForm.value);
      this.notificationService.success('Security settings saved');
    }
  }

  resetSecuritySettings(): void {
    this.securityForm.patchValue({
      twoFactorAuth: false,
      sessionTimeout: '30'
    });
    this.notificationService.info('Security settings reset to defaults');
  }
}

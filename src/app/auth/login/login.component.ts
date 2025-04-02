import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/components/notification/notification.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Login</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-field">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" placeholder="Enter your email" type="email">
                <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                  Please enter a valid email address
                </mat-error>
              </mat-form-field>
            </div>
            
            <div class="form-field">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <input matInput formControlName="password" placeholder="Enter your password" [type]="hidePassword ? 'password' : 'text'">
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                  <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                  Password is required
                </mat-error>
              </mat-form-field>
            </div>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid || isLoading" class="login-button">
                <mat-spinner *ngIf="isLoading" diameter="20" class="spinner"></mat-spinner>
                <span *ngIf="!isLoading">Login</span>
              </button>
            </div>
          </form>
        </mat-card-content>
        
        <mat-card-footer class="login-footer">
          <p>Demo credentials: admin@example.com / password</p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    
    .login-card {
      max-width: 400px;
      width: 100%;
      padding: 20px;
    }
    
    .form-field {
      margin-bottom: 20px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
    
    .login-button {
      min-width: 120px;
      position: relative;
    }
    
    .spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    
    .login-footer {
      text-align: center;
      padding: 16px;
      color: #666;
      font-size: 14px;
    }
    
    @media (max-width: 480px) {
      .login-card {
        max-width: 100%;
        margin: 0 16px;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  returnUrl: string = '/';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // Initialize the login form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Auto-fill demo credentials for convenience
    this.loginForm.patchValue({
      email: 'admin@example.com',
      password: 'password'
    });
  }

  onSubmit(): void {
    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials)
      .subscribe(
        user => {
          this.notificationService.success('Login successful');
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.notificationService.error(error.message || 'Login failed');
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, Profile } from '../../../core/models/models';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile-container" *ngIf="user">
      <mat-card class="profile-card">
        <mat-card-header>
          <div mat-card-avatar class="profile-avatar" 
               [style.background-image]="'url(' + (user.avatar || 'assets/default-avatar.png') + ')'">
          </div>
          <mat-card-title>{{ user.name }}</mat-card-title>
          <mat-card-subtitle>{{ user.email }}</mat-card-subtitle>
          <span class="spacer"></span>
          <button mat-icon-button color="primary" (click)="toggleEditMode()" *ngIf="editable && !editMode">
            <mat-icon>edit</mat-icon>
          </button>
        </mat-card-header>
        
        <mat-card-content>
          <!-- View Mode -->
          <div *ngIf="!editMode" class="profile-details">
            <div class="profile-section">
              <h3>Bio</h3>
              <p>{{ profile?.bio || 'No bio provided' }}</p>
            </div>
            
            <div class="profile-section">
              <h3>Location</h3>
              <p>{{ profile?.location || 'No location provided' }}</p>
            </div>
            
            <div class="profile-section" *ngIf="profile?.website">
              <h3>Website</h3>
              <p><a [href]="profile?.website || ''" target="_blank">{{ profile?.website }}</a></p>
            </div>
            
            <div class="profile-section" *ngIf="profile?.socialLinks">
              <h3>Social Links</h3>
              <div class="social-links">
                <a *ngIf="profile?.socialLinks?.twitter" [href]="profile?.socialLinks?.twitter || ''" target="_blank" class="social-link">
                  <mat-icon>link</mat-icon> Twitter
                </a>
                <a *ngIf="profile?.socialLinks?.facebook" [href]="profile?.socialLinks?.facebook || ''" target="_blank" class="social-link">
                  <mat-icon>link</mat-icon> Facebook
                </a>
                <a *ngIf="profile?.socialLinks?.linkedin" [href]="profile?.socialLinks?.linkedin || ''" target="_blank" class="social-link">
                  <mat-icon>link</mat-icon> LinkedIn
                </a>
              </div>
            </div>
          </div>
          
          <!-- Edit Mode -->
          <form *ngIf="editMode" [formGroup]="profileForm" class="profile-form">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Name</mat-label>
                <input matInput formControlName="name" placeholder="Your name">
                <mat-error *ngIf="profileForm.get('name')?.hasError('required')">
                  Name is required
                </mat-error>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Bio</mat-label>
                <textarea matInput formControlName="bio" placeholder="Tell us about yourself" rows="3"></textarea>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Location</mat-label>
                <input matInput formControlName="location" placeholder="Your location">
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Website</mat-label>
                <input matInput formControlName="website" placeholder="Your website URL">
                <mat-error *ngIf="profileForm.get('website')?.hasError('pattern')">
                  Please enter a valid URL
                </mat-error>
              </mat-form-field>
            </div>
            
            <h3>Social Links</h3>
            
            <div formGroupName="socialLinks">
              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Twitter</mat-label>
                  <input matInput formControlName="twitter" placeholder="Twitter profile URL">
                  <mat-error *ngIf="profileForm.get('socialLinks.twitter')?.hasError('pattern')">
                    Please enter a valid URL
                  </mat-error>
                </mat-form-field>
              </div>
              
              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>LinkedIn</mat-label>
                  <input matInput formControlName="linkedin" placeholder="LinkedIn profile URL">
                  <mat-error *ngIf="profileForm.get('socialLinks.linkedin')?.hasError('pattern')">
                    Please enter a valid URL
                  </mat-error>
                </mat-form-field>
              </div>
            </div>
          </form>
        </mat-card-content>
        
        <mat-card-actions *ngIf="editMode" align="end">
          <button mat-button (click)="cancelEdit()">CANCEL</button>
          <button mat-raised-button color="primary" 
                  [disabled]="profileForm.invalid || isLoading"
                  (click)="saveProfile()">
            <mat-icon *ngIf="isLoading">
              <mat-spinner diameter="20" color="accent"></mat-spinner>
            </mat-icon>
            <span *ngIf="!isLoading">SAVE</span>
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
    
    <div *ngIf="!user && !isLoading" class="profile-not-found">
      <mat-icon>person_off</mat-icon>
      <p>User profile not found</p>
    </div>
    
    <div *ngIf="isLoading" class="profile-loading">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .profile-card {
      margin-bottom: 20px;
    }
    
    .profile-avatar {
      background-size: cover;
      background-position: center;
    }
    
    .profile-details {
      padding: 16px 0;
    }
    
    .profile-section {
      margin-bottom: 24px;
    }
    
    .profile-section h3 {
      margin-bottom: 8px;
      color: #555;
      font-weight: 500;
    }
    
    .social-links {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .social-link {
      display: flex;
      align-items: center;
      gap: 4px;
      text-decoration: none;
      color: #1976d2;
    }
    
    .profile-form {
      padding: 16px 0;
    }
    
    .form-row {
      margin-bottom: 16px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .profile-not-found, .profile-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #888;
    }
    
    .profile-not-found mat-icon, .profile-loading mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .profile-container {
        padding: 0 16px;
      }
    }
  `]
})
export class UserProfileComponent implements OnInit {
  @Input() userId!: number;
  @Input() editable: boolean = false;
  
  @Output() profileUpdated = new EventEmitter<{user: User, profile: Profile}>();
  
  user: User | null = null;
  profile: Profile | null = null;
  editMode: boolean = false;
  isLoading: boolean = false;
  profileForm!: FormGroup;
  
  private urlPattern = '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$';
  
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) { }
  
  ngOnInit(): void {
    this.initForm();
    this.loadUserData();
  }
  
  ngOnChanges(): void {
    if (this.userId) {
      this.loadUserData();
    }
  }
  
  initForm(): void {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      bio: [''],
      location: [''],
      website: ['', Validators.pattern(this.urlPattern)],
      socialLinks: this.formBuilder.group({
        twitter: ['', Validators.pattern(this.urlPattern)],
        facebook: ['', Validators.pattern(this.urlPattern)],
        linkedin: ['', Validators.pattern(this.urlPattern)]
      })
    });
  }
  
  loadUserData(): void {
    if (!this.userId) return;
    
    this.isLoading = true;
    
    // For demo purposes, we'll use the mock API
    this.apiService.getMockUser(this.userId).subscribe(
      user => {
        this.user = user;
        
        // Load profile data
        this.apiService.getMockProfile(this.userId).subscribe(
          profile => {
            this.profile = profile;
            this.updateForm();
            this.isLoading = false;
          },
          error => {
            this.notificationService.error('Failed to load profile data');
            this.isLoading = false;
          }
        );
      },
      error => {
        this.notificationService.error('Failed to load user data');
        this.isLoading = false;
      }
    );
  }
  
  updateForm(): void {
    if (this.user && this.profile) {
      this.profileForm.patchValue({
        name: this.user.name,
        bio: this.profile.bio,
        location: this.profile.location,
        website: this.profile.website,
        socialLinks: {
          twitter: this.profile.socialLinks?.twitter || '',
          facebook: this.profile.socialLinks?.facebook || '',
          linkedin: this.profile.socialLinks?.linkedin || ''
        }
      });
    }
  }
  
  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.updateForm();
    }
  }
  
  cancelEdit(): void {
    this.editMode = false;
    this.updateForm(); // Reset form to original values
  }
  
  saveProfile(): void {
    if (this.profileForm.invalid) return;
    
    this.isLoading = true;
    
    const formValues = this.profileForm.value;
    
    // Update user data
    if (this.user) {
      const updatedUser: User = {
        ...this.user,
        name: formValues.name
      };
      
      // Update profile data
      const updatedProfile: Profile = {
        userId: this.userId,
        bio: formValues.bio,
        location: formValues.location,
        website: formValues.website,
        socialLinks: {
          twitter: formValues.socialLinks.twitter,
          facebook: formValues.socialLinks.facebook,
          linkedin: formValues.socialLinks.linkedin
        }
      };
      
      // For demo purposes, we'll simulate a successful update
      setTimeout(() => {
        this.user = updatedUser;
        this.profile = updatedProfile;
        this.isLoading = false;
        this.editMode = false;
        this.notificationService.success('Profile updated successfully');
        this.profileUpdated.emit({ user: updatedUser, profile: updatedProfile });
      }, 1000);
      
      // In a real app, you would call the API service to update the data
      // this.apiService.updateUser(updatedUser).subscribe(...);
      // this.apiService.updateProfile(updatedProfile).subscribe(...);
    }
  }
}

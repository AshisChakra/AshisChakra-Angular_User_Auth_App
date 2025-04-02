import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { TableData } from '../../core/models/models';
import { NotificationService } from '../../shared/components/notification/notification.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="container">
      <h1 class="page-title">Dashboard</h1>
      
      <div class="dashboard-cards">
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>people</mat-icon>
            <mat-card-title>Users</mat-card-title>
            <mat-card-subtitle>Total registered users</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="card-value">3</div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>table_chart</mat-icon>
            <mat-card-title>Data Records</mat-card-title>
            <mat-card-subtitle>Total data entries</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="card-value">{{tableData.length}}</div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>notifications</mat-icon>
            <mat-card-title>Notifications</mat-card-title>
            <mat-card-subtitle>Active notifications</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="card-value">5</div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <div class="dashboard-section">
        <h2>Recent Data</h2>
        <app-data-table
          [data]="tableData"
          [isLoading]="isLoading"
          [showActions]="true"
          (rowClick)="onRowClick($event)"
          (viewClick)="onViewClick($event)"
          (editClick)="onEditClick($event)"
          (deleteClick)="onDeleteClick($event)"
          (refresh)="refreshTable()">
        </app-data-table>
      </div>
    </div>
  `,
  styles: [`
    .page-title {
      margin-bottom: 24px;
      color: #333;
    }
    
    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }
    
    .dashboard-card {
      height: 100%;
    }
    
    .card-value {
      font-size: 48px;
      font-weight: 300;
      text-align: center;
      padding: 24px 0;
      color: #1976d2;
    }
    
    .dashboard-section {
      margin-bottom: 32px;
    }
    
    .dashboard-section h2 {
      margin-bottom: 16px;
      color: #555;
      font-weight: 500;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .dashboard-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  tableData: TableData[] = [];
  isLoading: boolean = false;
  
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadTableData();
  }

  loadTableData(): void {
    this.isLoading = true;
    
    this.apiService.getMockTableData(0, 20).subscribe(
      data => {
        this.tableData = data;
        this.isLoading = false;
      },
      error => {
        this.notificationService.error('Failed to load table data');
        this.isLoading = false;
      }
    );
  }

  onRowClick(row: any): void {
    console.log('Row clicked:', row);
  }
  
  onEditClick(row: any): void {
    console.log('Edit clicked:', row);
    this.notificationService.info(`Editing record: ${row.name}`);
    
    // Mock implementation for demo
    setTimeout(() => {
      row.status = row.status === 'Active' ? 'Inactive' : 'Active';
      this.notificationService.success(`Record ${row.id} updated successfully`);
    }, 1000);
  }
  
  onDeleteClick(row: any): void {
    console.log('Delete clicked:', row);
    this.notificationService.info(`Deleting record: ${row.name}`);
    
    // Mock implementation for demo
    setTimeout(() => {
      this.tableData = this.tableData.filter(item => item.id !== row.id);
      this.notificationService.success(`Record ${row.id} deleted successfully`);
    }, 1000);
  }
  
  onViewClick(row: any): void {
    console.log('View clicked:', row);
    this.notificationService.info(`Viewing details for: ${row.name}`);
  }

  refreshTable(): void {
    this.loadTableData();
    this.notificationService.info('Table data refreshed');
  }
}

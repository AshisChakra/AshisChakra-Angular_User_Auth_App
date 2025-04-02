import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-data-table',
  template: `
    <div class="simple-table-container">
      <!-- Loading indicator -->
      <div *ngIf="isLoading" class="loading-indicator">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
      
      <!-- Filter -->
      <div class="filter-container">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Filter</mat-label>
          <input matInput [formControl]="filterControl" placeholder="Search...">
          <button *ngIf="filterControl.value" matSuffix mat-icon-button aria-label="Clear" (click)="clearFilter()">
            <mat-icon>close</mat-icon>
          </button>
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
      </div>
      
      <!-- Simple Table -->
      <div class="table-wrapper mat-elevation-z2">
        <table mat-table [dataSource]="dataSource" class="simple-table">
          
          <!-- ID Column -->
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let row">{{row.id}}</td>
          </ng-container>
          
          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let row">{{row.name}}</td>
          </ng-container>
          
          <!-- Category Column -->
          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let row">{{row.category}}</td>
          </ng-container>
          
          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let row">
              <span [ngClass]="getStatusClass(row.status)">{{row.status}}</span>
            </td>
          </ng-container>
          
          <!-- Amount Column -->
          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef>Amount ($)</th>
            <td mat-cell *matCellDef="let row">{{row.amount}}</td>
          </ng-container>
          
          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let row">
              <button mat-icon-button color="primary" (click)="onView(row); $event.stopPropagation()">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button color="accent" (click)="onEdit(row); $event.stopPropagation()">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="onDelete(row); $event.stopPropagation()">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;" 
              (click)="onRowClick(row)"
              [class.selected-row]="selectedRow === row"></tr>
          
          <!-- Row shown when there is no data -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell no-data-cell" [attr.colspan]="columns.length">
              No data available
            </td>
          </tr>
        </table>
      </div>
      
      <!-- Refresh Button -->
      <div class="table-actions">
        <button mat-button color="primary" (click)="refresh.emit()">
          <mat-icon>refresh</mat-icon> Refresh Data
        </button>
      </div>
    </div>
  `,
  styles: [`
    .simple-table-container {
      margin: 20px 0;
    }
    
    .filter-container {
      margin-bottom: 16px;
    }
    
    .filter-field {
      width: 100%;
      max-width: 500px;
    }
    
    .table-wrapper {
      overflow-x: auto;
      border-radius: 4px;
    }
    
    .simple-table {
      width: 100%;
    }
    
    .loading-indicator {
      display: flex;
      justify-content: center;
      margin: 20px 0;
    }
    
    .selected-row {
      background-color: rgba(0, 0, 0, 0.04);
    }
    
    tr.mat-row:hover {
      background-color: rgba(0, 0, 0, 0.04);
      cursor: pointer;
    }
    
    .table-actions {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
    
    .no-data-cell {
      padding: 16px;
      text-align: center;
      font-style: italic;
      color: rgba(0, 0, 0, 0.54);
    }
    
    /* Status styling */
    .status-active {
      color: #4caf50;
      font-weight: 500;
    }
    
    .status-inactive {
      color: #f44336;
      font-weight: 500;
    }
    
    .status-pending {
      color: #ff9800;
      font-weight: 500;
    }
  `]
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() showActions: boolean = true;
  
  @Output() rowClick = new EventEmitter<any>();
  @Output() viewClick = new EventEmitter<any>();
  @Output() editClick = new EventEmitter<any>();
  @Output() deleteClick = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<void>();
  
  dataSource = new MatTableDataSource<any>([]);
  selectedRow: any = null;
  columns: string[] = ['id', 'name', 'category', 'status', 'amount'];
  filterControl = new FormControl('');
  
  ngOnInit(): void {
    this.updateTable();
    
    // Add actions column if needed
    if (this.showActions && !this.columns.includes('actions')) {
      this.columns.push('actions');
    }
    
    // Set up filter listener
    this.filterControl.valueChanges.subscribe(filterValue => {
      this.applyFilter(filterValue || '');
    });
    
    // Set up custom filter predicate
    this.dataSource.filterPredicate = this.createFilterPredicate();
  }
  
  ngOnChanges(): void {
    this.updateTable();
  }
  
  updateTable(): void {
    if (this.data) {
      this.dataSource.data = this.data;
    }
  }
  
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  clearFilter(): void {
    this.filterControl.setValue('');
  }
  
  createFilterPredicate(): (data: any, filter: string) => boolean {
    return (data: any, filter: string): boolean => {
      // Get all properties of the data object
      const dataStr = Object.keys(data)
        .reduce((currentTerm: string, key: string) => {
          // Use only string and number properties for filtering
          const val = data[key];
          if (val !== null && val !== undefined) {
            if (typeof val === 'string' || typeof val === 'number') {
              return currentTerm + val.toString().toLowerCase() + ' ';
            }
          }
          return currentTerm;
        }, '')
        .trim()
        .toLowerCase();
      
      // Match if the filter is found in the string
      return dataStr.indexOf(filter) !== -1;
    };
  }
  
  onRowClick(row: any): void {
    this.selectedRow = row;
    this.rowClick.emit(row);
  }
  
  onView(row: any): void {
    this.viewClick.emit(row);
  }
  
  onEdit(row: any): void {
    this.editClick.emit(row);
  }
  
  onDelete(row: any): void {
    this.deleteClick.emit(row);
  }
  
  getStatusClass(status: string): string {
    switch(status.toLowerCase()) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'pending': return 'status-pending';
      default: return '';
    }
  }
}

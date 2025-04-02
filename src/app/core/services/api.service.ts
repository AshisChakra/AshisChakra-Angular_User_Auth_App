import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, tap, map } from 'rxjs/operators';
import { User, Profile, TableData } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'; // json-server URL

  constructor(private http: HttpClient) { }

  // User related API calls
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      catchError(this.handleError<User[]>('getUsers', []))
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
      catchError(this.handleError<User>('getUser'))
    );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${user.id}`, user).pipe(
      catchError(this.handleError<User>('updateUser'))
    );
  }

  // Profile related API calls
  getProfile(userId: number): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/profiles?userId=${userId}`).pipe(
      catchError(this.handleError<Profile>('getProfile'))
    );
  }

  updateProfile(profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}/profiles/${profile.userId}`, profile).pipe(
      catchError(this.handleError<Profile>('updateProfile'))
    );
  }

  // Table data related API calls
  getTableData(page: number = 0, pageSize: number = 10, sortField: string = '', sortDirection: string = ''): Observable<TableData[]> {
    let url = `${this.apiUrl}/tableData?_page=${page + 1}&_limit=${pageSize}`;
    
    if (sortField && sortDirection) {
      url += `&_sort=${sortField}&_order=${sortDirection}`;
    }
    
    return this.http.get<TableData[]>(url).pipe(
      catchError(this.handleError<TableData[]>('getTableData', []))
    );
  }

  getTableDataCount(): Observable<number> {
    return this.http.get<TableData[]>(`${this.apiUrl}/tableData`).pipe(
      tap(data => console.log(`Total records: ${data.length}`)),
      catchError(this.handleError<TableData[]>('getTableDataCount', [])),
      // Map the array to its length
      map(data => data.length)
    );
  }

  // Mock API for demonstration purposes
  // In a real application, these would be actual API calls
  getMockUsers(): Observable<User[]> {
    const mockUsers: User[] = [
      { id: 1, name: 'Ashis Chakraborty', email: 'achakraborty169@gmail.com', avatar: 'https://i.pravatar.cc/150?img=1', role: 'Admin' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=5', role: 'User' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', avatar: 'https://i.pravatar.cc/150?img=8', role: 'User' }
    ];
    return of(mockUsers).pipe(delay(500)); // Simulate network delay
  }

  getMockUser(id: number): Observable<User> {
    const mockUser: User = { 
      id: id, 
      name: 'Ashis Chakraborty', 
      email: 'achakraborty169@gmail.com', 
      avatar: 'https://i.pravatar.cc/150?img=1', 
      role: 'Admin' 
    };
    return of(mockUser).pipe(delay(500)); // Simulate network delay
  }

  getMockProfile(userId: number): Observable<Profile> {
    const mockProfile: Profile = {
      userId: userId,
      bio: 'Software developer with 5 years of experience in web development.',
      location: 'Kolkata, India',
      website: 'https://ac-portfolio-site-2025.web.app/',
      socialLinks: {
        twitter: 'https://www.linkedin.com/in/ashis-chakraborty-68718b188/',
        linkedin: 'https://www.linkedin.com/in/ashis-chakraborty-68718b188/'
      }
    };
    return of(mockProfile).pipe(delay(500)); // Simulate network delay
  }

  // Cache for mock data to prevent regenerating it on every call
  private mockDataCache: TableData[] = [];
  
  getMockTableData(page: number = 0, pageSize: number = 10): Observable<TableData[]> {
    // If cache is empty, generate the data once
    if (this.mockDataCache.length === 0) {
      // Generate only 20 mock records to reduce load
      for (let i = 0; i < 20; i++) {
        this.mockDataCache.push({
          id: i + 1,
          name: `Item ${i + 1}`,
          category: ['Electronics', 'Clothing', 'Books', 'Food'][Math.floor(Math.random() * 4)],
          date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
          status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
          amount: Math.floor(Math.random() * 1000)
        });
      }
    }
    
    // Calculate pagination
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, this.mockDataCache.length);
    const paginatedData = this.mockDataCache.slice(startIndex, endIndex);
    
    // Return the paginated data with a delay to simulate network latency
    return of(paginatedData).pipe(delay(500));
  }

  getMockTableDataCount(): Observable<number> {
    return of(100).pipe(delay(500)); // Simulate network delay
  }

  // Error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Employee } from '../employee/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeesUrl =
    'https://archimedes-backend-dev.herokuapp.com//employee';
  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private httpClient: HttpClient) {}

  getEmployee(id: number): Observable<Employee> {
    const requestUrl = this.employeesUrl + '/' + id;
    return this.httpClient.get<Employee>(requestUrl).pipe(
      tap((_) => console.log(`fetched employee id `)),
      catchError(this.handleError<Employee>(`getEmployee id`))
    );
  }

  getEmployees(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(this.employeesUrl).pipe(
      tap((_) => console.log(`fetched employees`)),
      catchError(this.handleError<Employee[]>(`getEmployees`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`EmployeeService: ${message}`);
  }
}

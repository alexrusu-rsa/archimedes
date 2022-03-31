import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Customer } from '../models/customer';
import { RequestWrapper } from '../models/request-wrapper';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customersUrl = 'http://localhost:3000/customer';
  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(
    private httpClient: HttpClient,
    @Inject(NotificationService)
    private notificationService: NotificationService
  ) {}

  getCustomer(id: string): Observable<Customer> {
    const requestUrl = this.customersUrl + '/' + id;
    return this.httpClient
      .get<Customer>(requestUrl)
      .pipe(catchError(this.handleError<Customer>('getCustomer id')));
  }

  getCustomers(): Observable<Customer[]> {
    return this.httpClient
      .get<Customer[]>(this.customersUrl)
      .pipe(catchError(this.handleError<Customer[]>('getCustomers')));
  }

  deleteCustomer(id: string): Observable<RequestWrapper> {
    const deleteCustomerUrl = `${this.customersUrl}/${id}`;
    return this.httpClient
      .delete<RequestWrapper>(deleteCustomerUrl)
      .pipe(catchError(this.handleError<RequestWrapper>('deleteCustomer')));
  }

  updateCustomer(customer: Customer): Observable<RequestWrapper> {
    return this.httpClient
      .put(this.customersUrl + '/' + customer.id, customer)
      .pipe(catchError(this.handleError<RequestWrapper>('updateCustomer')));
  }

  addCustomer(customer: Customer): Observable<RequestWrapper> {
    return this.httpClient
      .post<RequestWrapper>(this.customersUrl, customer)
      .pipe(catchError(this.handleError<RequestWrapper>('addCustomer')));
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (err: HttpErrorResponse): Observable<T> => {
      console.error(err);
      this.notificationService.openSnackBar(
        err.error.message,
        err.error.statusCode
      );
      this.log(`${operation} failed: ${err.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`ActivityService: ${message}`);
  }
}

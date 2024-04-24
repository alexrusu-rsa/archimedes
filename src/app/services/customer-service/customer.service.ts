import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../../models/customer';
import { RequestWrapper } from '../../models/request-wrapper';
import { ResponseHandlingService } from '../response-handling-service/response-handling.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customersUrl = environment.serviceURL + 'customer';
  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(
    private httpClient: HttpClient,
    private responseHandlingService: ResponseHandlingService
  ) {}

  getCustomer(id: string): Observable<Customer> {
    const requestUrl = this.customersUrl + '/' + id;
    return this.httpClient
      .get<Customer>(requestUrl)
      .pipe(
        catchError(
          this.responseHandlingService.handleError<Customer>('getCustomer id')
        )
      );
  }

  getCustomers(): Observable<Customer[]> {
    return this.httpClient
      .get<Customer[]>(this.customersUrl)
      .pipe(
        catchError(
          this.responseHandlingService.handleError<Customer[]>('getCustomers')
        )
      );
  }

  deleteCustomer(id: string): Observable<RequestWrapper> {
    const deleteCustomerUrl = `${this.customersUrl}/${id}`;
    return this.httpClient
      .delete<RequestWrapper>(deleteCustomerUrl, { observe: 'response' })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Customer deleted');
          return res.body as RequestWrapper;
        }),
        catchError(
          this.responseHandlingService.handleError<RequestWrapper>(
            'deleteCustomer'
          )
        )
      );
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.httpClient
      .put(this.customersUrl + '/' + customer.id, customer, {
        observe: 'response',
      })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Customer updated');
          return res.body as Customer;
        }),
        catchError(
          this.responseHandlingService.handleError<Customer>('updateCustomer')
        )
      );
  }

  addCustomer(customer: Customer): Observable<Customer> {
    return this.httpClient
      .post<Customer>(this.customersUrl, customer, {
        observe: 'response',
      })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Customer added');
          return res.body as Customer;
        }),
        catchError(
          this.responseHandlingService.handleError<Customer>('addCustomer')
        )
      );
  }

  getCustomerInvoicePDF(
    customerId?: string,
    invoiceNumber?: string,
    selectedMonth?: string,
    selectedYear?: string,
    euroExchange?: number,
    dateFormatted?: number,
    invoiceTerm?: number
  ): Observable<any> {
    return this.httpClient.get(
      this.customersUrl +
        `/invoice/pdf/${customerId}/${invoiceNumber}/${selectedMonth}/${selectedYear}/${euroExchange}/${dateFormatted}/${invoiceTerm}`,
      { observe: 'response', responseType: 'blob' }
    );
  }

  getCustomerInvoiceXLSX(
    customerId: string,
    invoiceNumber: string,
    selectedMonth: string,
    selectedYear: string,
    euroExchange: number,
    dateFormatted: number
  ): Observable<any> {
    return this.httpClient.get(
      this.customersUrl +
        `/invoice/xlsx/${customerId}/${invoiceNumber}/${selectedMonth}/${selectedYear}/${euroExchange}/${dateFormatted}`,
      { observe: 'response', responseType: 'blob' }
    );
  }
}

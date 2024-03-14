import { Injectable } from '@angular/core';
import { Observable, filter, of, switchMap } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer-service/customer.service';

@Injectable()
export class CustomerFacade {
  public customers$: Observable<Customer[]>;
  constructor(private customerService: CustomerService) {
    this.customers$ = this.customerService.getCustomers().pipe(
      filter((customers: Customer[]) => customers.length > 0),
      switchMap((customers: Customer[]) => {
        if (customers.length) {
          return of(customers);
        } else {
          return of([]);
        }
      })
    );
  }

  addCustomer() {}

  editCustomer() {}

  deleteCustomer() {}
}

import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer-service/customer.service';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';
import { DeleteConfirmationDialogComponent } from '../../../reporting/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CustomerFacade } from 'src/app/ng-modules/customer/customer.facade';
import { Observable, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrls: ['./customer-page.component.sass'],
})
export class CustomerPageComponent {
  customers$: Observable<Customer[]> = this.facade.customers$;

  constructor(
    private customerService: CustomerService,
    public dialog: MatDialog,
    public facade: CustomerFacade
  ) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue);
    this.customers$.pipe(
      map((customers: Customer[]) =>
        customers.filter((customer: Customer) =>
          customer.customerName
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        )
      ),
      switchMap((filteredCustomers: Customer[]) => {
        return of();
      })
    );
    // this.allCustomers = this.customers?.filter((customer: Customer) =>
    //   customer.customerName
    //     .toLowerCase()
    //     .includes(filterValue.trim().toLowerCase())
    // );
  }

  // addCustomer() {
  //   const dialogRef = this.dialog.open(CustomerDialogComponent, {
  //     panelClass: 'full-width-dialog',
  //   });

  //   dialogRef.afterClosed().subscribe((newCustomer: Customer) => {
  //     if (newCustomer) this.allCustomers.push(newCustomer);
  //   });
  // }

  // editCustomer(customer: Customer) {
  //   const dialogRef = this.dialog.open(CustomerDialogComponent, {
  //     data: customer,
  //     panelClass: 'full-width-dialog',
  //   });

  //   dialogRef.afterClosed().subscribe((updatedCustomer: Customer) => {
  //     this.allCustomers.forEach((customer) => {
  //       if (customer.id === updatedCustomer.id) {
  //         customer = updatedCustomer;
  //       }
  //     });
  //   });
  // }

  // deleteCustomer(customerId: string) {
  //   const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
  //     panelClass: 'delete-confirmation-dialog',
  //   });
  //   dialogRef.afterClosed().subscribe((result: boolean) => {
  //     if (result) {
  //       this.allCustomers = this.allCustomers?.filter(
  //         (customer) => customer.id !== customerId
  //       );
  //       this.customerService
  //         .deleteCustomer(customerId)
  //         .pipe(takeUntilDestroyed(this.destroyRef))
  //         .subscribe();
  //     }
  //   });
  // }
}

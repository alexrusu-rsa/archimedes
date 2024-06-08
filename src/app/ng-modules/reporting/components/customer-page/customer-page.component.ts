import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from 'src/app/services/customer-service/customer.service';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  DeleteConfirmationModalComponent,
  deleteConfirmationModalPreset,
} from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { Icons } from 'src/app/shared/models/icons.enum';
import { Customer } from 'src/app/shared/models/customer';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrls: ['./customer-page.component.sass'],
})
export class CustomerPageComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  protected icons = Icons;
  allCustomers: Customer[] = [];
  customers: Customer[] = [];

  constructor(
    private customerService: CustomerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCustomers();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.allCustomers = this.customers?.filter((customer: Customer) =>
      customer.customerName
        .toLowerCase()
        .includes(filterValue.trim().toLowerCase())
    );
  }

  getCustomers() {
    this.customerService
      .getCustomers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.allCustomers = result;
        this.customers = result;
      });
  }

  addCustomer() {
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      panelClass: 'full-width-dialog',
    });

    dialogRef.afterClosed().subscribe((newCustomer: Customer) => {
      if (newCustomer) this.allCustomers.push(newCustomer);
    });
  }

  editCustomer(customer: Customer) {
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      data: customer,
      panelClass: 'full-width-dialog',
    });

    dialogRef.afterClosed().subscribe((updatedCustomer: Customer) => {
      this.allCustomers.forEach((customer) => {
        if (customer.id === updatedCustomer.id) {
          customer = updatedCustomer;
        }
      });
    });
  }

  deleteCustomer(customerId: string) {
    const dialogRef = this.dialog.open(
      DeleteConfirmationModalComponent,
      deleteConfirmationModalPreset
    );
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.allCustomers = this.allCustomers?.filter(
          (customer) => customer.id !== customerId
        );
        this.customerService
          .deleteCustomer(customerId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();
      }
    });
  }
}

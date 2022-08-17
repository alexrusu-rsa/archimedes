import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { RequestWrapper } from 'src/app/models/request-wrapper';
import { CustomerService } from 'src/app/services/customer.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-customer-dialog',
  templateUrl: './customer-dialog.component.html',
  styleUrls: ['./customer-dialog.component.sass'],
})
export class CustomerDialogComponent implements OnInit {
  constructor(
    private customerService: CustomerService,
    public dialogRef: MatDialogRef<CustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public customer: Customer
  ) {}

  addCustomerForm?: FormGroup;
  currentCustomer?: Customer;
  addCurrentCustomerSub?: Subscription;
  updateCustomerSub?: Subscription;

  addCustomer() {
    if (this.currentCustomer) {
      this.addCurrentCustomerSub = this.customerService
        .addCustomer(this.currentCustomer)
        .subscribe((newCustomer: Customer) => {
          this.dialogRef.close(newCustomer);
        });
    }
  }

  editCustomer() {
    if (this.currentCustomer) {
      this.updateCustomerSub = this.customerService
        .updateCustomer(this.currentCustomer)
        .subscribe((updatedCustomer: Customer) => {
          this.dialogRef.close(updatedCustomer);
        });
    }
  }

  checkAbleToRequestAddCustomer(): boolean {
    for (const [key, value] of Object.entries(this.addCustomerForm?.value)) {
      if (value === undefined || value === '') return false;
    }
    return true;
  }

  checkAbleToRequestUpdateCustomer(): boolean {
    for (const [key, value] of Object.entries(this.addCustomerForm?.value)) {
      if (value === undefined || value === '') return false;
    }
    return true;
  }
  dialogClose() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.currentCustomer = <Customer>{};
    this.currentCustomer.internal = false;
    if (this.customer !== null) {
      this.currentCustomer = this.customer;
      this.currentCustomer.internal = this.customer.internal;
    }

    this.addCustomerForm = new FormGroup({
      name: new FormControl(this.currentCustomer?.customerName, [
        Validators.required,
      ]),
      cui: new FormControl(this.currentCustomer?.customerCUI, [
        Validators.required,
      ]),
      reg: new FormControl(this.currentCustomer?.customerReg, [
        Validators.required,
      ]),
      address: new FormControl(this.currentCustomer?.customerAddress, [
        Validators.required,
      ]),
      city: new FormControl(this.currentCustomer?.customerCity, [
        Validators.required,
      ]),
      country: new FormControl(this.currentCustomer?.customerCountry, [
        Validators.required,
      ]),
      directorName: new FormControl(this.currentCustomer?.customerDirectorName),
      directorEmail: new FormControl(
        this.currentCustomer?.customerDirectorEmail
      ),
      directorTel: new FormControl(this.currentCustomer?.customerDirectorTel),
      shortName: new FormControl(this.currentCustomer?.shortName),
    });
  }

  get name() {
    return this.addCustomerForm?.get('name');
  }
  get cui() {
    return this.addCustomerForm?.get('cui');
  }
  get reg() {
    return this.addCustomerForm?.get('reg');
  }
  get address() {
    return this.addCustomerForm?.get('address');
  }
  get city() {
    return this.addCustomerForm?.get('city');
  }
  get country() {
    return this.addCustomerForm?.get('country');
  }
  get directorName() {
    return this.addCustomerForm?.get('directorName');
  }
  get directorEmail() {
    return this.addCustomerForm?.get('directorEmail');
  }
  get directorTel() {
    return this.addCustomerForm?.get('directorTel');
  }
  get shortName() {
    return this.addCustomerForm?.get('shortName');
  }
}

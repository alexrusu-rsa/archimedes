import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { RequestWrapper } from 'src/app/models/request-wrapper';
import { CustomerService } from 'src/app/services/customer.service';

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
    if (this.checkAbleToRequestAddCustomer())
      if (this.currentCustomer)
        this.addCurrentCustomerSub = this.customerService
          .addCustomer(this.currentCustomer)
          .subscribe((newCustomer: Customer) => {
            this.dialogRef.close(newCustomer);
          });
  }

  editCustomer() {
    if (this.checkAbleToRequestUpdateCustomer())
      if (this.currentCustomer) {
        this.updateCustomerSub = this.customerService
          .updateCustomer(this.currentCustomer)
          .subscribe((updatedCustomer: Customer) => {
            this.dialogRef.close();
          });
      }
  }

  checkAbleToRequestAddCustomer(): boolean {
    if (
      this.name?.pristine ||
      this.cui?.pristine ||
      this.reg?.pristine ||
      this.address?.pristine ||
      this.city?.pristine ||
      this.country?.pristine ||
      this.directorName?.pristine ||
      this.directorEmail?.pristine ||
      this.directorTel?.pristine
    )
      return false;
    return true;
  }

  checkAbleToRequestUpdateCustomer(): boolean {
    if (
      this.name?.value !== '' &&
      this.cui?.value !== '' &&
      this.reg?.value !== '' &&
      this.address?.value !== '' &&
      this.city?.value !== '' &&
      this.country?.value !== '' &&
      this.directorName?.value !== '' &&
      this.directorEmail?.value !== '' &&
      this.directorTel?.value !== ''
    )
      return true;
    return false;
  }
  dialogClose() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.currentCustomer = <Customer>{};
    if (this.customer !== null) this.currentCustomer = this.customer;
    this.addCustomerForm = new FormGroup({
      name: new FormControl(this.currentCustomer?.customerName),
      cui: new FormControl(this.currentCustomer?.customerCUI),
      reg: new FormControl(this.currentCustomer?.customerReg),
      address: new FormControl(this.currentCustomer?.customerAddress),
      city: new FormControl(this.currentCustomer?.customerCity),
      country: new FormControl(this.currentCustomer?.customerCountry),
      directorName: new FormControl(this.currentCustomer?.customerDirectorName),
      directorEmail: new FormControl(
        this.currentCustomer?.customerDirectorEmail
      ),
      directorTel: new FormControl(this.currentCustomer?.customerDirectorTel),
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
}

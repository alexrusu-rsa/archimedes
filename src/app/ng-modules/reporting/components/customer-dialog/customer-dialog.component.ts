import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CustomerService } from 'src/app/features/customer/services/customer-service/customer.service';
import { Customer } from 'src/app/shared/models/customer';
import { Icons } from 'src/app/shared/models/icons.enum';

@Component({
  selector: 'app-customer-dialog',
  templateUrl: './customer-dialog.component.html',
  styleUrls: ['./customer-dialog.component.sass'],
})
export class CustomerDialogComponent implements OnInit {
  protected readonly icons = Icons;
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

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  checkAbleToRequestAddCustomer(): boolean {
    for (const [_, value] of Object.entries(this.addCustomerForm?.value)) {
      if (value === undefined || value === '') return false;
    }
    return true;
  }

  checkAbleToRequestUpdateCustomer(): boolean {
    for (const [_, value] of Object.entries(this.addCustomerForm?.value)) {
      if (value === undefined || value === '') return false;
    }
    return true;
  }
  dialogClose() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.currentCustomer = <Customer>{};
    if (this.customer !== null) {
      this.currentCustomer = this.customer;
      this.currentCustomer.internal = this.customer.internal;
      this.currentCustomer.romanianCompany = this.customer.romanianCompany;
      this.currentCustomer.VAT = this.customer.VAT;
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
      internal: new FormControl(this.currentCustomer.internal),
      IBANRO: new FormControl(this.currentCustomer.IBANRO),
      IBANEUR: new FormControl(this.currentCustomer.IBANEUR),
      romanianCompany: new FormControl(this.currentCustomer.romanianCompany),
      VAT: new FormControl(this.currentCustomer.VAT),
      swift: new FormControl(this.currentCustomer.swift),
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
  get internal() {
    return this.addCustomerForm?.get('internal');
  }
  get IBANRO() {
    return this.addCustomerForm?.get('IBANRO');
  }
  get IBANEUR() {
    return this.addCustomerForm?.get('IBANEUR');
  }
  get romanianCompany() {
    return this.addCustomerForm?.get('romanianCompany');
  }
  get VAT() {
    return this.addCustomerForm?.get('VAT');
  }
  get swift() {
    return this.addCustomerForm?.get('swift');
  }
}

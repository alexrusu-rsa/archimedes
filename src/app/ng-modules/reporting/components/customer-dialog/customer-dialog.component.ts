import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models/customer';
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
    if (this.currentCustomer)
      this.addCurrentCustomerSub = this.customerService
        .addCustomer(this.currentCustomer)
        .subscribe();
  }

  editCustomer() {
    if (this.currentCustomer) {
      this.updateCustomerSub = this.customerService
        .updateCustomer(this.currentCustomer)
        .subscribe();
    }
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
      directorName: new FormControl(this.currentCustomer?.customerDirectorName),
      directorEmail: new FormControl(
        this.currentCustomer?.customerDirectorEmail
      ),
      directorTel: new FormControl(this.currentCustomer?.customerDirectorTel),
    });
  }
}

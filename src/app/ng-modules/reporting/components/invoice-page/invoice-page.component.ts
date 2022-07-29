import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { Customer } from 'src/app/models/customer';
import { ActivityService } from 'src/app/services/activity.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/project';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceDataWrapper } from 'src/app/models/invoice-data-wrapper';
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog.component';
import { DatePipe } from '@angular/common';
import _moment, { Moment } from 'moment';
import { default as _rollupMoment } from 'moment';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';

import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import e from 'express';
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.sass'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class InvoicePageComponent implements OnInit, OnDestroy {
  allCustomers?: Customer[];
  allCustomersSub?: Subscription;

  allActivitiesOfMonthYear?: Activity[];
  allActivitiesOfMonthYearSub?: Subscription;

  allProjects?: Project[];
  allProjectsSub?: Subscription;

  selectedDate?: Date;
  selectedMonth?: string;
  selectedYear?: string;

  constructor(
    private customerService: CustomerService,
    private activityService: ActivityService,
    private projectService: ProjectService,
    public dialog: MatDialog,
    public datepipe: DatePipe
  ) {}

  date = new FormControl(moment());

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());

    this.selectedMonth = (normalizedMonthAndYear.month() + 1).toString();
    this.selectedYear = normalizedMonthAndYear.year().toString();
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  getAllCustomers() {
    this.allCustomersSub = this.customerService
      .getCustomers()
      .subscribe((result) => {
        this.allCustomers = result;
      });
  }

  downloadInvoice(customerId: string) {
    const dialogRef = this.dialog.open(InvoiceDialogComponent, {
      data: <InvoiceDataWrapper>{
        customerId: customerId,
        month: this.selectedMonth,
        year: this.selectedYear,
      },
      panelClass: 'full-width-dialog',
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(result.body);
      a.href = objectUrl;
      if (
        result.body.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
        a.download = 'invoice.xlsx';
      else {
        a.download = 'invoice.pdf';
      }
      a.click();
    });
  }

  getAllProjects() {
    this.allProjectsSub = this.projectService
      .getProjects()
      .subscribe((result: Project[]) => {
        this.allProjects = result;
      });
  }

  preselectMonthAndYear() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    this.selectedMonth = (month + 1).toString();
    this.selectedYear = year.toString();
  }

  ngOnInit(): void {
    this.preselectMonthAndYear();
    this.getAllCustomers();
    this.getAllProjects();
  }

  ngOnDestroy(): void {
    this.allCustomersSub?.unsubscribe();
    this.allProjectsSub?.unsubscribe();
  }
}

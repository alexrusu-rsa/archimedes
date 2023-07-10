import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Subscription, switchMap } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { Customer } from 'src/app/models/customer';
import { ActivityService } from 'src/app/services/activity-service/activity.service';
import { CustomerService } from 'src/app/services/customer-service/customer.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
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
import { InvoiceDialogOnCloseResult } from 'src/app/models/invoice-dialog-onclose-result';
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
  allProjects?: Project[];

  fetchDataSub?: Subscription;

  selectedDate?: Date;
  selectedMonth?: string;
  selectedYear?: string;
  selectedDateToDisplay?: string;

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

    ctrlValue!.month(normalizedMonthAndYear.month());
    ctrlValue!.year(normalizedMonthAndYear.year());

    this.selectedMonth = (normalizedMonthAndYear.month() + 1).toString();
    this.selectedYear = normalizedMonthAndYear.year().toString();
    this.date.setValue(ctrlValue);
    this.selectedDateToDisplay = `
      ${ctrlValue!.toString().split(' ')[1]} ${
      ctrlValue!.toString().split(' ')[3]
    }`;
    datepicker.close();
  }

  async downloadInvoice(projectId: string, customerId: string) {
    const currentCustomerName = await this.allCustomers?.filter(
      (customer) => customer.id === customerId
    );
    if (currentCustomerName) {
      const dialogRef = this.dialog.open(InvoiceDialogComponent, {
        data: <InvoiceDataWrapper>{
          customerId: projectId,
          month: this.selectedMonth,
          year: this.selectedYear,
          customerName: currentCustomerName[0].customerName,
          customerShortName: currentCustomerName[0].shortName,
          customerRomanian: currentCustomerName[0].romanianCompany,
        },
        panelClass: 'full-width-dialog',
      });
      dialogRef
        .afterClosed()
        .subscribe((result: InvoiceDialogOnCloseResult) => {
          if (result) {
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(result.response.body);
            a.href = objectUrl;
            if (
              result.response.body.type ===
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ) {
              if (result.customerShortName)
                a.download = `RSA${result.invoiceNumber}-${result.customerShortName}.xlsx`;
              else
                a.download = `RSA${result.invoiceNumber}-${result.customerName}.xlsx`;
            } else {
              if (result.customerShortName)
                a.download = `RSA${result.invoiceNumber}-${result.customerShortName}.pdf`;
              else
                a.download = `RSA${result.invoiceNumber}-${result.customerName}.pdf`;
            }
            a.click();
          }
        });
    }
  }

  preselectMonthAndYear() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    this.selectedMonth = (month + 1).toString();
    this.selectedYear = year.toString();
    this.selectedDateToDisplay = `${today.toString().split(' ')[1]} ${
      today.toString().split(' ')[3]
    }`;
  }

  ngOnInit(): void {
    this.preselectMonthAndYear();
    this.fetchData();
  }

  fetchData() {
    this.fetchDataSub = this.customerService
      .getCustomers()
      .pipe(
        switchMap((customers) => {
          this.allCustomers = customers;
          return this.projectService.getProjects();
        })
      )
      .subscribe((projects) => {
        this.allProjects = projects;
      });
  }

  ngOnDestroy(): void {
    this.fetchDataSub?.unsubscribe();
  }
}

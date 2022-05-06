import { Component, OnInit } from '@angular/core';
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
import { default as _rollupMoment, Moment } from 'moment';
import _moment from 'moment';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
} from '@angular/material/core/datetime/date-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
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
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class InvoicePageComponent implements OnInit {
  allCustomers?: Customer[];
  allCustomersSub?: Subscription;

  allActivitiesOfMonthYear?: Activity[];
  allActivitiesOfMonthYearSub?: Subscription;

  allProjects?: Project[];
  allProjectsSub?: Subscription;

  selectedDate?: Date;
  selectedMonth?: string;
  selectedYear?: string;

  date = new FormControl(moment());

  constructor(
    private customerService: CustomerService,
    private activityService: ActivityService,
    private projectService: ProjectService,
    public dialog: MatDialog,
    public datepipe: DatePipe
  ) {}

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  dateChanges() {
    const dateFormatted = this.datepipe.transform(
      this.selectedDate,
      'dd/MM/yyyy'
    );
    if (dateFormatted) {
      const splitDateFormatted = dateFormatted.split('/');
      this.selectedMonth = splitDateFormatted[1];
      this.selectedYear = splitDateFormatted[2];
    }
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
  }

  getAllProjects() {
    this.allProjectsSub = this.projectService
      .getProjects()
      .subscribe((result: Project[]) => {
        this.allProjects = result;
      });
  }

  ngOnInit(): void {
    this.getAllCustomers();
    this.getAllProjects();
  }
}

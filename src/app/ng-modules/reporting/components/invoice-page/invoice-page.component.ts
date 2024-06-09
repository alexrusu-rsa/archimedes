import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { switchMap } from 'rxjs';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '../../../../shared/models/project';
import { CustomerService } from '../../../../features/customer/services/customer-service/customer.service';
import { Customer } from '../../../../shared/models/customer';
import { InvoiceDialogOnCloseResult } from '../../../../features/invoice/models/invoice-dialog-onclose-result';
import { ProjectService } from '../../../../features/project/services/project-service/project.service';
import { InvoiceModalComponent } from 'src/app/features/invoice/components/invoice-modal/invoice-modal.component';
import { Invoice } from 'src/app/features/invoice/models/invoice.model';
import { Icons } from 'src/app/shared/models/icons.enum';

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
export class InvoicePageComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  allCustomers?: Customer[];
  allProjects?: Project[];
  selectedMonth?: string;
  selectedYear?: string;
  selectedDateToDisplay?: string;
  protected icons = Icons;
  private invoiceSeries?: string;

  constructor(
    private customerService: CustomerService,
    private projectService: ProjectService,
    public dialog: MatDialog
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
    this.selectedDateToDisplay = `
      ${ctrlValue.toString().split(' ')[1]} ${
      ctrlValue.toString().split(' ')[3]
    }`;
    datepicker.close();
  }

  findInternalCustomer(): string {
    const result = this.allCustomers?.find(
      (customer) => customer.internal === true
    );
    if (result) {
      return result.shortName;
    }
    return 'NO_INTERNAL_SET';
  }

  openInvoiceModal(projectId: string, customerId: string) {
    const customer = this.allCustomers?.find(
      (customer) => customer?.id === customerId
    );

    const project = this.allProjects?.find(
      (project) => project?.id === projectId
    );

    const invoice: Invoice = {
      customer: customer,
      project: project,
      month: this.selectedMonth,
      year: this.selectedYear,
      series: this.invoiceSeries,
    };

    this.dialog
      .open(InvoiceModalComponent, {
        data: invoice,
      })
      .afterClosed()
      .pipe()
      .subscribe((invoiceDialogClosed: InvoiceDialogOnCloseResult) => {
        const a = document.createElement('a');
        a.href = invoiceDialogClosed?.blobUrl;
        a.download = invoiceDialogClosed.invoiceName;
        a.click();
      });
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
    this.customerService
      .getCustomers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((customers) => {
          this.allCustomers = customers;
          this.invoiceSeries = this.findInternalCustomer();
          return this.projectService.getProjects();
        })
      )
      .subscribe((projects) => {
        this.allProjects = projects;
      });
  }
}

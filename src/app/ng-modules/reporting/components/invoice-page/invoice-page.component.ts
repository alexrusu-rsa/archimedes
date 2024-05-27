import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { switchMap } from 'rxjs';
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog.component';
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
import { InvoicePreviewDialogComponent } from '../invoice-preview-dialog/invoice-preview-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceDataWrapper } from '../../../../models/invoice-data-wrapper';
import { Project } from '../../../../models/project';
import { CustomerService } from '../../../../services/customer-service/customer.service';
import { Customer } from '../../../../models/customer';
import { InvoiceDialogOnCloseResult } from '../../../../models/invoice-dialog-onclose-result';
import { ProjectService } from '../../../../services/project-service/project.service';
import { Icons } from 'src/app/models/icons.enum';

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
  icons = Icons;
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

  findInternalCustomer(): string {
    const result = this.allCustomers?.find(
      (customer) => customer.internal === true
    );
    if (result) {
      return result.shortName;
    }
    return 'NO_INTERNAL_SET';
  }

  async downloadInvoice(projectId: string, customerId: string) {
    const currentCustomerName = await this.allCustomers?.filter(
      (customer) => customer.id === customerId
    );

    const currentProject: Project | undefined = this.allProjects!.find(
      (project) => project.id === projectId
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
          invoiceSeries: this.invoiceSeries,
          invoiceTerm: currentProject ? currentProject.invoiceTerm : 0,
        },
        panelClass: 'full-width-height-dialog',
      });
      dialogRef
        .afterClosed()
        .subscribe((result: InvoiceDialogOnCloseResult) => {
          if (result) {
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(result.response['body']);
            if (result.downloadStart) {
              a.href = objectUrl;
              if (
                result.response['body'].type ===
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              ) {
                if (result.customerShortName)
                  a.download = `${this.invoiceSeries}${result.invoiceNumber}-${result.customerShortName}.xlsx`;
                else
                  a.download = `${this.invoiceSeries}${result.invoiceNumber}-${result.customerName}.xlsx`;
              } else {
                if (result.customerShortName)
                  a.download = `${this.invoiceSeries}${result.invoiceNumber}-${result.customerShortName}.pdf`;
                else
                  a.download = `${this.invoiceSeries}${result.invoiceNumber}-${result.customerName}.pdf`;
              }
              a.click();
            }
          }
        });
    }
  }

  previewInvoice(projectId: string, customerId: string) {
    const currentCustomerName = this.allCustomers?.filter(
      (customer) => customer.id === customerId
    );
    if (currentCustomerName) {
      this.dialog.open(InvoicePreviewDialogComponent, {
        panelClass: 'full-width-dialog',
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

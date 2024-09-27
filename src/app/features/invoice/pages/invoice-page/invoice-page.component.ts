import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCardActions } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { EntityItemComponent } from 'src/app/shared/components/entity-item/entity-item.component';
import { EntityPageHeaderComponent } from 'src/app/shared/components/entity-page-header/entity-page-header.component';
import { Icons } from 'src/app/shared/models/icons.enum';
import { ProjectService } from 'src/app/features/project/services/project-service/project.service';
import { Project } from 'src/app/shared/models/project';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePickerType } from 'src/app/shared/models/date-picker-type.enum';
import { Invoice } from '../../models/invoice.model';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceModalComponent } from '../../components/invoice-modal/invoice-modal.component';
import { InvoiceDialogOnCloseResult } from '../../models/invoice-dialog-onclose-result';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceLastNumber } from '../../models/invoiceLastNumber.model';
import { last, switchMap } from 'rxjs';

@Component({
  selector: 'app-invoice-page',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardActions,
    MatIconButton,
    MatIcon,
    EntityPageHeaderComponent,
    EntityItemComponent,
  ],
  templateUrl: './invoice-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicePageComponent {
  private readonly service = inject(ProjectService);
  private readonly invoiceService = inject(InvoiceService);
  private readonly dialog = inject(MatDialog);
  protected readonly icons = Icons;
  protected readonly datePickerType = DatePickerType;
  protected invoices = toSignal(this.service.getProjects(), {
    initialValue: [],
  });
  protected readonly currentMonth = signal<Date>(new Date());
  protected lastInvoiceNumber: string;
  downloadInvoice(project: Project) {
    const currentMonthValue = this.currentMonth();
    const currentMonthDate: Date = new Date(currentMonthValue);
    const month = currentMonthDate.getMonth() + 1;
    const year = currentMonthDate.getFullYear();

    this.invoiceService
      .getLastInvoiceNumber()
      .pipe(
        switchMap((lastInvoiceNumber) => {
          const invoice: Invoice = {
            customer: project?.customer,
            project: project,
            month: month.toString(),
            year: year.toString(),
            series: 'RSA',
            number: lastInvoiceNumber.lastSavedInvoiceNumber,
          };

          return this.dialog
            .open(InvoiceModalComponent, {
              data: invoice,
            })
            .afterClosed();
        }),
        switchMap((invoiceDialogClosed: InvoiceDialogOnCloseResult) => {
          if (
            invoiceDialogClosed?.blobUrl &&
            invoiceDialogClosed?.invoiceName
          ) {
            const a = document.createElement('a');
            a.href = invoiceDialogClosed.blobUrl;
            a.download = invoiceDialogClosed.invoiceName;
            a.click();
          }
          return null;
        })
      )
      .subscribe({
        // eslint-disable-next-line no-console
        error: (err) => console.error('Error:', err),
      });
  }
}

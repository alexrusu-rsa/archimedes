import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
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
  private readonly dialog = inject(MatDialog);
  protected readonly icons = Icons;
  protected readonly datePickerType = DatePickerType;
  protected invoices = toSignal(this.service.getProjects(), {
    initialValue: [],
  });
  protected readonly currentMonth = signal<Date>(new Date());

  downloadInvoice(project: Project) {
    const invoice: Invoice = {
      customer: project?.customer,
      project: project,
      month: this.currentMonth().getMonth().toString(),
      year: this.currentMonth().getFullYear().toString(),
      //TODO get internal customer from backend on login
      series: 'RSA',
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
}

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
  private service = inject(ProjectService);
  protected readonly icons = Icons;
  protected invoices = toSignal(this.service.getProjects(), {
    initialValue: [],
  });
  currentMonth = signal<Date>(new Date());

  udpateDate(arg0: string, $event: Date) {
    throw new Error('Method not implemented.');
  }
  downloadInvoice(project: Project) {
    throw new Error('Method not implemented.');
  }
}

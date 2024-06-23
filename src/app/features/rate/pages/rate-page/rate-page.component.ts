import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { EntityItemComponent } from 'src/app/shared/components/entity-item/entity-item.component';
import { EntityPageHeaderComponent } from 'src/app/shared/components/entity-page-header/entity-page-header.component';
import { Icons } from 'src/app/shared/models/icons.enum';
import { Rate } from 'src/app/shared/models/rate';
import { RateService } from '../../services/rate-service/rate.service';
import { MatDialog } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MobileRateTypePipe } from '../../mobileRateType.pipe';
import { TimePipe } from 'src/app/shared/pipes/time.pipe';
import {
  DeleteConfirmationModalComponent,
  deleteConfirmationModalPreset,
} from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { filter, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-rate-page',
  standalone: true,
  imports: [
    TranslateModule,
    MatButton,
    MatIconButton,
    MatIcon,
    MatIcon,
    MatCard,
    MatCardContent,
    MatCardActions,
    MatTableModule,
    EntityPageHeaderComponent,
    EntityItemComponent,
    MobileRateTypePipe,
    TimePipe,
  ],
  templateUrl: './rate-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatePageComponent {
  private readonly dialog = inject(MatDialog);
  protected search = signal('');

  private readonly destroyRef = inject(DestroyRef);
  protected readonly icons = Icons;

  private readonly service = inject(RateService);
  private rawRates: Signal<Rate[]> = toSignal(this.service.getRates(), {
    initialValue: [],
  });
  private rates = computed(() => signal(this.rawRates()));
  protected filteredRates = computed(() =>
    this.rates()().filter((rate: Rate) =>
      rate.project.projectName
        .toLowerCase()
        .includes(this.search().trim().toLowerCase())
    )
  );

  displayedColumns: string[] = [
    'project',
    'employee',
    'rate',
    'rateType',
    'employeeTimeCommitement',
    'editButton',
    'deleteButton',
  ];

  addRate() {
    // this.dialog
    //   .open(CustomerModalComponent)
    //   .afterClosed()
    //   .pipe(
    //     filter((newCustomer: Customer) => !!newCustomer),
    //     switchMap((newCustomer: Customer) => {
    //       return this.service
    //         .addCustomer(newCustomer)
    //         .pipe(takeUntilDestroyed(this.destroyRef));
    //     }),
    //     take(1)
    //   )
    //   .subscribe((customer: Customer) => {
    //     this.rates().update((customers) => [...customers, customer]);
    //   });
  }

  editRate(rate: Rate) {
    // this.dialog
    //   .open(CustomerModalComponent, {
    //     data: customer,
    //   })
    //   .afterClosed()
    //   .pipe(
    //     filter((editedCustomer: Customer) => !!editedCustomer),
    //     switchMap((editedCustomer: Customer) => {
    //       return this.service
    //         .updateCustomer(editedCustomer)
    //         .pipe(takeUntilDestroyed(this.destroyRef));
    //     }),
    //     take(1)
    //   )
    //   .subscribe((editedCustomer: Customer) => {
    //     this.customers().update((customers) =>
    //       customers.map((customer) => {
    //         if (editedCustomer?.id === customer?.id) return editedCustomer;
    //         return customer;
    //       })
    //     );
    //   });
  }

  deleteRate(rateId: string) {
    this.dialog
      .open(DeleteConfirmationModalComponent, deleteConfirmationModalPreset)
      .afterClosed()
      .pipe(
        filter((deleteConfirmation) => deleteConfirmation === true),
        switchMap((_) => {
          return this.service
            .deleteRate(rateId)
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        take(1)
      )
      .subscribe((_) => {
        this.rates().update((rates) =>
          rates.filter((rate) => rate.id !== rateId)
        );
      });
  }
}

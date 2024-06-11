import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from 'src/app/features/customer/services/customer-service/customer.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Icons } from 'src/app/shared/models/icons.enum';
import { Customer } from 'src/app/shared/models/customer';
import { EntityPageHeaderComponent } from 'src/app/shared/components/entity-page-header/entity-page-header.component';
import { MatCard, MatCardActions, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import {
  DeleteConfirmationModalComponent,
  deleteConfirmationModalPreset,
} from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { take, filter, switchMap } from 'rxjs';
import { EntityItemComponent } from 'src/app/shared/components/entity-item/entity-item.component';
import { CustomerModalComponent } from '../../components/customer-modal/customer-modal.component';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    EntityPageHeaderComponent,
    MatCard,
    MatCardTitle,
    MatCardActions,
    MatIcon,
    MatButton,
    MatIconButton,
    MatChip,
    MatChipSet,
    EntityItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerPageComponent {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly icons = Icons;
  private service = inject(CustomerService);
  private dialog = inject(MatDialog);
  protected search = signal('');
  private rawCustomers: Signal<Customer[]> = toSignal(
    this.service.getCustomers().pipe(takeUntilDestroyed(this.destroyRef)),
    { initialValue: [] }
  );
  private customers = computed(() => signal(this.rawCustomers()));
  protected filterdCustomers = computed(() =>
    this.customers()().filter((customer: Customer) =>
      customer.customerName
        .toLowerCase()
        .includes(this.search().trim().toLowerCase())
    )
  );

  addCustomer() {
    this.dialog
      .open(CustomerModalComponent)
      .afterClosed()
      .pipe(
        filter((newCustomer: Customer) => !!newCustomer),
        switchMap((newCustomer: Customer) => {
          return this.service
            .addCustomer(newCustomer)
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        take(1)
      )
      .subscribe((customer: Customer) => {
        this.customers().update((customers) => [...customers, customer]);
      });
  }

  editCustomer(customer: Customer) {
    this.dialog
      .open(CustomerModalComponent, {
        data: customer,
      })
      .afterClosed()
      .pipe(
        filter((editedCustomer: Customer) => !!editedCustomer),
        switchMap((editedCustomer: Customer) => {
          return this.service
            .updateCustomer(editedCustomer)
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        take(1)
      )
      .subscribe((editedCustomer: Customer) => {
        this.customers().update((customers) =>
          customers.map((customer) => {
            if (editedCustomer?.id === customer?.id) return editedCustomer;
            return customer;
          })
        );
      });
  }

  deleteCustomer(customerId: string) {
    this.dialog
      .open(DeleteConfirmationModalComponent, deleteConfirmationModalPreset)
      .afterClosed()
      .pipe(
        filter((deleteConfirmation) => deleteConfirmation === true),
        switchMap((_) => {
          return this.service
            .deleteCustomer(customerId)
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        take(1)
      )
      .subscribe((_) => {
        this.customers().update((customers) =>
          customers.filter((customer) => customer.id !== customerId)
        );
      });
  }

  chipsArray(customer: Customer): string[] {
    const chips = [];
    if (customer.internal) chips.push('Internal');
    if (customer.romanianCompany) chips.push('Romanian Company');
    if (customer.VAT) chips.push('TVA 19%');

    return chips;
  }
}

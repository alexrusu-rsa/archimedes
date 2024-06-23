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
import { RateModalComponent } from '../../components/rate-modal/rate-modal.component';
import { ProjectService } from 'src/app/features/project/services/project-service/project.service';
import { UserService } from 'src/app/features/user/services/user-service/user.service';
import { User } from 'src/app/shared/models/user';
import { Project } from 'src/app/shared/models/project';

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
  protected readonly icons = Icons;
  protected search = signal('');

  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly service = inject(RateService);
  private readonly projectService = inject(ProjectService);
  private readonly userService = inject(UserService);

  private rawRateTypes: Signal<string[]> = toSignal(
    this.service.getAllRateTypes(),
    {
      initialValue: [],
    }
  );

  private rawUsers: Signal<User[]> = toSignal(this.userService.getUsers(), {
    initialValue: [],
  });

  private rawProjects: Signal<Project[]> = toSignal(
    this.projectService.getProjects(),
    {
      initialValue: [],
    }
  );

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
    this.dialog
      .open(RateModalComponent, {
        data: {
          projects: this.rawProjects(),
          users: this.rawUsers(),
          rateTypes: this.rawRateTypes(),
        },
      })
      .afterClosed()
      .pipe(
        filter((newRate: Rate) => !!newRate),
        switchMap((newRate: Rate) => {
          const newRateWithIds = {
            ...newRate,
            projectId: newRate.project?.id,
            employeeId: newRate.user?.id,
          };
          return this.service
            .addRate(newRateWithIds)
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        take(1)
      )
      .subscribe((rate: Rate) => {
        this.rates().update((rates) => [...rates, rate]);
      });
  }

  editRate(rate: Rate) {
    const { id, ...rateWithoutUnnecessary } = rate;

    this.dialog
      .open(RateModalComponent, {
        data: {
          rate: rateWithoutUnnecessary,
          projects: this.rawProjects(),
          users: this.rawUsers(),
          rateTypes: this.rawRateTypes(),
        },
      })
      .afterClosed()
      .pipe(
        filter((editedRate: Rate) => !!editedRate),
        switchMap((editedRate: Rate) => {
          const { project, user, ...editedRateWithoutProjectAndEmployee } =
            editedRate;
          const editedRateWithId = {
            ...editedRateWithoutProjectAndEmployee,
            id: id,
            projectId: project?.id,
            employeeId: user?.id,
          };
          return this.service
            .updateRate(editedRateWithId)
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        take(1)
      )
      .subscribe((editedRate: Rate) => {
        this.rates().update((rates) =>
          rates.map((rate) => {
            if (editedRate?.id === rate?.id) return editedRate;
            return rate;
          })
        );
      });
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

import { DatePickerType } from './../../../../shared/models/date-picker-type.enum';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardTitle, MatCardActions } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { EntityItemComponent } from 'src/app/shared/components/entity-item/entity-item.component';
import { EntityPageHeaderComponent } from 'src/app/shared/components/entity-page-header/entity-page-header.component';
import { Icons } from 'src/app/shared/models/icons.enum';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OrderByPipe } from '../../pipes/order-by.pipe';
import { WorkedTimePipe } from '../../pipes/worked-time.pipe';
import { ActivityStore } from 'src/app/features/activity/store/activity.store';
import { ActivityModalComponent } from '../../components/activity-modal/activity-modal.component';
import { Activity } from 'src/app/shared/models/activity';
import {
  DeleteConfirmationModalComponent,
  deleteConfirmationModalPreset,
} from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import {
  DuplicateActivityModalComponent,
  duplicateActivityModalPreset,
} from '../../components/duplicate-activity-modal/duplicate-activity-modal.component';
import { DateTimePipe } from 'src/app/shared/pipes/date-time.pipe';

@Component({
  selector: 'app-activity-page',
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
    EntityItemComponent,
    OrderByPipe,
    WorkedTimePipe,
    DateTimePipe,
  ],
  templateUrl: './activity-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityPageComponent implements OnInit {
  public readonly store = inject(ActivityStore);
  private readonly dialog = inject(MatDialog);
  private readonly dateParam = toSignal(
    inject(ActivatedRoute).queryParams.pipe(
      map(({ date }) => date),
      filter((date) => !!date)
    )
  );
  protected readonly icons = Icons;
  protected readonly datePickerType = DatePickerType;

  ngOnInit() {
    this.store.loadProjects();
    this.store.loadActivityTypes();
    if (this.dateParam()) this.updateFilter('date', new Date(this.dateParam()));
    else this.updateFilter('date', new Date());
  }

  protected updateFilter(key: string, value) {
    switch (key) {
      case 'date':
        this.store.updateFilter({
          date: value,
          project: null,
        });
        break;
      case 'project':
        this.store.updateFilter({
          project: value,
          date: this.store.filter()?.date,
        });
        break;
      default:
        break;
    }
  }

  addActivity() {
    this.dialog
      .open(ActivityModalComponent, {
        data: {
          activityProjects: this.store.projects(),
          activityTypes: this.store.activityTypes(),
        },
        panelClass: 'full-width-dialog',
      })
      .afterClosed()
      .pipe(filter((activity: Activity) => !!activity))
      .subscribe((activity: Activity) => {
        this.store.addActivity(activity);
      });
  }

  deleteAllActivity() {
    this.dialog
      .open(DeleteConfirmationModalComponent, deleteConfirmationModalPreset)
      .afterClosed()
      .pipe(filter((deleteConfirmation) => deleteConfirmation === true))
      .subscribe((_) => {
        this.store.deleteAllActivity();
      });
  }

  editActivity(activity: Activity) {
    const {
      id,
      employeeId,
      date,
      projectId,
      projectName,
      workedTime,
      ...activityWithoutUnecessary
    } = activity;
    this.dialog
      .open(ActivityModalComponent, {
        data: {
          activity: {
            ...activityWithoutUnecessary,
          },
          activityProjects: this.store.projects(),
          activityTypes: this.store.activityTypes(),
        },
        panelClass: 'full-width-dialog',
      })
      .afterClosed()
      .pipe(
        filter((activity: Activity) => !!activity),
        take(1)
      )
      .subscribe(({ project, ...updatedActivity }: Activity) => {
        this.store.editActivity({
          ...updatedActivity,
          projectId,
          id,
        });
      });
  }

  deleteActivity(id: string) {
    this.dialog
      .open(DeleteConfirmationModalComponent, deleteConfirmationModalPreset)
      .afterClosed()
      .pipe(filter((deleteConfirmation) => deleteConfirmation === true))
      .subscribe((_) => {
        this.store.delete(id);
      });
  }

  duplicateActivity(activity: Activity) {
    this.dialog
      .open(DuplicateActivityModalComponent, {
        ...duplicateActivityModalPreset,
        data: activity,
      })
      .afterClosed()
      .pipe(filter((activityDuplication) => !!activityDuplication))
      .subscribe((activityDuplication) => {
        this.store.duplicateActivity(activityDuplication);
      });
  }
}

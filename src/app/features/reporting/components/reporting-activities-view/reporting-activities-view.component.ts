import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { EntityItemComponent } from 'src/app/shared/components/entity-item/entity-item.component';
import { MatCardActions, MatCardTitle } from '@angular/material/card';
import { CommonModule, DatePipe } from '@angular/common';
import { WorkedTimePipe } from 'src/app/features/activity/pipes/worked-time.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { Icons } from 'src/app/shared/models/icons.enum';
import { Activity } from 'src/app/shared/models/activity';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { TimePipe } from 'src/app/shared/pipes/time.pipe';
import { Days } from '../../models/days';
import { convertTimeToHours } from 'src/app/shared/utils/date-time.utils';
import { Project } from 'src/app/shared/models/project';
import { User } from 'src/app/shared/models/user';
import { ConvertTimeToHoursPipe } from 'src/app/shared/pipes/convertTimeToHours/convert-time-to-hours.pipe';

@Component({
  selector: 'app-reporting-activities-view',
  standalone: true,
  imports: [
    EntityItemComponent,
    MatButton,
    MatIconButton,
    MatIcon,
    MatCardActions,
    CommonModule,
    DatePipe,
    ConvertTimeToHoursPipe,
    WorkedTimePipe,
    TranslateModule,
    TimePipe,
    MatCardTitle,
  ],
  styles: `
    @use 'src/styles/variables.sass' as variables
    .orange
      color: variables.$rsasoft-partially-reported-day
    .green
      color: variables.$rsasoft-fully-reported-day
  `,
  templateUrl: './reporting-activities-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingActivitiesViewComponent {
  protected readonly projects = input<Project[]>();
  protected readonly activityTypes = input<string[]>();
  protected readonly users = input<User[]>();
  protected readonly monthYearReport = input<Days>();

  edit = output<{ activity: Activity; dateKey: string }>();
  add = output<string>();
  delete = output<{ activity: Activity; dateKey: string }>();

  monthYearReportUpdate = output<boolean>();

  protected readonly icons = Icons;
  protected readonly convertTimeToHours = convertTimeToHours;

  addActivityToDateEmit(dateKey: string) {
    this.add.emit(dateKey);
  }

  editActivityOfDateEmit(activity: Activity, dateKey: string) {
    this.edit.emit({ activity, dateKey });
  }

  deleteActivityOfDateEmit(activity: Activity, dateKey: string) {
    this.delete.emit({ activity, dateKey });
  }
}

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Icons } from '../../models/icons.enum';
import { MatSelectModule } from '@angular/material/select';
import { Project } from '../../models/project';
import { TranslateModule } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { ActivityFilter } from 'src/app/features/activity/models/activity-filter.model';

@Component({
  selector: 'app-entity-page-header',
  templateUrl: './entity-page-header.component.html',
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MatFormFieldModule,
    MatLabel,
    MatButton,
    MatIcon,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityPageHeaderComponent {
  protected readonly icons = Icons;

  searchLabel = input<string>();
  searchPlaceholder = input<string>();
  searchKeyUp = output<Event>();

  filter = input<ActivityFilter>();

  hasDatePicker = input(false);
  datePickerValueChanged = output<Date>();

  selectOptions = input<Project[]>();
  selectValueChanged = output<string>();

  hasAddEntity = input(false);
  addEntity = output<void>();

  hasDeleteAll = input(false);
  deleteAll = output<void>();
}

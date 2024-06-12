import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Icons } from '../../models/icons.enum';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Project } from '../../models/project';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-entity-page-header',
  templateUrl: './entity-page-header.component.html',
  imports: [
    CommonModule,
    TranslateModule,
    MatFormField,
    MatLabel,
    MatButton,
    MatIcon,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityPageHeaderComponent {
  protected readonly icons = Icons;

  searchLabel = input<string>();
  searchPlaceholder = input<string>();
  searchKeyUp = output<Event>();

  hasDatePicker = input(false);
  datePickerValue = input<Date>();
  datePickerValueChanged = output<Date>();

  selectOptions = input<Project[]>();
  selectValueChanged = output<string>();

  hasAddEntity = input(false);
  addEntity = output<void>();

  hasDeleteAll = input(false);
  deleteAll = output<void>();
}

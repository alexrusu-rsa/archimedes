import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Icons } from '../../models/icons.enum';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    MatButton,
    MatIconButton,
    MatDialogActions,
    MatDialogTitle,
    MatDialogClose,
  ],
  templateUrl: './delete-confirmation-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmationModalComponent {
  protected icons = Icons;
  dialogRef = inject(MatDialogRef<DeleteConfirmationModalComponent>);
}

export const deleteConfirmationModalPreset = {
  maxHeight: '50%',
  minHeight: '350px',
  panelClass: [
    'translate-middle-y',
    'top-50',
    'start-50',
    'justify-content-center',
    'col-12',
    'col-xs-12',
    'col-sm-12',
    'col-md-12',
    'col-lg-4',
    'col-xl-4',
    'col-xxl-3',
  ],
};

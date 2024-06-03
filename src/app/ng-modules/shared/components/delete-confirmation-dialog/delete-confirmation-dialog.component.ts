import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Icons } from 'src/app/models/icons.enum';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
})
export class DeleteConfirmationDialogComponent {
  icons = Icons;
  dialogRef = inject(MatDialogRef<DeleteConfirmationDialogComponent>);
}

export const deleteConfirmationDialogPreset = {
  maxHeight: '50%',
  minHeight: '350px',
  panelClass: [
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

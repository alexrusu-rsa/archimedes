import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Icons } from 'src/app/models/icons.enum';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.sass'],
})
export class DeleteConfirmationDialogComponent {
  icons = Icons;
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>
  ) {}

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}

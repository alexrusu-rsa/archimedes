import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog.component';

@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.sass'],
})
export class NewUserDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public newUserPasswordToDisplay: string,
    public dialogRef: MatDialogRef<InvoiceDialogComponent>
  ) {}
  newUserPassword?: string;
  ngOnInit(): void {
    this.newUserPassword = this.newUserPasswordToDisplay;
  }
}

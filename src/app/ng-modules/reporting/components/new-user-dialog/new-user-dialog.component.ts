import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.sass'],
})
export class NewUserDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public newUserPasswordToDisplay: string,
    public dialogRef: MatDialogRef<UserDialogComponent>
  ) {}
  newUserPassword?: string;
  ngOnInit(): void {
    this.newUserPassword = this.newUserPasswordToDisplay;
  }
}

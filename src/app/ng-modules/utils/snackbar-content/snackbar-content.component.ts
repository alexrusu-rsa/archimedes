import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { HttpErrorSnackbar } from 'src/app/models/http-error-snackbar';

@Component({
  selector: 'app-snackbar-content',
  templateUrl: './snackbar-content.component.html',
  styleUrls: ['./snackbar-content.component.sass'],
})
export class SnackbarContentComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: HttpErrorSnackbar) {}
  errorCode?: number;
  errorText?: string;
  successMessageToDisplay?: string;
  ngOnInit(): void {
    console.log(this.data);
    if (this.data.errorMessage !== undefined) {
      this.errorCode = this.data.status;
      this.errorText = this.data.errorMessage;
    } else {
      this.successMessageToDisplay = this.data.successMessage;
    }
  }
}

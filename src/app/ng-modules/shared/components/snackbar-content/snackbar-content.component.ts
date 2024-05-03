import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { HttpErrorSnackbar } from 'src/app/models/http-error-snackbar';
import { Icons } from 'src/app/models/icons.enum';

@Component({
  selector: 'app-snackbar-content',
  templateUrl: './snackbar-content.component.html',
  styleUrls: ['./snackbar-content.component.sass'],
})
export class SnackbarContentComponent implements OnInit {
  errorCode?: number;
  errorText?: string;
  successMessageToDisplay?: string;
  icons = Icons;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: HttpErrorSnackbar) {}
  ngOnInit(): void {
    if (this.data.errorMessage !== undefined) {
      this.errorCode = this.data.status;
      this.errorText = this.data.errorMessage;
    } else {
      this.successMessageToDisplay = this.data.successMessage;
    }
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar-content',
  templateUrl: './snackbar-content.component.html',
  styleUrls: ['./snackbar-content.component.sass'],
})
export class SnackbarContentComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {}
  errorCode?: string;
  errorText?: string;
  formatError(rawErrorMessage: string) {
    this.errorCode = rawErrorMessage.split(' ')[0];
    this.errorText = rawErrorMessage.slice(rawErrorMessage.indexOf(' ') + 1);
  }
  ngOnInit(): void {
    if (this.data.indexOf(':')) this.formatError(this.data);
  }
}

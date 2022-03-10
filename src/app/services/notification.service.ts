import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarContentComponent } from '../ng-modules/utils/snackbar-content/snackbar-content.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  durationInSeconds = 5;

  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(errorMessage: string) {
    const errorMessageSplit = errorMessage.split(': ')[1];
    this.snackBar.openFromComponent(SnackbarContentComponent, {
      duration: this.durationInSeconds * 1000,
      data: errorMessageSplit,
    });
  }
}

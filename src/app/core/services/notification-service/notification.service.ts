import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorSnackbar } from '../../models/http-error-snackbar';

import { SnackbarContentComponent } from '../../layout/components/snackbar-content/snackbar-content.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  dataToSend?: HttpErrorSnackbar;
  durationInSeconds = 3;
  constructor(private snackBar: MatSnackBar) {}
  openSnackBar(errorMessage: string, status: number) {
    this.snackBar.openFromComponent(SnackbarContentComponent, {
      duration: this.durationInSeconds * 1000,
      data: { status, message: errorMessage },
    });
  }

  openSuccesfulNotification(successMessage: string) {
    this.snackBar.openFromComponent(SnackbarContentComponent, {
      duration: this.durationInSeconds * 1000,
      data: { message: successMessage },
    });
  }
}

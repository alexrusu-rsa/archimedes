import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorSnackbar } from '../models/http-error-snackbar';
import { UserDashboardComponent } from '../ng-modules/reporting/components/user-reporting-page/user-reporting-page.component';

import { SnackbarContentComponent } from '../ng-modules/utils/snackbar-content/snackbar-content.component';

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
      data: new HttpErrorSnackbar(status, errorMessage),
    });
  }

  openSuccesfulNotification(successMessage: string) {
    this.snackBar.openFromComponent(SnackbarContentComponent, {
      duration: this.durationInSeconds * 1000,
      data: new HttpErrorSnackbar(undefined, undefined, successMessage),
    });
  }
}

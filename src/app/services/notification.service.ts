import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, of, tap } from 'rxjs';
import { RequestWrapper } from '../models/request-wrapper';
import { User } from '../models/user';
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

  openSnackBarCustomMessage(errorMessage: string) {
    this.snackBar.openFromComponent(SnackbarContentComponent, {
      duration: this.durationInSeconds * 1000,
      data: errorMessage,
    });
  }
}

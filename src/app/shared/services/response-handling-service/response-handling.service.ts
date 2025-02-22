/* eslint-disable no-console */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification-service/notification.service';

@Injectable({
  providedIn: 'root',
})
export class ResponseHandlingService {
  constructor(private notificationService: NotificationService) {}

  handleResponse(message: string) {
    this.notificationService.openSuccesfulNotification(message);
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (err: HttpErrorResponse): Observable<T> => {
      console.error(err);
      this.notificationService.openSnackBar(
        err.error.message,
        err.error.statusCode
      );
      console.error(`${operation} failed: ${err.message}`);
      return of(result as T);
    };
  }
}

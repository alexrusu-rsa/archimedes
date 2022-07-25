import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RequestWrapper } from '../models/request-wrapper';
import { User } from '../models/user';
import { ResponseHandlingService } from './response-handling.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagePasswordService {
  private userUrl = environment.serviceURL + 'user';
  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(
    private httpClient: HttpClient,
    @Inject(NotificationService)
    private notificationService: NotificationService,
    private responseHandlingService: ResponseHandlingService
  ) {}

  resetPasswordFor(userToUpdate: User): Observable<RequestWrapper> {
    const resetPasswordUrl = this.userUrl + '/' + 'password';
    return this.httpClient
      .put<RequestWrapper>(resetPasswordUrl, userToUpdate, {
        observe: 'response',
      })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Password reset');
          return res.body as RequestWrapper;
        }),
        catchError(
          this.responseHandlingService.handleError<RequestWrapper>(
            'resetpassword'
          )
        )
      );
  }

  changePasswordFor(
    newPassword: string,
    userId: string
  ): Observable<RequestWrapper> {
    const changePasswordUrl = this.userUrl + '/' + 'change';
    return this.httpClient
      .put<RequestWrapper>(
        changePasswordUrl,
        { userId, newPassword },
        {
          observe: 'response',
        }
      )
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Password changed succesfully');
          return res.body as RequestWrapper;
        }),
        catchError(
          this.responseHandlingService.handleError<RequestWrapper>(
            'changepassword'
          )
        )
      );
  }
}

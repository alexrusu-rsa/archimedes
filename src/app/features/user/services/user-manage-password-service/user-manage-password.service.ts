import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RequestWrapper } from '../../../../shared/models/request-wrapper';
import { User } from '../../../../shared/models/user';
import { ResponseHandlingService } from '../../../../shared/services/response-handling-service/response-handling.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagePasswordService {
  private userUrl = environment.serviceURL + 'user';
  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  private responseHandlingService = inject(ResponseHandlingService);
  private httpClient = inject(HttpClient);

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
          this.responseHandlingService.handleResponse(
            'Password changed succesfully'
          );
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

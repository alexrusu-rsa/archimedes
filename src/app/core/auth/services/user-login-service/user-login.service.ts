import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../../../shared/models/user';
import { ResponseHandlingService } from '../../../../shared/services/response-handling-service/response-handling.service';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  private usersUrl = environment.serviceURL + 'user';
  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private httpClient: HttpClient,
    private responseHandlingService: ResponseHandlingService
  ) {}

  getUser(): Observable<User> {
    return this.httpClient.get<User>(this.usersUrl + '/currentUser').pipe(
      // TODO handle this time format in backend
      map((user) => ({ ...user, timePerDay: user.timePerDay + ':00' })),
      catchError(this.responseHandlingService.handleError<User>('getUser'))
    );
  }

  logUserIn(user: User): Observable<LoginResponse> {
    const logInUrl = this.usersUrl + '/creds';
    return this.httpClient
      .post<LoginResponse>(
        logInUrl,
        {
          username: user.email,
          password: user.password,
        },
        { observe: 'response' }
      )
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Logged in succesfully');
          return res.body as LoginResponse;
        }),
        catchError(
          this.responseHandlingService.handleError<LoginResponse>(
            'userLoggedIn'
          )
        )
      );
  }
}

interface LoginResponse {
  accessToken: string;
  currentUser: User;
}

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { AuthService } from 'src/app/core/auth/services/auth-service/auth.service';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/localstorage-service/localstorage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.getToken();

    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + authToken,
      },
    });

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401) {
          return throwError(() => new Error(error.message));
        }
        this.localStorageService.localStorageLogout();
        this.router.navigate(['auth/login']);

        return throwError(() => new Error(error.message));
      })
    );
  }
}

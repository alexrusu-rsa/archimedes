import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { RoleCheckService } from 'src/app/services/rolecheck-service/rolecheck.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/localstorage-service/localstorage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private roleCheckService: RoleCheckService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    const userId = this.roleCheckService.getId();

    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + authToken,
      },
      setParams: {
        userId: '' + userId,
      },
    });

    return next.handle(req).pipe(
      tap(
        () => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
              return;
            }
            this.localStorageService.localStorageLogout();
            this.router.navigate(['auth/login']);
          }
        }
      )
    );
  }
}

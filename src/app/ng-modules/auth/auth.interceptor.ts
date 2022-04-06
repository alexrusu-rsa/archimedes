import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { RoleCheckService } from 'src/app/services/rolecheck.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  bodyOfRequest: any;
  finalBodyOfRequest: any;
  constructor(
    private authService: AuthService,
    private roleCheckService: RoleCheckService
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
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
    return next.handle(req);
  }
}

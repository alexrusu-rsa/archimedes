import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { RoleCheckService } from 'src/app/services/rolecheck-service/rolecheck.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    public roleCheckService: RoleCheckService,
    public router: Router
  ) {}
  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.roleCheckService.isAdmin !== true) {
      this.router.navigate(['auth/login']);
    }
    return true;
  }
}

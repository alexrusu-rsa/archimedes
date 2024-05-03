import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserAccessGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    console.log('user access guard');

    if (this.authService.isLoggedIn === true) {
      console.log('is loggedIn');

      this.router.navigate(['reporting']);
    }
    return true;
  }
}

import { Injectable } from '@angular/core';
import { Observable, filter, of, switchMap } from 'rxjs';
import { User } from 'src/app/models/user';
import { LocalStorageService } from 'src/app/services/localstorage-service/localstorage.service';
import { UserService } from 'src/app/services/user-service/user.service';
@Injectable()
export class UserFacade {
  public currentUser$: Observable<User>;
  public users$: Observable<User[]>;

  constructor(
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) {
    // get user Id from localStorage
    const userId = this.localStorageService.userId;
    if (userId) this.currentUser$ = this.userService.getUser(userId);

    this.users$ = this.userService.getUsers();
  }

  updateUsers() {
    this.users$ = this.userService.getUsers();
  }

  changePassword(newPassword: string) {
    return this.currentUser$.pipe(
      filter((user: User) => !!user.id),
      switchMap((user: User) => {
        if (user.id)
          return this.userService.changePasswordFor(newPassword, user.id);
        else return of();
      })
    );
  }

  deleteUser(userId: string) {
    return this.userService.deleteUser(userId);
  }
}

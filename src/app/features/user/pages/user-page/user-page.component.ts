import {
  Component,
  DestroyRef,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Icons } from 'src/app/shared/models/icons.enum';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/features/user/services/user-service/user.service';
import { CommonModule } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardTitle,
  MatCardActions,
  MatCardSubtitle,
} from '@angular/material/card';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { EntityItemComponent } from 'src/app/shared/components/entity-item/entity-item.component';
import { EntityPageHeaderComponent } from 'src/app/shared/components/entity-page-header/entity-page-header.component';
import {
  DeleteConfirmationModalComponent,
  deleteConfirmationModalPreset,
} from 'src/app/shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { filter, switchMap, take } from 'rxjs';
import { UserModalComponent } from '../../components/user-modal/user-modal.component';
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    EntityPageHeaderComponent,
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatCardActions,
    MatIcon,
    MatButton,
    MatIconButton,
    MatChip,
    MatChipSet,
    EntityItemComponent,
  ],
})
export class UserPageComponent {
  protected readonly icons = Icons;
  readonly destroyRef = inject(DestroyRef);
  private service = inject(UserService);
  private dialog = inject(MatDialog);
  protected search = signal('');
  private rawUsers: Signal<User[]> = toSignal(
    this.service.getUsers().pipe(takeUntilDestroyed(this.destroyRef)),
    { initialValue: [] }
  );
  private users = computed(() => signal(this.rawUsers()));
  protected filteredUsers = computed(() =>
    this.users()().filter((user: User) =>
      (user.surname + user.name)
        .toLowerCase()
        .includes(this.search().trim().toLowerCase())
    )
  );

  addUser() {
    this.dialog
      .open(UserModalComponent)
      .afterClosed()
      .pipe(
        filter((newUser: User) => !!newUser),
        switchMap((newUser: User) => {
          return this.service
            .addUser(newUser)
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        take(1)
      )
      .subscribe((user: User) => {
        this.users().update((users) => [...users, user]);
      });
  }

  editUser(user: User) {
    this.dialog
      .open(UserModalComponent, {
        data: user,
      })
      .afterClosed()
      .pipe(
        filter((editedUser: User) => !!editedUser),
        switchMap((editedUser: User) => {
          return this.service
            .updateUser(editedUser)
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        take(1)
      )
      .subscribe((editedUser: User) => {
        this.users().update((users) =>
          users.map((user) => {
            if (editedUser?.id === user?.id) return editedUser;
            return user;
          })
        );
      });
  }

  deleteUser(userId: string) {
    this.dialog
      .open(DeleteConfirmationModalComponent, deleteConfirmationModalPreset)
      .afterClosed()
      .pipe(
        filter((deleteConfirmation) => deleteConfirmation === true),
        switchMap((_) => {
          return this.service
            .deleteUser(userId)
            .pipe(takeUntilDestroyed(this.destroyRef));
        }),
        take(1)
      )
      .subscribe((_) => {
        this.users().update((users) =>
          users.filter((user) => user.id !== userId)
        );
      });
  }
}

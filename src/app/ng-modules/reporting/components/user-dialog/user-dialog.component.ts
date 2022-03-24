import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.sass'],
})
export class UserDialogComponent implements OnInit {
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) {}

  addUserForm?: FormGroup;
  currentUser?: User;
  addCurrentUserSub?: Subscription;
  updateUserSub?: Subscription;

  addUser() {
    if (this.currentUser)
      this.addCurrentUserSub = this.userService
        .addUser(this.currentUser)
        .subscribe();
  }
  dialogClose() {
    this.dialogRef.close();
  }

  editUser() {
    if (this.currentUser) {
      this.updateUserSub = this.userService
        .updateUser(this.currentUser)
        .subscribe();
    }
  }

  ngOnInit(): void {
    this.currentUser = <User>{};
    if (this.user !== null) this.currentUser = this.user;
    this.addUserForm = new FormGroup({
      email: new FormControl(this.currentUser?.email),
      surname: new FormControl(this.currentUser?.surname),
      name: new FormControl(this.currentUser?.name),
      role: new FormControl(this.currentUser?.role),
      seniority: new FormControl(this.currentUser?.seniority),
      password: new FormControl(this.currentUser?.password),
    });
  }

  get surname() {
    return this.addUserForm?.get('surname');
  }

  get password() {
    return this.addUserForm?.get('password');
  }

  get email() {
    return this.addUserForm?.get('email');
  }

  get name() {
    return this.addUserForm?.get('name');
  }

  get role() {
    return this.addUserForm?.get('role');
  }

  get seniority() {
    return this.addUserForm?.get('seniority');
  }
}

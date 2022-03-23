import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.sass'],
})
export class UserDialogComponent implements OnInit {
  constructor() {}
  addUserForm?: FormGroup;
  currentUser?: User;

  ngOnInit(): void {
    this.currentUser = <User>{};
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

  get email() {
    return this.addUserForm?.get('email');
  }

  get name() {
    return this.addUserForm?.get('name');
  }
}

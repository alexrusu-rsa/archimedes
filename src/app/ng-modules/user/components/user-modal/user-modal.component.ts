import { Component, DestroyRef, Inject, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, of, take } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserFacade } from '../../user.facade';
import { IconEnum } from 'src/app/ng-modules/shared/icon.enum';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.sass'],
})
export class UserModalComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  icon = IconEnum;
  userForm: FormGroup;

  constructor(
    private facade: UserFacade,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) {
    // do something
  }

  // Getter for the whole form
  get form() {
    return this.userForm;
  }

  // Getters for individual controls (with type assertion)
  get surnameControl(): FormControl {
    return this.userForm.get('surname') as FormControl;
  }

  get nameControl(): FormControl {
    return this.userForm.get('name') as FormControl;
  }

  get emailControl(): FormControl {
    return this.userForm.get('email') as FormControl;
  }

  get roleControl(): FormControl {
    return this.userForm.get('role') as FormControl;
  }

  get seniorityControl(): FormControl {
    return this.userForm.get('seniority') as FormControl;
  }

  get commitmentControl(): FormControl {
    return this.userForm.get('commitment') as FormControl;
  }

  get adminControl(): FormControl {
    return this.userForm.get('admin') as FormControl;
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      surname: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      role: [''],
      seniority: [''],
      commitment: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Ensure only integers
      admin: [false],
    });
  }

  onSubmit() {
    if (!this.user) {
      this.facade
        .create({
          ...this.userForm.value,
          timePerDay: this.commitmentControl.value,
        })
        .pipe(
          take(1),
          catchError((error) => {
            return of(null);
          })
        )
        .subscribe((newUser: User | null) => {
          if (newUser) this.dialogRef.close(newUser);
        });
    }
  }

  editUser() {
    this.facade
      .update(this.user)
      .pipe(take(1))
      .subscribe((updatedUser: User) => {
        this.dialogRef.close(updatedUser);
      });
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }
}

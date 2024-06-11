import { CommonModule, KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardTitle } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatLabel, MatHint, MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { Icons } from 'src/app/shared/models/icons.enum';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatCard,
    MatCardTitle,
    MatLabel,
    MatIcon,
    MatHint,
    MatFormField,
    MatButton,
    MatIconButton,
    MatInput,
    MatSlideToggle,
    KeyValuePipe,
  ],
  templateUrl: './user-modal.component.html',
  styles: [
    `
      .mat-dialog-content
        overflow: unset
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserModalComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<UserModalComponent>);
  private formBuilder = inject(FormBuilder);
  protected user = inject(MAT_DIALOG_DATA);
  protected readonly icons = Icons;
  protected userForm: FormGroup;
  protected validators = Validators;

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      surname: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      role: ['', Validators.required],
      seniority: ['', Validators.required],
      timePerDay: [0, Validators.required],
      roles: [false],
    });

    if (this.user) {
      const { id, password, ...userWithoutId } = this.user;
      this.userForm.setValue(userWithoutId);
    }
  }

  submit() {
    if (this.userForm.invalid) return;
    if (this.user)
      this.dialogRef.close({
        ...this.userForm.value,
        id: this.user.id,
      });
    if (!this.user) this.dialogRef.close(this.userForm.value);
  }
}

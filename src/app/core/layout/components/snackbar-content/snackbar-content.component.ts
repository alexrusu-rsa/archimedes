import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { HttpErrorSnackbar } from 'src/app/core/models/http-error-snackbar';
import { Icons } from 'src/app/shared/models/icons.enum';

@Component({
  selector: 'app-snackbar-content',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './snackbar-content.component.html',
})
export class SnackbarContentComponent {
  protected readonly icons = Icons;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: HttpErrorSnackbar) {}
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-invoice-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-modal.component.html',
  styleUrl: './invoice-modal.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceModalComponent {}

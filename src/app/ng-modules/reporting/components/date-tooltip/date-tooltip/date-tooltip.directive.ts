import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  selector: '[appDateTooltip]',
})
export class DateTooltipDirective implements OnInit {
  private _date?: Date;

  @Input('appDateTooltip') set date(value: Date) {
    this._date = value;
    this.setTooltipText();
  }

  constructor(private elementRef: ElementRef, private matTooltip: MatTooltip) {}

  ngOnInit(): void {
    this.setTooltipText();
  }

  private setTooltipText(): void {
    if (this._date) {
      const tooltipText = this._date.toDateString();
      this.matTooltip.message = tooltipText;
      this.elementRef.nativeElement.setAttribute('content', tooltipText);
    }
  }
}

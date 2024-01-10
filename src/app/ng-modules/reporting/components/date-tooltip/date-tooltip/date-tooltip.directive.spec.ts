import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTooltipComponent } from './date-tooltip.directive';

describe('DateTooltipComponent', () => {
  let component: DateTooltipComponent;
  let fixture: ComponentFixture<DateTooltipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DateTooltipComponent]
    });
    fixture = TestBed.createComponent(DateTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

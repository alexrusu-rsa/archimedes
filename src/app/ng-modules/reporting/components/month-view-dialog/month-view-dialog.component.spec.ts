import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthViewDialogComponent } from './month-view-dialog.component';

describe('MonthViewDialogComponent', () => {
  let component: MonthViewDialogComponent;
  let fixture: ComponentFixture<MonthViewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthViewDialogComponent]
    });
    fixture = TestBed.createComponent(MonthViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

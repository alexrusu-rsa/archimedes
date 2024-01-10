import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReportingMonthviewComponent } from './user-reporting-monthview.component';

describe('UserReportingMonthviewComponent', () => {
  let component: UserReportingMonthviewComponent;
  let fixture: ComponentFixture<UserReportingMonthviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserReportingMonthviewComponent]
    });
    fixture = TestBed.createComponent(UserReportingMonthviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

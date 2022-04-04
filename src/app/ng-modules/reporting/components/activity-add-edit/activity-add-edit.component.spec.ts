import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityAddEditComponent } from './activity-add-edit.component';

describe('ActivityAddEditComponent', () => {
  let component: ActivityAddEditComponent;
  let fixture: ComponentFixture<ActivityAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

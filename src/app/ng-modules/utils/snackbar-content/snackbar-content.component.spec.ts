import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarContentComponent } from './snackbar-content.component';

describe('SnackbarContentComponent', () => {
  let component: SnackbarContentComponent;
  let fixture: ComponentFixture<SnackbarContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnackbarContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

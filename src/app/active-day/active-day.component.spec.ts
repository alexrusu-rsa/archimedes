import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveDayComponent} from './active-day.component';

describe('ActiveDayComponent', () => {
  let component: ActiveDayComponent;
  let fixture: ComponentFixture<ActiveDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

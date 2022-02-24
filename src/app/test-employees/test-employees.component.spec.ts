import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEmployeesComponent } from './test-employees.component';

describe('TestEmployeesComponent', () => {
  let component: TestEmployeesComponent;
  let fixture: ComponentFixture<TestEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestEmployeesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

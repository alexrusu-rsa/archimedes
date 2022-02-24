import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Employee } from '../employee/employee';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-test-employees',
  templateUrl: './test-employees.component.html',
  styleUrls: ['./test-employees.component.sass'],
})
export class TestEmployeesComponent implements OnInit {
  constructor(private employeeService: EmployeeService) {}
  employees: Employee[] = [];
  employeesSubscription?: Subscription;
  getEmployees(): void {
    this.employeesSubscription = this.employeeService
      .getEmployees()
      .subscribe((response) => (this.employees = response));
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  ngOnDestroy() {
    this.employeesSubscription?.unsubscribe();
  }
}

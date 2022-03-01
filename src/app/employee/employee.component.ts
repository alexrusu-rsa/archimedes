import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Day } from '../day/day';
import { EmployeeService } from '../services/employee.service';
import { Employee } from './employee';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.sass'],
})
export class EmployeeComponent implements OnInit, OnDestroy {
  employee!: Employee;
  routeSub?: Subscription;
  employeeSub?: Subscription;
  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute
  ) {}

  getEmployee(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      const employeeId = params['id'];
      this.employeeSub = this.employeeService
        .getEmployee(Number(employeeId))
        .subscribe((response) => (this.employee = response));
    });
  }
  ngOnInit(): void {
    this.getEmployee();
    console.log(this.routeSub);
  }

  ngOnDestroy(): void {}
}

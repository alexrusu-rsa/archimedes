import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmptyError } from 'rxjs';
import { EmployeeCommitmentCalendar } from 'src/app/models/employee-commitment-calendar';
import { EmployeeCommitmentDate } from 'src/app/models/employee-commitment-date';

@Component({
  selector: 'app-reporting-hours-booked-dialog',
  templateUrl: './reporting-hours-booked-dialog.component.html',
  styleUrls: ['./reporting-hours-booked-dialog.component.sass'],
})
export class ReportingHoursBookedDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public employeeCommitmentOfSelectedDay: EmployeeCommitmentDate,
    public datepipe: DatePipe
  ) {}

  employeeCommitmentToDisplay!: EmployeeCommitmentCalendar[];
  dateToDisplay!: string;

  ngOnInit(): void {
    this.employeeCommitmentToDisplay =
      this.employeeCommitmentOfSelectedDay.employeeCommitment!;
    const todayDate = this.employeeCommitmentOfSelectedDay.todayDate!;
    const dateToDisplay = this.datepipe.transform(todayDate, 'dd/MM/yyyy');
    this.dateToDisplay = dateToDisplay!;
  }
}

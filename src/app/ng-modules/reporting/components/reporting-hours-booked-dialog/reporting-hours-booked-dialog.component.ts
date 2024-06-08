import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeCommitmentCalendar } from 'src/app/models/employee-commitment-calendar';
import { EmployeeCommitmentDate } from 'src/app/models/employee-commitment-date';
import { Icons } from 'src/app/shared/models/icons.enum';

@Component({
  selector: 'app-reporting-hours-booked-dialog',
  templateUrl: './reporting-hours-booked-dialog.component.html',
  styleUrls: ['./reporting-hours-booked-dialog.component.sass'],
})
export class ReportingHoursBookedDialogComponent implements OnInit {
  employeeCommitmentToDisplay: EmployeeCommitmentCalendar[];
  dateToDisplay: string;
  protected icons = Icons;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public employeeCommitmentOfSelectedDay: EmployeeCommitmentDate,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.employeeCommitmentToDisplay =
      this.employeeCommitmentOfSelectedDay.employeeCommitment;
    const todayDate = this.employeeCommitmentOfSelectedDay.todayDate;
    const dateToDisplay = this.datepipe.transform(todayDate, 'dd/MM/yyyy');
    this.dateToDisplay = dateToDisplay;
  }
}

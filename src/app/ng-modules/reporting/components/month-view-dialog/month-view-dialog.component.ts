import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserDate } from 'src/app/models/user-date';

@Component({
  selector: 'app-month-view-dialog',
  templateUrl: './month-view-dialog.component.html',
  styleUrls: ['./month-view-dialog.component.sass'],
})
export class MonthViewDialogComponent implements OnInit {
  constructor(
    private router: Router,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public activityReportUserDate: UserDate
  ) {}

  goToActivityPage(): void {
    this.router.navigate(
      [`/reporting/activity/${this.activityReportUserDate.userId}`],
      {
        queryParams: {
          presetDate: this.activityReportUserDate.date,
        },
      }
    );
    this.dialog.closeAll();
  }

  ngOnInit(): void {
    console.log(this.activityReportUserDate);
  }
}

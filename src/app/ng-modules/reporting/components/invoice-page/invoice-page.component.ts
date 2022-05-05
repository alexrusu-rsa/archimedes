import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core/datetime';
import { MatDatepicker } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { Customer } from 'src/app/models/customer';
import { ActivityService } from 'src/app/services/activity.service';
import { CustomerService } from 'src/app/services/customer.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/project';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceDataWrapper } from 'src/app/models/invoice-data-wrapper';
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog.component';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.sass'],
})
export class InvoicePageComponent implements OnInit {
  allCustomers?: Customer[];
  allCustomersSub?: Subscription;

  allActivitiesOfMonthYear?: Activity[];
  allActivitiesOfMonthYearSub?: Subscription;

  allProjects?: Project[];
  allProjectsSub?: Subscription;

  constructor(
    private customerService: CustomerService,
    private activityService: ActivityService,
    private projectService: ProjectService,
    public dialog: MatDialog
  ) {}

  dateChanges() {
    return;
  }

  getActivitiesOfMonthYear(month: string, year: string) {
    this.allActivitiesOfMonthYearSub = this.activityService
      .getActivitiesOfMonthYear(month, year)
      .subscribe((result: Activity[]) => {
        this.allActivitiesOfMonthYear = result;
        console.log(result);
      });
  }

  getAllCustomers() {
    this.allCustomersSub = this.customerService
      .getCustomers()
      .subscribe((result) => {
        this.allCustomers = result;
      });
  }

  downloadInvoice(customerId: string) {
    const dialogRef = this.dialog.open(InvoiceDialogComponent, {
      data: <InvoiceDataWrapper>{
        customerId: customerId,
        month: '04',
        year: '2022',
      },
      panelClass: 'full-width-dialog',
    });
  }

  getAllProjects() {
    this.allProjectsSub = this.projectService
      .getProjects()
      .subscribe((result: Project[]) => {
        this.allProjects = result;
      });
  }

  ngOnInit(): void {
    this.getAllCustomers();
    this.getActivitiesOfMonthYear('04', '2022');
    if (this.allActivitiesOfMonthYear)
      console.log(this.allActivitiesOfMonthYear);
    this.getAllProjects();
  }
}

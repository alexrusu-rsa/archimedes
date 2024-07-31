// import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
// import {
//   DateAdapter,
//   MAT_DATE_LOCALE,
//   MAT_DATE_FORMATS,
// } from '@angular/material/core';
// import _moment from 'moment';
// import { default as _rollupMoment } from 'moment';
// import {
//   MomentDateAdapter,
//   MAT_MOMENT_DATE_ADAPTER_OPTIONS,
// } from '@angular/material-moment-adapter';
// import { FormControl, FormGroup } from '@angular/forms';
// import { Activity } from 'src/app/shared/models/activity';
// import { switchMap } from 'rxjs';
// import { Project } from 'src/app/shared/models/project';
// import { RateService } from 'src/app/features/rate/services/rate-service/rate.service';
// import { Rate } from 'src/app/shared/models/rate';
// import { MatDialog } from '@angular/material/dialog';
// import { ReportingHoursBookedDialogComponent } from '../reporting-hours-booked-dialog/reporting-hours-booked-dialog.component';
// import { TooltipPosition } from '@angular/material/tooltip';
// import { DatePipe } from '@angular/common';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import {
//   CalendarDay,
//   WeekCalendarDay,
// } from 'src/app/features/activity/models/week-calendar-day';
// import { EmployeeCommitmentDate } from 'src/app/features/reporting/models/employee-commitment-date';
// import { EmployeeCommitmentCalendar } from 'src/app/shared/models/employee-commitment-calendar';
// import { User } from 'src/app/shared/models/user';
// import { ActivityService } from 'src/app/features/activity/services/activity-service/activity.service';
// import { ProjectService } from 'src/app/features/project/services/project-service/project.service';
// import { UserService } from 'src/app/features/user/services/user-service/user.service';

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'MM/YYYY',
//   },
//   display: {
//     dateInput: 'MM/YYYY',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };
// const moment = _rollupMoment || _moment;

// @Component({
//   selector: 'app-reporting-page',
//   templateUrl: './reporting-page.component.html',
//   styleUrls: ['./reporting-page.component.sass'],
//   providers: [
//     {
//       provide: DateAdapter,
//       useClass: MomentDateAdapter,
//       deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
//     },

//     { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
//   ],
// })
// export class ReportingPageComponent implements OnInit {
//   @Input() currentEmployeeId?: string;

//   date = new FormControl(moment());
//   readonly destroyRef = inject(DestroyRef);
//   startDate?: Date;
//   selectedMonth?: string;
//   selectedYear?: string;

//   allActivities?: Activity[];

//   allEmployees?: User[];

//   selectedItemEmployee?: string;
//   range?: FormGroup;

//   pickedStartDate?: string;
//   pickedEndDate?: string;

//   activitiesInRange: Activity[] = [];

//   allProjects?: Project[];

//   allRates?: Rate[];

//   noFilterUsers = 'ALLUSERS';
//   nameFilter?: string;

//   nameFilteredActivities?: Activity[];
//   filterRange: Date[] = [];

//   calendarDays?: CalendarDay[] = [];
//   datesInSelectedRange: Date[] = [];
//   positionOptions: TooltipPosition[] = [
//     'after',
//     'before',
//     'above',
//     'below',
//     'left',
//     'right',
//   ];

//   employeesTotalCommitment?: number;
//   calendar?: Calendar = <Calendar>{
//     numberOfWeeks: 0,
//     weeksInCalendar: [],
//   };

//   firstDayOfCalendarInitial?: Date;
//   lastDayOfCalendarInitial?: Date;

//   constructor(
//     private activityService: ActivityService,
//     private userService: UserService,
//     private projectService: ProjectService,
//     private rateService: RateService,
//     public datepipe: DatePipe,
//     public dialog: MatDialog
//   ) {}

//   generateCalendarDaysForEachDateInSelectedRange() {
//     this.datesInSelectedRange.forEach((date) => {
//       const newCalendarDay = <CalendarDay>(<unknown>{
//         color: 'red',
//         timeBooked: 0,
//         expectedTimeCommitment: this.employeesTotalCommitment,
//         date: <Date>date,
//         employeesCommitment: [],
//         tooltipMessage: '',
//       });
//       this.calendarDays?.push(newCalendarDay);
//     });
//     this.computeTimeCommitmentOnCalendarDaysAllEmployees();
//   }

//   computeTimeCommitmentOnCalendarDaysAllEmployees() {
//     if (this.calendarDays)
//       this.calendarDays?.forEach((calendarDay) => {
//         this.allEmployees?.forEach((employee) => {
//           const filteredActivitiesOfEmployee = this.allActivities?.filter(
//             (activity) => activity.employeeId === employee.id
//           );
//           let employeeReportedHours = 0;
//           let employeeReportedMinutes = 0;
//           if (filteredActivitiesOfEmployee) {
//             filteredActivitiesOfEmployee?.forEach((activity) => {
//               if (
//                 activity.date ===
//                 this.transformNewDateToDBString(calendarDay.date)
//               ) {
//                 employeeReportedHours =
//                   employeeReportedHours +
//                   Number(activity.workedTime?.split(':')[0]);
//                 employeeReportedMinutes =
//                   employeeReportedMinutes +
//                   Number(activity.workedTime?.split(':')[1]);
//               }
//             });
//             const hoursFromMinutes = this.minutesToHours(
//               employeeReportedMinutes
//             );
//             employeeReportedHours = employeeReportedHours + hoursFromMinutes;
//             const newEmployeeCommitmentCalendar = <EmployeeCommitmentCalendar>(<
//               unknown
//             >{
//               employee: employee.id,
//               employeeName: employee.name + ' ' + employee.surname,
//               reportedHours: employeeReportedHours,
//               employeeExpectedCommitment: this.getExpectedCommitmentOfEmployee(
//                 employee.id
//               ),
//             });
//             if (newEmployeeCommitmentCalendar.employeeExpectedCommitment > 0)
//               calendarDay.employeesCommitment.push(
//                 newEmployeeCommitmentCalendar
//               );
//           }
//         });
//       });
//   }

//   getTooltipText(calendarDay: CalendarDay): string {
//     return calendarDay.tooltipMessage;
//   }

//   generateTooltipMessagesForCalendarDays() {
//     this.calendarDays?.forEach((calendarDay) => {
//       let newMessage = '';
//       calendarDay.employeesCommitment.forEach((employeeCommitment) => {
//         newMessage =
//           newMessage +
//           this.genereateEmployeeMessageForTooltip(employeeCommitment);
//       });
//       calendarDay.tooltipMessage = newMessage;
//     });
//   }

//   genereateEmployeeMessageForTooltip(
//     employeeCommitment: EmployeeCommitmentCalendar
//   ): string {
//     if (employeeCommitment.reportedHours === 0) {
//       return employeeCommitment.employeeName + ' no reported hours' + '.\n';
//     }
//     if (
//       employeeCommitment.reportedHours > 0 &&
//       employeeCommitment.reportedHours <
//         employeeCommitment.employeeExpectedCommitment
//     )
//       return (
//         employeeCommitment.employeeName +
//         ' - ' +
//         employeeCommitment.reportedHours.toString() +
//         '/' +
//         employeeCommitment.employeeExpectedCommitment.toString() +
//         '.\n'
//       );

//     if (
//       employeeCommitment.reportedHours >=
//       employeeCommitment.employeeExpectedCommitment
//     )
//       return (
//         employeeCommitment.employeeName +
//         ' - ' +
//         employeeCommitment.reportedHours.toString() +
//         '/' +
//         employeeCommitment.employeeExpectedCommitment.toString() +
//         '.\n'
//       );
//     return '';
//   }

//   minutesToHours(minutes: number): number {
//     return minutes / 60;
//   }

//   transformNewDateToDBString(date: Date) {
//     const dateFormatted = this.datepipe.transform(date, 'dd/MM/yyyy');
//     return dateFormatted;
//   }

//   getExpectedCommitmentOfEmployee(employeeId: string): number {
//     let employeeTotalExpectedCommitment = 0;
//     this.allRates?.forEach((rate) => {
//       if (rate.employeeId === employeeId) {
//         employeeTotalExpectedCommitment =
//           employeeTotalExpectedCommitment + rate.employeeTimeCommitement;
//       }
//     });
//     if (employeeTotalExpectedCommitment > 0)
//       return employeeTotalExpectedCommitment;
//     else return 0;
//   }

//   formatISOToDB(dateISO: string): string {
//     const activityDate = dateISO.split('-');
//     return activityDate[2] + '/' + activityDate[1] + '/' + activityDate[0];
//   }

//   transformDateToDBString(date: Date): string {
//     return this.formatISOToDB(date.toISOString());
//   }

//   computeEmployeesTotalCommitment() {
//     let totalCommitment = 0;
//     this.allRates?.forEach((rate) => {
//       totalCommitment = totalCommitment + rate.employeeTimeCommitement;
//     });
//     this.employeesTotalCommitment = totalCommitment;
//   }

//   generateCalendarDayColors() {
//     this.calendarDays?.forEach((calendarDay) => {
//       let color = 'green';
//       if (calendarDay.date.getDay() === 0 || calendarDay.date.getDay() === 6) {
//         calendarDay.color = color;
//       } else {
//         let totalCommitmentOfCalendarDay = 0;
//         calendarDay.employeesCommitment.forEach((employeeCommitment) => {
//           if (employeeCommitment.reportedHours === 0) color = 'red';
//           if (
//             employeeCommitment.reportedHours > 0 &&
//             employeeCommitment.reportedHours <
//               employeeCommitment.employeeExpectedCommitment
//           )
//             color = 'orange';
//           totalCommitmentOfCalendarDay =
//             totalCommitmentOfCalendarDay + employeeCommitment.reportedHours;
//         });
//         calendarDay.timeBooked = totalCommitmentOfCalendarDay;
//         calendarDay.color = color;
//       }
//     });
//   }

//   getNumberOfWeeksToDisplay(): number {
//     const numberOfDaysCheck = this.calendarDays.length;
//     let numberOfDays = this.calendarDays.length;
//     const firstDayNumber = this.getDayForMondayFirstDayOfWeek(
//       this.calendarDays[0].date
//     );

//     let numberOfWeeks = 0;
//     let cursor = firstDayNumber;
//     while (numberOfDays > 0) {
//       if (cursor === 7) {
//         numberOfWeeks = numberOfWeeks + 1;
//         cursor = 0;
//       }
//       cursor = cursor + 1;
//       numberOfDays = numberOfDays - 1;
//     }
//     if (cursor > 0) {
//       numberOfWeeks = numberOfWeeks + 1;
//     }
//     if (firstDayNumber + 1 + numberOfDaysCheck - 1 <= 7) {
//       numberOfWeeks = 1;
//     }
//     return numberOfWeeks;
//   }

//   addPaddingDaysToCalendarLastWeek() {
//     const lastWeekIndex = this.calendar.weeksInCalendar.length - 1;
//     if (this.calendar.weeksInCalendar[lastWeekIndex].weekDays.length < 7) {
//       const remainingDays =
//         7 - this.calendar.weeksInCalendar[lastWeekIndex].weekDays.length;
//       let cursor = 0;
//       while (cursor < remainingDays) {
//         this.calendar.weeksInCalendar[lastWeekIndex].weekDays.push(<
//           CalendarDay
//         >{
//           color: '#d4d4d4',
//           date: new Date(),
//           employeesCommitment: {},
//           expectedTimeCommitment: 0,
//           timeBooked: 0,
//           tooltipMessage: '',
//           opacity: 0,
//         });
//         cursor = cursor + 1;
//       }
//     }
//   }

//   checkEmployeesCommitment(
//     weekDay: CalendarDay,
//     employeeCommitmentOfSelectedDay: EmployeeCommitmentCalendar[],
//     todayDate: string
//   ) {
//     if (
//       weekDay.color === 'red' ||
//       weekDay.color === 'orange' ||
//       weekDay.color === 'green'
//     ) {
//       this.dialog.open(ReportingHoursBookedDialogComponent, {
//         data: <EmployeeCommitmentDate>{
//           employeeCommitment: employeeCommitmentOfSelectedDay,
//           todayDate: todayDate,
//         },

//         panelClass: 'full-width-dialog',
//       });
//     }
//   }

//   addPaddingToCalendarFirstWeek() {
//     if (this.calendar.numberOfWeeks > 1) {
//       if (this.calendar.weeksInCalendar[0].weekDays.length < 7) {
//         const remainingDays =
//           7 - this.calendar.weeksInCalendar[0].weekDays.length;
//         let cursor = 0;
//         while (cursor < remainingDays) {
//           this.calendar.weeksInCalendar[0].weekDays.unshift(<CalendarDay>{
//             color: '#d4d4d4',
//             date: new Date(),
//             employeesCommitment: {},
//             expectedTimeCommitment: 0,
//             timeBooked: 0,
//             tooltipMessage: '',
//             opacity: 0,
//           });
//           cursor = cursor + 1;
//         }
//       }
//     } else {
//       const firstDayOfOnlyWeek = this.getDayForMondayFirstDayOfWeek(
//         this.calendar.weeksInCalendar[0].weekDays[0].date
//       );
//       const lastDayOfOnlyWeekIndex =
//         this.calendar.weeksInCalendar[0].weekDays?.length;
//       const lastDayOfOnlyWeek = this.getDayForMondayFirstDayOfWeek(
//         this.calendar.weeksInCalendar[0].weekDays[lastDayOfOnlyWeekIndex - 1]
//           .date
//       );
//       if (lastDayOfOnlyWeek < 6)
//         if (firstDayOfOnlyWeek > 0) {
//           const firstDayWeekIndex = firstDayOfOnlyWeek;
//           const lastDayWeekIndex = lastDayOfOnlyWeek;
//           let cursorUnshift = 0;
//           const remainingDaysToAddInFront = firstDayWeekIndex;
//           while (cursorUnshift < remainingDaysToAddInFront) {
//             this.calendar.weeksInCalendar[0].weekDays.unshift(<CalendarDay>{
//               color: '#d4d4d4',
//               date: new Date(),
//               employeesCommitment: {},
//               expectedTimeCommitment: 0,
//               timeBooked: 0,
//               tooltipMessage: '',
//               opacity: 0,
//             });
//             cursorUnshift = cursorUnshift + 1;
//           }

//           const remainingDaysToAddAfterwards = 6 - lastDayWeekIndex;
//           let cursorPush = 0;
//           while (cursorPush < remainingDaysToAddAfterwards) {
//             this.calendar.weeksInCalendar[0].weekDays.push(<CalendarDay>{
//               color: '#d4d4d4',
//               date: new Date(),
//               employeesCommitment: {},
//               expectedTimeCommitment: 0,
//               timeBooked: 0,
//               tooltipMessage: '',
//               opacity: 0,
//             });
//             cursorPush = cursorPush + 1;
//           }
//         } else {
//           const lastDayWeekIndex = lastDayOfOnlyWeek;
//           const remainingDaysToAddAfterwards = 6 - lastDayWeekIndex;
//           let cursorPush = 0;
//           while (cursorPush < remainingDaysToAddAfterwards) {
//             this.calendar.weeksInCalendar[0].weekDays.push(<CalendarDay>{
//               color: '#d4d4d4',
//               date: new Date(),
//               employeesCommitment: {},
//               expectedTimeCommitment: 0,
//               timeBooked: 0,
//               tooltipMessage: '',
//               opacity: 0,
//             });
//             cursorPush = cursorPush + 1;
//           }
//         }
//       else {
//         let cursorUnshift = 0;
//         const firstDayWeekIndex = firstDayOfOnlyWeek;
//         const remainingDaysToAddInFront = firstDayWeekIndex + 1;
//         while (cursorUnshift < remainingDaysToAddInFront - 1) {
//           this.calendar.weeksInCalendar[0].weekDays.unshift(<CalendarDay>{
//             color: '#d4d4d4',
//             date: new Date(),
//             employeesCommitment: {},
//             expectedTimeCommitment: 0,
//             timeBooked: 0,
//             tooltipMessage: '',
//             opacity: 0,
//           });
//           cursorUnshift = cursorUnshift + 1;
//         }
//       }
//     }
//   }

//   addDaysToWeeksInCalendar() {
//     const newEmptyWeek = <WeekCalendarDay>{
//       weekDays: [],
//     };

//     let calendarWeeks = this.calendar.numberOfWeeks;
//     const calendarDaysNumber = this.calendarDays.length;
//     const firstDayNumber = this.getDayForMondayFirstDayOfWeek(
//       this.calendarDays[0].date
//     );

//     while (calendarWeeks > 0) {
//       this.calendar.weeksInCalendar.push(newEmptyWeek);
//       calendarWeeks = calendarWeeks - 1;
//     }
//     let weekCursor = 0;
//     let cursor = 0;
//     let weekDayCursor = firstDayNumber;
//     let newWeek = <WeekCalendarDay>{
//       weekDays: [],
//     };

//     while (cursor < calendarDaysNumber) {
//       if (weekDayCursor === 7) {
//         this.calendar.weeksInCalendar[weekCursor] = newWeek;
//         newWeek = {};
//         newWeek = <WeekCalendarDay>{
//           weekDays: [],
//         };
//         weekCursor = weekCursor + 1;
//         weekDayCursor = 0;
//       }
//       newWeek.weekDays.push(this.calendarDays[cursor]);
//       weekDayCursor = weekDayCursor + 1;
//       cursor = cursor + 1;
//     }
//     let checkAllDaysAdded = 0;
//     this.calendar?.weeksInCalendar.forEach((week) => {
//       checkAllDaysAdded = checkAllDaysAdded + week.weekDays.length;
//     });
//     if (checkAllDaysAdded < calendarDaysNumber) {
//       this.calendar.weeksInCalendar[weekCursor] = newWeek;
//     }
//   }

//   initialStateCalendar() {
//     this.calendar.weeksInCalendar = [];
//     this.activitiesInRange = [];
//     this.calendarDays = [];
//     this.datesInSelectedRange = [];
//     const now = new Date();
//     const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
//     this.firstDayOfCalendarInitial = firstDay;
//     const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//     this.lastDayOfCalendarInitial = lastDay;
//     this.getAllActivitiesInRangeParam(this.allActivities);
//     this.getDatesInRangeParam(
//       this.firstDayOfCalendarInitial,
//       this.lastDayOfCalendarInitial
//     );
//     this.generateCalendarDaysForEachDateInSelectedRange();
//     this.generateCalendarDayColors();
//     this.calendar.numberOfWeeks = this.getNumberOfWeeksToDisplay();
//     this.addDaysToWeeksInCalendar();
//     this.addPaddingToCalendarFirstWeek();
//     this.addPaddingDaysToCalendarLastWeek();
//     this.generateTooltipMessagesForCalendarDays();
//   }

//   getDatesInRangeParam(firstDate: Date, lastDate: Date) {
//     const date = new Date(firstDate);
//     date.setDate(date.getDate());
//     const dates = [];
//     while (date <= lastDate) {
//       dates.push(new Date(date));
//       date.setDate(date.getDate() + 1);
//     }
//     this.datesInSelectedRange = dates;
//   }

//   getDatesInRange() {
//     const date = new Date(this.start?.value);
//     date.setDate(date.getDate());
//     const dates = [];
//     while (date <= this.end?.value) {
//       dates.push(new Date(date));
//       date.setDate(date.getDate() + 1);
//     }
//     this.datesInSelectedRange = dates;
//   }

//   getAllActivitiesInRangeParam(activities: Activity[]) {
//     if (activities !== undefined) {
//       activities.forEach((activity) => {
//         if (
//           this.stringToDate(activity.date) >= this.start?.value &&
//           this.stringToDate(activity.date) <= this.end?.value
//         ) {
//           if (this.currentEmployeeId) {
//             if (activity.employeeId === this.currentEmployeeId) {
//               this.activitiesInRange?.push(activity);
//             }
//           } else {
//             this.activitiesInRange?.push(activity);
//           }
//         }
//       });
//     }
//   }

//   getAllActivitiesInRange(activities: Activity[]) {
//     if (activities !== undefined) {
//       activities.forEach((activity) => {
//         if (
//           this.stringToDate(activity.date) >= this.start?.value &&
//           this.stringToDate(activity.date) <= this.end?.value
//         ) {
//           if (this.currentEmployeeId) {
//             if (activity.employeeId === this.currentEmployeeId) {
//               this.activitiesInRange?.push(activity);
//             }
//           } else {
//             this.activitiesInRange?.push(activity);
//           }
//         }
//       });
//     }
//   }

//   getDayForMondayFirstDayOfWeek(date: Date): number {
//     if (date.getDay() === 0) return 6;
//     else return date.getDay() - 1;
//   }

//   private stringToDate(dateString: string) {
//     const splitDateString = dateString.split('/');
//     const dateStringISO =
//       splitDateString[2] + '-' + splitDateString[1] + '-' + splitDateString[0];
//     const formattedDate = new Date(dateStringISO);
//     const resultDate = formattedDate.setDate(formattedDate.getDate());
//     return new Date(resultDate);
//   }

//   dateChanges() {
//     this.fetchDataOnDateChange();
//   }

//   fetchDataOnDateChange() {
//     this.calendar.weeksInCalendar = [];
//     this.activitiesInRange = [];
//     this.calendarDays = [];
//     this.datesInSelectedRange = [];
//     this.getAllActivitiesInRange(this.allActivities);
//     this.getDatesInRange();
//     this.generateCalendarDaysForEachDateInSelectedRange();
//     this.generateCalendarDayColors();
//     this.calendar.numberOfWeeks = this.getNumberOfWeeksToDisplay();
//     this.addDaysToWeeksInCalendar();
//     this.addPaddingToCalendarFirstWeek();
//     this.addPaddingDaysToCalendarLastWeek();
//     this.generateTooltipMessagesForCalendarDays();
//   }

//   fetchData() {
//     this.calendar.weeksInCalendar = [];
//     this.activitiesInRange = [];
//     this.calendarDays = [];
//     this.datesInSelectedRange = [];
//     this.activityService
//       .getActivities()
//       .pipe(
//         takeUntilDestroyed(this.destroyRef),
//         switchMap((activities) => {
//           if (this.currentEmployeeId) {
//             this.allActivities = activities.filter(
//               (activity) => activity.employeeId === this.currentEmployeeId
//             );
//             if (activities) {
//               this.getAllActivitiesInRange(activities);
//             }
//           } else {
//             this.allActivities = activities;
//             if (activities) {
//               this.getAllActivitiesInRange(activities);
//             }
//           }
//           return this.userService.getUsers();
//         }),
//         switchMap((users) => {
//           if (this.currentEmployeeId) {
//             this.allEmployees = users.filter(
//               (user) => user.id === this.currentEmployeeId
//             );
//           } else {
//             this.allEmployees = users;
//           }
//           return this.rateService.getRates();
//         }),
//         switchMap((rates) => {
//           if (this.currentEmployeeId) {
//             this.allRates = rates.filter(
//               (rate) => rate.employeeId === this.currentEmployeeId
//             );
//             if (rates) {
//               this.computeEmployeesTotalCommitment();
//               this.initialStateCalendar();
//             }
//           } else {
//             this.allRates = rates;
//             if (rates) {
//               this.computeEmployeesTotalCommitment();
//               this.initialStateCalendar();
//             }
//           }
//           return this.projectService.getProjects();
//         })
//       )
//       .subscribe((projects) => {
//         this.allProjects = projects;
//       });
//   }
//   ngOnInit(): void {
//     this.fetchData();

//     this.selectedItemEmployee = this.noFilterUsers;
//     this.nameFilter = this.noFilterUsers;

//     const currentDate = new Date();

//     const startDate = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       1
//     );

//     const endDate = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       currentDate.getDate()
//     );

//     this.range = new FormGroup({
//       start: new FormControl(<Date>startDate),
//       end: new FormControl(<Date>endDate),
//     });
//   }

//   get start() {
//     return this.range?.get('start');
//   }
//   get end() {
//     return this.range?.get('end');
//   }
// }

// interface Calendar {
//   weeksInCalendar: WeekCalendarDay[];
//   numberOfWeeks: number;
// }

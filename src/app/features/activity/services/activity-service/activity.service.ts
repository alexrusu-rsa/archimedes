import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { Activity } from 'src/app/shared/models/activity';
import { RequestWrapper } from 'src/app/shared/models/request-wrapper';
import { ResponseHandlingService } from 'src/app/shared/services/response-handling-service/response-handling.service';
import { environment } from 'src/environments/environment';
import { ActivityDuplication } from '../../models/activity-duplication.model';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private activitiesUrl = environment.serviceURL + 'activity';
  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(
    private httpClient: HttpClient,
    private responseHandlingService: ResponseHandlingService
  ) {}

  getActivity(id: string): Observable<Activity> {
    const requestUrl = this.activitiesUrl + '/' + id;
    return this.httpClient
      .get<Activity>(requestUrl)
      .pipe(
        catchError(
          this.responseHandlingService.handleError<Activity>(`getActivity id`)
        )
      );
  }

  getAllActivityTypes(): Observable<string[]> {
    return this.httpClient
      .get<string[]>(this.activitiesUrl + '/types')
      .pipe(
        catchError(
          this.responseHandlingService.handleError<string[]>('getActivityTypes')
        )
      );
  }

  getActivities(): Observable<Activity[]> {
    return this.httpClient
      .get<Activity[]>(this.activitiesUrl)
      .pipe(
        catchError(
          this.responseHandlingService.handleError<Activity[]>(`getActivities`)
        )
      );
  }

  addDuplicates(
    activityDuplicateRange: ActivityDuplication
  ): Observable<RequestWrapper> {
    return this.httpClient
      .post(this.activitiesUrl + '/duplicate', activityDuplicateRange, {
        observe: 'response',
      })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Activities duplicated');
          return res.body as RequestWrapper;
        }),
        catchError(
          this.responseHandlingService.handleError<RequestWrapper>(
            'duplicateActivity'
          )
        )
      );
  }

  deleteActivity(id: string): Observable<RequestWrapper> {
    const deleteActivityUrl = `${this.activitiesUrl}/${id}`;
    return this.httpClient
      .delete<RequestWrapper>(deleteActivityUrl, { observe: 'response' })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Activity deleted');
          return res.body as RequestWrapper;
        }),
        catchError(
          this.responseHandlingService.handleError<RequestWrapper>(
            'deleteActivity'
          )
        )
      );
  }

  deleteAllActivitiesOfUserDay(
    userId: string,
    date: string
  ): Observable<RequestWrapper> {
    const deleteAllActivitiesOfUserDayUrl = `${this.activitiesUrl}/${userId}/${date}`;
    return this.httpClient
      .delete<RequestWrapper>(deleteAllActivitiesOfUserDayUrl, {
        observe: 'response',
      })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Activities deleted');
          return res.body as RequestWrapper;
        }),
        catchError(
          this.responseHandlingService.handleError<RequestWrapper>(
            'deleteAllActivitiesOfUserDay'
          )
        )
      );
  }

  addActivity(activity: Activity): Observable<Activity> {
    return this.httpClient
      .post<Activity>(this.activitiesUrl, activity, {
        observe: 'response',
      })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Activity added');
          return res.body as Activity;
        }),
        catchError(
          this.responseHandlingService.handleError<Activity>('addActivity')
        )
      );
  }

  updateActivity(activity: Activity): Observable<Activity> {
    return this.httpClient
      .put(this.activitiesUrl + '/' + activity.id, activity, {
        observe: 'response',
      })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Activity updated');
          return res.body as Activity;
        }),
        catchError(
          this.responseHandlingService.handleError<Activity>('updateActivity')
        )
      );
  }

  getActivitiesByDateEmployeeId(
    id: string,
    dateToFind: string
  ): Observable<Activity[]> {
    const activitiesByDateUrl = this.activitiesUrl + '/date';
    return this.httpClient
      .post<Activity[]>(
        activitiesByDateUrl,
        <RequestWrapper>{
          data: dateToFind,
          userId: id,
        },
        { observe: 'response' }
      )
      .pipe(
        map((res) => {
          return res.body as Activity[];
        }),
        catchError(
          this.responseHandlingService.handleError<Activity[]>(
            `getActivitiesOfDateForEmployee`
          )
        )
      );
  }

  getActivitiesByEmployee(userId: string): Observable<Activity[]> {
    const activitiesByEmployeeUrl = this.activitiesUrl + '/employee';
    return this.httpClient
      .post<Activity[]>(
        activitiesByEmployeeUrl,
        <RequestWrapper>{
          userId: userId,
        },
        { observe: 'response' }
      )
      .pipe(
        map((res) => {
          return res.body as Activity[];
        }),
        catchError(
          this.responseHandlingService.handleError<Activity[]>(
            `getActivitiesOfEmployee`
          )
        )
      );
  }

  getActivitiesInRange(startDate: string, endDate: string) {
    const activitiesByRangeUrl = this.activitiesUrl + '/range';
    let qParams = new HttpParams();
    qParams = qParams.append('startDate', startDate);
    qParams = qParams.append('endDate', endDate);
    return this.httpClient
      .get<Activity[]>(activitiesByRangeUrl, {
        params: qParams,
      })
      .pipe(
        catchError(
          this.responseHandlingService.handleError<Activity[]>(
            `getActivitiesByRange`
          )
        )
      );
  }

  getActivitiesOfMonthYearForUser(date: Date): Observable<Activity[]> {
    const requestBody = {
      month: (date.getUTCMonth() + 1).toString(),
      year: date.getUTCFullYear().toString(),
    };
    const activitiesOfMonthYearUserUrl = this.activitiesUrl + '/monthYear';
    return this.httpClient
      .post<Activity[]>(activitiesOfMonthYearUserUrl, requestBody)
      .pipe(
        catchError(
          this.responseHandlingService.handleError<Activity[]>(
            `getActivitiesOfMonthYearForUser`
          )
        )
      );
  }

  getBookedTimePerDayOfMonthYear(date: Date): Observable<Activity[]> {
    const requestBody = {
      month: date.getUTCMonth() + 1,
      year: date.getUTCFullYear(),
    };
    const activitiesOfMonthYearUserUrl =
      this.activitiesUrl + '/monthYear/bookedTimePerDay';
    return this.httpClient
      .post<Activity[]>(activitiesOfMonthYearUserUrl, requestBody)
      .pipe(
        catchError(
          this.responseHandlingService.handleError<Activity[]>(
            `getActivitiesOfMonthYearForUser`
          )
        )
      );
  }
}

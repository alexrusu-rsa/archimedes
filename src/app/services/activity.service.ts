import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Activity } from '../models/activity';
import { RequestWrapper } from '../models/request-wrapper';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private activitiesUrl =
    'https://archimedes-backend-dev.herokuapp.com/api/activity';
  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(
    private httpClient: HttpClient,
    @Inject(NotificationService)
    private notificationService: NotificationService
  ) {}

  getActivity(id: string): Observable<Activity> {
    const requestUrl = this.activitiesUrl + '/' + id;
    return this.httpClient
      .get<Activity>(requestUrl)
      .pipe(catchError(this.handleError<Activity>(`getActivity id`)));
  }

  getActivities(): Observable<Activity[]> {
    return this.httpClient
      .get<Activity[]>(this.activitiesUrl)
      .pipe(catchError(this.handleError<Activity[]>(`getActivities`)));
  }

  deleteActivity(id: string): Observable<RequestWrapper> {
    const deleteActivityUrl = `${this.activitiesUrl}/${id}`;
    return this.httpClient
      .delete<RequestWrapper>(deleteActivityUrl)
      .pipe(catchError(this.handleError<RequestWrapper>('deleteActivity')));
  }

  addActivity(activity: Activity): Observable<RequestWrapper> {
    return this.httpClient
      .post<RequestWrapper>(this.activitiesUrl, activity)
      .pipe(catchError(this.handleError<RequestWrapper>('addActivity')));
  }

  updateActivity(activity: Activity): Observable<RequestWrapper> {
    return this.httpClient
      .put(this.activitiesUrl + '/' + activity.id, activity)
      .pipe(catchError(this.handleError<RequestWrapper>('updateActivity')));
  }

  getActivitiesByDateEmployeeId(
    id: string,
    dateToFind: string
  ): Observable<Activity[]> {
    const activitiesByDateUrl = this.activitiesUrl + '/date';
    return this.httpClient
      .post<Activity[]>(activitiesByDateUrl, <RequestWrapper>{
        data: dateToFind,
        userId: id,
      })
      .pipe(
        catchError(
          this.handleError<Activity[]>(`getActivitiesOfDateForEmployee`)
        )
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: Error): Observable<T> => {
      console.error(error);
      this.notificationService.openSnackBar(error.message);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`ActivityService: ${message}`);
  }
}

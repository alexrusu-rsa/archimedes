import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Activity } from '../activity/activity';
import { RequestWrapper } from '../custom/request-wrapper';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private activitiesUrl = 'http://localhost:3000/api/activity';
  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private httpClient: HttpClient) {}

  getActivity(id: string): Observable<Activity> {
    const requestUrl = this.activitiesUrl + '/' + id;
    return this.httpClient.get<Activity>(requestUrl).pipe(
      tap((_) => console.log(`fetched activity id `)),
      catchError(this.handleError<Activity>(`getActivity id`))
    );
  }

  getActivities(): Observable<Activity[]> {
    return this.httpClient.get<Activity[]>(this.activitiesUrl).pipe(
      tap((_) => console.log(`fetched activities`)),
      catchError(this.handleError<Activity[]>(`getActivities`))
    );
  }

  getActivitiesByDate(dateToFind: string): Observable<Activity[]> {
    const activitiesByDateUrl =
      this.activitiesUrl +
      '/date?dateToFind=' +
      dateToFind.split(' ').join('%20');
    return this.httpClient.get<Activity[]>(activitiesByDateUrl).pipe(
      tap((_) => console.log(`fetched activities of given date`)),
      catchError(this.handleError<Activity[]>(`getActivitiesOfDate`))
    );
  }

  deleteActivity(id: string): Observable<RequestWrapper> {
    const deleteActivityUrl = `${this.activitiesUrl}/${id}`;
    return this.httpClient.delete<RequestWrapper>(deleteActivityUrl).pipe(
      tap((_) => this.log(`deleted activity`)),
      catchError(this.handleError<RequestWrapper>('deleteActivity'))
    );
  }

  addActivity(activity: Activity): Observable<RequestWrapper> {
    return this.httpClient
      .post<RequestWrapper>(this.activitiesUrl, activity)
      .pipe(
        tap((_) => this.log(`added activity `)),
        catchError(this.handleError<RequestWrapper>('addActivity'))
      );
  }

  updateActivity(activity: Activity): Observable<RequestWrapper> {
    return this.httpClient
      .put(this.activitiesUrl + '/' + activity.id, activity)
      .pipe(
        tap((_) => this.log(`updated activity id`)),
        catchError(this.handleError<RequestWrapper>('updateActivity'))
      );
  }
  
  getActivitiesByDateEmployeeId(
    id: string,
    dateToFind: string
  ): Observable<Activity[]> {
    const activitiesByDateUrl =
      this.activitiesUrl +
      '/' +
      id +
      '/date?dateToFind=' +
      dateToFind.split(' ').join('%20');
    return this.httpClient.get<Activity[]>(activitiesByDateUrl).pipe(
      tap((_) => console.log(`fetched activities of given date for employee`)),
      catchError(this.handleError<Activity[]>(`getActivitiesOfDateForEmployee`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: Error): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`ActivityService: ${message}`);
  }
}

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Activity } from '../activity/activity';
import { RequestWrapper } from '../custom/request-wrapper';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private activitiesUrl = 'http://192.168.0.29:3000/api/activity';
  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private httpClient: HttpClient) {}

  getActivity(id: number): Observable<Activity> {
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
    console.log(activitiesByDateUrl);
    return this.httpClient.get<Activity[]>(activitiesByDateUrl).pipe(
      tap((_) => console.log(`fetched activities of given date`)),
      catchError(this.handleError<Activity[]>(`getActivitiesOfDate`))
    );
  }

  deleteActivity(id: number): any {
    const deleteActivityUrl = `${this.activitiesUrl}/${id}`;
    console.log(deleteActivityUrl);
    return this.httpClient.delete<any>(deleteActivityUrl).pipe(
      tap((_) => this.log(``)),
      catchError(this.handleError<any>(''))
    );
  }

  addActivity(activity: Activity): any {
    console.log(activity);
    return this.httpClient
      .post<any>(this.activitiesUrl, activity)
      .subscribe((data) => {});
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`ActivityService: ${message}`);
  }
}

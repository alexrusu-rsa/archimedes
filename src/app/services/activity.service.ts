import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Activity } from '../activity/activity';

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

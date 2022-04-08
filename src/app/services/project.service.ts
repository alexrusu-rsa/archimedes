import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project';
import { RequestWrapper } from '../models/request-wrapper';
import { NotificationService } from './notification.service';
@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectsUrl = environment.serviceURL + 'project';

  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private httpClient: HttpClient,
    @Inject(NotificationService)
    private notificationService: NotificationService
  ) {}

  getProject(id: string): Observable<Project> {
    const requestUrl = this.projectsUrl + '/' + id;
    return this.httpClient
      .get<Project>(requestUrl)
      .pipe(catchError(this.handleError<Project>('getProject id')));
  }

  getProjects(): Observable<Project[]> {
    return this.httpClient
      .get<Project[]>(this.projectsUrl)
      .pipe(catchError(this.handleError<Project[]>('getProjects')));
  }

  deleteProject(id: string): Observable<RequestWrapper> {
    const deleteProjectUrl = `${this.projectsUrl}/${id}`;
    return this.httpClient
      .delete(deleteProjectUrl)
      .pipe(catchError(this.handleError<RequestWrapper>('deleteProject')));
  }

  updateProject(project: Project): Observable<RequestWrapper> {
    return this.httpClient
      .put(this.projectsUrl + '/' + project.id, project)
      .pipe(catchError(this.handleError<RequestWrapper>('updateProject')));
  }

  addProject(project: Project): Observable<RequestWrapper> {
    return this.httpClient
      .post<RequestWrapper>(this.projectsUrl, project)
      .pipe(catchError(this.handleError<RequestWrapper>('addProject')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (err: HttpErrorResponse): Observable<T> => {
      console.error(err);
      this.notificationService.openSnackBar(
        err.error.message,
        err.error.statusCode
      );
      this.log(`${operation} failed: ${err.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`ActivityService: ${message}`);
  }
}

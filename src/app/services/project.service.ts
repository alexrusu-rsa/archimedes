import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project';
import { RequestWrapper } from '../models/request-wrapper';
import { ResponseHandlingService } from '../response-handling.service';

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
    private responseHandlingService: ResponseHandlingService
  ) {}

  getProject(id: string): Observable<Project> {
    const requestUrl = this.projectsUrl + '/' + id;
    return this.httpClient
      .get<Project>(requestUrl)
      .pipe(
        catchError(
          this.responseHandlingService.handleError<Project>('getProject id')
        )
      );
  }

  getProjects(): Observable<Project[]> {
    return this.httpClient
      .get<Project[]>(this.projectsUrl)
      .pipe(
        catchError(
          this.responseHandlingService.handleError<Project[]>('getProjects')
        )
      );
  }

  deleteProject(id: string): Observable<RequestWrapper> {
    const deleteProjectUrl = `${this.projectsUrl}/${id}`;
    return this.httpClient
      .delete(deleteProjectUrl, { observe: 'response' })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Project deleted');
          return res.body as RequestWrapper;
        }),
        catchError(
          this.responseHandlingService.handleError<RequestWrapper>(
            'deleteProject'
          )
        )
      );
  }

  updateProject(project: Project): Observable<RequestWrapper> {
    return this.httpClient
      .put(this.projectsUrl + '/' + project.id, project, {
        observe: 'response',
      })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Project updated');
          return res.body as RequestWrapper;
        }),
        catchError(
          this.responseHandlingService.handleError<RequestWrapper>(
            'updateProject'
          )
        )
      );
  }

  addProject(project: Project): Observable<RequestWrapper> {
    return this.httpClient
      .post<RequestWrapper>(this.projectsUrl, project, { observe: 'response' })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Project added');
          return res.body as RequestWrapper;
        }),
        catchError(
          this.responseHandlingService.handleError<RequestWrapper>('addProject')
        )
      );
  }
}

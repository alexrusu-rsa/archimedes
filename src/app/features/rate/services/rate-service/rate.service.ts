import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Rate } from '../../../../shared/models/rate';
import { RequestWrapper } from '../../../../shared/models/request-wrapper';
import { ResponseHandlingService } from '../../../../shared/services/response-handling-service/response-handling.service';

@Injectable({
  providedIn: 'root',
})
export class RateService {
  private ratesUrl = environment.serviceURL + 'rate';
  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private responseHandlingService = inject(ResponseHandlingService);
  private httpClient = inject(HttpClient);

  getRate(id: string): Observable<Rate> {
    const requestUrl = this.ratesUrl + '/' + id;
    return this.httpClient
      .get<Rate>(requestUrl)
      .pipe(
        catchError(
          this.responseHandlingService.handleError<Rate>(`get rate by id`)
        )
      );
  }

  getRates(): Observable<Rate[]> {
    return this.httpClient
      .get<Rate[]>(this.ratesUrl)
      .pipe(
        catchError(this.responseHandlingService.handleError<Rate[]>(`getRates`))
      );
  }

  getAllRateTypes(): Observable<string[]> {
    return this.httpClient
      .get<string[]>(this.ratesUrl + '/types')
      .pipe(
        catchError(
          this.responseHandlingService.handleError<string[]>('getRateTypes')
        )
      );
  }

  deleteRate(id: string): Observable<RequestWrapper> {
    const deleteRateUrl = `${this.ratesUrl}/${id}`;
    return this.httpClient
      .delete<RequestWrapper>(deleteRateUrl, { observe: 'response' })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Rate deleted');
          return res.body as RequestWrapper;
        }),
        catchError(
          this.responseHandlingService.handleError<RequestWrapper>('deleteRate')
        )
      );
  }

  addRate(rate: Rate): Observable<Rate> {
    return this.httpClient
      .post<Rate>(this.ratesUrl, rate, {
        observe: 'response',
      })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Rate added');
          return res.body as Rate;
        }),
        catchError(this.responseHandlingService.handleError<Rate>('addRate'))
      );
  }

  updateRate(rate: Rate): Observable<Rate> {
    return this.httpClient
      .put(this.ratesUrl + '/' + rate.id, rate, {
        observe: 'response',
      })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Rate updated');
          return res.body as Rate;
        }),
        catchError(this.responseHandlingService.handleError<Rate>('updateRate'))
      );
  }
}

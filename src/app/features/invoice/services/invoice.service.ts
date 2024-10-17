import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { ResponseHandlingService } from 'src/app/shared/services/response-handling-service/response-handling.service';
import { environment } from 'src/environments/environment';
import { InvoiceLastNumber } from '../models/invoiceLastNumber.model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private invoiceUrl = environment.serviceURL + 'invoice';
  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private responseHandlingService = inject(ResponseHandlingService);
  private httpClient = inject(HttpClient);

  getLastInvoiceNumber(): Observable<InvoiceLastNumber> {
    return this.httpClient
      .get<InvoiceLastNumber>(this.invoiceUrl)
      .pipe(
        catchError(
          this.responseHandlingService.handleError<InvoiceLastNumber>(
            'getInvoiceLastNumber'
          )
        )
      );
  }
}

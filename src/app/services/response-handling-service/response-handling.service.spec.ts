import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
} from '@angular/common/http/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResponseHandlingService } from './response-handling.service';
import { NotificationService } from '../notification-service/notification.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

describe('SpecFileResponseHandlingService', () => {
  const mockSnackBar = <MatSnackBar>{};
  let innerService = new NotificationService(mockSnackBar);
  let service = new ResponseHandlingService(innerService);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
      ],
      providers: [ResponseHandlingService, NotificationService],
    });
    service = TestBed.inject(ResponseHandlingService);
    innerService = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handleResponse should call', () => {
    const spy = spyOn(service, 'handleResponse');
    service.handleResponse('message');
    expect(spy).toHaveBeenCalled();
  });

  it('handleError', () => {
    const spy = spyOn(service, 'handleError');
    service.handleError();
    expect(spy).toHaveBeenCalled();
  });
});

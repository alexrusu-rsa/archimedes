import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationService } from '../notification-service/notification.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

describe('SpecFileNotificationService', () => {
  const mockSnackBar = <MatSnackBar>{};
  let service = new NotificationService(mockSnackBar);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
      ],
      providers: [NotificationService, NotificationService],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('openSuccesfulNotification should be called', () => {
    const spy = spyOn(service.snackBar, 'openFromComponent');
    service.openSuccesfulNotification('success message');
    expect(spy).toHaveBeenCalled();
  });

  it('openSnackNar should be called ', () => {
    const spy = spyOn(service.snackBar, 'openFromComponent');
    service.openSnackBar('error message', 404);
    expect(spy).toHaveBeenCalled();
  });
});

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HoursAndMinutes } from 'src/app/models/hours_minutes';
import { Observable, of, subscribeOn } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { environment } from 'src/environments/environment';
import { ResponseHandlingService } from '../response-handling-service/response-handling.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { User } from 'src/app/models/user';
import { UserManagePasswordService } from './user-manage-password.service';
import e from 'express';
import { RequestWrapper } from 'src/app/models/request-wrapper';

describe('SpecFileUserManagePasswordService', () => {
  let service: UserManagePasswordService;
  let httpController: HttpTestingController;
  const expectedRates: User[] = [
    {
      id: '08b39b39-2e39-4e19-97b6-318fea26ffcc',
      email: 'rusualexgeo@gmail.com',
      surname: 'Denisa',
      name: 'Sz',
      role: 'Senior NG Dev',
      seniority: 'Senior',
      roles: 'user',
      timePerDay: '4',
    },
    {
      id: '588eb7d4-7966-458b-82ed-f47fcf8e6b0f',
      email: 'rusualexrsa@gmail.com',
      surname: 'Rusu',
      name: 'Alex George',
      role: 'Founder',
      seniority: 'Senior',
      roles: 'admin',
      timePerDay: '12',
    },
    {
      id: '1d0cd6c9-449e-415d-ac49-3f75aab0cbca',
      email: 'calin.andrei.coroian@gmail.com',
      surname: 'Coroian',
      name: 'Calin Andrei',
      role: 'web developer',
      seniority: 'junior',
      roles: 'admin',
      timePerDay: '8',
    },
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
      ],
      providers: [UserManagePasswordService, ResponseHandlingService],
    });
    service = TestBed.inject(UserManagePasswordService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call resetPasswordFor() and should return ', () => {
    const expectedReturn = {
      id: '1d0cd6c9-449e-415d-ac49-3f75aab0cbca',
      email: 'calin.andrei.coroian@gmail.com',
      surname: 'Coroian',
      name: 'Calin Andrei',
      role: 'web developer',
      seniority: 'junior',
      roles: 'admin',
      timePerDay: '8',
    };
    service.resetPasswordFor(expectedReturn).subscribe((result) => {
      const actualResult = result;
      expect(actualResult).toEqual(<RequestWrapper>expectedReturn);
    });
    const req = httpController.expectOne({
      method: 'PUT',
      url: environment.serviceURL + 'user/password',
    });
    req.flush(expectedReturn);
  });

  it('should call changePasswordFor(newPassword, userId)', () => {
    const expectedResult = <RequestWrapper>{
      generatedMaps: [],
      raw: [],
      affected: 1,
    };
    service.changePasswordFor('newpassword', 'ABCD').subscribe((result) => {
      const actualResult = result;
      expect(actualResult).toEqual(expectedResult);
    });
    const req = httpController.expectOne({
      method: 'PUT',
      url: environment.serviceURL + 'user/change',
    });
    req.flush(expectedResult);
  });
});

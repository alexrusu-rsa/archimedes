import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserLoginService } from './user-login.service';
import { User } from 'src/app/models/user';
import { of } from 'rxjs';
import { RequestWrapper } from 'src/app/models/request-wrapper';

describe('SpecFileUserLoginService', () => {
  let service: UserLoginService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
      ],
      providers: [UserLoginService],
    });
    service = TestBed.inject(UserLoginService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getUser(Id) and return user with Id', () => {
    const expectedValue: User = {
      id: '1d0cd6c9-449e-415d-ac49-3f75aab0cbca',
      email: 'calin.andrei.coroian@gmail.com',
      surname: 'Coroian',
      name: 'Calin Andrei',
      role: 'web developer',
      seniority: 'junior',
      roles: 'admin',
      timePerDay: '8',
    };
    service
      .getUser('1d0cd6c9-449e-415d-ac49-3f75aab0cbca')
      .subscribe((result) => {
        const actualValue = result;
        expect(actualValue).toEqual(expectedValue);
      });
    const req = httpController.expectOne({
      method: 'GET',
      url: process.env['BACKEND_URL'] + 'user/' + expectedValue.id,
    });
    req.flush(expectedValue);
  });

  it('should call logUserIn(user) and return response', () => {
    const expectedReturn = {
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNhbGluLmFuZHJlaS5jb3JvaWFuQGdtYWlsLmNvbSIsInN1YiI6IjFkMGNkNmM5LTQ0OWUtNDE1ZC1hYzQ5LTNmNzVhYWIwY2JjYSIsImlhdCI6MTY2NTA0MjI3MywiZXhwIjoxNjY1MDUwODczfQ.Nxa3v8QKS2_-xtC5qX7GfyHFEOoCxSs67SkpvdY_H9Q',
      role: 'role1',
      userId: 'abbc201112fdd-239d-e-11123aaaaddccee',
    };

    const mockUser = {
      surname: 'Coroian',
      name: 'Andrei',
      role: 'web dev',
      seniority: 'junior',
      email: 'calinabcdef@gmail.com',
      password: 'parola',
      roles: 'admin',
      timePerDay: '8',
    };
    service.logUserIn(mockUser).subscribe((result) => {
      const actualResult = result;
      expect(actualResult).toEqual(expectedReturn);
    });
    const req = httpController.expectOne({
      method: 'POST',
      url: process.env['BACKEND_URL'] + 'user/creds',
    });
    req.flush(<RequestWrapper>expectedReturn);
  });
});

import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { environment } from 'src/environments/environment';
import { ResponseHandlingService } from '../response-handling-service/response-handling.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from './user.service';
import { User } from 'src/app/models/user';

describe('SpecFileUserService', () => {
  let service: UserService;
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
      providers: [UserService, ResponseHandlingService],
    });
    service = TestBed.inject(UserService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getUsers and return User[]', () => {
    service.getUsers().subscribe((result) => {
      expect(result).toEqual(expectedRates);
    });
    const req = httpController.expectOne({
      method: 'GET',
      url: environment.serviceURL + 'user',
    });
    req.flush(expectedRates);
  });

  it('should call addUser(user) and return the user added', () => {
    let actualResponse = {};
    const userToAdd: User = {
      email: 'calin.andrei.coroian@gmail.com',
      surname: 'Coroian',
      name: 'Calin Andrei',
      role: 'web developer',
      seniority: 'junior',
      roles: 'admin',
      timePerDay: '8',
    };
    const expectedAddResponse = {
      id: 'ABCDE',
      email: 'calin.andrei.coroian@gmail.com',
      surname: 'Coroian',
      name: 'Calin Andrei',
      role: 'web developer',
      seniority: 'junior',
      roles: 'admin',
      timePerDay: '8',
    };
    service.addUser(userToAdd).subscribe((result) => {
      actualResponse = result;
      expect(actualResponse).toEqual(expectedAddResponse);
    });
    const req = httpController.expectOne({
      method: 'POST',
      url: environment.serviceURL + 'user',
    });
    req.flush(expectedAddResponse);
  });

  it('should call deleteUser(id) and return value of expectedReturn', () => {
    const expectedReturn = {
      raw: [],
      affected: 1,
    };
    let actualReturn = {};
    const idOfUserToDelete = 'fad87c2d-5502-46f2-b839-284e5a1d1cc1';
    service.deleteUser(idOfUserToDelete).subscribe((result) => {
      actualReturn = result;
      expect(actualReturn).toEqual(expectedReturn);
    });
    const req = httpController.expectOne({
      method: 'DELETE',
      url: environment.serviceURL + 'user/' + idOfUserToDelete,
    });
    req.flush(expectedReturn);
  });

  it('should call updateUser(user) and return value of expectedReturn', () => {
    const expectedReturn = {};
    const userToUpdate = <User>(<unknown>{
      id: 'ABCDE',
      email: 'calin.andrei.coroian@gmail.com',
      surname: 'Coroian',
      name: 'Calin Andrei',
      role: 'web developer',
      seniority: 'junior',
      roles: 'admin',
      timePerDay: '8',
    });
    let actualReturn = {};
    service.updateUser(userToUpdate).subscribe((result) => {
      actualReturn = result;
      expect(actualReturn).toEqual(expectedReturn);
    });
    const req = httpController.expectOne({
      method: 'PUT',
      url: environment.serviceURL + 'user/' + userToUpdate.id,
    });
    req.flush(expectedReturn);
  });

  it('should call getUsersNumber() and should return number', () => {
    const expectedReturn = 5;
    let actualResult = 5;
    service.getUsersNumber().subscribe((result) => {
      actualResult = result;
      expect(actualResult).toEqual(expectedReturn);
    });
    const req = httpController.expectOne({
      method: 'GET',
      url: environment.serviceURL + 'user/number',
    });
    req.flush(expectedReturn);
  });
});

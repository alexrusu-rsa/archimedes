import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of, subscribeOn } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { environment } from 'src/environments/environment';
import { ResponseHandlingService } from '../response-handling-service/response-handling.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoleCheckService } from './rolecheck.service';

describe('SpecFileRoleCheckService', () => {
  let service: RoleCheckService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BrowserAnimationsModule],
      providers: [RoleCheckService],
    });
    service = TestBed.inject(RoleCheckService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getRole', () => {
    const expectedRole = 'role';
    spyOn(service, 'getRole').and.returnValue(expectedRole);
    const actualRole = service.getRole();
    expect(actualRole).toEqual(expectedRole);
  });

  it('should call getId', () => {
    const expectedId = 'iduser';
    spyOn(service, 'getId').and.returnValue(expectedId);
    const actualId = service.getId();
    expect(actualId).toEqual(expectedId);
  });
});

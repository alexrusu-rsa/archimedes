import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './auth.service';

describe('SpecFileAuthService', () => {
  let service: AuthService;
  let _httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BrowserAnimationsModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    _httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getToken()', () => {
    const expectedToken = 'sdkfnk12ei201eisjnsjvn2o';
    spyOn(service, 'getToken').and.returnValue(expectedToken);
    const actualResult = service.getToken();
    expect(actualResult).toEqual(expectedToken);
    expect(service.getToken).toHaveBeenCalled();
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoleCheckService } from './rolecheck.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SpecFileRoleCheckService', () => {
  let service: RoleCheckService;
  let _httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [BrowserAnimationsModule],
    providers: [RoleCheckService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(RoleCheckService);
    _httpController = TestBed.inject(HttpTestingController);
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

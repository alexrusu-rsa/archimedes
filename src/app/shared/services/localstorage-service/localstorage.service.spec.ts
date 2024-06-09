import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageService } from './localstorage.service';

describe('SpecFileLocalStorageService', () => {
  let service: LocalStorageService;
  const expectedToken = 'aabbbd223111afffdbbeee';
  const expectedRole = 'Role';
  const expectedUserId = 'AABBCCDDEEFF';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BrowserAnimationsModule],
      providers: [LocalStorageService],
    });
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getAccessToken', () => {
    localStorage.setItem('access_token', expectedToken);
    const actualAccessToken = service.accessToken;
    expect(actualAccessToken).toEqual(expectedToken);
  });

  it('should set access token in localStorage', () => {
    service.accessToken = expectedToken;
    const actualAccessToken = localStorage.getItem('access_token');
    expect(actualAccessToken).toEqual(expectedToken);
  });

  it('should get role of the user from localStorage', () => {
    localStorage.setItem('role', expectedRole);
    const actualRole = service.role;
    expect(actualRole).toEqual(expectedRole);
  });

  it('should set role value in localStorage', () => {
    service.role = expectedRole;
    const actualRole = localStorage.getItem('role');
    expect(actualRole).toEqual(expectedRole);
  });

  it('should get userId from localStorage', () => {
    localStorage.setItem('userId', expectedUserId);
    const actualUserId = service.userId;
    expect(actualUserId).toEqual(expectedUserId);
  });

  it('should set userId value in localStorage', () => {
    service.userId = expectedUserId;
    const actualUserId = localStorage.getItem('userId');
    expect(actualUserId).toEqual(expectedUserId);
  });

  it('should make everything in localstorage be null', () => {
    localStorage.setItem('userId', expectedUserId);
    localStorage.setItem('role', expectedRole);
    localStorage.setItem('access_token', expectedToken);
    service.localStorageLogout();
    expect(localStorage.getItem('role')).toEqual(null);
    expect(localStorage.getItem('access_token')).toEqual(null);
    expect(localStorage.getItem('userId')).toEqual(null);
  });
});

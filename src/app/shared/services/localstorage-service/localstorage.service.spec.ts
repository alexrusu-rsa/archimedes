import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageKeys, LocalStorageService } from './localstorage.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SpecFileLocalStorageService', () => {
  let service: LocalStorageService;
  const expectedToken = 'aabbbd223111afffdbbeee';
  const expectedRole = 'Role';
  const expectedUserId = 'AABBCCDDEEFF';

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [BrowserAnimationsModule],
    providers: [LocalStorageService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getAccessToken', () => {
    localStorage.setItem(LocalStorageKeys.accessToken, expectedToken);
    const actualAccessToken = service.accessToken;
    expect(actualAccessToken).toEqual(expectedToken);
  });

  it('should set access token in localStorage', () => {
    service.accessToken = expectedToken;
    const actualAccessToken = localStorage.getItem(
      LocalStorageKeys.accessToken
    );
    expect(actualAccessToken).toEqual(expectedToken);
  });

  it('should get role of the user from localStorage', () => {
    localStorage.setItem(LocalStorageKeys.role, expectedRole);
    const actualRole = service.role;
    expect(actualRole).toEqual(expectedRole);
  });

  it('should set role value in localStorage', () => {
    service.role = expectedRole;
    const actualRole = localStorage.getItem(LocalStorageKeys.role);
    expect(actualRole).toEqual(expectedRole);
  });

  it('should get userId from localStorage', () => {
    localStorage.setItem(LocalStorageKeys.userId, expectedUserId);
    const actualUserId = service.userId;
    expect(actualUserId).toEqual(expectedUserId);
  });

  it('should set userId value in localStorage', () => {
    service.userId = expectedUserId;
    const actualUserId = localStorage.getItem(LocalStorageKeys.userId);
    expect(actualUserId).toEqual(expectedUserId);
  });

  it('should make everything in localstorage be null', () => {
    localStorage.setItem(LocalStorageKeys.userId, expectedUserId);
    localStorage.setItem(LocalStorageKeys.role, expectedRole);
    localStorage.setItem(LocalStorageKeys.accessToken, expectedToken);
    service.localStorageLogout();
    expect(localStorage.getItem(LocalStorageKeys.role)).toEqual(null);
    expect(localStorage.getItem(LocalStorageKeys.accessToken)).toEqual(null);
    expect(localStorage.getItem(LocalStorageKeys.userId)).toEqual(null);
  });
});

import { TestBed } from '@angular/core/testing';

import { UserManagePasswordService } from './user-manage-password.service';

describe('UserManagePasswordService', () => {
  let service: UserManagePasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserManagePasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

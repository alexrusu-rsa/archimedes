import { TestBed } from '@angular/core/testing';

import { SpecFileTestService } from './spec-file-test.service';

describe('SpecFileTestService', () => {
  let service: SpecFileTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecFileTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

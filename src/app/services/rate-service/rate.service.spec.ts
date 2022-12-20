import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HoursAndMinutes } from 'src/app/models/hours_minutes';
import { Observable, of } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { environment } from 'src/environments/environment';
import { ResponseHandlingService } from '../response-handling-service/response-handling.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RateService } from './rate.service';
import { Rate } from 'src/app/models/rate';

describe('SpecFileRateService', () => {
  let service: RateService;
  let httpController: HttpTestingController;
  const expectedRates: Rate[] = [
    {
      id: '301b61de-e196-4409-9364-f3ba4d4b20f1',
      projectId: 'ee0b5a3a-5a55-4b08-9964-d4eba93c82c3',
      employeeId: '1d0cd6c9-449e-415d-ac49-3f75aab0cbca',
      rate: 6.5,
      rateType: 'hourly',
      employeeTimeCommitement: 8,
    },
    {
      id: '16c0d6ed-f1f5-40aa-a8ee-2ed23e2358eb',
      projectId: 'ee0b5a3a-5a55-4b08-9964-d4eba93c82c3',
      employeeId: '588eb7d4-7966-458b-82ed-f47fcf8e6b0f',
      rate: 22.5,
      rateType: 'hourly',
      employeeTimeCommitement: 5,
    },
    {
      id: 'fad87c2d-5502-46f2-b839-284e5a1d1cc1',
      projectId: '8783d1cd-eed3-4714-9771-ac30c8bedf2c',
      employeeId: '1d0cd6c9-449e-415d-ac49-3f75aab0cbca',
      rate: 5,
      rateType: 'hourly',
      employeeTimeCommitement: 8,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
      ],
      providers: [RateService, ResponseHandlingService],
    });
    service = TestBed.inject(RateService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getRates and return Rate[]', () => {
    let actualRates: Rate[] | undefined;
    service.getRates().subscribe((result) => {
      actualRates = result;
      expect(result).toEqual(expectedRates);
    });
    const req = httpController.expectOne({
      method: 'GET',
      url: process.env['BACKEND_URL'] + 'rate',
    });
    req.flush(expectedRates);
  });

  it('should call getRate(id) and return the rate with id taken as parameter', () => {
    let actualRate: Rate | undefined;
    const expectedRate: Rate = {
      id: 'fad87c2d-5502-46f2-b839-284e5a1d1cc1',
      projectId: '8783d1cd-eed3-4714-9771-ac30c8bedf2c',
      employeeId: '1d0cd6c9-449e-415d-ac49-3f75aab0cbca',
      rate: 5,
      rateType: 'hourly',
      employeeTimeCommitement: 8,
    };

    const id = 'fad87c2d-5502-46f2-b839-284e5a1d1cc1';
    service.getRate(id).subscribe((result) => {
      actualRate = result;
      expect(result).toEqual(expectedRate);
    });
    const req = httpController.expectOne({
      method: 'GET',
      url: process.env['BACKEND_URL'] + 'rate' + '/' + id,
    });
    req.flush(expectedRate);
  });

  it('should call addRate(rate) and return the rate added', () => {
    let actualResponse = {};
    const rateToAdd: Rate = {
      projectId: '8783d1cd-eed3-4714-9771-ac30c8bedf2c',
      employeeId: '1d0cd6c9-449e-415d-ac49-3f75aab0cbca',
      rate: 5,
      rateType: 'hourly',
      employeeTimeCommitement: 8,
    };
    const expectedAddResponse = {
      id: 'abc',
      projectId: '8783d1cd-eed3-4714-9771-ac30c8bedf2c',
      employeeId: '1d0cd6c9-449e-415d-ac49-3f75aab0cbca',
      rate: 5,
      rateType: 'hourly',
      employeeTimeCommitement: 8,
    };
    service.addRate(rateToAdd).subscribe((result) => {
      actualResponse = result;
      expect(actualResponse).toEqual(expectedAddResponse);
    });
    const req = httpController.expectOne({
      method: 'POST',
      url: process.env['BACKEND_URL'] + 'rate',
    });
    req.flush(expectedAddResponse);
  });

  it('should call deleteRate(id) and return value of expectedReturn', () => {
    const expectedReturn = {
      raw: [],
      affected: 1,
    };
    let actualReturn = {};
    const idOfRateToDelete = 'fad87c2d-5502-46f2-b839-284e5a1d1cc1';
    service.deleteRate(idOfRateToDelete).subscribe((result) => {
      actualReturn = result;
      expect(actualReturn).toEqual(expectedReturn);
    });
    const req = httpController.expectOne({
      method: 'DELETE',
      url: process.env['BACKEND_URL'] + 'rate/' + idOfRateToDelete,
    });
    req.flush(expectedReturn);
  });

  it('should call updateRate(rate) and return value of expectedReturn', () => {
    const expectedReturn = {
      id: 'abc',
      projectId: '8783d1cd-eed3-4714-9771-ac30c8bedf2c',
      employeeId: '1d0cd6c9-449e-415d-ac49-3f75aab0cbca',
      rate: 5,
      rateType: 'hourly',
      employeeTimeCommitement: 8,
    };
    const rateToUpdate = <Rate>(<unknown>{
      id: 'abc',
      projectId: '8783d1cd-eed3-4714-9771-ac30c8bedf2c',
      employeeId: '1d0cd6c9-449e-415d-ac49-3f75aab0cbca',
      rate: 5,
      rateType: 'hourly',
      employeeTimeCommitement: 8,
    });
    let actualReturn = {};
    service.updateRate(rateToUpdate).subscribe((result) => {
      actualReturn = result;
      expect(actualReturn).toEqual(expectedReturn);
    });
    const req = httpController.expectOne({
      method: 'PUT',
      url: process.env['BACKEND_URL'] + 'rate/' + rateToUpdate.id,
    });
    req.flush(expectedReturn);
  });
});

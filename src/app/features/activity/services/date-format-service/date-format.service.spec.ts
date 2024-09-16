import { TestBed } from '@angular/core/testing';
import { HoursAndMinutes } from 'src/app/models/hours_minutes';
import { DateFormatService } from './date-format.service';

describe('SpecFileDateFormatService', () => {
  let service: DateFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return correct number of milliseconds', () => {
    const mockParamTime = '12:00';
    expect(service.toMilliseconds(mockParamTime)).toEqual(43200000);
  });

  it('should return Date', () => {
    const mockParamTime = '14:00';
    const mockValueDate = new Date();
    const milliseconds = 43200000;
    mockValueDate.setTime(milliseconds);
    spyOn(service, 'toMilliseconds').and.returnValue(milliseconds);
    const actualResult = service.getNewDateWithTime(mockParamTime);
    expect(service.toMilliseconds).toHaveBeenCalled();
    expect(actualResult).toEqual(mockValueDate);
  });

  it('should return number', () => {
    const hours = 10;
    expect(service.hoursToMilliseconds(hours)).toEqual(36000000);
  });

  it('should return number', () => {
    const minutes = 120;
    expect(service.minutesToHours(minutes)).toEqual(2);
  });

  it('should return number', () => {
    const seconds = 60;
    expect(service.secondsToMinutes(seconds)).toEqual(1);
  });

  it('should return HoursAndMinutes', () => {
    const milliseconds = 5400000;
    expect(service.millisecondsToHoursAndMinutes(milliseconds)).toEqual(
      new HoursAndMinutes(1, 30)
    );
  });
});

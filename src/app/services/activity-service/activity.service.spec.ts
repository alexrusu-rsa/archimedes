import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HoursAndMinutes } from 'src/app/models/hours_minutes';
import { ActivityService } from './activity.service';
import { Activity } from 'src/app/models/activity';
import { Observable, of } from 'rxjs';
import { NotificationService } from '../notification-service/notification.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ActivityDuplicateRange } from '../../models/activity-duplicate-range';

import { environment } from 'src/environments/environment';
import { EnumDeclaration, Type } from 'typescript';
import { ActivityType } from 'src/app/models/activity-type.enum';
import { ResponseHandlingService } from '../response-handling-service/response-handling.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SpecFileActivityService', () => {
  let service: ActivityService;
  let httpController: HttpTestingController;
  const expectedActivities: Activity[] = [
    {
      id: '6099875c-8c37-4c88-9f2b-a933f8b91a07',
      name: 'asdasd',
      employeeId: '588eb7d4-7966-458b-82ed-f47fcf8e6b0f',
      date: '13/07/2022',
      start: '10:00',
      activityType: 'training',
      end: '12:00',
      projectId: 'ee0b5a3a-5a55-4b08-9964-d4eba93c82c3',
      description: 'sda',
      extras: 'sadas',
      workedTime: '2:0',
    },
    {
      id: '6099875c-8c37-4c88-9f2b-a933f8b91a07',
      name: 'asdasd',
      employeeId: '588eb7d4-7966-458b-82ed-f47fcf8e6b0f',
      date: '13/07/2022',
      start: '10:00',
      activityType: 'training',
      end: '12:00',
      projectId: 'ee0b5a3a-5a55-4b08-9964-d4eba93c82c3',
      description: 'sda',
      extras: 'sadas',
      workedTime: '2:0',
    },
    {
      id: '6099875c-8c37-4c88-9f2b-a933f8b91a07',
      name: 'asdasd',
      employeeId: '588eb7d4-7966-458b-82ed-f47fcf8e6b0f',
      date: '13/07/2022',
      start: '10:00',
      activityType: 'training',
      end: '12:00',
      projectId: 'ee0b5a3a-5a55-4b08-9964-d4eba93c82c3',
      description: 'sda',
      extras: 'sadas',
      workedTime: '2:0',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
      ],
      providers: [ActivityService, ResponseHandlingService],
    });
    service = TestBed.inject(ActivityService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getActivities and return Activity[]', () => {
    let actualActivities: Activity[] | undefined;
    service.getActivities().subscribe((result) => {
      actualActivities = result;
      expect(result).toEqual(expectedActivities);
    });
    const req = httpController.expectOne({
      method: 'GET',
      url: environment.serviceURL + 'activity',
    });
    req.flush(expectedActivities);
  });

  it('should call getActivity(id) and return the activity with id taken as parameter', () => {
    let actualActivity: Activity | undefined;
    const expectedActivity: Activity = {
      id: '6099875c-8c37-4c88-9f2b-a933f8b91a07',
      name: 'asdasd',
      employeeId: '588eb7d4-7966-458b-82ed-f47fcf8e6b0f',
      date: '13/07/2022',
      start: '10:00',
      activityType: 'training',
      end: '12:00',
      projectId: 'ee0b5a3a-5a55-4b08-9964-d4eba93c82c3',
      description: 'sda',
      extras: 'sadas',
      workedTime: '2:0',
    };
    const id = '1';
    service.getActivity(id).subscribe((result) => {
      actualActivity = result;
      expect(result).toEqual(expectedActivity);
    });
    const req = httpController.expectOne({
      method: 'GET',
      url: environment.serviceURL + 'activity' + '/' + id,
    });
    req.flush(expectedActivity);
  });

  it('should call duplicateActivity(mockParameter) and return nothing', () => {
    const mockParameter: ActivityDuplicateRange | undefined = {
      activity: {
        name: 'asdasd',
        employeeId: '588eb7d4-7966-458b-82ed-f47fcf8e6b0f',
        date: '13/07/2022',
        start: '10:00',
        activityType: 'training',
        end: '12:00',
        projectId: 'ee0b5a3a-5a55-4b08-9964-d4eba93c82c3',
        description: 'sda',
        extras: 'sadas',
        workedTime: '2:0',
      },
      startDate: new Date(),
      endDate: new Date(),
    };
    const expectedDuplicateResponse = { data: '', userId: '' };
    service.addDuplicates(mockParameter).subscribe((result) => {
      expect(result).toEqual(expectedDuplicateResponse);
    });
    const req = httpController.expectOne({
      method: 'POST',
      url: environment.serviceURL + 'activity' + '/duplicate',
    });
    req.flush({ data: '', userId: '' });
  });

  it('should call addActivity(activity) and return activity added', () => {
    let actualResponse = {};
    const activityToAdd: Activity = {
      name: 'Test Aadd',
      employeeId: 'ff1a0656-716a-4b0e-8b28-e04e2cdeca75',
      date: '24/02/2022',
      start: '12:45',
      end: '15:25',
      description: 'dfgdflkgjdfgsxasd',
      extras: 'sdgdsgs',
      activityType: 'internal',
    };
    const expectedAddResponse = {
      id: 'b9c2fd13-963c-4b7b-b5b6-dc5990d4a32b',
      name: 'Test Aadd',
      employeeId: 'ff1a0656-716a-4b0e-8b28-e04e2cdeca75',
      date: '24/02/2022',
      start: '12:45',
      activityType: 'internal',
      end: '15:25',
      projectId: null,
      description: 'dfgdflkgjdfgsxasd',
      extras: 'sdgdsgs',
      workedTime: '2:40',
    };
    service.addActivity(activityToAdd).subscribe((result) => {
      actualResponse = result;
      expect(actualResponse).toEqual(expectedAddResponse);
    });
    const req = httpController.expectOne({
      method: 'POST',
      url: environment.serviceURL + 'activity',
    });
    req.flush(expectedAddResponse);
  });

  it('should call deleteActivity(id) and return value of expectedReturn', () => {
    const expectedReturn = {
      raw: [],
      affected: 1,
    };
    let actualReturn = {};
    const idOfActivityToDelete = 'b9c2fd13-963c-4b7b-b5b6-dc5990d4a32b';
    service.deleteActivity(idOfActivityToDelete).subscribe((result) => {
      actualReturn = result;
      expect(actualReturn).toEqual(expectedReturn);
    });
    const req = httpController.expectOne({
      method: 'DELETE',
      url: environment.serviceURL + 'activity/' + idOfActivityToDelete,
    });
    req.flush(expectedReturn);
  });

  it('should call updateActivty(activity) and return value of expectedReturn', () => {
    const expectedReturn = {
      id: 'b9c2fd13-963c-4b7b-b5b6-dc5990d4a32b',
      name: 'Test Aadd',
      employeeId: 'ff1a0656-716a-4b0e-8b28-e04e2cdeca75',
      date: '24/02/2022',
      start: '12:45',
      activityType: 'internal',
      end: '15:25',
      projectId: null,
      description: 'dfgdflkgjdfgsxasd',
      extras: 'sdgdsgs',
      workedTime: '2:40',
    };
    const activityToUpdate = <Activity>(<unknown>{
      id: 'b9c2fd13-963c-4b7b-b5b6-dc5990d4a32b',
      name: 'Test Aadd',
      employeeId: 'ff1a0656-716a-4b0e-8b28-e04e2cdeca75',
      date: '24/02/2022',
      start: '12:45',
      activityType: 'internal',
      end: '15:25',
      projectId: null,
      description: 'dfgdflkgjdfgsxasd',
      extras: 'sdgdsgs',
      workedTime: '2:40',
    });
    let actualReturn = {};
    const idOfActivityToDelete = 'b9c2fd13-963c-4b7b-b5b6-dc5990d4a32b';
    service.updateActivity(activityToUpdate).subscribe((result) => {
      actualReturn = result;
      expect(actualReturn).toEqual(expectedReturn);
    });
    const req = httpController.expectOne({
      method: 'PUT',
      url: environment.serviceURL + 'activity/' + activityToUpdate.id,
    });
    req.flush(expectedReturn);
  });

  it('should call getActivitiesByDateEmployeeId(id, date) and return activities of certain date for certain employee', () => {
    const idOfEmployee = '1d0cd6c9-449e-415d-ac49-3f75aab0cbca';
    const dateToFind = '24/02/2022';
    let actualActivities: Activity[] | undefined;

    service
      .getActivitiesByDateEmployeeId(idOfEmployee, dateToFind)
      .subscribe((result) => {
        actualActivities = result;
        expect(actualActivities).toEqual(expectedActivities);
      });
    const req = httpController.expectOne({
      method: 'POST',
      url: environment.serviceURL + 'activity/date',
    });
    req.flush(expectedActivities);
  });

  it('should call getActivitiesByEmployee(userId)', () => {
    const idOfEmployee = '1d0cd6c9-449e-415d-ac49-3f75aab0cbca';
    let actualActivities: Activity[] | undefined;

    service.getActivitiesByEmployee(idOfEmployee).subscribe((result) => {
      actualActivities = result;
      expect(actualActivities).toEqual(expectedActivities);
    });
    const req = httpController.expectOne({
      method: 'POST',
      url: environment.serviceURL + 'activity/employee',
    });
    req.flush(expectedActivities);
  });
});

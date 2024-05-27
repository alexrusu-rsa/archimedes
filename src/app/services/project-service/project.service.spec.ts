import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { environment } from 'src/environments/environment';
import { ResponseHandlingService } from '../response-handling-service/response-handling.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectService } from './project.service';
import { Project } from 'src/app/models/project';

describe('SpecFileProjectService', () => {
  let service: ProjectService;
  let httpController: HttpTestingController;
  const expectedProjects: Project[] = [
    {
      id: 'ee0b5a3a-5a55-4b08-9964-d4eba93c82c3',
      projectName: 'Archimedes',
      customerId: '8dbd427f-fa5f-4807-9ded-048706e0a91d',
      contract: 'Nr. R000798/21.06.2022 si Nr R0000804/21.06.2022 ',
      dueDate: '15/06/2022',
      invoiceTerm: 15,
      contractSignDate: '',
    },
    {
      id: '439d031c-5de8-4028-a109-eaccfa6bfeda',
      projectName: 'CSP UI',
      customerId: 'ba545783-bbd6-4505-bdcf-39a968dc3077',
      contract: 'Nr R0000804/21.06.2022',
      dueDate: 'null',
      invoiceTerm: 15,
      contractSignDate: 'null',
    },
    {
      id: '8783d1cd-eed3-4714-9771-ac30c8bedf2c',
      projectName: 'VPD',
      customerId: '1eb1be72-3074-4f87-8773-a37e20b7884e',
      contract: 'Nr R0000804/21.06.2022',
      dueDate: '20/07/2022',
      invoiceTerm: 22,
      contractSignDate: '07/07/2022',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
      ],
      providers: [ProjectService, ResponseHandlingService],
    });
    service = TestBed.inject(ProjectService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getProjects and return Project[]', () => {
    service.getProjects().subscribe((result) => {
      expect(result).toEqual(expectedProjects);
    });
    const req = httpController.expectOne({
      method: 'GET',
      url: environment.serviceURL + 'project',
    });
    req.flush(expectedProjects);
  });

  it('should call getProject(id) and return the project with id taken as parameter', () => {
    const expectedProject: Project = {
      id: 'ee0b5a3a-5a55-4b08-9964-d4eba93c82c3',
      projectName: 'Archimedes',
      customerId: '8dbd427f-fa5f-4807-9ded-048706e0a91d',
      contract: 'Nr. R000798/21.06.2022 si Nr R0000804/21.06.2022 ',
      dueDate: '15/06/2022',
      invoiceTerm: 15,
      contractSignDate: '',
    };

    const id = '1';
    service.getProject(id).subscribe((result) => {
      expect(result).toEqual(expectedProject);
    });
    const req = httpController.expectOne({
      method: 'GET',
      url: environment.serviceURL + 'project' + '/' + id,
    });
    req.flush(expectedProject);
  });

  it('should call addProject(project) and return the project added', () => {
    let actualResponse = {};
    const projectToAdd: Project = {
      projectName: 'Archimedes',
      customerId: '8dbd427f-fa5f-4807-9ded-048706e0a91d',
      contract: 'Nr. R000798/21.06.2022 si Nr R0000804/21.06.2022 ',
      dueDate: '15/06/2022',
      invoiceTerm: 15,
      contractSignDate: '',
    };
    const expectedAddResponse = {
      projectId: '8783d1cd-eed3-4714-9771-ac30c8bedf2c',
      employeeId: '1d0cd6c9-449e-415d-ac49-3f75aab0cbca',
      rate: 5,
      rateType: 'hourly',
      employeeTimeCommitement: 8,
    };

    service.addProject(projectToAdd).subscribe((result) => {
      actualResponse = result;
      expect(actualResponse).toEqual(expectedAddResponse);
    });
    const req = httpController.expectOne({
      method: 'POST',
      url: environment.serviceURL + 'project',
    });
    req.flush(expectedAddResponse);
  });

  it('should call deleteProject(id) and return value of expectedReturn', () => {
    const expectedReturn = {
      raw: [],
      affected: 1,
    };
    let actualReturn = {};
    const idOfProjectToDelete = 'ee0b5a3a-5a55-4b08-9964-d4eba93c82c3';
    service.deleteProject(idOfProjectToDelete).subscribe((result) => {
      actualReturn = result;
      expect(actualReturn).toEqual(expectedReturn);
    });
    const req = httpController.expectOne({
      method: 'DELETE',
      url: environment.serviceURL + 'project/' + idOfProjectToDelete,
    });
    req.flush(expectedReturn);
  });

  it('should call updateProject(project) and return value of expectedReturn', () => {
    const expectedReturn = {};
    const projectToUpdate = <Project>(<unknown>{
      id: 'ee0b5a3a-5a55-4b08-9964-d4eba93c82c3',
      projectName: 'Archimedes',
      customerId: '8dbd427f-fa5f-4807-9ded-048706e0a91d',
      contract: 'Nr. R000798/21.06.2022 si Nr R0000804/21.06.2022 ',
      dueDate: '15/06/2022',
      invoiceTerm: 15,
      contractSignDate: '',
    });
    let actualReturn = {};
    service.updateProject(projectToUpdate).subscribe((result) => {
      actualReturn = result;
      expect(actualReturn).toEqual(expectedReturn);
    });
    const req = httpController.expectOne({
      method: 'PUT',
      url: environment.serviceURL + 'project/' + projectToUpdate.id,
    });
    req.flush(expectedReturn);
  });

  it('should call getProjectsUser(userId) and return projects of that certain user', () => {
    const userId = 'ABCDEF';
    let actualResult: Project[] | undefined;
    const expectedReturn: Project[] = [
      {
        projectName: 'HIJKLMN',
        customerId: '8dbd427f-fa5f-4807-9ded-048706e0a91d',
        contract: 'Nr. R000798/21.06.2022 si Nr R0000804/21.06.2022 ',
        dueDate: '15/06/2022',
        invoiceTerm: 15,
        contractSignDate: '',
      },
      {
        projectName: 'DEFG',
        customerId: '8dbd427f-fa5f-4807-9ded-048706e0a91d',
        contract: 'Nr. R000798/21.06.2022 si Nr R0000804/21.06.2022 ',
        dueDate: '15/06/2022',
        invoiceTerm: 15,
        contractSignDate: '',
      },
      {
        projectName: 'ABCD',
        customerId: '8dbd427f-fa5f-4807-9ded-048706e0a91d',
        contract: 'Nr. R000798/21.06.2022 si Nr R0000804/21.06.2022 ',
        dueDate: '15/06/2022',
        invoiceTerm: 15,
        contractSignDate: '',
      },
    ];
    service.getProjectsUser(userId).subscribe((result) => {
      actualResult = result;
      expect(actualResult).toEqual(expectedReturn);
    });
    const req = httpController.expectOne({
      method: 'GET',
      url: environment.serviceURL + 'project/' + userId,
    });
    req.flush(expectedReturn);
  });
});

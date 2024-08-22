import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { environment } from 'src/environments/environment';
import { ResponseHandlingService } from '../../../../shared/services/response-handling-service/response-handling.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomerService } from './customer.service';
import { Customer } from 'src/app/shared/models/customer';

describe('SpecFileCustomerService', () => {
  let service: CustomerService;
  let httpController: HttpTestingController;
  const expectedCustomers: Customer[] = [
    {
      id: 'ba545783-bbd6-4505-bdcf-39a968dc3077',
      name: 'Alighieri',
      CUI: 'fs.dkjmfl',
      Reg: 'lfksdjkfllk',
      address: 'kjsdalfklsl',
      city: 'ksdfjdslfsjfdl',
      country: 'safasfsss',
      directorName: '',
      directorTel: '',
      directorEmail: '',
      internal: false,
      romanianCompany: true,
      VAT: true,
      shortName: 'null',
    },
    {
      id: 'ba545783-bbd6-4505-bdcf-39a968dc3077',
      name: 'Alighieri',
      CUI: 'fs.dkjmfl',
      romanianCompany: true,
      VAT: true,
      Reg: 'lfksdjkfllk',
      address: 'kjsdalfklsl',
      city: 'ksdfjdslfsjfdl',
      country: 'safasfsss',
      directorName: '',
      directorTel: '',
      directorEmail: '',
      internal: false,
      shortName: 'null',
    },
    {
      id: 'ba545783-bbd6-4505-bdcf-39a968dc3077',
      name: 'Alighieri',
      CUI: 'fs.dkjmfl',
      Reg: 'lfksdjkfllk',
      romanianCompany: true,
      VAT: true,
      address: 'kjsdalfklsl',
      city: 'ksdfjdslfsjfdl',
      country: 'safasfsss',
      directorName: '',
      directorTel: '',
      directorEmail: '',
      internal: false,
      shortName: 'null',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
      ],
      providers: [CustomerService, ResponseHandlingService],
    });
    service = TestBed.inject(CustomerService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getCustomers and return Customer[]', () => {
    service.getCustomers().subscribe((result) => {
      expect(result).toEqual(expectedCustomers);
    });
    const req = httpController.expectOne({
      method: 'GET',
      url: environment.serviceURL + 'customer',
    });
    req.flush(expectedCustomers);
  });

  it('should call getCustomer(id) and return the customer with id taken as parameter', () => {
    const expectedCustomer: Customer = {
      name: 'Alighieri',
      CUI: 'fs.dkjmfl',
      Reg: 'lfksdjkfllk',
      address: 'kjsdalfklsl',
      city: 'ksdfjdslfsjfdl',
      country: 'safasfsss',
      directorName: '',
      directorTel: '',
      romanianCompany: true,
      VAT: true,
      directorEmail: '',
      internal: false,
      shortName: 'null',
    };

    const id = '1';
    service.getCustomer(id).subscribe((result) => {
      expect(result).toEqual(expectedCustomer);
    });
    const req = httpController.expectOne({
      method: 'GET',
      url: environment.serviceURL + 'customer' + '/' + id,
    });
    req.flush(expectedCustomer);
  });

  it('should call addCustomer(customer) and return the customer added', () => {
    let actualResponse = {};
    const customerToAdd: Customer = {
      name: 'Alighieri',
      CUI: 'fs.dkjmfl',
      Reg: 'lfksdjkfllk',
      address: 'kjsdalfklsl',
      city: 'ksdfjdslfsjfdl',
      country: 'safasfsss',
      directorName: '',
      directorTel: '',
      directorEmail: '',
      internal: false,
      romanianCompany: true,
      VAT: true,
      shortName: 'null',
    };
    const expectedAddResponse = {};
    service.addCustomer(customerToAdd).subscribe((result) => {
      actualResponse = result;
      expect(actualResponse).toEqual(expectedAddResponse);
    });
    const req = httpController.expectOne({
      method: 'POST',
      url: environment.serviceURL + 'customer',
    });
    req.flush(expectedAddResponse);
  });

  it('should call deleteCustomer(id) and return value of expectedReturn', () => {
    const expectedReturn = {
      raw: [],
      affected: 1,
    };
    let actualReturn = {};
    const idOfCustomerToDelete = '8dbd427f-fa5f-4807-9ded-048706e0a91d';
    service.deleteCustomer(idOfCustomerToDelete).subscribe((result) => {
      actualReturn = result;
      expect(actualReturn).toEqual(expectedReturn);
    });
    const req = httpController.expectOne({
      method: 'DELETE',
      url: environment.serviceURL + 'customer/' + idOfCustomerToDelete,
    });
    req.flush(expectedReturn);
  });

  it('should call updateCustomer(customer) and return value of expectedReturn', () => {
    const expectedReturn = {};
    const customerToUpdate = <Customer>(<unknown>{
      id: '8dbd427f-fa5f-4807-9ded-048706e0a91d',
      name: 'RSA SOFT',
      CUI: '43911790',
      Reg: 'J31/149/2021',
      address: 'Gheorghe Doje, nr 89',
      city: 'Zalau',
      country: 'Romania',
      directorName: 'Rusu Alex George',
      directorTel: '+40 747011397',
      directorEmail: 'rusualexrsa@gmail.com',
      internal: true,
      shortName: 'RSA',
    });
    let actualReturn = {};
    service.updateCustomer(customerToUpdate).subscribe((result) => {
      actualReturn = result;
      expect(actualReturn).toEqual(expectedReturn);
    });
    const req = httpController.expectOne({
      method: 'PUT',
      url: environment.serviceURL + 'customer/' + customerToUpdate.id,
    });
    req.flush(expectedReturn);
  });

  it('should call getCustomerInvoicePDF and return PDF invoice as Blob', () => {
    const customerId = 'lskdjfhjksdf';
    const invoiceNumber = '1123';
    const selectedMonth = '02';
    const selectedYear = '2022';
    const euroExchange = 5.55;
    const dateFormatted = 22022022;

    const response = new Blob();

    service
      .getCustomerInvoicePDF(
        customerId,
        invoiceNumber,
        selectedMonth,
        selectedYear,
        euroExchange,
        dateFormatted
      )
      .subscribe((result) => {
        expect(result['body']).toEqual(response);
      });

    const url =
      environment.serviceURL +
      'customer/invoice/pdf/' +
      customerId +
      '/' +
      invoiceNumber +
      '/' +
      selectedMonth +
      '/' +
      selectedYear +
      '/' +
      euroExchange +
      '/' +
      dateFormatted;

    const req = httpController.expectOne({
      method: 'GET',
      url: url,
    });
    req.flush(response);
  });
});

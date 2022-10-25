import {
  HttpClient,
  HttpClientModule,
  HttpResponse,
} from '@angular/common/http';
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
import { Customer } from 'src/app/models/customer';
import { CustomerService } from './customer.service';

describe('SpecFileCustomerService', () => {
  let service: CustomerService;
  let httpController: HttpTestingController;
  const expectedCustomers: Customer[] = [
    {
      id: 'ba545783-bbd6-4505-bdcf-39a968dc3077',
      customerName: 'Alighieri',
      customerCUI: 'fs.dkjmfl',
      customerReg: 'lfksdjkfllk',
      customerAddress: 'kjsdalfklsl',
      customerCity: 'ksdfjdslfsjfdl',
      customerCountry: 'safasfsss',
      customerDirectorName: '',
      customerDirectorTel: '',
      customerDirectorEmail: '',
      internal: false,
      shortName: 'null',
    },
    {
      id: 'ba545783-bbd6-4505-bdcf-39a968dc3077',
      customerName: 'Alighieri',
      customerCUI: 'fs.dkjmfl',
      customerReg: 'lfksdjkfllk',
      customerAddress: 'kjsdalfklsl',
      customerCity: 'ksdfjdslfsjfdl',
      customerCountry: 'safasfsss',
      customerDirectorName: '',
      customerDirectorTel: '',
      customerDirectorEmail: '',
      internal: false,
      shortName: 'null',
    },
    {
      id: 'ba545783-bbd6-4505-bdcf-39a968dc3077',
      customerName: 'Alighieri',
      customerCUI: 'fs.dkjmfl',
      customerReg: 'lfksdjkfllk',
      customerAddress: 'kjsdalfklsl',
      customerCity: 'ksdfjdslfsjfdl',
      customerCountry: 'safasfsss',
      customerDirectorName: '',
      customerDirectorTel: '',
      customerDirectorEmail: '',
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
    let actualCustomers: Customer[] | undefined;
    service.getCustomers().subscribe((result) => {
      actualCustomers = result;
      expect(result).toEqual(expectedCustomers);
    });
    const req = httpController.expectOne({
      method: 'GET',
      url: environment.serviceURL + 'customer',
    });
    req.flush(expectedCustomers);
  });

  it('should call getCustomer(id) and return the customer with id taken as parameter', () => {
    let actualCustomer: Customer | undefined;
    const expectedCustomer: Customer = {
      customerName: 'Alighieri',
      customerCUI: 'fs.dkjmfl',
      customerReg: 'lfksdjkfllk',
      customerAddress: 'kjsdalfklsl',
      customerCity: 'ksdfjdslfsjfdl',
      customerCountry: 'safasfsss',
      customerDirectorName: '',
      customerDirectorTel: '',
      customerDirectorEmail: '',
      internal: false,
      shortName: 'null',
    };

    const id = '1';
    service.getCustomer(id).subscribe((result) => {
      actualCustomer = result;
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
      customerName: 'Alighieri',
      customerCUI: 'fs.dkjmfl',
      customerReg: 'lfksdjkfllk',
      customerAddress: 'kjsdalfklsl',
      customerCity: 'ksdfjdslfsjfdl',
      customerCountry: 'safasfsss',
      customerDirectorName: '',
      customerDirectorTel: '',
      customerDirectorEmail: '',
      internal: false,
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
      customerName: 'RSA SOFT',
      customerCUI: '43911790',
      customerReg: 'J31/149/2021',
      customerAddress: 'Gheorghe Doje, nr 89',
      customerCity: 'Zalau',
      customerCountry: 'Romania',
      customerDirectorName: 'Rusu Alex George',
      customerDirectorTel: '+40 747011397',
      customerDirectorEmail: 'rusualexrsa@gmail.com',
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
  it('should call getCustomerInvoiceXLSX and return XLSX invoice as Blob', () => {
    const customerId = 'lskdjfhjksdf';
    const invoiceNumber = '1123';
    const selectedMonth = '02';
    const selectedYear = '2022';
    const euroExchange = 5.55;
    const dateFormatted = 22022022;

    const response = new Blob();

    service
      .getCustomerInvoiceXLSX(
        customerId,
        invoiceNumber,
        selectedMonth,
        selectedYear,
        euroExchange,
        dateFormatted
      )
      .subscribe((result) => {
        const actualResult = result;
        expect(actualResult.body).toEqual(response);
      });

    const url =
      environment.serviceURL +
      'customer/invoice/xlsx/' +
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
        const actualResult = result;
        expect(actualResult.body).toEqual(response);
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

export interface Customer {
  id?: string;
  customerName: string;
  customerCUI: string;
  customerReg: string;
  customerAddress: string;
  customerCity: string;
  customerCountry: string;
  customerDirectorName: string;
  customerDirectorTel: string;
  customerDirectorEmail: string;
  internal: boolean;
  IBANRO?: string;
  IBANEUR?: string;
  romanianCompany: boolean;
  shortName: string;
  VAT: boolean;
  swift?: string;
}

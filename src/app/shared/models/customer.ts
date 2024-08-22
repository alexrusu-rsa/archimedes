export interface Customer {
  id?: string;
  name: string;
  CUI: string;
  Reg: string;
  address: string;
  city: string;
  country: string;
  directorName: string;
  directorTel: string;
  directorEmail: string;
  internal: boolean;
  IBANRO?: string;
  IBANEUR?: string;
  romanianCompany: boolean;
  shortName: string;
  VAT: boolean;
  swift?: string;
}

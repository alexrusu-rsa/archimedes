export interface Customer {
  id?: string;
  name: string;
  cui: string;
  reg: string;
  address: string;
  city: string;
  country: string;
  directorName: string;
  directorTel: string;
  directorEmail: string;
  internal: boolean;
  ibanRo?: string;
  ibanEur?: string;
  romanianCompany: boolean;
  shortName: string;
  vat: boolean;
  swift?: string;
}

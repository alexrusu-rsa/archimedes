export class Activity {
  id?: string;
  name: string;
  date: string;
  start: string;
  end: string;
  description?: string;
  extras?: string;
  employeeId: string;
  constructor(
    name: string,
    date: string,
    start: string,
    end: string,
    description: string,
    extras: string,
    employeeId: string
  ) {
    this.name = name;
    this.date = date;
    this.start = start;
    this.end = end;
    this.employeeId = employeeId;
  }
}

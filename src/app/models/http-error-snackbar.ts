export class HttpErrorSnackbar {
  status?: number;
  errorMessage?: string;

  constructor(status: number, errorMessage: string) {
    this.status = status;
    this.errorMessage = errorMessage;
  }
}

export class HttpErrorSnackbar {
  status?: number;
  errorMessage?: string;
  successMessage?: string;

  constructor(status?: number, errorMessage?: string, successMessage?: string) {
    this.status = status;
    this.errorMessage = errorMessage;
    this.successMessage = successMessage;
  }
}

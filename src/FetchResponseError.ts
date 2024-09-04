import ExtendableError from 'es6-error';

export class FetchResponseError extends ExtendableError {
  response: Response;

  status: number;

  statusText: string;

  constructor(response: Response) {
    super(response.statusText);
    this.name = 'FetchResponseError';
    this.response = response;
    this.status = response.status;
    this.statusText = response.statusText;
  }
}

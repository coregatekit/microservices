import { ResultStatus } from './enum/result';

export interface HttpResponse<T> {
  status: ResultStatus;
  message: string;
  data?: T;
}

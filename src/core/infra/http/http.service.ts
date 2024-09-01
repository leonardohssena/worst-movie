import { HttpService as AxiosHttpService } from '@nestjs/axios'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { lastValueFrom, Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

@Injectable()
export class HttpService {
  constructor(private readonly httpService: AxiosHttpService) {}

  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return lastValueFrom(
      this.httpService.get<T>(url, config).pipe(
        map((response: AxiosResponse<T>) => response.data),
        catchError(this.handleError),
      ),
    )
  }

  post<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> {
    return lastValueFrom(
      this.httpService.post<T>(url, data, config).pipe(
        map((response: AxiosResponse<T>) => response.data),
        catchError(this.handleError),
      ),
    )
  }

  private handleError(error: AxiosError): Observable<never> {
    throw new HttpException(
      error.response?.data || 'An error occurred during the HTTP request',
      error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    )
  }
}

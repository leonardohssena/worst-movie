import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { v4 as uuid } from 'uuid'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('LoggingInterceptor')
  private readonly excludedRoutes: string[] = ['/api/health']

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    const correlationHeader = request.header('x-correlation-id') || uuid()
    request.headers['x-correlation-id'] = correlationHeader
    response.setHeader('X-Correlation-Id', correlationHeader)

    const { method, originalUrl, body: reqBody, headers: reqHeaders } = request
    if (this.excludedRoutes.includes(originalUrl)) {
      return next.handle()
    }

    const start = Date.now()
    this.logger.log(`Incoming Request [${correlationHeader}]: ${method} ${originalUrl}`, {
      headers: this.sanitizeData(reqHeaders),
      body: this.sanitizeData(reqBody),
    })

    return next.handle().pipe(
      tap(data => {
        const { statusCode } = response
        const responseTime = Date.now() - start

        const sanitizedData = Array.isArray(data) ? data.map(item => this.sanitizeData(item)) : this.sanitizeData(data)

        this.logger.log(
          `Outgoing Response [${correlationHeader}]: ${method} ${originalUrl} ${statusCode} - ${responseTime}ms`,
          {
            statusCode,
            headers: this.sanitizeData(response.getHeaders()),
            body: sanitizedData,
          },
        )
      }),
    )
  }

  private sanitizeData(data: { [key: string]: unknown }): { [key: string]: unknown } {
    const sanitized = { ...data }

    if (sanitized.password) {
      sanitized.password = '******'
    }

    if (sanitized.token) {
      sanitized.token = '******'
    }

    return sanitized
  }
}

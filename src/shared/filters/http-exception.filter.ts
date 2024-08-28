import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'
import { Request, Response } from 'express'

import sanitizeData from '@shared/helpers/sanitezed-data.helper'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    const statusCode = exception.getStatus ? exception.getStatus() : 500
    const start = Number(request.headers['x-start-time'])

    const correlationHeader = request.headers['x-correlation-id'] || 'N/A'
    const { method, originalUrl } = request
    const responseTime = Date.now() - start
    response.setHeader('X-Duration-Time', responseTime)

    this.logger.error(
      `Outgoing Response With Exception [${correlationHeader}]: ${method} ${originalUrl} ${statusCode} - ${responseTime}ms`,
      {
        data: {
          statusCode,
          headers: sanitizeData(response.getHeaders()),
          message: exception.message,
          stack: exception.stack,
        },
      },
    )

    response.status(statusCode).json({
      statusCode,
      message: exception.message,
      correlationId: correlationHeader,
    })
  }
}

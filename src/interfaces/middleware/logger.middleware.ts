import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger()

  use(req: Request, res: Response, next: NextFunction) {
    const correlationHeader = req.header('x-correlation-id') || uuid()
    req.headers['x-correlation-id'] = correlationHeader
    res.set('X-Correlation-Id', correlationHeader)

    const logData = {
      body: req.body,
      headers: req.headers,
      originalUrl: req.originalUrl,
    }

    this.logger.log(`Request - ${correlationHeader}`, logData)

    this.getResponseLog(res, correlationHeader)

    if (next) {
      next()
    }
  }

  private getResponseLog = (res: Response, correlationHeader: string) => {
    const rawResponseEnd = res.end
    let chunkBuffers: Buffer[] = []

    res.end = (...chunks) => {
      const resArgs = chunks.filter(chunk => chunk)

      if (resArgs.length > 0) {
        chunkBuffers = [...chunkBuffers, ...resArgs]
      }

      const body = Buffer.concat(chunkBuffers).toString('utf8')

      const responseLog = {
        body: JSON.parse(body) || body || {},
        headers: res.getHeaders(),
        statusCode: res.statusCode,
      }

      if (responseLog.statusCode < 300) {
        this.logger.log(`Response - ${correlationHeader}`, responseLog)
      } else {
        this.logger.error(`Response - ${correlationHeader}`, responseLog)
      }

      rawResponseEnd.apply(res, resArgs)
      return responseLog as unknown as Response
    }
  }
}

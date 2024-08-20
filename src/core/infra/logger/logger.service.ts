import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import * as winston from 'winston'

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger

  constructor(private configService: ConfigService) {
    this.logger = winston.createLogger({
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      level: 'info',
      transports: [
        new winston.transports.Console({
          format: winston.format.prettyPrint(),
        }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    })
  }

  log(message: string, data: unknown) {
    this.logger.info(message, { data })
  }

  error(message: string, trace: string, data: unknown) {
    this.logger.error(message, trace, { data })
  }

  warn(message: string, data: unknown) {
    this.logger.warn(message, { data })
  }

  debug(message: string, data: unknown) {
    this.logger.debug(message, { data })
  }

  verbose(message: string, data: unknown) {
    this.logger.verbose(message, { data })
  }
}

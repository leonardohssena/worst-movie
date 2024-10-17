import { AsyncLocalStorage } from 'async_hooks'

import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as winston from 'winston'

import sanitizeData from '@shared/helpers/sanitezed-data.helper'

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger
  private readonly loggerTransaction: winston.Logger

  private asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>()

  constructor(private configService: ConfigService) {
    const defaultLoggerConfig = {
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      level: 'info',
      transports: [
        new winston.transports.Console({
          format: winston.format.prettyPrint(),
        }),
      ],
    }
    this.loggerTransaction = winston.createLogger({
      ...defaultLoggerConfig,
      defaultMeta: { type: 'TRANSACTION' },
    })
    this.loggerTransaction.add(
      new winston.transports.File({ filename: `logs/${this.configService.get('APP_NAME')}_transaction.log` }),
    )
    this.logger = winston.createLogger({
      ...defaultLoggerConfig,
      defaultMeta: { type: 'TRACE' },
    })
    this.logger.add(new winston.transports.File({ filename: `logs/${this.configService.get('APP_NAME')}_trace.log` }))
  }

  private getTransactionId(): string | undefined {
    return this.asyncLocalStorage.getStore()?.get('transactionId')
  }

  private removeTransactionId() {
    this.asyncLocalStorage.getStore()?.delete('transactionId')
  }

  private createTransaction(transactionId: string): string {
    const store = new Map<string, string>().set('transactionId', transactionId)
    this.asyncLocalStorage.enterWith(store)
    this.logTransaction('Transaction started', transactionId, 'IN_EXECUTION')
    return transactionId
  }

  private finishTransaction(status: string, transactionId: string) {
    this.logTransaction(`Transaction finished with status: ${status}`, transactionId, status)
    this.removeTransactionId()
  }

  private logTransaction(message: string, transactionId: string, status: string) {
    this.loggerTransaction.info(message, {
      transactionId,
      status,
    })
  }

  private logMessage(
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    status: string,
    data?: object,
    isFinal = false,
    transactionId: string = this.getTransactionId(),
  ) {
    const sanitizedData = data ? (Array.isArray(data) ? data.map(item => sanitizeData(item)) : sanitizeData(data)) : {}
    this.logger[level](message, { data: sanitizedData, transactionId, status })
    if (isFinal) this.finishTransaction(status, transactionId)
  }

  log(
    message: string,
    { transactionId, isFinal = false, data }: { transactionId?: string; isFinal?: boolean; data?: object },
  ) {
    if (transactionId) {
      this.createTransaction(transactionId)
    }
    this.logMessage('info', message, 'SUCCESS', data, isFinal)
  }

  error(
    message: string,
    { transactionId, isFinal = false, data }: { transactionId?: string; isFinal?: boolean; data?: object },
  ) {
    this.logMessage('error', message, 'ERROR', data, isFinal, transactionId)
  }

  warn(message: string, { isFinal = false, data }: { isFinal?: boolean; data?: object }) {
    this.logMessage('warn', message, 'WARNING', data, isFinal)
  }

  debug(message: string, { isFinal = false, data }: { isFinal?: boolean; data?: object }) {
    this.logMessage('debug', message, 'DEBUG', data, isFinal)
  }
}

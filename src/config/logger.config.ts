import { registerAs } from '@nestjs/config'

export default registerAs('logger', () => ({
  level: process.env.LOGGER_LEVEL || 'info',
  mongoDb: {
    enabled: process.env.LOGGER_MONGODB_ENABLED === 'true',
    uri: process.env.LOGGER_MONGODB_URI,
    transactionCollection: process.env.LOGGER_MONGODB_TRANSACTION_COLLECTION || 'transactions',
    traceCollection: process.env.LOGGER_MONGODB_TRACE_COLLECTION || 'traces',
  },
}))

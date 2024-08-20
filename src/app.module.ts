import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'
import { TerminusModule } from '@nestjs/terminus'

import { AuthModule } from '@infra/auth/auth.module'
import { HealthController } from '@infra/terminus'
import { LoggerMiddleware } from '@interfaces/middleware'
import { LoggerService } from '@infra/logger/logger.service'
import { PrismaClientExceptionFilter } from '@infra/database/prisma/prisma-client-exceptions.filter'

@Module({
  controllers: [HealthController],
  imports: [AuthModule, ConfigModule.forRoot({ expandVariables: true, isGlobal: true }), HttpModule, TerminusModule],
  providers: [
    LoggerService,
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ method: RequestMethod.ALL, path: '*' })
  }
}

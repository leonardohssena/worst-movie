import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { TerminusModule } from '@nestjs/terminus'

import loggerConfig from '@config/logger.config'
import { PrismaModule } from '@infra/database/prisma/prisma.module'
import { LoggerService } from '@infra/logger/logger.service'
import { ProducersModule } from '@infra/modules/producers.module'
import { HealthController } from '@infra/terminus'
import { LoggingInterceptor } from '@interfaces/interceptors/logger.interceptor'
import { HttpExceptionFilter } from '@shared/filters/http-exception.filter'
import { PrismaClientExceptionFilter } from '@shared/filters/prisma-client-exceptions.filter'

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({ expandVariables: true, isGlobal: true }),
    ConfigModule.forFeature(loggerConfig),
    HttpModule,
    PrismaModule,
    ProducersModule,
    TerminusModule,
  ],
  providers: [
    LoggerService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}

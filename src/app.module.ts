import { HttpModule } from '@nestjs/axios'
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { TerminusModule } from '@nestjs/terminus'

import { AuthModule } from '@infra/auth/auth.module'
import { PrismaModule } from '@infra/database/prisma/prisma.module'
import { PrismaClientExceptionFilter } from '@infra/database/prisma/prisma-client-exceptions.filter'
import { LoggerService } from '@infra/logger/logger.service'
import { UsersModule } from '@infra/modules/users.module'
import { HealthController } from '@infra/terminus'
import { LoggerMiddleware } from '@interfaces/middleware'

@Module({
  controllers: [HealthController],
  imports: [
    AuthModule,
    ConfigModule.forRoot({ expandVariables: true, isGlobal: true }),
    HttpModule,
    PrismaModule,
    UsersModule,
    TerminusModule,
  ],
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

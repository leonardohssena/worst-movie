import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import databaseConfig from '@config/database.config'

import { PrismaService } from './prisma.service'
import { SeedService } from './seed.service'

@Global()
@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  exports: [PrismaService],
  providers: [PrismaService, SeedService],
})
export class PrismaModule {}

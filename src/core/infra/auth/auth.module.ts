import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'

import authConfig from '@config/auth.config'
import { JwtStrategy } from '@infra/auth/jwt.strategy'

@Module({
  exports: [PassportModule, JwtStrategy],
  imports: [ConfigModule.forFeature(authConfig), PassportModule.register({})],
  providers: [JwtStrategy],
})
export class AuthModule {}

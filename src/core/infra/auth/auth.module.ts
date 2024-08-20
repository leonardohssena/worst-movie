import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { JwtStrategy } from '@infra/auth/jwt.strategy'
import authConfig from '@config/auth.config'

@Module({
  exports: [PassportModule, JwtStrategy],
  imports: [ConfigModule.forFeature(authConfig), PassportModule.register({})],
  providers: [JwtStrategy],
})
export class AuthModule {}

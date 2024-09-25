import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import authConfig from '@config/auth.config'
import { HttpModule } from '@infra/http'

import { Auth0Service } from './auth0.service'

@Module({
  imports: [ConfigModule.forFeature(authConfig), HttpModule],
  providers: [Auth0Service],
  exports: [Auth0Service],
})
export class Auth0Module {}

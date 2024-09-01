import { Module } from '@nestjs/common'

import { HttpModule } from '@infra/http'

import { Auth0Service } from './auth0.service'

@Module({
  imports: [HttpModule],
  providers: [Auth0Service],
  exports: [Auth0Service],
})
export class Auth0Module {}

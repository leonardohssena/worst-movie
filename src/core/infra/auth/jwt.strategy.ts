import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { Strategy as BaseStrategy, ExtractJwt } from 'passport-jwt'
import { passportJwtSecret } from 'jwks-rsa'

import { JwtPayload } from './jwt.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseStrategy) {
  constructor(configService: ConfigService) {
    super({
      algorithms: ['RS256'],
      audience: configService.get<string>('auth.audience'),
      issuer: `https://${configService.get<string>('auth.domain')}/`,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${configService.get<string>('auth.domain')}/.well-known/jwks.json`,
        rateLimit: true,
      }),
    })
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload
  }
}

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { passportJwtSecret } from 'jwks-rsa'
import { ExtractJwt, Strategy as BaseStrategy } from 'passport-jwt'

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

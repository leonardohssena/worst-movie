import { Injectable, Logger } from '@nestjs/common'

import { HttpService } from '@infra/http'

import { Auth0TokenDto, Auth0UserDto, CreateAuth0UserDto } from './dto'

@Injectable()
export class Auth0Service {
  private readonly auth0Domain = process.env.AUTH0_DOMAIN
  private readonly auth0ClientId = process.env.AUTH0_CLIENT_ID
  private readonly auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET
  private readonly auth0Audience = process.env.AUTH0_AUDIENCE

  private auth0Token: string
  private tokenExpirationTime: number

  private readonly logger = new Logger(Auth0Service.name)

  constructor(private readonly httpService: HttpService) {}

  private async initAuth0Token() {
    try {
      const auth0TokenResponse = await this.generateAuth0Token()
      const expiresIn = auth0TokenResponse.expires_in || 3600
      this.tokenExpirationTime = Date.now() + expiresIn * 1000
      this.auth0Token = `${auth0TokenResponse.token_type} ${auth0TokenResponse.access_token}`
      this.logger.log('Auth0 token generated')
    } catch (err) {
      this.logger.error(`Error generating Auth0 token: ${err.message}`, err.stack)
    }
  }

  private async generateAuth0Token(): Promise<Auth0TokenDto> {
    const url = `https://${this.auth0Domain}/oauth/token`

    const response = await this.httpService.post(
      url,
      {
        client_id: this.auth0ClientId,
        client_secret: this.auth0ClientSecret,
        audience: this.auth0Audience,
        grant_type: 'client_credentials',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    return response as Auth0TokenDto
  }

  private async ensureTokenIsValid(): Promise<void> {
    if (!this.auth0Token || Date.now() >= this.tokenExpirationTime) {
      this.logger.log('Auth0 token is expired or not set, generating a new one...')
      await this.initAuth0Token()
    }
  }

  async createUser(createAuth0UserDto: CreateAuth0UserDto): Promise<Auth0UserDto> {
    await this.ensureTokenIsValid()

    const url = `https://${this.auth0Domain}/api/v2/users`
    return this.httpService.post(url, createAuth0UserDto, {
      headers: {
        Authorization: this.auth0Token,
        'Content-Type': 'application/json',
      },
    })
  }
}

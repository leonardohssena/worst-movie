import { v4 as uuid } from 'uuid'

export class CreateAuth0UserDto {
  connection: string
  email: string
  username: string
  password: string
  user_metadata: object
  email_verified: boolean
  app_metadata: object

  constructor(partial: Partial<CreateAuth0UserDto> = {}) {
    Object.assign(
      this,
      {
        connection: 'Username-Password-Authentication',
        password: uuid(),
        user_metadata: {},
        email_verified: false,
        app_metadata: {},
      },
      partial,
    )
  }
}

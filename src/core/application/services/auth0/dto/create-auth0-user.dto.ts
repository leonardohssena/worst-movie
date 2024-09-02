import { v4 as uuid } from 'uuid'

import removeSpaces from '@shared/helpers/string-remove-spaces.helper'

export class CreateAuth0UserDto {
  connection: string
  email: string
  username: string
  password: string
  user_metadata: object
  email_verified: boolean
  app_metadata: object

  constructor(partial: Partial<CreateAuth0UserDto> = {}) {
    partial.username = removeSpaces(partial.username)
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

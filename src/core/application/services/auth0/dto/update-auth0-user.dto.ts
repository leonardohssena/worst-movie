import removeSpaces from '@shared/helpers/string-remove-spaces.helper'

export class UpdateAuth0UserDto {
  email: string
  username: string

  constructor(partial: Partial<UpdateAuth0UserDto> = {}) {
    partial.username = removeSpaces(partial.username)
    Object.assign(this, partial)
  }
}

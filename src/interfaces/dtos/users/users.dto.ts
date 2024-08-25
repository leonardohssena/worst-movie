import { Expose, plainToInstance } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

import TransformDate from '../shared/transform-date.helpers'
import User from '@domain/models/users.model'

export class UserDTO {
  @Expose()
  @ApiProperty({
    description: 'The id of the user',
    example: '641484f003c96fe562c53abf',
  })
  id: string

  @Expose()
  @ApiProperty({
    description: 'The unique email of the user',
    example: 'john.doe@email.com',
  })
  email: string

  @Expose()
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string

  @Expose()
  @ApiProperty({ description: 'The creation date of the user' })
  @TransformDate()
  createdAt: Date

  @Expose()
  @ApiProperty({ description: 'The date of the last user update' })
  @TransformDate()
  updatedAt: Date

  static toViewModel(user: User | User[]): UserDTO | UserDTO[] {
    return plainToInstance(UserDTO, user, { excludeExtraneousValues: true })
  }
}

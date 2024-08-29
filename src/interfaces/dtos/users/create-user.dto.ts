import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string
}

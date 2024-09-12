import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsOptional()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsOptional()
  @IsEmail()
  email: string
}

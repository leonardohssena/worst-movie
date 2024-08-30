import { HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class ConflictError {
  @ApiProperty({
    description: 'The error message.',
    example: 'Resource already exists',
  })
  message: string

  @ApiProperty({
    description: 'The error status.',
    example: HttpStatus.CONFLICT,
  })
  statusCode: HttpStatus

  @ApiProperty({
    description: 'The id of operation.',
    example: '12',
  })
  correlationId: string
}

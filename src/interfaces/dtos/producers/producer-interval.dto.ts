import { ApiProperty } from '@nestjs/swagger'
import { Expose, plainToInstance } from 'class-transformer'

import { ProducersIntervalResponse } from '@application/useCases/producers'

class ProducersIntervalDTO {
  @Expose()
  @ApiProperty({
    description: 'The name of the producer',
    example: 'John Doe',
  })
  producer: string

  @Expose()
  @ApiProperty({
    description: 'The interval years between wins',
    example: 2,
  })
  interval: number

  @Expose()
  @ApiProperty({
    description: 'The previous win year',
    example: 2010,
  })
  previousWin: number

  @Expose()
  @ApiProperty({
    description: 'The follow win year',
    example: 2012,
  })
  followingWin: number
}

export class ProducersIntervalResponseDTO {
  @Expose()
  @ApiProperty({
    description: 'Array of producers min interval',
    example: [
      {
        producer: 'John Doe',
        interval: 2,
        previousWin: 2010,
        followingWin: 2012,
      },
    ],
  })
  min: ProducersIntervalDTO[]

  @Expose()
  @ApiProperty({
    description: 'Array of producers max interval',
    example: [
      {
        producer: 'John Doe',
        interval: 2,
        previousWin: 2010,
        followingWin: 2012,
      },
    ],
  })
  max: ProducersIntervalDTO[]

  static toViewModel(
    producersIntervalResponse: ProducersIntervalResponse,
  ): ProducersIntervalResponseDTO | ProducersIntervalResponseDTO[] {
    return plainToInstance(ProducersIntervalResponseDTO, producersIntervalResponse, { excludeExtraneousValues: true })
  }
}

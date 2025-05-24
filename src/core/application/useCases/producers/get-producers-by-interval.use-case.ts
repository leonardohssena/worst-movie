import { Injectable } from '@nestjs/common'

import { IMoviesRepository } from '@domain/repositories/movies/movies.protocol'

export type ProducersInterval = {
  producer: string
  interval: number
  previousWin: number
  followWin: number
}

export type ProducersIntervalResponse = {
  min: ProducersInterval[]
  max: ProducersInterval[]
}

@Injectable()
export class GetProducersByIntervalUseCase {
  constructor(private readonly movieRepository: IMoviesRepository) {}

  async execute(): Promise<ProducersIntervalResponse> {
    const movies = await this.movieRepository.findAll(
      {
        winner: true,
      },
      {
        year: 'asc',
      },
    )

    const producerAndYears = movies.reduce<Map<string, number[]>>((previous, { year, producers }) => {
      producers.split(',').map(producer => {
        if (!previous.has(producer)) {
          previous.set(producer, [])
        }
        previous.get(producer).push(year)
      })
      return previous
    }, new Map<string, number[]>())

    const [minProducerInterval, maxProducerInterval] = Array.from(producerAndYears.entries()).reduce(
      ([minProducerInterval, maxProducerInterval], [producer, years]) => {
        if (years.length < 2) return [minProducerInterval, maxProducerInterval]

        const sortedYears = years.sort((a, b) => a - b)

        const firstYear = sortedYears[0]
        const secondYear = sortedYears[1]
        const lastYear = sortedYears[sortedYears.length - 1]

        const minInterval = secondYear - firstYear
        const maxInterval = lastYear - firstYear

        minProducerInterval.push({ producer, interval: minInterval, previousWin: firstYear, followWin: lastYear })
        maxProducerInterval.push({ producer, interval: maxInterval, previousWin: firstYear, followWin: lastYear })

        return [minProducerInterval, maxProducerInterval]
      },
      [[], []],
    )

    return {
      min: minProducerInterval,
      max: maxProducerInterval,
    }
  }
}

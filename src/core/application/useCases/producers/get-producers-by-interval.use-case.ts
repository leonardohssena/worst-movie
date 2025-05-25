import { Injectable } from '@nestjs/common'

import { IMoviesRepository } from '@domain/repositories/movies/movies.protocol'

export type ProducersInterval = {
  producer: string
  interval: number
  previousWin: number
  followingWin: number
}

export type ProducersIntervalResponse = {
  min: ProducersInterval[]
  max: ProducersInterval[]
}

@Injectable()
export class GetProducersByIntervalUseCase {
  constructor(private readonly movieRepository: IMoviesRepository) {}

  private getMinInterval(years: number[]) {
    const minInterval = years.reduce(
      (current, year, index) => {
        if (index === 0) return current
        const previousWin = years[index - 1]
        const interval = year - previousWin
        if (interval < current.interval || current.interval === 0) {
          return { interval, previousWin, followingWin: year }
        }
        return current
      },
      { interval: 0, previousWin: 0, followingWin: 0 },
    )
    return minInterval
  }

  private getMaxInterval(years: number[]) {
    const firstYear = years[0]
    const lastYear = years[years.length - 1]
    return {
      interval: lastYear - firstYear,
      previousWin: firstYear,
      followingWin: lastYear,
    }
  }

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

    const { minProducerInterval, maxProducerInterval } = Array.from(producerAndYears.entries()).reduce(
      ({ minProducerInterval, maxProducerInterval }, [producer, years]) => {
        if (years.length < 2) return { minProducerInterval, maxProducerInterval }

        const sortedYears = years.sort((a, b) => a - b)

        const minInterval = this.getMinInterval(sortedYears)
        const maxInterval = this.getMaxInterval(sortedYears)

        minProducerInterval.push({ producer, ...minInterval })
        maxProducerInterval.push({ producer, ...maxInterval })

        return { minProducerInterval, maxProducerInterval }
      },
      { minProducerInterval: [], maxProducerInterval: [] },
    )

    return {
      min: minProducerInterval,
      max: maxProducerInterval,
    }
  }
}

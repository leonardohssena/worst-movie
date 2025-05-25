import * as path from 'path'

import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Prisma } from '@prisma/client'

import parseCsvToJson from '@shared/helpers/csv-to-json'

import { PrismaService } from './prisma.service'

type MovieCsv = {
  title: string
  year: string
  studios: string
  producers: string
  winner: string | undefined
}

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name)

  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (!this.configService.get<boolean>('database.seedDb')) return
    this.logger.log('Populating database...')
    await this.populateMoviesFromCSV()
    this.logger.log('Database populated!')
  }

  private async populateMoviesFromCSV() {
    this.logger.log('Deleting all movies...')
    await this.prisma.movie.deleteMany()

    this.logger.log('Fetching movies...')
    const records = await this.getMoviesFromCSV()

    this.logger.log('Creating movies...')
    await this.prisma.movie.createMany({
      data: records,
    })

    this.logger.log(`${records.length} movies created!`)
  }

  private async getMoviesFromCSV(): Promise<Prisma.MovieCreateManyInput[]> {
    const filePath = path.join(
      process.cwd(),
      'assets',
      'data',
      this.configService.get<string>('database.seedCsvMovieFileName'),
    )
    const records = await parseCsvToJson(filePath)

    const movies: Prisma.MovieCreateManyInput[] = records.map((record: MovieCsv) => ({
      title: record.title,
      year: parseInt(record.year, 10),
      studios: record.studios,
      producers: record.producers
        .replace(/, and /gi, ',')
        .replace(/ and /gi, ',')
        .split(',')
        .map(p => p.trim())
        .join(','),
      winner: record.winner?.toLowerCase() === 'yes',
    }))

    return movies
  }
}

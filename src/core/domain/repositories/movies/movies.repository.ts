import { Injectable } from '@nestjs/common'

import Movie from '@domain/models/movies.model'
import { PrismaService } from '@infra/database/prisma/prisma.service'

import { BaseRepository } from '../base.repository'

import { IMoviesRepository } from './movies.protocol'

@Injectable()
export class MoviesRepository extends BaseRepository<Movie> implements IMoviesRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma.movie)
  }
}

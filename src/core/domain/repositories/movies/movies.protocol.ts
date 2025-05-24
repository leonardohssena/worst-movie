import { Injectable } from '@nestjs/common'

import Movie from '@domain/models/movies.model'

import { IBaseRepository } from '../base.protocol'

@Injectable()
export abstract class IMoviesRepository extends IBaseRepository<Movie> {}

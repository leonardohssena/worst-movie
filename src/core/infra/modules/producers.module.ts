import { Module } from '@nestjs/common'

import { GetProducersByIntervalUseCase } from '@application/useCases/producers'
import { IMoviesRepository } from '@domain/repositories/movies/movies.protocol'
import { MoviesRepository } from '@domain/repositories/movies/movies.repository'
import { ProducersController } from '@interfaces/controllers/producers.controller'

@Module({
  controllers: [ProducersController],
  imports: [],
  providers: [GetProducersByIntervalUseCase, { provide: IMoviesRepository, useClass: MoviesRepository }],
})
export class ProducersModule {}

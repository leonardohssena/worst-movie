import { Movie as PrismaMovie } from '@prisma/client'

import { BaseModel } from './base.model'

export default class Movie extends BaseModel implements PrismaMovie {
  title: string
  year: number
  studios: string
  producers: string
  winner: boolean

  constructor(partial: Partial<Movie>) {
    super(partial)
    Object.assign(this, partial)
  }
}

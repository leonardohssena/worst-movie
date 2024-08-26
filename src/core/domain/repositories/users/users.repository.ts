import { Injectable } from '@nestjs/common'

import User from '@domain/models/users.model'
import { PrismaService } from '@infra/database/prisma/prisma.service'

import { BaseRepository } from '../base.repository'

import { IUsersRepository } from './users.protocol'

@Injectable()
export class UsersRepository extends BaseRepository<User> implements IUsersRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma.user)
  }
}

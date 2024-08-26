import { Injectable } from '@nestjs/common'

import User from '@domain/models/users.model'
import { PrismaService } from '@infra/database/prisma/prisma.service'

import { IUsersRepository } from './users.protocol'

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany()
  }
}

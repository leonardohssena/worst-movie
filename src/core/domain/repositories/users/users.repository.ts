import { IUsersRepository } from './users.protocol'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infra/database/prisma/prisma.service'

import User from '@domain/models/users.model'

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany()
  }
}

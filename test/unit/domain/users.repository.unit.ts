import { Test } from '@nestjs/testing'

import { IUsersRepository } from '@domain/repositories/users/users.protocol'
import { UsersRepository } from '@domain/repositories/users/users.repository'
import { PrismaService } from '@infra/database/prisma/prisma.service'

import { USER_OBJECT } from '../../jest.mocks'

describe('UsersRepository', () => {
  let usersRepository: IUsersRepository
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: PrismaService,
          useFactory: () => ({
            user: {
              findMany: jest.fn(),
            },
          }),
        },
      ],
    }).compile()

    usersRepository = moduleRef.get<UsersRepository>(UsersRepository)
    prisma = moduleRef.get<PrismaService>(PrismaService)
    ;(prisma.user.findMany as jest.Mock).mockResolvedValue([USER_OBJECT])
  })

  it('should be defined', () => {
    expect(usersRepository).toBeDefined()
  })

  it('should have a findAll method', () => {
    expect(usersRepository.findAll).toBeDefined()
  })

  it('should return a list of users', async () => {
    const users = await usersRepository.findAll()
    expect(users).toEqual([USER_OBJECT])
  })
})

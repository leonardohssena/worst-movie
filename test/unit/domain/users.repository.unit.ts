import { Test } from '@nestjs/testing'

import { IUsersRepository } from '@domain/repositories/users/users.protocol'
import { UsersRepository } from '@domain/repositories/users/users.repository'
import { PrismaService } from '@infra/database/prisma/prisma.service'

import { USER_ID, USER_OBJECT } from '../../jest.mocks'

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
              findUnique: jest.fn(),
            },
          }),
        },
      ],
    }).compile()

    usersRepository = moduleRef.get<UsersRepository>(UsersRepository)
    prisma = moduleRef.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(usersRepository).toBeDefined()
  })

  describe('Method findAll', () => {
    it('should have a findAll method', () => {
      expect(usersRepository.findAll).toBeDefined()
    })

    it('should return a list of users', async () => {
      ;(prisma.user.findMany as jest.Mock).mockResolvedValue([USER_OBJECT])

      const users = await usersRepository.findAll()
      expect(users).toEqual([USER_OBJECT])
    })
  })

  describe('Method findOne', () => {
    it('should have a findAll method', () => {
      expect(usersRepository.findOne).toBeDefined()
    })

    it('should return an user', async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(USER_OBJECT)

      const users = await usersRepository.findOne({ id: USER_ID })
      expect(users).toEqual(USER_OBJECT)
    })
  })
})

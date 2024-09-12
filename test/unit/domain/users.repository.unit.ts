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
              create: jest.fn(),
              update: jest.fn(),
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

  describe('Method Create', () => {
    it('should have a created method', () => {
      expect(usersRepository.create).toBeDefined()
    })

    it('should to create an user', async () => {
      ;(prisma.user.create as jest.Mock).mockResolvedValue(USER_OBJECT)

      const users = await usersRepository.create(USER_OBJECT)
      expect(users).toEqual(USER_OBJECT)
    })
  })

  describe('Method Update', () => {
    it('should have a update method', () => {
      expect(usersRepository.update).toBeDefined()
    })

    it('should to update an user', async () => {
      ;(prisma.user.update as jest.Mock).mockResolvedValue(USER_OBJECT)

      const users = await usersRepository.update(USER_ID, USER_OBJECT)
      expect(users).toEqual(USER_OBJECT)
    })
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

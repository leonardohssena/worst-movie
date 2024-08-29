import { Test } from '@nestjs/testing'

import { GetAllUsersUseCase, GetUserByIdUseCase } from '@application/useCases/users'
import { UsersController } from '@interfaces/controllers/users.controller'

import { USER_DTO_OBJECT, USER_ID, USER_OBJECT } from '../../jest.mocks'

describe('UsersController', () => {
  let usersController: UsersController
  let getAllUsersUseCase: GetAllUsersUseCase
  let getUserByIdUseCase: GetUserByIdUseCase

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersController,
        {
          provide: GetUserByIdUseCase,
          useFactory: () => ({
            execute: jest.fn(),
          }),
        },
        {
          provide: GetAllUsersUseCase,
          useFactory: () => ({
            execute: jest.fn(),
          }),
        },
      ],
    }).compile()

    usersController = moduleRef.get<UsersController>(UsersController)
    getAllUsersUseCase = moduleRef.get<GetAllUsersUseCase>(GetAllUsersUseCase)
    getUserByIdUseCase = moduleRef.get<GetUserByIdUseCase>(GetUserByIdUseCase)
  })

  it('should be defined', () => {
    expect(usersController).toBeDefined()
  })

  describe('Method findAll', () => {
    it('should have a findAll method', () => {
      expect(usersController.findAll).toBeDefined()
    })

    it('should return a list of users', async () => {
      ;(getAllUsersUseCase.execute as jest.Mock).mockResolvedValue([USER_OBJECT])

      const users = await usersController.findAll()
      expect(users).toEqual([USER_DTO_OBJECT])
    })
  })

  describe('Method findOne', () => {
    it('should have a findOne method', () => {
      expect(usersController.findOne).toBeDefined()
    })

    it('should return an user', async () => {
      ;(getUserByIdUseCase.execute as jest.Mock).mockResolvedValue(USER_OBJECT)

      const users = await usersController.findOne(USER_ID)
      expect(users).toEqual(USER_DTO_OBJECT)
    })
  })
})

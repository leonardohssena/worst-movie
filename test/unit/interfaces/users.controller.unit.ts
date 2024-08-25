import { Test } from '@nestjs/testing'

import { GetAllUsersUseCase } from '@application/useCases/get-all-users.use-case'
import { UsersController } from '@interfaces/controllers/users.controller'

import { USER_DTO_OBJECT, USER_OBJECT } from '../../jest.mocks'

describe('UsersController', () => {
  let usersController: UsersController
  let getAllUsersUseCase: GetAllUsersUseCase

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersController,
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
    ;(getAllUsersUseCase.execute as jest.Mock).mockResolvedValue([USER_OBJECT])
  })

  it('should be defined', () => {
    expect(usersController).toBeDefined()
  })

  it('should have a findAll method', () => {
    expect(usersController.findAll).toBeDefined()
  })

  it('should return a list of users', async () => {
    const users = await usersController.findAll()
    expect(users).toEqual([USER_DTO_OBJECT])
  })
})

import { Test } from '@nestjs/testing'

import {
  CreateUserUseCase,
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from '@application/useCases/users'
import { UsersController } from '@interfaces/controllers/users.controller'

import { USER_DTO_OBJECT, USER_ID, USER_OBJECT } from '../../jest.mocks'

describe('UsersController', () => {
  let usersController: UsersController
  let createUserUseCase: CreateUserUseCase
  let getAllUsersUseCase: GetAllUsersUseCase
  let getUserByIdUseCase: GetUserByIdUseCase
  let updateUserUseCase: UpdateUserUseCase

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
        {
          provide: CreateUserUseCase,
          useFactory: () => ({
            execute: jest.fn(),
          }),
        },
        {
          provide: UpdateUserUseCase,
          useFactory: () => ({
            execute: jest.fn(),
          }),
        },
      ],
    }).compile()

    usersController = moduleRef.get<UsersController>(UsersController)
    getAllUsersUseCase = moduleRef.get<GetAllUsersUseCase>(GetAllUsersUseCase)
    getUserByIdUseCase = moduleRef.get<GetUserByIdUseCase>(GetUserByIdUseCase)
    createUserUseCase = moduleRef.get<CreateUserUseCase>(CreateUserUseCase)
    updateUserUseCase = moduleRef.get<UpdateUserUseCase>(UpdateUserUseCase)
  })

  it('should be defined', () => {
    expect(usersController).toBeDefined()
  })

  describe('Method create', () => {
    it('should have a create method', () => {
      expect(usersController.create).toBeDefined()
    })

    it('should to create an user', async () => {
      ;(createUserUseCase.execute as jest.Mock).mockResolvedValue(USER_OBJECT)

      const users = await usersController.create(USER_OBJECT)
      expect(users).toEqual(USER_DTO_OBJECT)
    })
  })

  describe('Method update', () => {
    it('should have a update method', () => {
      expect(usersController.update).toBeDefined()
    })

    it('should to update an user', async () => {
      ;(updateUserUseCase.execute as jest.Mock).mockResolvedValue(USER_OBJECT)

      const users = await usersController.update({ id: USER_ID }, USER_OBJECT)
      expect(users).toEqual(USER_DTO_OBJECT)
    })
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

      const users = await usersController.findOne({ id: USER_ID })
      expect(users).toEqual(USER_DTO_OBJECT)
    })
  })
})

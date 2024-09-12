import { ConflictException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { Auth0Service } from '@application/services/auth0/auth0.service'
import { UpdateUserUseCase } from '@application/useCases/users'
import { IUsersRepository } from '@domain/repositories/users/users.protocol'

import { AUTH0_USER_OBJECT, USER_ID, USER_OBJECT } from '../../jest.mocks'

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase
  let usersRepository: IUsersRepository
  let auth0Service: Auth0Service

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: Auth0Service,
          useFactory: () => ({
            updateUser: jest.fn(),
          }),
        },
        {
          provide: IUsersRepository,
          useFactory: () => ({
            update: jest.fn(),
            findOne: jest.fn(),
          }),
        },
      ],
    }).compile()

    useCase = moduleRef.get<UpdateUserUseCase>(UpdateUserUseCase)
    usersRepository = moduleRef.get<IUsersRepository>(IUsersRepository)
    auth0Service = moduleRef.get<Auth0Service>(Auth0Service)
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  it('should have a execute method', () => {
    expect(useCase.execute).toBeDefined()
  })

  it('should return an user', async () => {
    ;(usersRepository.findOne as jest.Mock).mockResolvedValueOnce(USER_OBJECT)
    ;(auth0Service.updateUser as jest.Mock).mockResolvedValue(AUTH0_USER_OBJECT)
    ;(usersRepository.update as jest.Mock).mockResolvedValue(USER_OBJECT)

    const result = await useCase.execute(USER_ID, USER_OBJECT)
    expect(result).toEqual(USER_OBJECT)
  })

  it('should throw a NotFoundException if the user does not exists', async () => {
    ;(usersRepository.findOne as jest.Mock).mockResolvedValue(null)

    await expect(useCase.execute(USER_ID, USER_OBJECT)).rejects.toThrow(NotFoundException)
  })

  it('should throw a ConflictException if the new email already exists', async () => {
    ;(usersRepository.findOne as jest.Mock).mockResolvedValueOnce(USER_OBJECT)
    ;(usersRepository.findOne as jest.Mock).mockResolvedValue({ ...USER_OBJECT, email: 'new-email@example.com' })

    await expect(useCase.execute(USER_ID, { ...USER_OBJECT, email: 'new-email@example.com' })).rejects.toThrow(
      ConflictException,
    )
  })
})

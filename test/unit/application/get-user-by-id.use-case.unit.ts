import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { GetUserByIdUseCase } from '@application/useCases/users'
import { IUsersRepository } from '@domain/repositories/users/users.protocol'

import { USER_ID, USER_OBJECT } from '../../jest.mocks'

describe('GetUserByIdUseCase', () => {
  let useCase: GetUserByIdUseCase
  let usersRepository: IUsersRepository

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetUserByIdUseCase,
        {
          provide: IUsersRepository,
          useFactory: () => ({
            findOne: jest.fn(),
          }),
        },
      ],
    }).compile()

    useCase = moduleRef.get<GetUserByIdUseCase>(GetUserByIdUseCase)
    usersRepository = moduleRef.get<IUsersRepository>(IUsersRepository)
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  it('should have a execute method', () => {
    expect(useCase.execute).toBeDefined()
  })

  it('should return an user', async () => {
    ;(usersRepository.findOne as jest.Mock).mockResolvedValue(USER_OBJECT)

    const result = await useCase.execute(USER_ID)
    expect(result).toEqual(USER_OBJECT)
  })

  it('should throw a NotFoundException if the user does not exist', async () => {
    ;(usersRepository.findOne as jest.Mock).mockResolvedValue(null)

    await expect(useCase.execute(USER_ID)).rejects.toThrow(NotFoundException)
  })
})

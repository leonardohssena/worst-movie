import { Test } from '@nestjs/testing'

import { GetAllUsersUseCase } from '@application/useCases/get-all-users.use-case'
import { IUsersRepository } from '@domain/repositories/users/users.protocol'

import { USER_OBJECT } from '../../jest.mocks'

describe('GetAllUsersUseCase', () => {
  let useCase: GetAllUsersUseCase
  let usersRepository: IUsersRepository

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetAllUsersUseCase,
        {
          provide: IUsersRepository,
          useFactory: () => ({
            findAll: jest.fn(),
          }),
        },
      ],
    }).compile()

    useCase = moduleRef.get<GetAllUsersUseCase>(GetAllUsersUseCase)
    usersRepository = moduleRef.get<IUsersRepository>(IUsersRepository)
    ;(usersRepository.findAll as jest.Mock).mockResolvedValue([USER_OBJECT])
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  it('should have a execute method', () => {
    expect(useCase.execute).toBeDefined()
  })

  it('should return an array of users', async () => {
    const result = await useCase.execute()
    expect(result).toEqual([USER_OBJECT])
  })
})

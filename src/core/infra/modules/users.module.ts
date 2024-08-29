import { Module } from '@nestjs/common'

import { CreateUserUseCase, GetAllUsersUseCase, GetUserByIdUseCase } from '@application/useCases/users'
import { IUsersRepository } from '@domain/repositories/users/users.protocol'
import { UsersRepository } from '@domain/repositories/users/users.repository'
import { UsersController } from '@interfaces/controllers/users.controller'

@Module({
  controllers: [UsersController],
  imports: [],
  providers: [
    CreateUserUseCase,
    GetAllUsersUseCase,
    GetUserByIdUseCase,
    { provide: IUsersRepository, useClass: UsersRepository },
  ],
})
export class UsersModule {}

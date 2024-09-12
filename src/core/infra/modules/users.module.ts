import { Module } from '@nestjs/common'

import { Auth0Module } from '@application/services/auth0/auth0.module'
import {
  CreateUserUseCase,
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from '@application/useCases/users'
import { IUsersRepository } from '@domain/repositories/users/users.protocol'
import { UsersRepository } from '@domain/repositories/users/users.repository'
import { UsersController } from '@interfaces/controllers/users.controller'

@Module({
  controllers: [UsersController],
  imports: [Auth0Module],
  providers: [
    CreateUserUseCase,
    GetAllUsersUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    { provide: IUsersRepository, useClass: UsersRepository },
  ],
})
export class UsersModule {}

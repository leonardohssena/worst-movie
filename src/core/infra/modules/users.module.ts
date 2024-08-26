import { Module } from '@nestjs/common'

import { GetAllUsersUseCase } from '@application/useCases/get-all-users.use-case'
import { IUsersRepository } from '@domain/repositories/users/users.protocol'
import { UsersRepository } from '@domain/repositories/users/users.repository'
import { UsersController } from '@interfaces/controllers/users.controller'

@Module({
  controllers: [UsersController],
  imports: [],
  providers: [GetAllUsersUseCase, { provide: IUsersRepository, useClass: UsersRepository }],
})
export class UsersModule {}

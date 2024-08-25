import { Injectable } from '@nestjs/common'

import { IUsersRepository } from '@domain/repositories/users/users.protocol'
import User from '@domain/models/users.model'

@Injectable()
export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUsersRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll()
  }
}

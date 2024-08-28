import { Injectable } from '@nestjs/common'

import User from '@domain/models/users.model'
import { IUsersRepository } from '@domain/repositories/users/users.protocol'

@Injectable()
export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUsersRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll()
  }
}

import { Injectable } from '@nestjs/common'

import User from '@domain/models/users.model'
import { IUsersRepository } from '@domain/repositories/users/users.protocol'

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUsersRepository) {}

  async execute(id: string): Promise<User | null> {
    return this.userRepository.findOne({ id })
  }
}

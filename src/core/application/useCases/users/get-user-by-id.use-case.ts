import { Injectable, NotFoundException } from '@nestjs/common'

import User from '@domain/models/users.model'
import { IUsersRepository } from '@domain/repositories/users/users.protocol'

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUsersRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ id })
    if (!user) throw new NotFoundException(`The user {${id}} has not found.`)
    return user
  }
}

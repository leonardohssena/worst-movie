import { ConflictException, Injectable } from '@nestjs/common'

import User from '@domain/models/users.model'
import { IUsersRepository } from '@domain/repositories/users/users.protocol'

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUsersRepository) {}

  async execute(userData: Partial<User>): Promise<User> {
    const user = new User(userData)
    const existingUser = await this.userRepository.findOne({ email: user.email })
    if (existingUser) throw new ConflictException('User already exists.')
    return this.userRepository.create(user)
  }
}

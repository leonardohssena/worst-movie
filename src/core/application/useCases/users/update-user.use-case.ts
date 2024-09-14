import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

import { Auth0Service } from '@application/services/auth0/auth0.service'
import { UpdateAuth0UserDto } from '@application/services/auth0/dto'
import User from '@domain/models/users.model'
import { IUsersRepository } from '@domain/repositories/users/users.protocol'
import { UpdateUserDto } from '@interfaces/dtos/users'

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUsersRepository,
    private readonly auth0Service: Auth0Service,
  ) {}

  async execute(id: string, userData: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ id })
    if (!user) throw new NotFoundException('User not found.')

    if (userData.email && userData.email !== user.email) {
      const existingUser = await this.userRepository.findOne({ email: userData.email })
      if (existingUser) throw new ConflictException('Email already in use.')
    }

    const updateAuth0UserDto = new UpdateAuth0UserDto({
      email: userData.email,
      username: userData.name,
      name: userData.name,
    })
    await this.auth0Service.updateUser(user.auth0Id, updateAuth0UserDto)

    Object.assign(user, userData)
    return this.userRepository.update(id, user)
  }
}

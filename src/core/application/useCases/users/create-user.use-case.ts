import { ConflictException, Injectable } from '@nestjs/common'

import { Auth0Service } from '@application/services/auth0/auth0.service'
import { CreateAuth0UserDto } from '@application/services/auth0/dto'
import User from '@domain/models/users.model'
import { IUsersRepository } from '@domain/repositories/users/users.protocol'
import { CreateUserDto } from '@interfaces/dtos/users'

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUsersRepository,
    private readonly auth0Service: Auth0Service,
  ) {}

  async execute(userData: CreateUserDto): Promise<User> {
    const user = new User(userData)
    const existingUser = await this.userRepository.findOne({ email: user.email })
    if (existingUser) throw new ConflictException('User already exists.')

    const createAuth0UserDto = new CreateAuth0UserDto({
      email: user.email,
      username: user.name,
    })
    const auth0User = await this.auth0Service.createUser(createAuth0UserDto)

    return this.userRepository.create(new User({ ...user, auth0Id: auth0User.user_id }))
  }
}

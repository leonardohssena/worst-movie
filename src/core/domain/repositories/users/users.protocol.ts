import { Injectable } from '@nestjs/common'

import User from '@domain/models/users.model'

@Injectable()
export abstract class IUsersRepository {
  abstract findAll(): Promise<User[]>
}

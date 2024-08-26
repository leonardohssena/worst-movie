import { Injectable } from '@nestjs/common'

import User from '@domain/models/users.model'

import { IBaseRepository } from '../base.protocol'

@Injectable()
export abstract class IUsersRepository extends IBaseRepository<User> {}

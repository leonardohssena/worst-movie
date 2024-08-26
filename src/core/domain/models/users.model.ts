import { User as PrismaUser } from '@prisma/client'

import { BaseModel } from './base.model'

export default class User extends BaseModel implements PrismaUser {
  email: string
  name: string

  constructor(partial: Partial<User>) {
    super(partial)
    Object.assign(this, partial)
  }
}

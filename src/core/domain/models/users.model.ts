import { User as PrismaUser } from '@prisma/client'

export default class User implements PrismaUser {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<User>) {
    Object.assign(this, partial)
  }
}

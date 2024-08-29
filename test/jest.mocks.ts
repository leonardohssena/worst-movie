import { ObjectId } from 'mongodb'

import User from '@domain/models/users.model'
import { UserDTO } from '@interfaces/dtos/users'

export const USER_ID = new ObjectId().toString()

export const USER_OBJECT = new User({
  id: USER_ID,
  email: 'test@example.com',
  name: 'Test User',
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const USER_DTO_OBJECT = UserDTO.toViewModel(USER_OBJECT)

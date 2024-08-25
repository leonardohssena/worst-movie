import { ObjectId } from 'mongodb'

import User from '@domain/models/users.model'
import { UserDTO } from '@interfaces/dtos/users/users.dto'

export const USER_ID = new ObjectId()

export const USER_OBJECT = new User({
  id: USER_ID.toString(),
  email: 'test@example.com',
  name: 'Test User',
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const USER_DTO_OBJECT = UserDTO.toViewModel(USER_OBJECT)

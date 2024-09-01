import { ObjectId } from 'mongodb'

import { Auth0UserDto } from '@application/services/auth0/dto'
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

export const AUTH0_USER_OBJECT = new Auth0UserDto({
  created_at: new Date().toISOString(),
  email: 'test@example.com',
  email_verified: false,
  identities: [
    {
      connection: 'Username-Password-Authentication',
      user_id: '66d47bb57724f24a97972fa9',
      provider: 'auth0',
      isSocial: false,
    },
  ],
  name: 'test@example.com',
  nickname: 'test',
  picture:
    'https://s.gravatar.com/avatar/93942e96f5acd83e2e047ad8fe03114d?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png',
  updated_at: new Date().toISOString(),
  user_id: 'auth0|66d47bb57724f24a97972fa9',
  user_metadata: {},
  username: 'test',
})

export const USER_DTO_OBJECT = UserDTO.toViewModel(USER_OBJECT)

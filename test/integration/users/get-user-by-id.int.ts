import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from 'app.module'
import { instanceToPlain } from 'class-transformer'
import request from 'supertest'

import { PrismaService } from '@infra/database/prisma/prisma.service'

import { USER_DTO_OBJECT, USER_ID, USER_OBJECT } from '../../jest.mocks'

describe('GetUserByIdEntrypoint', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        user: {
          findUnique: jest.fn(),
        },
      })
      .compile()

    prisma = moduleRef.get<PrismaService>(PrismaService)
    app = moduleRef.createNestApplication()
    app.setGlobalPrefix('api')
    await app.init()
  })

  it('/GET api/users/:id', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(USER_OBJECT)

    const response = await request(app.getHttpServer()).get(`/api/users/${USER_ID}`).expect(HttpStatus.OK)
    expect(response.body).toEqual(instanceToPlain(USER_DTO_OBJECT))
  })

  it('/GET api/users/:id - Not Found', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    await request(app.getHttpServer()).get(`/api/users/${USER_ID}`).expect(HttpStatus.NOT_FOUND)
  })

  afterAll(async () => {
    await app.close()
  })
})

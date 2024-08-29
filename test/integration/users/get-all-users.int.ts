import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from 'app.module'
import { instanceToPlain } from 'class-transformer'
import request from 'supertest'

import { PrismaService } from '@infra/database/prisma/prisma.service'

import { USER_DTO_OBJECT, USER_OBJECT } from '../../jest.mocks'

describe('GetAllUsersEntrypoint', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        user: {
          findMany: jest.fn(),
        },
      })
      .compile()

    prisma = moduleRef.get<PrismaService>(PrismaService)
    app = moduleRef.createNestApplication({ logger: false })
    app.setGlobalPrefix('api')
    await app.init()
  })

  it('/GET api/users', async () => {
    ;(prisma.user.findMany as jest.Mock).mockResolvedValue([USER_OBJECT])

    const response = await request(app.getHttpServer()).get('/api/users').expect(HttpStatus.OK)
    expect(response.body).toEqual(instanceToPlain([USER_DTO_OBJECT]))
  })

  afterAll(async () => {
    await app.close()
  })
})

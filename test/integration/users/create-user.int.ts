import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from 'app.module'
import { instanceToPlain } from 'class-transformer'
import request from 'supertest'

import { PrismaService } from '@infra/database/prisma/prisma.service'

import { USER_DTO_OBJECT, USER_OBJECT } from '../../jest.mocks'

describe('CreateUserEntrypoint', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        user: {
          create: jest.fn(),
        },
      })
      .compile()

    prisma = moduleRef.get<PrismaService>(PrismaService)
    app = moduleRef.createNestApplication({ logger: false })
    app.useGlobalPipes(new ValidationPipe())
    app.setGlobalPrefix('api')
    await app.init()
  })

  it('/POST api/users', async () => {
    ;(prisma.user.create as jest.Mock).mockResolvedValue(USER_OBJECT)

    const response = await request(app.getHttpServer()).post(`/api/users`).send(USER_OBJECT).expect(HttpStatus.CREATED)
    expect(response.body).toEqual(instanceToPlain(USER_DTO_OBJECT))
  })

  it('/POST api/users - Invalid data', async () => {
    await request(app.getHttpServer()).post(`/api/users`).send({}).expect(HttpStatus.BAD_REQUEST)
  })

  it('/POST api/users - Invalid email', async () => {
    await request(app.getHttpServer())
      .post(`/api/users`)
      .send({
        ...USER_OBJECT,
        email: 'invalid-email',
      })
      .expect(HttpStatus.BAD_REQUEST)
  })

  it('/POST api/users - Invalid name', async () => {
    await request(app.getHttpServer())
      .post(`/api/users`)
      .send({
        ...USER_OBJECT,
        name: '',
      })
      .expect(HttpStatus.BAD_REQUEST)
  })

  afterAll(async () => {
    await app.close()
  })
})

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
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
          findUnique: jest.fn(),
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
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    ;(prisma.user.create as jest.Mock).mockResolvedValue(USER_OBJECT)

    const response = await request(app.getHttpServer()).post(`/api/users`).send(USER_OBJECT).expect(HttpStatus.CREATED)
    expect(response.body).toEqual(instanceToPlain(USER_DTO_OBJECT))
  })

  it('/POST api/users - Invalid data', async () => {
    await request(app.getHttpServer()).post(`/api/users`).send({}).expect(HttpStatus.BAD_REQUEST)
  })

  it('/POST api/users - User Already Exists', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(USER_OBJECT)

    await request(app.getHttpServer()).post(`/api/users`).send(USER_OBJECT).expect(HttpStatus.CONFLICT)
  })

  it('/POST api/users - Prisma User Already Exists', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    ;(prisma.user.create as jest.Mock).mockRejectedValue(
      new PrismaClientKnownRequestError('Test Error', {
        code: 'P2002',
        clientVersion: '5.19.0',
        meta: {
          target: 'user_email_key',
        },
      }),
    )

    await request(app.getHttpServer()).post(`/api/users`).send(USER_OBJECT).expect(HttpStatus.CONFLICT)
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

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from 'app.module'
import { instanceToPlain } from 'class-transformer'
import request from 'supertest'

import { PrismaService } from '@infra/database/prisma/prisma.service'
import { HttpService } from '@infra/http'

import { AUTH0_USER_OBJECT, USER_DTO_OBJECT, USER_ID, USER_OBJECT } from '../../jest.mocks'

describe('UpdateUserEntrypoint', () => {
  let app: INestApplication
  let prisma: PrismaService
  let httpService: HttpService

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        user: {
          update: jest.fn(),
          findUnique: jest.fn(),
        },
      })
      .overrideProvider(HttpService)
      .useValue({
        post: jest.fn(),
        patch: jest.fn(),
      })
      .compile()

    prisma = moduleRef.get<PrismaService>(PrismaService)
    httpService = moduleRef.get<HttpService>(HttpService)
    app = moduleRef.createNestApplication({ logger: false })
    app.useGlobalPipes(new ValidationPipe())
    app.setGlobalPrefix('api')
    await app.init()
  })

  it('/PUT api/users/:id', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(USER_OBJECT)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    ;(httpService.post as jest.Mock).mockResolvedValue(AUTH0_USER_OBJECT)
    ;(httpService.patch as jest.Mock).mockResolvedValue(AUTH0_USER_OBJECT)
    ;(prisma.user.update as jest.Mock).mockResolvedValue(USER_OBJECT)

    const response = await request(app.getHttpServer())
      .put(`/api/users/${USER_ID}`)
      .send(USER_OBJECT)
      .expect(HttpStatus.OK)
    expect(response.body).toEqual(instanceToPlain(USER_DTO_OBJECT))
  })

  it('/PUT api/users/:id - Invalid id', async () => {
    await request(app.getHttpServer()).put(`/api/users/12`).send(USER_OBJECT).expect(HttpStatus.BAD_REQUEST)
  })

  it('/PUT api/users/:id - Invalid email', async () => {
    await request(app.getHttpServer())
      .put(`/api/users/${USER_ID}`)
      .send({
        ...USER_OBJECT,
        email: 'invalid-email',
      })
      .expect(HttpStatus.BAD_REQUEST)
  })

  it('/PUT api/users/:id - Invalid name', async () => {
    await request(app.getHttpServer())
      .put(`/api/users/${USER_ID}`)
      .send({
        ...USER_OBJECT,
        name: '',
      })
      .expect(HttpStatus.BAD_REQUEST)
  })

  it('/PUT api/users/:id - User not found', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    await request(app.getHttpServer()).put(`/api/users/${USER_ID}`).send(USER_OBJECT).expect(HttpStatus.NOT_FOUND)
  })

  it('/PUT api/users/:id - Email already in use', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(USER_OBJECT)
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ ...USER_OBJECT, email: 'new-email@example.com' })

    await request(app.getHttpServer())
      .put(`/api/users/${USER_ID}`)
      .send({ ...USER_OBJECT, email: 'new-email@example.com' })
      .expect(HttpStatus.CONFLICT)
  })

  afterAll(async () => {
    await app.close()
  })
})

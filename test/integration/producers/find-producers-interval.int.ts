import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from 'app.module'
import { difference } from 'lodash'
import request from 'supertest'

describe('GetProducersByIntervalEntrypoint', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication({ logger: false })
    app.setGlobalPrefix('api')
    await app.init()
  })

  it('Should return HTTP 200', async () => {
    const res = await request(app.getHttpServer()).get('/api/producers/interval')
    expect(res.status).toBe(HttpStatus.OK)
  })

  it('Should return min and max properties as arrays', async () => {
    const res = await request(app.getHttpServer()).get('/api/producers/interval')
    expect(Array.isArray(res.body.min)).toBe(true)
    expect(Array.isArray(res.body.max)).toBe(true)
  })

  it('Each item should contain producer, interval, previousWin, and followingWin', async () => {
    const res = await request(app.getHttpServer()).get('/api/producers/interval')
    for (const item of [...res.body.min, ...res.body.max]) {
      expect(item).toHaveProperty('producer')
      expect(item).toHaveProperty('interval')
      expect(item).toHaveProperty('previousWin')
      expect(item).toHaveProperty('followingWin')
    }
  })

  it('Should return same set of producers in min and max', async () => {
    const res = await request(app.getHttpServer()).get('/api/producers/interval')
    const minProducers = res.body.min.map(p => p.producer)
    const maxProducers = res.body.max.map(p => p.producer)
    expect(difference(minProducers, maxProducers).length).toBe(0)
  })

  it('Should calculate interval as followingWin - previousWin', async () => {
    const res = await request(app.getHttpServer()).get('/api/producers/interval')
    for (const item of [...res.body.min, ...res.body.max]) {
      expect(item.interval).toEqual(item.followingWin - item.previousWin)
    }
  })

  afterAll(async () => {
    await app.close()
  })
})

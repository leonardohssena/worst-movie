import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class IBaseRepository<T> {
  abstract findAll(): Promise<T[]>
  abstract findOne(id: string): Promise<T | null>
  abstract create(data: Partial<T>): Promise<T>
  abstract update(id: string, data: Partial<T>): Promise<T>
  abstract delete(id: string): Promise<T>
}

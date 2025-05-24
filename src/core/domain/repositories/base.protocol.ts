import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class IBaseRepository<T> {
  abstract findAll(filters?: Partial<T>, orderBy?: { [K in keyof T]?: 'asc' | 'desc' }): Promise<T[]>
  abstract findOne(data: Partial<T>): Promise<T | null>
  abstract create(data: Partial<T>): Promise<T>
  abstract update(id: string, data: Partial<T>): Promise<T>
  abstract delete(id: string): Promise<T>
}

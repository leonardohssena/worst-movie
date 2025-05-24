/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBaseRepository } from './base.protocol'

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected constructor(
    protected readonly model: { findMany: any; findUnique: any; create: any; update: any; delete: any },
  ) {}

  async findAll(filters?: Partial<T>): Promise<T[]> {
    return this.model.findMany({ where: filters })
  }
  async findMany(filters?: Partial<T>, orderBy?: { [K in keyof T]?: 'asc' | 'desc' }): Promise<T[]> {
    return this.model.findMany({
      where: filters,
      orderBy,
    })
  }
  async findOne(data: Partial<T>): Promise<T | null> {
    return this.model.findUnique({ where: data })
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create({ data })
  }

  async update(id: string, data: Partial<T> & { id: string }): Promise<T> {
    if (data.id) delete data.id
    return this.model.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({ where: { id } })
  }
}

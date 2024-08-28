/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBaseRepository } from './base.protocol'

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected constructor(
    protected readonly model: { findMany: any; findUnique: any; create: any; update: any; delete: any },
  ) {}

  async findAll(): Promise<T[]> {
    return this.model.findMany()
  }

  async findOne(data: Partial<T>): Promise<T | null> {
    return this.model.findUnique({ where: data })
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create({ data })
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({ where: { id } })
  }
}

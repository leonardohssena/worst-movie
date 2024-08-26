export abstract class BaseModel {
  id: string
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<BaseModel>) {
    Object.assign(this, partial)
  }
}

import { IsMongoId } from 'class-validator'

export class GetUserByIdDto {
  @IsMongoId({ message: 'The id must be a valid ObjectId' })
  id: string
}

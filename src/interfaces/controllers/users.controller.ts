import { Controller, Get, HttpException, NotFoundException, Param } from '@nestjs/common'
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { GetAllUsersUseCase, GetUserByIdUseCase } from '@application/useCases/users'
import { UserDTO } from '@interfaces/dtos/users/users.dto'
import { NotFoundError } from '@shared/errors/NotFoundError'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Find all users',
  })
  @ApiOkResponse({ description: 'Users list.', isArray: true, type: UserDTO })
  async findAll(): Promise<UserDTO[]> {
    const users = await this.getAllUsersUseCase.execute()
    return UserDTO.toViewModel(users) as UserDTO[]
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Find user by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The user id',
  })
  @ApiOkResponse({ description: 'User found.', type: UserDTO })
  @ApiNotFoundResponse({ description: 'User not found.', type: NotFoundError })
  async findOne(@Param('id') id: string): Promise<UserDTO | HttpException> {
    const user = await this.getUserByIdUseCase.execute(id)
    if (!user) throw new NotFoundException(`The user {${id}} has not found.`)
    return UserDTO.toViewModel(user) as UserDTO
  }
}

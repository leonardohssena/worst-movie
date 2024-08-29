import { Controller, Get, Param } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'

import { GetAllUsersUseCase, GetUserByIdUseCase } from '@application/useCases/users'
import { GetUserByIdDto, UserDTO } from '@interfaces/dtos/users'
import { BadRequestError, NotFoundError } from '@shared/errors'

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
  @ApiBadRequestResponse({ description: 'Invalid user id.', type: BadRequestError })
  async findOne(@Param() params: GetUserByIdDto): Promise<UserDTO> {
    const user = await this.getUserByIdUseCase.execute(params.id)
    return UserDTO.toViewModel(user) as UserDTO
  }
}

import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'

import {
  CreateUserUseCase,
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from '@application/useCases/users'
import { CreateUserDto, GetUserByIdDto, UpdateUserDto, UserDTO } from '@interfaces/dtos/users'
import { BadRequestError, ConflictError, NotFoundError } from '@shared/errors'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
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

  @Get(':id')
  @ApiOperation({
    summary: 'Find user by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The user id',
    example: '641484f003c96fe562c53abd',
  })
  @ApiOkResponse({ description: 'User found.', type: UserDTO })
  @ApiNotFoundResponse({ description: 'User not found.', type: NotFoundError })
  @ApiBadRequestResponse({ description: 'Invalid user id.', type: BadRequestError })
  async findOne(@Param() params: GetUserByIdDto): Promise<UserDTO> {
    const user = await this.getUserByIdUseCase.execute(params.id)
    return UserDTO.toViewModel(user) as UserDTO
  }

  @Post()
  @ApiOperation({
    summary: 'Create new user',
  })
  @ApiCreatedResponse({ description: 'User created.', type: UserDTO })
  @ApiBadRequestResponse({ description: 'Invalid user data.', type: BadRequestError })
  @ApiConflictResponse({ description: 'User already exists.', type: ConflictError })
  async create(@Body() data: CreateUserDto): Promise<UserDTO> {
    const user = await this.createUserUseCase.execute(data)
    return UserDTO.toViewModel(user) as UserDTO
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an user',
  })
  @ApiCreatedResponse({ description: 'User updated.', type: UserDTO })
  @ApiBadRequestResponse({ description: 'Invalid user data.', type: BadRequestError })
  @ApiNotFoundResponse({ description: 'User not found.', type: NotFoundError })
  @ApiConflictResponse({ description: 'Email already in use.', type: ConflictError })
  async update(@Param() params: GetUserByIdDto, @Body() data: UpdateUserDto): Promise<UserDTO> {
    const user = await this.updateUserUseCase.execute(params.id, data)
    return UserDTO.toViewModel(user) as UserDTO
  }
}

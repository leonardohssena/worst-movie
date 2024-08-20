import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Controller, Get } from '@nestjs/common'

import { GetAllUsersUseCase } from '@application/useCases/get-all-users.use-case'
import { UserDTO } from '@interfaces/dtos/users/users.dto'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly getAllUsersUseCase: GetAllUsersUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Find all users',
  })
  @ApiOkResponse({ description: 'Users list.', isArray: true, type: UserDTO })
  async findAll(): Promise<UserDTO[]> {
    const users = await this.getAllUsersUseCase.execute()
    return users.map(UserDTO.toViewModel)
  }
}
